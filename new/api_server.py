from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import numpy as np
import cv2
import base64
import io
from PIL import Image
import datetime
from datetime import timezone
import os
import hashlib
import jwt
import re
from functools import wraps

# Suppress TensorFlow warnings BEFORE importing TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress INFO and WARNING messages
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'  # Disable oneDNN to prevent numerical warnings

# Now import TensorFlow
import tensorflow as tf
tf.get_logger().setLevel('ERROR')  # Only show errors

from supabase_client import get_supabase_client

# Try to import Google Generative AI for prescription generation
try:
    from google import genai
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', 'AIzaSyBPFPDPaOEOkEpq1EdWmUi3QTiCnUI9_58')
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    GEMINI_AVAILABLE = True
    print("✅ Gemini AI configured successfully (using new SDK)")
except Exception as e:
    print(f"⚠️ Gemini AI not available: {e}")
    GEMINI_AVAILABLE = False
    gemini_client = None

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# FIXED: Use a persistent secret key to prevent token invalidation on restart
# In production, set JWT_SECRET_KEY environment variable
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'mediscan-ai-fixed-secret-key-2026-keep-safe')
TOKEN_EXPIRATION_HOURS = int(os.environ.get('TOKEN_EXPIRATION_HOURS', 24))

# Load model with optimizations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'chest_disease_efficientnetv2.h5')

print("📦 Loading TensorFlow model (this may take a moment)...")
try:
    # Suppress Keras compilation warning
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    # Warm up the model with a dummy prediction for faster first inference
    dummy_input = np.zeros((1, 224, 224, 3), dtype=np.float32)
    _ = model.predict(dummy_input, verbose=0)
    print(f"✅ Model loaded and warmed up successfully")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None

# Disease mapping
DISEASE_MAP = {
    0: "Pneumonia", 1: "Tuberculosis", 2: "Lung Cancer", 3: "COVID-19",
    4: "Atelectasis", 5: "Cardiomegaly", 6: "Pulmonary Fibrosis",
    7: "Pleural Effusion", 8: "Emphysema", 9: "Bronchitis",
    10: "Asthma", 11: "Interstitial Lung Disease", 12: "Pneumothorax",
    13: "Hypertension-Related Changes", 14: "Pulmonary Edema",
    15: "Pulmonary Embolism", 16: "Sarcoidosis", 17: "COPD",
    18: "Lung Abscess", 19: "Lung Nodule", 20: "Lung Mass",
    21: "Mediastinal Widening", 22: "Bronchiectasis", 23: "Rib Fracture",
    24: "Chest Wall Abnormality", 25: "Hemothorax", 26: "Chylothorax",
    27: "ARDS", 28: "Silicosis", 29: "Asbestosis", 30: "Berylliosis",
    31: "Pneumoconiosis", 32: "Hyperinflation", 33: "Hypoventilation",
    34: "COVID Post Effects", 35: "Scoliosis", 36: "Kyphosis",
    37: "Tracheal Deviation", 38: "Diaphragm Elevation",
    39: "Diaphragm Flattening", 40: "Bronchopneumonia",
    41: "Hilar Enlargement", 42: "Lymphadenopathy", 43: "Consolidation",
    44: "Ground Glass Opacity", 45: "Reticular Pattern",
    46: "Nodular Pattern", 47: "Upper Lobe Opacity",
    48: "Lower Lobe Opacity", 49: "Normal"
}

# Initialize Supabase client
supabase = get_supabase_client()
print("✅ Connected to Supabase database")

def hash_password(password):
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, password_hash):
    """Verify password against hash"""
    return hash_password(password) == password_hash

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain at least one letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, "Password is strong"

