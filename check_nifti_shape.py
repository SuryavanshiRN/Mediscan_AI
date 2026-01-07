import nibabel as nib
import numpy as np
import os

# Change this to any .nii file path you have
file_path = r"D:\project\dataset image\image_000.nii"

img = nib.load(file_path)
data = img.get_fdata()

print("File:", file_path)
print("Shape:", data.shape)

if len(data.shape) == 3:
    print("➡ This is a 3D volume (H × W × D)")
elif len(data.shape) == 2:
    print("➡ This is a 2D image (H × W)")
else:
    print("➡ Unknown format")
