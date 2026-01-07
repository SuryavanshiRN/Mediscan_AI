# 🚀 MediScan AI - FINAL DEPLOYMENT PLAN (6.5GB → 150MB)

## ✅ CONFIRMED SIZES

- **Datasets**: 3.58 GB (NOT NEEDED for deployment - training only!)
- **Production Model**: 27 MB (chest_disease_efficientnetv2.h5)
- **Code + Dependencies**: ~100 MB
- **After Cleanup**: ~150 MB total ✅

---

## 🎯 STEP-BY-STEP DEPLOYMENT (20 minutes)

### **PHASE 1: Upload Model to Cloud (5 min)**

Your model is only **27 MB** - small enough for most platforms!

#### **Recommended: Hugging Face (Best for ML models)**

```bash
# Install CLI
pip install huggingface_hub

# Login (create account first at https://huggingface.co/join)
huggingface-cli login

# Create repository and upload
huggingface-cli upload YourUsername/mediscan-ai-model new/models/chest_disease_efficientnetv2.h5 chest_disease_efficientnetv2.h5

# Your model URL will be:
# https://huggingface.co/YourUsername/mediscan-ai-model/resolve/main/chest_disease_efficientnetv2.h5
```

**Alternative: Just commit it to Git** (27MB is under GitHub's 100MB limit!)

```bash
# Remove model from .gitignore temporarily
git add new/models/chest_disease_efficientnetv2.h5
git commit -m "Add production model"
```

---

### **PHASE 2: Prepare Frontend (3 min)**

```bash
cd frontend

# Create production environment file
echo VITE_API_URL=https://mediscan-api.onrender.com > .env.production

# Test build locally
npm install
npm run build

# Should create frontend/dist/ folder (~2MB)
```

---

### **PHASE 3: Deploy to Render (Backend) - FREE (7 min)**

#### **3.1: Push to GitHub**

```bash
# In project root
git init
git add .
git commit -m "Production deployment"
git branch -M main

# Create repo on GitHub, then:
git remote add origin https://github.com/YourUsername/mediscan-ai.git
git push -u origin main
```

#### **3.2: Deploy on Render**

1. Go to https://render.com → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your `mediscan-ai` repository
4. **Configuration:**

   ```
   Name: mediscan-api
   Region: Oregon (closest to free tier)
   Branch: main
   Root Directory: (leave empty)
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: cd new && gunicorn api_server:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120
   Instance Type: Free
   ```

5. **Environment Variables** (Add these):

   ```
   SUPABASE_URL = your_supabase_project_url
   SUPABASE_KEY = your_supabase_anon_key
   GEMINI_API_KEY = AIzaSyBPFPDPaOEOkEpq1EdWmUi3QTiCnUI9_58
   JWT_SECRET_KEY = your-random-secret-key-here-12345
   PYTHON_VERSION = 3.11.0
   ```

6. Click **"Create Web Service"**
7. Wait 5-7 minutes for build
8. Copy your URL: `https://mediscan-api.onrender.com`

---

### **PHASE 4: Deploy Frontend to Vercel - FREE (5 min)**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? mediscan-ai
# - Directory? ./
# - Override settings? No

# Wait 2 minutes...
# You'll get: https://mediscan-ai.vercel.app
```

**OR use Vercel Dashboard:**

1. Go to https://vercel.com → Import Project
2. Connect GitHub → Select `mediscan-ai`
3. Configure:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Environment Variables:
     VITE_API_URL = https://mediscan-api.onrender.com
   ```
4. Click Deploy!

---

### **PHASE 5: Fix CORS (2 min)**

Update backend to allow frontend:

```bash
# Edit new/api_server.py
# Find line: CORS(app)
# Replace with: CORS(app, origins=["https://mediscan-ai.vercel.app", "http://localhost:5173"])
```

Commit and push:

```bash
git add new/api_server.py
git commit -m "Update CORS for production"
git push origin main
```

Render will auto-redeploy (2 min).

---

## 🧪 TESTING (2 min)

1. Open `https://mediscan-ai.vercel.app`
2. Login with test credentials
3. Upload a chest X-ray image
4. Should get diagnosis within 10-15 seconds ✅

---

## 📊 FINAL ARCHITECTURE

```
User → Vercel (Frontend - Free)
         ↓ HTTPS
      Render (Backend - Free, 512MB RAM)
         ↓
      TensorFlow Model (27MB, loaded in memory)
         ↓
      Supabase (Database - Free, 500MB)
```

**Performance:**

- First request: ~30s (cold start on Render free tier)
- Subsequent requests: ~5-10s (while warm)
- After 15min inactivity: Spins down (cold start again)

---

## ⚡ OPTIMIZATION TIPS

### If Render fails with memory error:

```bash
# Reduce TensorFlow memory usage
# Add to new/api_server.py after imports:

import tensorflow as tf
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    tf.config.set_logical_device_configuration(
        gpus[0],
        [tf.config.LogicalDeviceConfiguration(memory_limit=256)]
    )
```

### If model loading is slow:

Use model quantization (reduces to ~7MB):

```python
# Create convert_model.py
import tensorflow as tf

model = tf.keras.models.load_model('new/models/chest_disease_efficientnetv2.h5')
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

with open('new/models/model_quantized.tflite', 'wb') as f:
    f.write(tflite_model)
```

---

## 🆘 TROUBLESHOOTING

| Issue                    | Solution                                                    |
| ------------------------ | ----------------------------------------------------------- |
| "Build failed on Render" | Check requirements.txt has all deps                         |
| "502 Bad Gateway"        | Wait for Render to finish deploying (check logs)            |
| "CORS error in browser"  | Update CORS origins in api_server.py                        |
| "Model not found"        | Ensure model is committed to Git or download URL is correct |
| "Out of memory"          | Use smaller workers: `--workers 1` in start command         |

---

## 💰 COST BREAKDOWN (All FREE)

| Service          | Free Tier       | Limits                            |
| ---------------- | --------------- | --------------------------------- |
| **Vercel**       | Unlimited       | 100GB bandwidth/month             |
| **Render**       | 750 hours/month | 512MB RAM, spins down after 15min |
| **Supabase**     | Unlimited       | 500MB DB, 1GB storage             |
| **Hugging Face** | Unlimited       | Model hosting                     |
| **GitHub**       | Unlimited       | 1GB repo limit (you're at ~200MB) |

**Total: $0/month forever** ✅

---

## 🚀 QUICK START (Copy-Paste)

```bash
# 1. Upload model (if not in Git)
pip install huggingface_hub
huggingface-cli login
huggingface-cli upload YourUsername/mediscan-ai-model new/models/chest_disease_efficientnetv2.h5

# 2. Prepare frontend
cd frontend
echo VITE_API_URL=https://mediscan-api.onrender.com > .env.production
npm install && npm run build
cd ..

# 3. Push to GitHub
git init
git add .
git commit -m "Deploy"
git remote add origin https://github.com/YourUsername/mediscan-ai.git
git push -u origin main

# 4. Deploy backend: https://render.com (connect GitHub repo)
# 5. Deploy frontend: vercel --prod (in frontend/ directory)
# 6. Done! 🎉
```

---

## ✅ SUCCESS METRICS

After deployment, you should have:

- ✅ Frontend live at Vercel
- ✅ Backend live at Render
- ✅ Database connected to Supabase
- ✅ AI model working (27MB loaded)
- ✅ Total deployment size: ~150MB (vs 6.5GB original)
- ✅ Cost: $0/month
- ✅ Deployment time: 20 minutes

---

**Need help?** Check Render logs or Vercel deployment logs for errors.
