import os
import shutil
import tempfile
import zipfile
from PIL import Image


def convert_dds_to_jpg(input_folder, output_folder):
    # Ensure the output directory exists
    os.makedirs(output_folder, exist_ok=True)

    for root, dirs, files in os.walk(input_folder):
        for file in files:
            file_path = os.path.join(root, file)
            output_path = os.path.join(output_folder, file)

            # Check if the file is a .dds file
            if file.lower().endswith(".dds"):
                try:
                    # Convert .dds to .jpg
                    img = Image.open(file_path)
                    output_path = os.path.splitext(output_path)[0] + ".png"
                    img.save(output_path, "PNG")
                    print(f"Converted {file} to PNG and saved as {output_path}")
                except Exception as e:
                    print(f"Failed to convert {file}: {e}")
            else:
                try:
                    # Move non-dds files to the output directory
                    shutil.move(file_path, output_path)
                    print(f"Moved {file} to {output_path}")
                except Exception as e:
                    print(f"Failed to move {file}: {e}")


def process_zip(zip_path, output_folder):
    # Create a temporary directory
    with tempfile.TemporaryDirectory() as temp_dir:
        # Extract the ZIP file into the temporary directory
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(temp_dir)
            print(f"Extracted {zip_path} to {temp_dir}")

        # Convert DDS files to JPG and move other files
        convert_dds_to_jpg(temp_dir + "/Media/Flags", output_folder)


# Example usage
zip_path = "../Maniaplanet_Flags.zip"
output_folder = "../assets"
process_zip(zip_path, output_folder)
