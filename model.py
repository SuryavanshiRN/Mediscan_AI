## model.py

from keras.models import Sequential, load_model
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from keras.optimizers import Adam


# ---------------------------------------------
# Build CNN Model
# ---------------------------------------------
def build_model(num_classes):
    model = Sequential([
        Conv2D(32, (3, 3), activation="relu", input_shape=(224, 224, 3)),
        MaxPooling2D(),

        Conv2D(64, (3, 3), activation="relu"),
        MaxPooling2D(),

        Conv2D(128, (3, 3), activation="relu"),
        MaxPooling2D(),

        Flatten(),
        Dense(256, activation="relu"),
        Dropout(0.3),

        Dense(num_classes, activation="softmax")
    ])

    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss="categorical_crossentropy",
        metrics=["accuracy"]
    )
    return model

# ---------------------------------------------
# Train Model
# ---------------------------------------------
def train_model(train_data, test_data, epochs=10, save_path="chest_disease_model.h5"):
    model = build_model(train_data.num_classes)

    print("\n==================== TRAINING STARTED ====================")
    history = model.fit(
        train_data,
        validation_data=test_data,
        epochs=epochs
    )

    # Save model
    model.save(save_path)
    print(f"\nModel saved as {save_path}")

    return model, history

# ---------------------------------------------
# Load Model
# ---------------------------------------------
def load_trained_model(model_path="chest_disease_model.h5"):
    try:
        model = load_model(model_path)
        print(f"[INFO] Loaded model from {model_path}")
        return model
    except Exception as e:
        print(f"[ERROR] Unable to load model: {e}")
        return None

