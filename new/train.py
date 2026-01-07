import os
import numpy as np
import tensorflow as tf
from sklearn.utils import class_weight
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D, BatchNormalization
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
from tensorflow.keras.optimizers import Adam
from tensorflow.keras import backend as K

# --- CONFIGURATION ---
DATASET_DIR = r"D:/project/new/dataset"
MODEL_DIR = r"D:/project/new/models"
os.makedirs(MODEL_DIR, exist_ok=True)

# List of 10 Architectures to test
# --- CORRECTED IMPORTS ---
from tensorflow.keras.applications import (
    InceptionResNetV2, VGG16, Xception, 
    NASNetMobile,  # Fix: Changed from NasNetMobile to NASNetMobile
    ConvNeXtTiny   # Note: Ensure your TensorFlow is 2.11+ for this one
)

# --- UPDATE YOUR DICTIONARY TOO ---
MODELS_TO_TRAIN = {
 
    
    "InceptionResNetV2": InceptionResNetV2,
    "VGG16": VGG16,
    "Xception": Xception,
    "NASNetMobile": NASNetMobile, # Fix here as well
    "ConvNeXtTiny": ConvNeXtTiny
}

# --- DATA PREPARATION ---
train_gen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=20,
    horizontal_flip=True
)

# Note: Some models like InceptionV3 prefer 299x299, but 224x224 works for all as a baseline
train_data = train_gen.flow_from_directory(DATASET_DIR, target_size=(224, 224), batch_size=32, class_mode="categorical", subset="training")
val_data = train_gen.flow_from_directory(DATASET_DIR, target_size=(224, 224), batch_size=32, class_mode="categorical", subset="validation")

num_classes = train_data.num_classes
y_train = train_data.classes
weights = class_weight.compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
class_weights = dict(enumerate(weights))

# --- MODEL FACTORY FUNCTION ---
def build_model(model_func, num_classes):
    base_model = model_func(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
    base_model.trainable = False  # Freeze for Phase 1
    
    x = GlobalAveragePooling2D()(base_model.output)
    x = BatchNormalization()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.4)(x)
    outputs = Dense(num_classes, activation="softmax")(x)
    
    return Model(inputs=base_model.input, outputs=outputs)

# --- LOOP THROUGH MODELS ---
results = {}

for name, model_func in MODELS_TO_TRAIN.items():
    print(f"\n{'='*40}\nSTARTING TRAINING: {name}\n{'='*40}")
    
    # 1. Build and Compile
    model = build_model(model_func, num_classes)
    model.compile(optimizer=Adam(1e-4), loss="categorical_crossentropy", metrics=["accuracy"])
    
    # 2. Path for this specific model
    current_model_path = os.path.join(MODEL_DIR, f"chest_model_{name}.h5")
    
    # 3. Callbacks
    callbacks = [
        ModelCheckpoint(current_model_path, monitor='val_accuracy', save_best_only=True, mode='max', verbose=0),
        EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)
    ]
    
    # 4. Phase 1: Train Head
    history = model.fit(
        train_data, validation_data=val_data,
        epochs=5, callbacks=callbacks, class_weight=class_weights
    )
    
    # 5. Phase 2: Simple Fine-Tuning
    print(f"Fine-tuning {name}...")
    model.trainable = True
    model.compile(optimizer=Adam(1e-6), loss="categorical_crossentropy", metrics=["accuracy"])
    
    history_fine = model.fit(
        train_data, validation_data=val_data,
        epochs=5, callbacks=callbacks, class_weight=class_weights
    )
    
    # Store the best accuracy achieved
    results[name] = max(history_fine.history['val_accuracy'])
    
    # CRITICAL: Clear memory to avoid crash
    K.clear_session()
    del model

# --- FINAL SUMMARY ---
print("\n--- FINAL PERFORMANCE COMPARISON ---")
for model_name, acc in sorted(results.items(), key=lambda item: item[1], reverse=True):
    print(f"{model_name}: {acc:.4f}")