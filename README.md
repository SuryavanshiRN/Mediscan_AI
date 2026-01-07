# 🏥 MediScan AI - AI-Powered Chest Disease Detection Platform

A comprehensive full-stack medical diagnostic platform that leverages deep learning to detect and analyze chest diseases from medical imaging. Built with modern web technologies and powered by EfficientNetV2 for accurate disease classification.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### 🤖 AI-Powered Diagnostics

- **50+ Disease Detection**: Identifies a wide range of chest conditions including:
  - Pneumonia, Tuberculosis, Lung Cancer, COVID-19
  - Pulmonary Fibrosis, COPD, Pneumothorax, Pleural Effusion
  - And 40+ more conditions
- **High Accuracy**: Powered by EfficientNetV2B0 deep learning model (99.2% accuracy)
- **Confidence Scoring**: Provides confidence levels for each diagnosis
- **Grad-CAM Visualization**: Visual heatmaps showing areas of interest
- **Multi-Image Upload**: Analyze multiple scans simultaneously
- **Gemini AI Prescriptions**: AI-generated treatment recommendations and prescriptions

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
- **AI/ML**: TensorFlow 2.20+, Keras
- **Image Processing**: OpenCV, Pillow
- **Database**: SQLite
- **Security**: SHA-256 hashing, JWT tokens

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

- **Gemini AI**: Google Gemini for prescription generation
- **TensorFlow**: EfficientNetV2 for disease classification

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.8 or higher
- **Node.js** 16.x or higher
- **npm** or **yarn**
- **Git**

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
pip install flask flask-cors tensorflow opencv-python pillow numpy
```

#### Verify Model Files

Ensure the model file exists at:

```
new/models/chest_disease_efficientnetv2.h5
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
project/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Dashboard/   # Dashboard components (StatCard, etc.)
│   │   │   ├── Diagnosis/   # Diagnosis components
│   │   │   ├── Layout/      # Layout components (Navbar, Sidebar)
│   │   │   └── Patients/    # Patient management components
│   │   ├── contexts/        # React contexts (Auth, Theme)
│   │   ├── hooks/           # Custom hooks (useTheme, useCountUp, etc.)
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Diagnosis.jsx
│   │   │   ├── Login.jsx    # Premium login with doctor carousel
│   │   │   ├── Patients.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Subscription.jsx
│   │   ├── services/        # API service layer
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   ├── index.css            # Global styles with CSS variables
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json         # Frontend dependencies
│
├── new/                     # Backend application
│   ├── api_server.py        # Flask API server
│   ├── models/              # AI model files
│   │   └── chest_disease_efficientnetv2.h5
│   ├── uploads/             # Uploaded images
│   └── radiology_app.db     # SQLite database
│
├── data/                    # Training/test datasets
│   ├── train/
│   ├── test/
│   └── val/
│
├── start.ps1                # Start all servers (Windows)
├── stop.ps1                 # Stop all servers (Windows)
├── requirements.txt         # Python dependencies
└── README.md               # This file
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
- Upload single or multiple chest X-ray/CT scan images
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
- Check if model file exists at `new/models/chest_disease_efficientnetv2.h5`
- Verify all Python dependencies are installed

### Frontend won't start

- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear browser cache

### Login fails

- Check if backend server is running
- Verify database file exists at `new/radiology_app.db`
- Try creating a new account

### CORS errors

- Ensure both servers are running
- Check that backend CORS is enabled
- Verify frontend is accessing correct API URL

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- EfficientNet architecture by Google Research
- Google Gemini AI for prescription generation
- Medical imaging datasets
- Tailwind CSS and Framer Motion communities
- Open source community

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**⚠️ Disclaimer**: This application is for educational and research purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.

## 🗺️ Roadmap

- [ ] Full mobile responsiveness
- [ ] Push notifications
- [ ] PDF report generation
- [ ] Patient appointment scheduling
- [ ] Integration with hospital systems
- [ ] Multi-language support
