#!/bin/bash

# Deployment script for Railway/Render
echo "🚀 Starting MediScan AI deployment..."

# Check if model exists
MODEL_PATH="new/models/chest_disease_efficientnetv2.h5"
if [ ! -f "$MODEL_PATH" ]; then
    echo "📥 Downloading AI model from cloud storage..."
    mkdir -p new/models
    
    # Option 1: Download from Hugging Face (upload your model there first)
    # wget -O "$MODEL_PATH" "https://huggingface.co/yourusername/mediscan-model/resolve/main/chest_disease_efficientnetv2.h5"
    
    # Option 2: Download from Google Drive (share your model file)
    # gdown --id YOUR_GOOGLE_DRIVE_FILE_ID -O "$MODEL_PATH"
    
    # Option 3: Download from Supabase Storage (upload to your bucket)
    # curl -o "$MODEL_PATH" "YOUR_SUPABASE_STORAGE_URL/chest_disease_efficientnetv2.h5"
    
    echo "✅ Model downloaded successfully"
else
    echo "✅ Model already exists"
fi

echo "🎉 Deployment preparation complete!"
