# evaluate.py

import os
import numpy as np
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
import joblib
import argparse

# ---------------------------------------------
# 1. LOAD MODEL
# ---------------------------------------------

def load_model(model_path):
    try:
        model = joblib.load(model_path)
        print(f"[INFO] Model loaded successfully from {model_path}")
        return model
    except:
        print("[ERROR] Could not load model.")
        exit()

# ---------------------------------------------
# 2. LOAD TEST DATASET
# ---------------------------------------------
# Expected CSV Format:
# image_path,label

def load_test_data(csv_path):
    if not os.path.exists(csv_path):
        print("[ERROR] Test CSV not found!")
        exit()

    df = pd.read_csv(csv_path)

    if "image_path" not in df.columns or "label" not in df.columns:
        print("[ERROR] CSV must contain 'image_path' and 'label' columns.")
        exit()

    return df

# ---------------------------------------------
# 3. IMAGE PROCESSING (for CNN models)
# ---------------------------------------------
# This function should match your training preprocessing

import cv2

def preprocess_image(img_path):
    try:
        img = cv2.imread(img_path)
        img = cv2.resize(img, (224, 224))
        img = img / 255.0
        return img
    except:
        print(f"[WARNING] Could not read image: {img_path}")
        return None

# ---------------------------------------------
# 4. EVALUATION PIPELINE
# ---------------------------------------------

def evaluate(model, df):
    X = []
    y_true = []

    for i, row in df.iterrows():
        img = preprocess_image(row["image_path"])
        if img is None:
            continue
        X.append(img)
        y_true.append(row["label"])

    X = np.array(X)
    X = X.reshape(len(X), -1)  # flatten for SVM/ML models

    y_pred = model.predict(X)

    print("\n================ Evaluation Report ================")
    print(classification_report(y_true, y_pred))
    print("\n================ Confusion Matrix ================")
    print(confusion_matrix(y_true, y_pred))

    # Saving report
    report_dict = classification_report(y_true, y_pred, output_dict=True)
    pd.DataFrame(report_dict).transpose().to_csv("evaluation_report.csv", index=True)
    print("\n[INFO] Evaluation report saved as evaluation_report.csv")

# ---------------------------------------------
# 5. MAIN
# ---------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str, required=True, help="Path to trained model (.pkl)")
    parser.add_argument("--testcsv", type=str, required=True, help="CSV file with image paths & labels")

    args = parser.parse_args()

    model = load_model(args.model)
    df_test = load_test_data(args.testcsv)
    evaluate(model, df_test)

