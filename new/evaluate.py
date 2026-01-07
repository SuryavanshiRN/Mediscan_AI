import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import image_dataset_from_directory
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# Path to your model and test data folder
MODEL_PATH = r"D:\project\new\models\chest_disease_model.h5"
TEST_DIR = r"D:\project\new\test_images"  # <-- Put your test images here, subfolders = classes

# Load the Keras model
model = load_model(MODEL_PATH)
print("Model loaded!")

# Load test dataset
IMG_SIZE = (224, 224)  # same as training
BATCH_SIZE = 32

test_ds = image_dataset_from_directory(
    TEST_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

# Get true labels
y_true = np.concatenate([y.numpy() for x, y in test_ds], axis=0)

# Get predictions
y_pred_probs = model.predict(test_ds)
y_pred = np.argmax(y_pred_probs, axis=1)

# Evaluation metrics
print("Accuracy:", accuracy_score(y_true, y_pred))
print("Precision:", precision_score(y_true, y_pred, average="macro"))
print("Recall:", recall_score(y_true, y_pred, average="macro"))
print("F1 Score:", f1_score(y_true, y_pred, average="macro"))
print("Confusion Matrix:\n", confusion_matrix(y_true, y_pred))