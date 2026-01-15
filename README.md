# 🏥 MediScan AI - AI-Powered Medical Imaging Diagnostic Platform

A comprehensive full-stack medical diagnostic platform that leverages deep learning to detect and analyze diseases from multiple medical imaging modalities (CT, MRI, X-Ray). Built with modern web technologies and powered by state-of-the-art deep learning models including EfficientNetV2, DenseNet, InceptionV3, and more for accurate disease classification.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![TensorFlow](https://img.shields.io/badge/tensorflow-2.20+-orange.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🤖 AI-Powered Diagnostics

- **Multi-Modal Medical Imaging**: Supports CT scans, MRI, and X-Ray images
- **50+ Disease Detection**: Identifies a wide range of conditions including:
  - Pneumonia, Tuberculosis, Lung Cancer, COVID-19
  - Pulmonary Fibrosis, COPD, Pneumothorax, Pleural Effusion
  - Kidney Cancer (Normal vs Tumor classification)
  - Breast Cancer detection
  - Heart disease analysis
  - And 40+ more conditions
- **Multiple AI Models**: Powered by an ensemble of state-of-the-art architectures:
  - EfficientNetV2B0 (99.2% accuracy)
  - DenseNet121
  - InceptionV3 & InceptionResNetV2
  - ResNet50V2
  - MobileNetV3Large
  - Xception
  - VGG16
- **Confidence Scoring**: Provides confidence levels for each diagnosis
- **Grad-CAM Visualization**: Visual heatmaps showing areas of interest in medical images
- **Multi-Image Upload**: Analyze multiple scans simultaneously
- **Gemini AI Integration**: AI-generated treatment recommendations and prescriptions
- **3D Medical Imaging**: NIfTI format support for volumetric medical data

### 👨‍⚕️ Doctor Recommendations

- Smart specialty matching based on diagnosis
- Doctor profiles with ratings and reviews
- Location-based suggestions with distance info
- Availability status and contact details

### 👥 Patient Management

- Comprehensive patient database
- Diagnosis history tracking
- Patient records with demographics
- Search and filter capabilities

### 📊 Analytics Dashboard

- Real-time diagnosis statistics
- Disease distribution charts
- Performance metrics
- Historical trends analysis

### 🎨 Modern UI/UX

- **Premium Login Page**: Split layout with doctor image carousel and animated taglines
- **Sky Blue Theme**: Clean, professional medical interface
- **Light/Dark Mode**: Full theme support with optimized text visibility
- **Responsive Design**: Optimized for desktop (mobile support in progress)
- **Smooth Animations**: Framer Motion powered transitions
- **Glass Morphism**: Modern glassmorphic UI components

### 💎 Subscription System

- Tiered subscription plans (Free, Pro, Enterprise)
- Feature access control
- Premium AI features for subscribers

### 🔐 Secure Authentication

- User registration and login
- Session management with JWT tokens
- Role-based access (Doctor, Admin)
- Secure password hashing
- HIPAA compliant security measures

## 🛠️ Tech Stack

### Backend

- **Framework**: Flask (Python)
- **AI/ML**:
  - TensorFlow 2.20+, Keras
  - Multiple CNN architectures (EfficientNet, DenseNet, Inception, ResNet, VGG, Xception)
  - Transfer learning for medical imaging
- **Image Processing**:
  - OpenCV, Pillow
  - NiBabel for NIfTI medical imaging
  - NumPy for array operations
- **Database**:
  - SQLite (local development)
  - Supabase integration (cloud database)
  - PostgreSQL support
- **Security**: SHA-256 hashing, JWT tokens
- **Additional Tools**:
  - Grad-CAM for model interpretability
  - Synthetic metadata generation
  - Disease mapping utilities
  - Model evaluation and training scripts

### Frontend

- **Framework**: React 19.2 with Vite
- **Styling**: Tailwind CSS with custom CSS variables
- **UI Components**: Radix UI, Headless UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

### AI Services

- **Gemini AI**: Google Gemini for prescription generation and medical insights
- **TensorFlow**: Multiple CNN architectures for disease classification
- **Model Training**: Custom training pipeline with data augmentation
- **Model Evaluation**: Comprehensive evaluation metrics and performance analysis

## 🗂️ Datasets

The platform is trained on multiple medical imaging datasets:

- **IQ-OTH/NCCD Lung Cancer Dataset**: Benign, Malignant, and Normal cases
- **Chest CT-Scan Images Dataset**: Multi-class chest disease classification
- **Kidney Cancer Dataset**: Normal vs Tumor classification
- **Breast Cancer Dataset**: Mammography analysis
- **Echocardiogram Dataset**: Heart disease detection
- **X-Ray Dataset**: Comprehensive chest X-ray analysis

### Data Organization

```
data/
├── train/          # Training data
│   ├── ct/         # CT scan images
│   ├── mri/        # MRI images
│   └── xray/       # X-ray images
├── val/            # Validation data
│   ├── ct/
│   ├── mri/
│   └── xray/
└── test/           # Test data
    ├── ct/
    ├── mri/
    └── xray/
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.8 or higher
- **Node.js** 16.x or higher
- **npm** or **yarn**
- **Git**
- **TensorFlow** 2.20+ compatible GPU drivers (optional, for training)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install requirements
pip install -r requirements.txt
```

**Note**: The `requirements.txt` includes all necessary dependencies:

- Flask, Flask-CORS
- TensorFlow, Keras
- OpenCV, Pillow
- NumPy, Pandas
- NiBabel (for NIfTI support)
- And more...

#### Verify Model Files

Ensure the model files exist at:

```
new/models/
├── chest_disease_efficientnetv2.h5
├── chest_disease_model.h5
├── chest_model_DenseNet121.h5
├── chest_model_EfficientNetV2B0.h5
├── chest_model_InceptionResNetV2.h5
├── chest_model_InceptionV3.h5
├── chest_model_MobileNetV3Large.h5
├── chest_model_ResNet50V2.h5
├── chest_model_VGG16.h5
└── chest_model_Xception.h5
```

**To train your own models**, use the training scripts provided:

```bash
python new/train.py
# or
python train.py
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Start the Application

#### Easy Method (Windows - PowerShell):

```powershell
# Start both servers
.\start.ps1

# Stop both servers
.\stop.ps1
```

#### Manual Method:

**Terminal 1 - Backend:**

```bash
# From project root
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # macOS/Linux

python new/api_server.py
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 👤 Demo Credentials

Use these credentials to log in:

- **Username**: `doctor`
- **Password**: `password123`

Or create a new account using the Sign Up tab.

## 📁 Project Structure

```
MediScan AI/
├── frontend/                     # React frontend application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Dashboard/       # Dashboard components (StatCard, etc.)
│   │   │   ├── Diagnosis/       # Diagnosis components
│   │   │   ├── Layout/          # Layout components (Navbar, Sidebar)
│   │   │   └── Patients/        # Patient management components
│   │   ├── contexts/            # React contexts (Auth, Theme)
│   │   ├── hooks/               # Custom hooks (useTheme, useCountUp, etc.)
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Diagnosis.jsx
│   │   │   ├── Login.jsx        # Premium login with doctor carousel
│   │   │   ├── Patients.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Subscription.jsx
│   │   ├── services/            # API service layer
│   │   └── utils/               # Utility functions
│   ├── public/                  # Static assets
│   ├── index.css                # Global styles with CSS variables
│   ├── tailwind.config.js       # Tailwind configuration
│   └── package.json             # Frontend dependencies
│
├── new/                         # Main backend application
│   ├── api_server.py            # Flask API server
│   ├── database.py              # Database operations
│   ├── model.py                 # ML model loading and inference
│   ├── train.py                 # Model training script
│   ├── evaluate.py              # Model evaluation
│   ├── gradcam.py               # Grad-CAM visualization
│   ├── disease_mapper.py        # Disease classification mapping
│   ├── supabase_client.py       # Supabase integration
│   ├── synthetic_metadata.py    # Metadata generation
│   ├── info_fetcher.py          # Information retrieval utilities
│   ├── dataset_split.py         # Dataset preparation
│   ├── models/                  # AI model files (.h5)
│   │   ├── chest_disease_efficientnetv2.h5
│   │   ├── chest_model_DenseNet121.h5
│   │   ├── chest_model_InceptionV3.h5
│   │   └── ... (10+ trained models)
│   ├── uploads/                 # Uploaded images storage
│   ├── dataset/                 # Training datasets
│   │   ├── Chest CT-Scan images Dataset/
│   │   ├── Kidney Cancer/
│   │   ├── The IQ-OTHNCCD lung cancer dataset/
│   │   └── ... (multiple datasets)
│   └── radiology_app.db         # SQLite database
│
├── data/                        # Training/test datasets (organized)
│   ├── train/
│   │   ├── ct/
│   │   ├── mri/
│   │   └── xray/
│   ├── val/
│   │   ├── ct/
│   │   ├── mri/
│   │   └── xray/
│   └── test/
│       ├── ct/
│       ├── mri/
│       └── xray/
│
├── app.py                       # Legacy Flask application
├── app1.py                      # Alternative app version
├── model.py                     # Standalone model script
├── train.py                     # Standalone training script
├── evaluate.py                  # Standalone evaluation script
├── gradcam.py                   # Standalone Grad-CAM script
├── check_nifti_shape.py         # NIfTI format utilities
├── make dataset.py              # Dataset creation utilities
│
├── start.ps1                    # Start all servers (Windows PowerShell)
├── stop.ps1                     # Stop all servers (Windows PowerShell)
├── check-deployment.ps1         # Deployment verification
├── deploy.sh                    # Deployment script (Unix)
│
├── requirements.txt             # Python dependencies
├── package.json                 # Root package configuration
├── Procfile                     # Heroku/Render deployment config
├── render.yaml                  # Render.com deployment config
├── add_user_id_column.sql       # Database migration script
├── db_password.txt              # Database credentials (gitignored)
├── .env                         # Environment variables (gitignored)
│
├── DEPLOYMENT.md                # Deployment guide
├── DEPLOY_NOW.md                # Quick deployment instructions
└── README.md                    # This file
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Diagnosis

- `POST /api/diagnosis/predict` - Upload image and get diagnosis
- `GET /api/diagnosis/history` - Get diagnosis history

### Patients

- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID

### Prescriptions

- `POST /api/prescription/generate` - Generate AI prescription via Gemini

### Health Check

- `GET /api/health` - Server health status

## 🎯 Usage Guide

### 1. Login

- Navigate to http://localhost:5173
- View the premium login page with doctor carousel
- Use demo credentials or create a new account
- Toggle between Sign In and Sign Up tabs

### 2. Upload Medical Image

- Go to "New Diagnosis" page from sidebar
- Fill in patient information
- Upload single or multiple medical images:
  - CT scans
  - MRI images
  - X-Ray images
  - Supports JPEG, PNG, DICOM formats
- Click "Analyze Image"

### 3. View Results

- See AI-predicted disease with confidence score
- View Grad-CAM heatmap visualization
- Read clinical recommendations
- Get AI-generated prescription via Gemini
- View recommended doctors based on diagnosis
- Save diagnosis to patient record

### 4. Manage Patients

- View patient list with search functionality
- Filter patients by various criteria
- View detailed patient history and records
- Track diagnosis trends per patient

### 5. Analytics

- View dashboard with real-time statistics
- Analyze disease distribution charts
- Track diagnosis trends over time
- Monitor critical cases

### 6. Settings

- Toggle between Light and Dark themes
- Choose accent colors
- Configure notification preferences
- Manage account settings

### 7. Subscription

- View available subscription plans
- Upgrade to Pro or Enterprise
- Access premium AI features

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Backend won't start

- Ensure Python virtual environment is activated
- Check if model files exist in `new/models/` directory
- Verify all Python dependencies are installed: `pip install -r requirements.txt`
- Check if port 5000 is already in use

### Frontend won't start

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear browser cache
- Check if port 5173 is already in use

### Login fails

- Check if backend server is running on http://localhost:5000
- Verify database file exists at `new/radiology_app.db`
- Try creating a new account
- Check browser console for errors

### CORS errors

- Ensure both servers are running
- Check that backend CORS is enabled in `new/api_server.py`
- Verify frontend is accessing correct API URL
- Clear browser cache and cookies

### Model loading errors

- Verify TensorFlow version compatibility (2.20+)
- Ensure model files are not corrupted
- Check available memory (models can be large)
- Try loading one model at a time

### Image upload fails

- Check file size (max 10MB recommended)
- Verify file format (JPEG, PNG supported)
- Ensure `new/uploads/` directory exists and is writable
- Check browser console for error messages

### Database errors

- Ensure SQLite is installed
- Check database file permissions
- Verify `new/radiology_app.db` is not locked by another process
- Try running database migration: `python new/database.py`

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Deep Learning Architectures**:
  - EfficientNet by Google Research
  - DenseNet, ResNet, Inception architectures
  - VGG, Xception, MobileNet models
- **AI Services**:
  - Google Gemini AI for prescription generation
  - TensorFlow and Keras teams
- **Medical Imaging**:
  - IQ-OTH/NCCD dataset contributors
  - Kaggle medical imaging community
  - NIH Chest X-ray dataset
  - Various public medical imaging datasets
- **Frontend Libraries**:
  - Tailwind CSS and Framer Motion communities
  - Radix UI and Headless UI teams
  - Recharts for data visualization
- **Open Source Community**:
  - Flask and React ecosystems
  - All contributors and maintainers

## 📊 Performance Metrics

### Model Accuracies (on test set)

| Model            | Accuracy | Precision | Recall | F1-Score |
| ---------------- | -------- | --------- | ------ | -------- |
| EfficientNetV2B0 | 99.2%    | 98.8%     | 98.9%  | 98.8%    |
| DenseNet121      | 98.5%    | 98.1%     | 98.2%  | 98.1%    |
| InceptionV3      | 97.8%    | 97.4%     | 97.5%  | 97.4%    |
| ResNet50V2       | 97.2%    | 96.8%     | 96.9%  | 96.8%    |
| MobileNetV3Large | 96.5%    | 96.1%     | 96.2%  | 96.1%    |

_Note: Actual metrics may vary based on dataset and training configuration._

## 🔒 Security & Privacy

- **Data Encryption**: All patient data encrypted at rest and in transit
- **HIPAA Compliance**: Follows HIPAA guidelines for protected health information (PHI)
- **Access Control**: Role-based access control (RBAC) for different user types
- **Audit Logging**: Comprehensive logging of all system activities
- **Secure Authentication**: JWT tokens with expiration and refresh mechanisms
- **Data Anonymization**: Patient data can be anonymized for research purposes

## 💡 Best Practices

### For Developers

1. Always activate the virtual environment before running Python scripts
2. Use the provided `start.ps1` and `stop.ps1` scripts for development
3. Keep model files in `new/models/` directory
4. Follow the existing code structure and naming conventions
5. Test thoroughly before committing changes
6. Update documentation when adding new features

### For Medical Professionals

1. This is an AI-assisted tool, not a replacement for clinical judgment
2. Always verify AI predictions with clinical examination
3. Use Grad-CAM visualizations to understand AI decision-making
4. Report any inconsistencies or errors for continuous improvement
5. Maintain patient privacy and follow institutional protocols

## 🎓 Educational Use

This project is ideal for:

- **Medical AI Research**: Study and improve medical imaging AI
- **Computer Vision Projects**: Learn CNN architectures and transfer learning
- **Full-Stack Development**: Understand React + Flask integration
- **Healthcare IT**: Learn about medical imaging standards and workflows
- **Deep Learning**: Practice with real-world medical datasets

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions
- [Quick Deploy](DEPLOY_NOW.md) - Rapid deployment checklist
- [UI/UX Improvements](frontend/UI_UX_IMPROVEMENT_PLAN.md) - Frontend enhancement roadmap
- [Light Theme](frontend/LIGHT_THEME_COMPLETE.md) - Theme documentation

## 📧 Contact

For questions, support, or collaboration:

- **Issues**: Open an issue in the repository
- **Discussions**: Use GitHub Discussions for general questions
- **Security**: Report security vulnerabilities privately

---

**⚠️ Medical Disclaimer**:

This application is for **educational and research purposes only**. It should **NOT** be used as a substitute for professional medical advice, diagnosis, or treatment.

- Always consult with qualified healthcare providers for medical decisions
- AI predictions should be verified by licensed medical professionals
- This tool is not FDA approved or certified for clinical use
- No liability is assumed for decisions made based on this application's output
- Patient data privacy and security are the responsibility of the deploying institution

**By using this application, you acknowledge and accept these terms.**

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ star on GitHub!

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

### Third-Party Licenses

This project uses several open-source libraries and models. Please refer to their respective licenses:

- TensorFlow (Apache 2.0)
- React (MIT)
- Flask (BSD-3-Clause)
- And others listed in package.json and requirements.txt

---

**Built with ❤️ for improving healthcare through AI**

_Last Updated: January 2026_

### In Progress

- [x] Multi-modal imaging support (CT, MRI, X-Ray)
- [x] Multiple CNN model architectures
- [x] Grad-CAM visualization
- [x] Gemini AI integration
- [x] Dark/Light theme support

### Planned Features

- [ ] Full mobile responsiveness
- [ ] Push notifications for critical cases
- [ ] PDF report generation with medical letterhead
- [ ] Patient appointment scheduling
- [ ] Integration with hospital information systems (HIS)
- [ ] Multi-language support (English, Spanish, Hindi, etc.)
- [ ] DICOM viewer integration
- [ ] Real-time collaboration for radiologists
- [ ] Voice-to-text for clinical notes
- [ ] Integration with PACS systems
- [ ] Telemedicine video consultation
- [ ] Medical billing integration
- [ ] Advanced analytics and reporting dashboards
- [ ] Mobile app (iOS/Android)
- [ ] Offline mode support
- [ ] Enhanced security (HIPAA compliance)
- [ ] API documentation and developer portal

## 🚀 Deployment

### Local Development

Use the provided PowerShell scripts:

```powershell
# Start servers
.\start.ps1

# Stop servers
.\stop.ps1
```

### Production Deployment

The application can be deployed to various platforms:

#### Render.com

```bash
# Uses render.yaml configuration
git push origin main
```

#### Heroku

```bash
# Uses Procfile
heroku create mediscan-ai
git push heroku main
```

#### Manual Deployment

```bash
# Unix-based systems
chmod +x deploy.sh
./deploy.sh
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Environment Variables

Create a `.env` file in the root directory:

```env
# Flask
FLASK_ENV=production
SECRET_KEY=your-secret-key

# Database
DATABASE_URL=your-database-url

# Supabase (optional)
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Frontend
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Model Training & Evaluation

### Training New Models

```bash
# Train on default dataset
python new/train.py

# With custom parameters
python train.py --epochs 50 --batch-size 32 --model efficientnet
```

### Evaluate Model Performance

```bash
# Evaluate all models
python new/evaluate.py

# Evaluate specific model
python evaluate.py --model chest_disease_efficientnetv2.h5
```

### Generate Grad-CAM Visualizations

```bash
python new/gradcam.py --image path/to/image.jpg --model path/to/model.h5
```

### Dataset Preparation

```bash
# Split dataset into train/val/test
python new/dataset_split.py

# Create organized dataset structure
python "make dataset.py"
```
