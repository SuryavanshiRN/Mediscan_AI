# train.py

import keras as tf
from keras.preprocessing.image import ImageDataGenerator
from model import train_model


# -------------------------------------------------
# Configuration
# -------------------------------------------------
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10

TRAIN_DIR = "dataset/train"
TEST_DIR = "dataset/test"

# -------------------------------------------------
# DATASET LOADING
# -------------------------------------------------
def load_dataset():
    print("[INFO] Loading dataset...")

    train_datagen = ImageDataGenerator(
        rescale=1/255.0,
        rotation_range=10,
        zoom_range=0.2,
        horizontal_flip=True
    )

    test_datagen = ImageDataGenerator(
        rescale=1/255.0
    )

    train_data = train_datagen.flow_from_directory(
        TRAIN_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical"
    )

    test_data = test_datagen.flow_from_directory(
        TEST_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode="categorical"
    )

    print("[INFO] Dataset loaded successfully.")
    print(f"[INFO] Classes detected: {train_data.class_indices}")

    return train_data, test_data


# -------------------------------------------------
# MAIN TRAINING SCRIPT
# -------------------------------------------------
if __name__ == "__main__":
    print("\n================ START TRAINING ================\n")

    train_data, test_data = load_dataset()

    # Train using model.py
    model, history = train_model(
        train_data=train_data,
        test_data=test_data,
        epochs=EPOCHS,
        save_path="chest_disease_model.h5"
    )

    print("\n================ TRAINING COMPLETED ================\n")

