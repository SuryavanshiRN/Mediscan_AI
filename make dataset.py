import os
import shutil
import random

# ---------------------------------------------------------
# MAIN PATHS
# ---------------------------------------------------------
project_folder = "D:/project"
dataset_folder = os.path.join(project_folder, "dataset")
output_folder = os.path.join(project_folder, "data")

# Final modalities
modalities = ["ct", "xray", "mri"]

# Supported image types
IMAGE_EXTENSIONS = (
    ".png", ".jpg", ".jpeg", ".bmp",
    ".tif", ".tiff", ".nii", ".nii.gz"
)

# ---------------------------------------------------------
# CREATE OUTPUT STRUCTURE
# ---------------------------------------------------------
for split in ["train", "val", "test"]:
    for mod in modalities:
        os.makedirs(os.path.join(output_folder, split, mod), exist_ok=True)

# Dataset split ratios
train_ratio = 0.70
val_ratio = 0.20
test_ratio = 0.10

# ---------------------------------------------------------
# MODALITY DETECTION LOGIC
# ---------------------------------------------------------
def detect_modality(path):
    """Detect CT/X-ray/MRI based on folder names or extension."""
    p = path.lower()

    # Name-based detection
    if "ct" in p or "computed" in p:
        return "ct"
    if "xray" in p or "x-ray" in p or "chest" in p or "cxr" in p:
        return "xray"
    if "mri" in p or "t1" in p or "t2" in p:
        return "mri"

    # NII files → usually MRI, but you can change
    if p.endswith(".nii") or p.endswith(".nii.gz"):
        return "mri"

    return None

# ---------------------------------------------------------
# GATHER ALL IMAGES
# ---------------------------------------------------------
dataset_images = {mod: [] for mod in modalities}

for root, dirs, files in os.walk(dataset_folder):
    for file in files:
        if file.lower().endswith(IMAGE_EXTENSIONS):
            full_path = os.path.join(root, file)
            mod = detect_modality(root)

            if mod:
                dataset_images[mod].append(full_path)
            else:
                print(f"⚠ Skipped (unknown modality): {full_path}")

# ---------------------------------------------------------
# SPLIT & COPY FUNCTION
# ---------------------------------------------------------
def split_and_copy(images, mod):
    """Shuffle, split, copy images into train/val/test folders."""
    if len(images) == 0:
        print(f"⚠ No images found for {mod.upper()} — skipping.")
        return

    random.shuffle(images)
    total = len(images)

    train_end = int(total * train_ratio)
    val_end = train_end + int(total * val_ratio)

    train_files = images[:train_end]
    val_files = images[train_end:val_end]
    test_files = images[val_end:]

    # Copy sets
    for src in train_files:
        shutil.copy2(src, os.path.join(output_folder, "train", mod, os.path.basename(src)))

    for src in val_files:
        shutil.copy2(src, os.path.join(output_folder, "val", mod, os.path.basename(src)))

    for src in test_files:
        shutil.copy2(src, os.path.join(output_folder, "test", mod, os.path.basename(src)))

# ---------------------------------------------------------
# PROCESS ALL MODALITIES
# ---------------------------------------------------------
print("\n========== DATASET SUMMARY ==========")

for mod in modalities:
    print(f"{mod.upper()} images found: {len(dataset_images[mod])}")

print("\n========== STARTING SPLIT ==========\n")

for mod in modalities:
    split_and_copy(dataset_images[mod], mod)

print("\n=====================================")
print("✔ All datasets merged & categorized.")
print("✔ Train / Val / Test created.")
print("✔ Modalities included: CT / X-ray / MRI")
print("=====================================\n")
