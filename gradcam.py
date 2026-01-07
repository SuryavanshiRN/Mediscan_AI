# gradcam.py

import numpy as np
import keras
from keras.models import load_model, Model

import tensorflow as tf
import cv2

# -------------------------------------------------------------
# Load model (only once – good for Streamlit)
# -------------------------------------------------------------
MODEL_PATH = "chest_disease_model.h5"
model = load_model(MODEL_PATH)

# Automatically fetch the last CONV layer for GradCAM
def get_last_conv_layer(model):
    for layer in reversed(model.layers):
        # Conv layers have 4D feature maps: (batch, h, w, channels)
        try:
            if len(layer.output_shape) == 4:
                return layer.name
        except:
            continue
    raise ValueError("No convolutional layer found for GradCAM.")

last_conv_layer_name = get_last_conv_layer(model)

# -------------------------------------------------------------
# Preprocessing function (use EXACT same input normalization as training)
# -------------------------------------------------------------
def preprocess_image(img):
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# -------------------------------------------------------------
# Generate Grad-CAM heatmap
# -------------------------------------------------------------
def generate_gradcam(img_array, model, last_conv_layer_name, pred_index=None):

    grad_model = Model(
        inputs=model.inputs,
        outputs=[
            model.get_layer(last_conv_layer_name).output,
            model.output
        ]
    )

    with tf.GradientTape() as tape:
        conv_outputs, predictions = grad_model(img_array)

        if pred_index is None:
            pred_index = tf.argmax(predictions[0])

        predicted_output = predictions[:, pred_index]

    # Compute gradients wrt conv outputs
    grads = tape.gradient(predicted_output, conv_outputs)

    # Global average pooling on gradients
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    # Remove batch dimension
    conv_outputs = conv_outputs[0]

    # Weighted sum of feature maps
    heatmap = tf.reduce_sum(
        conv_outputs * pooled_grads,
        axis=-1
    )

    # Normalize 0–1
    heatmap = np.maximum(heatmap, 0)
    max_val = np.max(heatmap) + 1e-10
    heatmap /= max_val

    return heatmap

# -------------------------------------------------------------
# Overlay heatmap on original X-ray image
# -------------------------------------------------------------
def overlay_heatmap(original_img, heatmap, alpha=0.5):
    heatmap = cv2.resize(heatmap, (original_img.shape[1], original_img.shape[0]))
    heatmap = np.uint8(255 * heatmap)

    heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(original_img, 1 - alpha, heatmap_color, alpha, 0)

    return overlay

# -------------------------------------------------------------
# MAIN GradCAM function (for Streamlit)
# -------------------------------------------------------------
def get_gradcam(image_file):
    # Read uploaded image from Streamlit
    file_bytes = np.asarray(bytearray(image_file.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
    original_img = img.copy()

    # Preprocess
    img_array = preprocess_image(img)

    # Predict class
    preds = model.predict(img_array)[0]
    class_index = np.argmax(preds)

    # Generate heatmap
    heatmap = generate_gradcam(img_array, model, last_conv_layer_name, class_index)

    # Overlay heatmap on original image
    gradcam_img = overlay_heatmap(original_img, heatmap)

    return gradcam_img, class_index, preds[class_index]

