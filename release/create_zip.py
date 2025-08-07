import os
import zipfile
import shutil

def create_zip():
    source_dir = 'esp-tracker-release'
    zip_filename = 'esp-tracker-web-v2.2.zip'
    
    # ลบไฟล์ ZIP เดิมถ้ามี
    if os.path.exists(zip_filename):
        os.remove(zip_filename)
    
    # สร้างไฟล์ ZIP ใหม่
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, arcname)
    
    print(f"ZIP file created: {zip_filename}")
    print(f"Size: {os.path.getsize(zip_filename)} bytes")

if __name__ == "__main__":
    create_zip() 