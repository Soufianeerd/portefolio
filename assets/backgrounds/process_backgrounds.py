import os
import json
import shutil
from pathlib import Path
from PIL import Image, ImageStat
from concurrent.futures import ProcessPoolExecutor

# Paths
ROOT_DIR = Path("/Users/soufianeelrhadi/Desktop/Portfolio/portfolio/assets/backgrounds")
BACKUP_DIR = Path("/Users/soufianeelrhadi/Desktop/Portfolio/portfolio/assets/backgrounds_backup_20260518_203059")
OUTPUT_JSON = ROOT_DIR / "backgrounds.json"

def calculate_brightness(image_path):
    with Image.open(image_path) as img:
        gray_img = img.convert('L')
        stat = ImageStat.Stat(gray_img)
        return stat.mean[0]

def process_single_image(args):
    i, file_path = args
    output_name = f"image{i}.webp"
    output_path = ROOT_DIR / output_name
    
    # If output file already exists, skip conversion
    if output_path.exists():
        try:
            brightness = calculate_brightness(output_path)
            theme = "day" if brightness >= 120 else "night"
            return {
                "id": i,
                "file": output_name,
                "brightness": round(brightness, 2),
                "theme": theme,
                "status": "skipped"
            }
        except Exception as e:
            return {"id": i, "file": output_name, "error": str(e), "status": "error"}
            
    try:
        # Open and convert to webp
        with Image.open(file_path) as img:
            # Optimize speed: set method=2 (faster conversion)
            img.save(output_path, "WEBP", quality=85, method=2)
        
        # Calculate brightness on the final WebP image
        brightness = calculate_brightness(output_path)
        theme = "day" if brightness >= 120 else "night"
        
        return {
            "id": i,
            "file": output_name,
            "brightness": round(brightness, 2),
            "theme": theme,
            "status": "processed"
        }
    except Exception as e:
        return {"id": i, "file": output_name, "error": str(e), "status": "error"}

def main():
    print("Starting background images processing (multiprocessing)...")
    
    # Get list of files in backup directory
    extensions = {".png", ".jpg", ".jpeg", ".webp"}
    backup_files = [
        f for f in BACKUP_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in extensions
    ]
    backup_files.sort(key=lambda x: x.name.lower())
    
    # Clean the current backgrounds directory (preserve python scripts, clean_backgrounds.py, and existing image*.webp)
    valid_names = {f"image{i}.webp" for i in range(1, len(backup_files) + 1)}
    for path in ROOT_DIR.iterdir():
        if path.is_file():
            if path.name in ("process_backgrounds.py", "clean_backgrounds.py", ".DS_Store", "backgrounds.json", "backgrounds-data.js"):
                continue
            if path.name in valid_names:
                continue
            path.unlink()
        elif path.is_dir():
            shutil.rmtree(path)
            
    print(f"Found {len(backup_files)} images in backup directory.")
    
    tasks = [(i, file_path) for i, file_path in enumerate(backup_files, 1)]
    
    backgrounds_metadata = []
    
    # Use ProcessPoolExecutor to process images in parallel
    max_workers = os.cpu_count() or 4
    print(f"Running with {max_workers} parallel workers...")
    
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(process_single_image, tasks))
        
    processed_count = 0
    skipped_count = 0
    error_count = 0
    
    for res in sorted(results, key=lambda x: x["id"]):
        if "error" in res:
            print(f"Error processing {res['file']}: {res['error']}")
            error_count += 1
        else:
            backgrounds_metadata.append({
                "id": res["id"],
                "file": res["file"],
                "brightness": res["brightness"],
                "theme": res["theme"]
            })
            if res["status"] == "processed":
                processed_count += 1
            elif res["status"] == "skipped":
                skipped_count += 1
                
    print(f"Processed: {processed_count}, Skipped: {skipped_count}, Errors: {error_count}")
    
    # Save metadata to JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(backgrounds_metadata, f, indent=2, ensure_ascii=False)
        
    # Save metadata to JS file (for file:// protocol compatibility)
    OUTPUT_JS = ROOT_DIR / "backgrounds-data.js"
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write("/* Generated file - do not edit directly */\n")
        f.write("window.PORTFOLIO_BACKGROUNDS = ")
        json.dump(backgrounds_metadata, f, indent=2, ensure_ascii=False)
        f.write(";\n")
        
    print(f"Processing complete! Saved {len(backgrounds_metadata)} items.")
    print(f"JSON: {OUTPUT_JSON}")
    print(f"JS: {OUTPUT_JS}")

if __name__ == "__main__":
    main()
