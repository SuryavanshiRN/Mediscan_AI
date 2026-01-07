import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling1D, Input
from transformers import ViTFeatureExtractor, TFViTForImageClassification

def create_vit_model(num_classes, image_size=(224, 224)):
    # 1. Load a pre-trained ViT model from Hugging Face
    # 'google/vit-base-patch16-224-in21k' is a powerful base for fine-tuning
    vit_model = TFViTForImageClassification.from_pretrained(
        'google/vit-base-patch16-224-in21k', 
        num_labels=num_classes
    )
    
    # Using the TF model directly as a Keras layer or custom head
    inputs = Input(shape=(image_size[0], image_size[1], 3))
    
    # ViT expects normalized pixel values; the model handle this internally 
    # when using the TFViTForImageClassification call
    outputs = vit_model(inputs).logits
    
    # Final classification head
    x = Dense(512, activation="relu")(outputs)
    x = Dropout(0.5)(x)
    final_output = Dense(num_classes, activation="softmax")(x)

    model = Model(inputs=inputs, outputs=final_output)
    return model