import os
import shutil
import random

image_extensions = [".png", ".jpg", ".jpeg"]

directions = ["CT", "Xray", "MRI", "val"]
dataset_dir = "dataset"

train_dir = os.path.join(dataset_dir, "train")
test_dir = os.path.join(dataset_dir, "test")
val_dir = os.path.join(dataset_dir, "val")

os.makedirs(train_dir, exist_ok=True)
os.makedirs(test_dir, exist_ok=True)
os.makedirs(val_dir, exist_ok=True)

for subfolder in directions:
    subfolder_path = os.path.join(dataset_dir, subfolder)
    if not os.path.exists(subfolder_path):
        continue
    files = [f for f in os.listdir(subfolder_path) if os.path.splitext(f)[1].lower() in image_extensions]
    random.shuffle(files)
    split_1 = int(0.7 * len(files))
    train_files = files[:split_1]
    test_files = files[split_1:]
    dist = {"train": train_files, "test": test_files}
    for key, f_list in dist.items():
        dest_dir = train_dir if key == "train" else test_dir
        for f in f_list:
            src = os.path.join(subfolder_path, f)
            dst = os.path.join(dest_dir, f)
            try:
                shutil.move(src, dst)
            except Exception as e:
                print(f"Error moving {f}: {e}")