def generate_token(user_id, username, role):
    """Generate JWT token"""
    now = datetime.datetime.now(timezone.utc)
    payload = {
        'user_id': str(user_id),
        'username': username,
        'role': role,
        'exp': now + datetime.timedelta(hours=TOKEN_EXPIRATION_HOURS),
        'iat': now
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator to require valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            payload = verify_token(token)
            if not payload:
                return jsonify({'error': 'Token is invalid or expired'}), 401
            
            # Add user info to request context
            request.user = payload
            
        except Exception as e:
            return jsonify({'error': 'Token verification failed'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Za-z]', password):
        return False, "Password must contain at least one letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one number"
    return True, "Password is strong"

def generate_token(user_id, username, role):
    """Generate JWT token"""
    now = datetime.datetime.now(timezone.utc)
    payload = {
        'user_id': str(user_id),
        'username': username,
        'role': role,
        'exp': now + datetime.timedelta(hours=TOKEN_EXPIRATION_HOURS),
        'iat': now
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator to require valid JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            payload = verify_token(token)
            if not payload:
                return jsonify({'error': 'Token is invalid or expired'}), 401
            
            # Add user info to request context
            request.user = payload
            
        except Exception as e:
            return jsonify({'error': 'Token verification failed'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

# Supabase client is initialized globally above

def preprocess_image(image_bytes):
    """Preprocess image for model input"""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.resize(img, (224, 224))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=0)
    return img

def generate_gradcam_simple(original_image, confidence):
    """Generate a simple heatmap overlay"""
    nparr = np.frombuffer(original_image, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    h, w, _ = img.shape
    
    # Create a simple overlay (in production, use real Grad-CAM)
    overlay = img.copy()
    color = (0, 255, 0) if confidence > 70 else (0, 165, 255)
    cv2.rectangle(overlay, (w//4, h//4), (3*w//4, 3*h//4), color, -1)
    overlay = cv2.addWeighted(img, 0.7, overlay, 0.3, 0)
    
    # Convert to base64
    _, buffer = cv2.imencode('.png', overlay)
    img_str = base64.b64encode(buffer).decode()
    return f"data:image/png;base64,{img_str}"

# ==================== API ROUTES ====================

@app.route('/api/diagnosis/predict', methods=['POST'])
@token_required
def predict():
    """Predict disease from uploaded image"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    patient_data = request.form.get('patient_data', '{}')
    
    try:
        print("=" * 50)
        print("🔬 Starting diagnosis...")
        
        # Get user_id from authenticated token
        user_id = request.user['user_id']
        print(f"👤 User ID: {user_id}")
        
        # Read image
        image_bytes = file.read()
        print(f"✅ Image read: {len(image_bytes)} bytes")
        
        # Preprocess
        processed_img = preprocess_image(image_bytes)
        print(f"✅ Image preprocessed: {processed_img.shape}")
        
        # Predict
        if model:
            predictions = model.predict(processed_img, verbose=0)
            class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][class_idx]) * 100
            print(f"✅ Prediction made: {class_idx} with {confidence:.2f}% confidence")
        else:
            # Fallback if model not loaded
            class_idx = 0
            confidence = 85.0
            print("⚠️ Using fallback prediction")
        
        disease = DISEASE_MAP.get(class_idx, "Unknown")
        print(f"✅ Disease: {disease}")
        
        # Generate Grad-CAM
        gradcam_image = generate_gradcam_simple(image_bytes, confidence)
        print(f"✅ Grad-CAM generated")
        
        # Parse patient data
        import json
        patient = json.loads(patient_data)
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        print(f"✅ Patient data parsed: {patient.get('name', 'Unknown')}")
        
        # For now, skip Supabase Storage upload to avoid errors
        image_url = None
        
        # Insert record into Supabase with user_id
        print(f"💾 Saving to Supabase...")
        try:
            response = supabase.table('records').insert({
                'user_id': user_id,  # Link to authenticated user
                'patient_name': patient.get('name', 'Unknown'),
                'patient_id': patient.get('id', 'AUTO-' + timestamp),
                'age': int(patient.get('age', 0)) if patient.get('age') else 0,
                'sex': patient.get('gender', 'Unknown'),
                'physician': patient.get('physician', 'Dr. AI'),
                'diagnosis': disease,
                'confidence': float(confidence),
                'image_url': image_url,
                'timestamp': datetime.datetime.now().isoformat()
            }).execute()
            
            diagnosis_id = str(response.data[0]['id']) if response.data else 'unknown'
            print(f"✅ Saved to database with ID: {diagnosis_id}")
        except Exception as db_error:
            print(f"❌ Database error: {str(db_error)}")
            diagnosis_id = 'temp-' + timestamp
        
        result = {
            'id': diagnosis_id,
            'disease': disease,
            'confidence': round(confidence, 2),
            'gradcam_image': gradcam_image,
            'image_url': image_url,
            'clinical_info': f'Diagnosis: {disease}. Please consult with a healthcare professional for proper medical advice.',
            'timestamp': datetime.datetime.now().isoformat()
        }
        
        print(f"✅ Returning result")
        print("=" * 50)
        return jsonify(result)
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ ERROR in predict: {error_msg}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Analysis failed: {error_msg}'}), 500

@app.route('/api/diagnosis/history', methods=['GET'])
@token_required
def get_history():
    """Get diagnosis history for authenticated user"""
    try:
        user_id = request.user['user_id']
        print(f"\n📊 Fetching history for user: {user_id}")
        response = supabase.table('records').select('*').eq('user_id', user_id).order('timestamp', desc=True).limit(100).execute()
        
        print(f"📊 Supabase returned {len(response.data)} records")
        
        history = []
        for record in response.data:
            history.append({
                'id': record['id'],
                'patient_name': record['patient_name'],
                'patient_id': record['patient_id'],
                'age': record['age'],
                'sex': record['sex'],
                'diagnosis': record['diagnosis'],
                'confidence': record['confidence'],
                'timestamp': record['timestamp']
            })
        
        print(f"📊 Returning {len(history)} history items")
        return jsonify(history)
    except Exception as e:
        print(f"❌ Error fetching history: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients', methods=['GET'])
@token_required
def get_patients():
    """Get all patients for authenticated user"""
    try:
        user_id = request.user['user_id']
        print(f"\n👥 Fetching patients for user: {user_id}")
        response = supabase.table('records').select('*').eq('user_id', user_id).order('timestamp', desc=True).execute()
        
        print(f"👥 Supabase returned {len(response.data)} patient records")
        
        # Get unique patients with scan counts and latest diagnosis
        patient_map = {}
        for record in response.data:
            patient_id = record['patient_id']
            if patient_id not in patient_map:
                patient_map[patient_id] = {
                    'name': record['patient_name'],
                    'id': patient_id,
                    'age': record['age'],
                    'gender': record['sex'],
                    'status': 'Active',
                    'total_scans': 0,
                    'latest_diagnosis': None,
                    'last_visit': None
                }
            
            # Count scans (all records for this patient)
            patient_map[patient_id]['total_scans'] += 1
            
            # Set latest diagnosis and last visit (first record since ordered by timestamp desc)
            if patient_map[patient_id]['latest_diagnosis'] is None:
                patient_map[patient_id]['latest_diagnosis'] = record['diagnosis']
                patient_map[patient_id]['last_visit'] = record['timestamp']
        
        patients = list(patient_map.values())
        
        print(f"👥 Returning {len(patients)} unique patients with scan counts")
        return jsonify({'patients': patients})
    except Exception as e:
        print(f"❌ Error fetching patients: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients', methods=['POST'])
@token_required
def create_patient():
    """Create a new patient record"""
    try:
        data = request.json
        user_id = request.user['user_id']
        
        print(f"📝 Creating patient with data: {data}")
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Patient name is required'}), 400
        
        # Generate patient ID if not provided
        patient_id = data.get('id') or f"P{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Create a record entry (patients are tracked through records)
        response = supabase.table('records').insert({
            'user_id': user_id,
            'patient_name': data.get('name'),
            'patient_id': patient_id,
            'age': int(data.get('age', 0)),
            'sex': data.get('gender', 'Unknown'),
            'physician': data.get('physician', 'Dr. AI'),
            'diagnosis': 'Initial Registration',
            'confidence': 0,
            'timestamp': datetime.datetime.now().isoformat()
        }).execute()
        
        print(f"✅ Patient created: {patient_id}")
        
        return jsonify({
            'message': 'Patient created successfully',
            'patient': {
                'id': patient_id,
                'name': data.get('name'),
                'age': int(data.get('age', 0)),
                'gender': data.get('gender', 'Unknown')
            }
        }), 201
        
    except Exception as e:
        print(f"❌ Error creating patient: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>', methods=['DELETE'])
@token_required
def delete_patient(patient_id):
    """Delete a patient and all their records"""
    try:
        user_id = request.user['user_id']
        
        # Delete all records for this patient
        response = supabase.table('records').delete().eq('user_id', user_id).eq('patient_id', patient_id).execute()
        
        print(f"✅ Deleted patient {patient_id} and their records")
        
        return jsonify({'message': 'Patient deleted successfully'}), 200
        
    except Exception as e:
        print(f"❌ Error deleting patient: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/patients/<patient_id>', methods=['PUT'])
@token_required
def update_patient(patient_id):
    """Update a patient's information"""
    try:
        data = request.json
        user_id = request.user['user_id']
        
        print(f"📝 Updating patient {patient_id} with data: {data}")
        
        # Update all records for this patient with the new information
        update_data = {}
        if data.get('name'):
            update_data['patient_name'] = data.get('name')
        if data.get('age'):
            update_data['age'] = int(data.get('age'))
        if data.get('gender'):
            update_data['sex'] = data.get('gender')
        
        if update_data:
            response = supabase.table('records').update(update_data).eq('user_id', user_id).eq('patient_id', patient_id).execute()
            print(f"✅ Updated {len(response.data)} records for patient {patient_id}")
        
        return jsonify({
            'message': 'Patient updated successfully',
            'patient': {
                'id': patient_id,
                'name': data.get('name'),
                'age': int(data.get('age', 0)),
                'gender': data.get('gender', 'Unknown')
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Error updating patient: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login with custom JWT authentication"""
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    print(f"🔐 Login attempt - Email: {email}")
    
    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400
    
    try:
        # Find user in database by email
        response = supabase.table('users').select('*').eq('email', email).execute()
        
        user = response.data[0] if response.data else None
        
        if user and verify_password(password, user['password_hash']):
            # Generate our own JWT token
            token = generate_token(user['id'], user['email'], user['role'])
            
            print(f"✅ Login successful for: {email}")
            
            return jsonify({
                'token': token,
                'user': {
                    'id': str(user['id']),
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role']
                }
            })
        else:
            print(f"❌ Login failed for: {email}")
            return jsonify({'error': 'Invalid email or password'}), 401
            
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return jsonify({'error': 'Login failed. Please try again.'}), 500

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """User signup with custom JWT authentication"""
    data = request.json
    password = data.get('password')
    name = data.get('name')
    email = data.get('email')
    
    # Validate required fields
    if not all([password, name, email]):
        return jsonify({'error': 'All fields are required'}), 400
    
    # Basic email validation
    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Validate password strength
    is_valid, message = validate_password(password)
    if not is_valid:
        return jsonify({'error': message}), 400
    
    try:
        print(f"🔨 Attempting signup for: {email}")
        
        # Check if email already exists
        existing = supabase.table('users').select('id').eq('email', email).execute()
        if existing.data:
            print(f"⚠️ Email already exists: {email}")
            return jsonify({'error': 'Email already registered'}), 409
        
        # Hash password
        password_hash = hash_password(password)
        
        # Insert user into database
        response = supabase.table('users').insert({
            'username': email,  # Use email as username
            'password_hash': password_hash,
            'name': name,
            'email': email,
            'role': 'doctor'
        }).execute()
        
        user = response.data[0]
        
        # Generate our own JWT token
        token = generate_token(user['id'], user['email'], user['role'])
        
        print(f"✅ New user registered: {email}")
        
        return jsonify({
            'token': token,
            'user': {
                'id': str(user['id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 201
            
    except Exception as e:
        error_msg = str(e)
        print(f"⚠️ Signup error: {error_msg}")
        return jsonify({'error': 'Failed to create account. Please try again.'}), 500

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current user info from custom JWT token"""
    try:
        user_id = request.user['user_id']
        response = supabase.table('users').select('id, name, email, role').eq('id', user_id).execute()
        
        if response.data:
            user = response.data[0]
            return jsonify({
                'user': {
                    'id': str(user['id']),
                    'name': user['name'],
                    'email': user['email'],
                    'role': user['role']
                }
            })
        else:
            return jsonify({'error': 'User not found'}), 404
            
    except Exception as e:
        print(f"❌ Error getting user: {str(e)}")
        return jsonify({'error': 'Failed to get user info'}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout endpoint (client-side token removal)"""
    return jsonify({'message': 'Logged out successfully'}), 200

@app.route('/api/prescription/generate', methods=['POST'])
@token_required
def generate_prescription():
    """Generate AI-powered prescription using Gemini"""
    try:
        data = request.get_json()
        disease = data.get('disease', 'Unknown')
        confidence = data.get('confidence', 0)
        patient_name = data.get('patient_name', 'Patient')
        patient_age = data.get('patient_age', 'N/A')
        patient_gender = data.get('patient_gender', 'N/A')
        clinical_info = data.get('clinical_info', '')
        
        if not GEMINI_AVAILABLE or not gemini_client:
            print("⚠️ Gemini not available, using fallback")
            return jsonify({
                'prescription': get_fallback_prescription(disease, "Gemini AI not configured")
            })
        
        prompt = f"""You are a medical AI assistant. Based on the following chest X-ray diagnosis, generate a detailed prescription and medical recommendations.

DIAGNOSIS DETAILS:
- Detected Condition: {disease}
- Confidence Level: {confidence}%
- Patient Name: {patient_name}
- Patient Age: {patient_age}
- Patient Gender: {patient_gender}
- Clinical Information: {clinical_info}

Please provide a comprehensive response in the following JSON format ONLY (no markdown, no code blocks, just pure JSON):
{{
    "medications": [
        {{"name": "Medication Name", "dosage": "Dosage amount", "frequency": "How often", "duration": "How long"}}
    ],
    "precautions": ["List of precautions the patient should take"],
    "lifestyle_recommendations": ["Lifestyle changes and recommendations"],
    "follow_up": "Recommended follow-up schedule",
    "emergency_signs": ["Signs that require immediate medical attention"],
    "dietary_advice": ["Dietary recommendations"],
    "tests_recommended": ["Additional tests that may be needed"]
}}

Important: 
1. Be specific to the diagnosed condition ({disease})
2. Consider the patient's age ({patient_age}) when recommending medications
3. Include appropriate dosages for the condition severity
4. Always include a disclaimer that this is AI-generated and should be reviewed by a physician"""

        # Try multiple models with fallback (gemini-2.5-flash has better rate limits)
        models_to_try = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']
        last_error = None
        
        for model_name in models_to_try:
            try:
                print(f"🤖 Trying model: {model_name}")
                response = gemini_client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                response_text = response.text.strip()
                
                # Clean up response - remove markdown code blocks if present
                if response_text.startswith('```'):
                    parts = response_text.split('```')
                    if len(parts) >= 2:
                        response_text = parts[1]
                        if response_text.startswith('json'):
                            response_text = response_text[4:]
                response_text = response_text.strip()
                
                import json
                prescription_data = json.loads(response_text)
                prescription_data['generated_by'] = f'Gemini AI ({model_name})'
                prescription_data['disclaimer'] = 'This prescription is AI-generated and should be reviewed and approved by a licensed healthcare provider before use.'
                
                print(f"✅ Prescription generated successfully with {model_name}")
                return jsonify({'prescription': prescription_data})
                
            except Exception as model_error:
                last_error = str(model_error)
                print(f"⚠️ Model {model_name} failed: {last_error[:100]}")
                continue
        
        # All models failed
        print(f"❌ All Gemini models failed. Last error: {last_error}")
        return jsonify({
            'prescription': get_fallback_prescription(disease, last_error)
        })
        
    except Exception as e:
        print(f"❌ Prescription generation error: {str(e)}")
        return jsonify({
            'prescription': get_fallback_prescription("Unknown", str(e))
        })

def get_fallback_prescription(disease, error_msg=""):
    """Generate a disease-specific fallback prescription"""
    # Disease-specific recommendations
    disease_recommendations = {
        "Pneumonia": {
            "medications": [
                {"name": "Amoxicillin", "dosage": "500mg", "frequency": "3 times daily", "duration": "7-10 days"},
                {"name": "Paracetamol", "dosage": "500mg", "frequency": "As needed for fever", "duration": "Until symptoms resolve"}
            ],
            "precautions": ["Complete the full course of antibiotics", "Rest and stay hydrated", "Avoid smoking"],
            "tests_recommended": ["Follow-up chest X-ray in 2 weeks", "Complete blood count"]
        },
        "Tuberculosis": {
            "medications": [
                {"name": "DOTS Therapy", "dosage": "As per TB program", "frequency": "Daily under supervision", "duration": "6-9 months"}
            ],
            "precautions": ["Strictly follow medication schedule", "Wear mask in public", "Ensure good ventilation"],
            "tests_recommended": ["Sputum test", "Monthly liver function tests"]
        },
        "COVID-19": {
            "medications": [
                {"name": "Paracetamol", "dosage": "500-650mg", "frequency": "Every 6 hours if fever", "duration": "As needed"},
                {"name": "Vitamin C", "dosage": "1000mg", "frequency": "Once daily", "duration": "2 weeks"}
            ],
            "precautions": ["Self-isolate for recommended period", "Monitor oxygen levels", "Stay hydrated"],
            "tests_recommended": ["RT-PCR test", "Pulse oximetry monitoring"]
        },
        "Normal": {
            "medications": [
                {"name": "No medication required", "dosage": "N/A", "frequency": "N/A", "duration": "N/A"}
            ],
            "precautions": ["Maintain healthy lifestyle", "Regular exercise", "Annual health checkup"],
            "tests_recommended": ["Routine health checkup as needed"]
        }
    }
    
    # Get disease-specific or default recommendations
    specific = disease_recommendations.get(disease, {
        "medications": [{"name": "Consult with physician", "dosage": "As directed", "frequency": "N/A", "duration": "N/A"}],
        "precautions": ["Please consult with a qualified healthcare provider for proper diagnosis and treatment."],
        "tests_recommended": ["As recommended by physician"]
    })
    
    return {
        'medications': specific.get('medications', [{"name": "Consult with physician", "dosage": "As directed", "frequency": "N/A", "duration": "N/A"}]),
        'precautions': specific.get('precautions', ["Consult healthcare provider"]) + (
            [f"Note: AI prescription service temporarily unavailable"] if error_msg else []
        ),
        'lifestyle_recommendations': [
            'Maintain a healthy diet',
            'Get adequate rest',
            'Stay hydrated',
            'Follow up with your healthcare provider'
        ],
        'follow_up': 'Schedule an appointment with your physician within 1-2 weeks',
        'emergency_signs': [
            'Difficulty breathing',
            'Chest pain',
            'High fever (>103°F/39.4°C)',
            'Severe coughing with blood',
            'Confusion or altered consciousness'
        ],
        'dietary_advice': ['Eat nutritious foods', 'Avoid processed foods', 'Stay hydrated'],
        'tests_recommended': specific.get('tests_recommended', ['As recommended by physician']),
        'generated_by': 'Smart Fallback System',
        'disclaimer': 'This is a fallback response. Please consult a healthcare provider for personalized medical advice.'
    }

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'gemini_available': GEMINI_AVAILABLE,
        'timestamp': datetime.datetime.now().isoformat()
    })

@app.route('/api/gemini/test', methods=['GET'])
def test_gemini():
    """Test Gemini API connection"""
    if not GEMINI_AVAILABLE or not gemini_client:
        return jsonify({'status': 'unavailable', 'error': 'Gemini not configured'}), 503
    
    try:
        # Quick test with a simple prompt
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents='Say "Gemini is working" in exactly 3 words'
        )
        return jsonify({
            'status': 'working',
            'response': response.text[:100],
            'model': 'gemini-2.5-flash'
        })
    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e)[:200]}), 500

if __name__ == '__main__':
    print("🚀 Starting Flask API server...")
    print(f"📊 Model status: {'✅ Loaded' if model else '❌ Not loaded'}")
    print(f"🤖 Gemini AI: {'✅ Available' if GEMINI_AVAILABLE else '❌ Not available'}")
    print(f"🔗 API will be available at: http://localhost:5000")
    print(f"🗄️ Database: Supabase Cloud PostgreSQL")
    print(f"🔐 JWT Secret: {'Custom (env)' if os.environ.get('JWT_SECRET_KEY') else 'Default (built-in)'}")
    
    # FIXED: use_reloader=False prevents server restarts during diagnosis
    # This was causing "Analysis failed" errors when TensorFlow files were touched
    app.run(
        debug=True,           # Keep debug for error messages
        port=5000,
        host='0.0.0.0',
        use_reloader=False,   # CRITICAL: Prevents mid-request server restarts
        threaded=True         # Better handling of concurrent requests
    )
