import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Conv2D

def get_gradcam_refined(image, model, class_names, target_size=(224, 224), target_class_idx=None):
    """
    Generate a Grad-CAM heatmap and overlay for any input image shape and channel count.
    
    Args:
        image (np.ndarray): Input image as numpy array (H, W, C) or (H, W).
        model (tf.keras.Model): Keras model.
        class_names (list): List of class names.
        target_size (tuple): Target size for model input (default: 224x224).
        target_class_idx (int, optional): Index of the class to visualize. 
                                          If None (default), the predicted class is used.

    Returns:
        overlay (np.ndarray): Image with Grad-CAM heatmap overlay.
    """
    # 1. Preprocess the Input Image
    resized_img = cv2.resize(image, target_size)
    if len(resized_img.shape) == 2:  # Grayscale -> convert to 3 channels
        processed_img = cv2.cvtColor(resized_img, cv2.COLOR_GRAY2BGR)
    elif resized_img.shape[2] > 3:  # Reduce higher channels to 3
        processed_img = resized_img[:, :, :3]
    else:
        processed_img = resized_img.copy()

    # Normalize and create batch dimension
    img_input_tensor = np.expand_dims(processed_img / 255.0, axis=0).astype(np.float32)

    # 2. Determine Target Class
    predictions = model.predict(img_input_tensor)
    if target_class_idx is None:
        target_class_idx = np.argmax(predictions[0])

    # 3. Find the Last Convolutional Layer
    last_conv_layer = None
    for layer in reversed(model.layers):
        if isinstance(layer, Conv2D):
            last_conv_layer = layer
            break
    
    if last_conv_layer is None:
        raise ValueError("No Conv2D layer found in the model for Grad-CAM.")
        
    print(f"Using layer '{last_conv_layer.name}' as the target convolutional layer.")

    # 4. Create the Grad-CAM Model
    grad_model = Model(
        inputs=model.input,
        outputs=[last_conv_layer.output, model.output]
    )

    # 5. Compute Gradients
    with tf.GradientTape() as tape:
        # Cast the input image to be watched by the gradient tape
        tape.watch(img_input_tensor) 
        conv_outputs, model_predictions = grad_model(img_input_tensor)
        
        # Get the loss for the target class
        target_channel = model_predictions[:, target_class_idx]
        
    # Compute the gradient of the target class loss with respect to the last conv layer output
    grads = tape.gradient(target_channel, conv_outputs)

    # 6. Compute Heatmap Weighting (Global Average Pooling of Gradients)
    # The result is the average intensity of the gradient for each feature map channel
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    
    # 7. Weight the Feature Maps
    # Multiply each channel in the feature map by the corresponding gradient weight
    conv_outputs = conv_outputs[0] # remove batch dim
    heatmap_weighted = conv_outputs * pooled_grads[tf.newaxis, tf.newaxis, :]

    # 8. Generate and Normalize Heatmap
    # Average across all weighted channels and apply ReLU to only keep positive contribution
    heatmap = tf.reduce_mean(heatmap_weighted, axis=-1).numpy()
    heatmap = np.maximum(heatmap, 0) # ReLU
    heatmap /= np.max(heatmap) + 1e-8 # Normalize to 0-1

    # 9. Create the Final Overlay
    # Resize the heatmap to the original image dimensions
    heatmap_resized = cv2.resize(heatmap, (image.shape[1], image.shape[0]), interpolation=cv2.INTER_LINEAR)
    heatmap_uint8 = np.uint8(255 * heatmap_resized)

    # Prepare the original image for overlay
    if len(image.shape) == 2:
        original_bgr = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    elif image.shape[2] != 3:
        original_bgr = image[:, :, :3]
    else:
        original_bgr = image.copy()

    # Apply color map and overlay (Jet color scheme is standard)
    heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    overlay = cv2.addWeighted(original_bgr, 0.5, heatmap_color, 0.5, 0)
    
    # Add predicted class name to the image for context
    predicted_class = class_names[target_class_idx]
    
    # Optional: Draw the class name on the overlay
    # cv2.putText(overlay, predicted_class, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)
    
    return overlay

