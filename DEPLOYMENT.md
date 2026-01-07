# MediScan AI - Quick Deployment Guide

## 🚀 Deploy in 15 Minutes (6.5GB → 200MB)

### **Step 1: Upload Model to Cloud (5 min)**

Your `.h5` model is too large for Git. Upload it to cloud storage:

#### Option A: Hugging Face (Recommended - Free)

```bash
# 1. Create account: https://huggingface.co/join
# 2. Create new model repo: https://huggingface.co/new
# 3. Upload via web UI or CLI:
pip install huggingface_hub
huggingface-cli login
huggingface-cli upload yourusername/mediscan-model new/models/chest_disease_efficientnetv2.h5
```

#### Option B: Google Drive

```bash
# 1. Upload new/models/chest_disease_efficientnetv2.h5 to Drive
# 2. Share → Anyone with link → Get shareable link
# 3. Extract file ID from URL
```

#### Option C: Supabase Storage

```bash
# 1. Go to Supabase → Storage → Create bucket "models"
# 2. Upload chest_disease_efficientnetv2.h5
# 3. Make public → Copy URL
```

---

### **Step 2: Deploy Backend to Render (5 min)**

1. **Push to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial deployment"
   git branch -M main
   git remote add origin https://github.com/yourusername/mediscan-ai.git
   git push -u origin main
   ```

2. **Deploy on Render:**

   - Go to https://render.com → Sign up (free)
   - New Web Service → Connect GitHub repo
   - **Settings:**

     - Name: `mediscan-api`
     - Runtime: `Python 3`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `cd new && gunicorn api_server:app --bind 0.0.0.0:$PORT`

   - **Environment Variables:**
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_KEY=your_supabase_key
     GEMINI_API_KEY=your_gemini_key
     JWT_SECRET_KEY=random-secret-string-here
     MODEL_URL=https://huggingface.co/yourusername/mediscan-model/resolve/main/chest_disease_efficientnetv2.h5
     ```

3. **Deploy!** (Takes ~5 min)
   - Get URL: `https://mediscan-api.onrender.com`

---

### **Step 3: Deploy Frontend to Vercel (3 min)**

1. **Update API URL:**

   ```bash
   cd frontend
   # Create .env.production
   echo "VITE_API_URL=https://mediscan-api.onrender.com" > .env.production
   ```

2. **Deploy:**

   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Configure:**

   - Project name: `mediscan-ai`
   - Framework: `Vite`
   - Build: `npm run build`
   - Output: `dist`

4. **Done!** Get URL: `https://mediscan-ai.vercel.app`

---

### **Step 4: Update CORS (2 min)**

In `new/api_server.py`, update CORS:

```python
CORS(app, origins=["https://mediscan-ai.vercel.app"])
```

Commit and push → Render auto-deploys.

---

## 📊 Size Reduction

| Component | Before     | After       | Status                   |
| --------- | ---------- | ----------- | ------------------------ |
| Datasets  | 5.5 GB     | 0 MB        | Excluded (training only) |
| Models    | 1 GB       | 0 MB        | Cloud hosted             |
| Code      | 100 MB     | 100 MB      | Deployed                 |
| **TOTAL** | **6.6 GB** | **~100 MB** | ✅ Deployable            |

---

## 🔧 Alternative: Model Download on Startup

Modify `new/api_server.py` to auto-download model:

```python
import os
import requests

MODEL_PATH = os.path.join(BASE_DIR, 'models', 'chest_disease_efficientnetv2.h5')
MODEL_URL = os.environ.get('MODEL_URL')

if not os.path.exists(MODEL_PATH) and MODEL_URL:
    print("📥 Downloading model from cloud...")
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    response = requests.get(MODEL_URL, stream=True)
    with open(MODEL_PATH, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    print("✅ Model downloaded!")

model = tf.keras.models.load_model(MODEL_PATH)
```

---

## 🎯 Final Checklist

- [ ] Upload model to Hugging Face/Drive/Supabase
- [ ] Push code to GitHub (datasets excluded)
- [ ] Deploy backend on Render
- [ ] Set environment variables
- [ ] Deploy frontend on Vercel
- [ ] Update CORS in api_server.py
- [ ] Test: Open frontend URL → Upload test image

**Total Time:** 15-20 minutes  
**Total Cost:** $0/month
