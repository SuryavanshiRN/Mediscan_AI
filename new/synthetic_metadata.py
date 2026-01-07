import random
import pandas as pd

def generate_synthetic_radiology_metadata(n=10000, seed=42):
    random.seed(seed)

    aspects = [
        "Scan Type", "Modality", "Orientation", "Patient Position", "Region Examined",
        "Anatomical Landmarks", "Bone Structures Visible", "Soft Tissue Visibility",
        "Lung Field Visibility", "Heart Visibility", "Diaphragm Visibility", "Mediastinum Visibility",
        "Pleural Space Visibility", "Image Contrast", "Image Sharpness", "Exposure Quality",
        "Noise Level", "Artifacts Detected", "Symmetry", "Lung Inflation", "Thoracic Cage Shape",
        "Spinal Alignment", "Clavicle Position", "Shoulder Girdle Visibility", "Rib Count Visibility",
        "Vascular Markings", "Airway Visibility", "Trachea Position", "Costophrenic Angles",
        "Cardiac Silhouette", "Field Coverage", "Image Usability", "General Notes"
    ]

    detail_templates = [
        "appears generally consistent with typical imaging patterns",
        "visual representation aligns with standard orientation",
        "soft tissue outlines detectable in general terms",
        "bony structures faintly visible without diagnostic context",
        "image contrast shows moderate differentiation",
        "noise and artifact levels remain low and non-obstructive",
        "overall symmetry appears within neutral limits",
        "field coverage sufficient for general reference",
        "anatomical boundaries identifiable without interpretation",
        "exposure quality adequate for generic visualization",
        "slight variations in appearance present but non-diagnostic",
        "clarity allows general observation of structural regions",
        "minor shadowing or faint lines visible without clinical meaning",
        "image captures expected regions for this modality",
        "structures partially visible in non-specific manner"
    ]

    categories = ["Quality", "Anatomy", "Visibility"]

    aspect_list = []
    detail_list = []
    category_list = []

    for i in range(n):
        aspect = aspects[i % len(aspects)]
        detail = f"{random.choice(detail_templates)} (Reference ID: {i+1})"
        category = categories[i % len(categories)]

        aspect_list.append(aspect)
        detail_list.append(detail)
        category_list.append(category)

    df = pd.DataFrame({
        "Aspect": aspect_list,
        "Details": detail_list,
        "Category": category_list
    })

    return df