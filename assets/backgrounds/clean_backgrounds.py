from pathlib import Path
import hashlib
import shutil
import csv
from datetime import datetime

ROOT = Path(".").resolve()
EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
backup = ROOT.parent / f"{ROOT.name}_backup_{timestamp}"

print(f"📦 Sauvegarde du dossier vers : {backup}")
shutil.copytree(ROOT, backup, ignore=shutil.ignore_patterns(
    "clean_backgrounds.py",
    ".DS_Store",
    "__MACOSX"
))

# Nettoyage fichiers parasites macOS
for p in ROOT.rglob("*"):
    if p.name == ".DS_Store" or p.name.startswith("._"):
        try:
            p.unlink()
            print(f"🗑️ Supprimé parasite : {p.name}")
        except Exception as e:
            print(f"⚠️ Impossible de supprimer {p}: {e}")

for p in ROOT.rglob("__MACOSX"):
    if p.is_dir():
        shutil.rmtree(p, ignore_errors=True)
        print(f"🗑️ Supprimé dossier parasite : {p.name}")

def file_hash(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def priority(path):
    name = path.name.lower()
    score = 0

    # On préfère garder les fichiers sans "copie"
    if "copie" in name:
        score += 100

    # On préfère garder les noms déjà propres
    if name.startswith("background-"):
        score -= 20
    if name.startswith("day-"):
        score -= 10

    # On évite de garder les noms ChatGPT si doublon avec autre chose
    if name.startswith("chatgpt image"):
        score += 20

    return score

images = [
    p for p in ROOT.iterdir()
    if p.is_file()
    and p.suffix.lower() in EXTENSIONS
    and p.name != "clean_backgrounds.py"
]

print(f"🔍 Images trouvées avant nettoyage : {len(images)}")

# Suppression des doublons exacts par hash
groups = {}
for img in images:
    try:
        h = file_hash(img)
        groups.setdefault(h, []).append(img)
    except Exception as e:
        print(f"⚠️ Fichier ignoré : {img.name} ({e})")

deleted = []

for h, files in groups.items():
    if len(files) <= 1:
        continue

    files_sorted = sorted(files, key=lambda p: (priority(p), len(p.name), p.name.lower()))
    keep = files_sorted[0]
    duplicates = files_sorted[1:]

    print(f"\n✅ Gardé : {keep.name}")
    for dup in duplicates:
        try:
            dup.unlink()
            deleted.append(dup.name)
            print(f"🗑️ Doublon supprimé : {dup.name}")
        except Exception as e:
            print(f"⚠️ Impossible de supprimer {dup.name}: {e}")

# Recharger la liste après suppression
images = [
    p for p in ROOT.iterdir()
    if p.is_file()
    and p.suffix.lower() in EXTENSIONS
    and p.name != "clean_backgrounds.py"
]

# Fonction de renommage sécurisé
def safe_rename(src, new_name):
    target = ROOT / new_name
    if src == target:
        return src

    if target.exists():
        stem = target.stem
        suffix = target.suffix
        i = 2
        while True:
            alt = ROOT / f"{stem}-{i}{suffix}"
            if not alt.exists():
                target = alt
                break
            i += 1

    src.rename(target)
    return target

renames = []

# 1. Renommer les backgrounds principaux
fixed_names = {
    "background-afternoon.webp": "bg-square-afternoon.webp",
    "background-day.webp": "bg-square-day.webp",
    "background-evening.webp": "bg-square-evening.webp",
    "background-morning.webp": "bg-square-morning.webp",
    "background-night.webp": "bg-square-night.webp",
    "background-sunset.webp": "bg-square-sunset.webp",
}

for old, new in fixed_names.items():
    src = ROOT / old
    if src.exists():
        dst = safe_rename(src, new)
        renames.append((old, dst.name))

# 2. Renommer les day-xx-time
time_order = {
    "morning": "morning",
    "day": "day",
    "afternoon": "afternoon",
    "evening": "evening",
    "sunset": "sunset",
    "night": "night",
}

for p in sorted(ROOT.glob("day-*.webp")):
    name = p.stem.lower()

    clean_name = name.replace(" copie 2", "").replace(" copie 3", "").replace(" copie", "")
    parts = clean_name.split("-")

    if len(parts) >= 3:
        day_number = parts[1]
        moment = parts[2]
        moment_clean = time_order.get(moment, moment)
        new_name = f"bg-wide-day-{day_number}-{moment_clean}.webp"
    else:
        new_name = f"bg-wide-{p.stem.lower().replace(' ', '-')}.webp"

    old_name = p.name
    dst = safe_rename(p, new_name)
    renames.append((old_name, dst.name))

# 3. Renommer les images ChatGPT restantes
chatgpt_images = sorted([
    p for p in ROOT.iterdir()
    if p.is_file()
    and p.suffix.lower() in EXTENSIONS
    and p.name.lower().startswith("chatgpt image")
])

for i, p in enumerate(chatgpt_images, start=1):
    old_name = p.name
    new_name = f"bg-generated-{i:03d}{p.suffix.lower()}"
    dst = safe_rename(p, new_name)
    renames.append((old_name, dst.name))

# 4. Renommer les wallpapers restants
wallpapers = sorted([
    p for p in ROOT.iterdir()
    if p.is_file()
    and p.suffix.lower() in EXTENSIONS
    and p.name.lower().startswith("wallpaper_")
])

for i, p in enumerate(wallpapers, start=1):
    old_name = p.name
    new_name = f"bg-wallpaper-{i:03d}{p.suffix.lower()}"
    dst = safe_rename(p, new_name)
    renames.append((old_name, dst.name))

# 5. Renommer tout ce qui reste avec un nom générique
remaining = sorted([
    p for p in ROOT.iterdir()
    if p.is_file()
    and p.suffix.lower() in EXTENSIONS
    and not p.name.startswith(("bg-square-", "bg-wide-", "bg-generated-", "bg-wallpaper-"))
])

for i, p in enumerate(remaining, start=1):
    old_name = p.name
    new_name = f"bg-other-{i:03d}{p.suffix.lower()}"
    dst = safe_rename(p, new_name)
    renames.append((old_name, dst.name))

# Rapport CSV
report = ROOT / "rename_report.csv"
with open(report, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["ancien_nom", "nouveau_nom"])
    writer.writerows(renames)

final_images = sorted([
    p.name for p in ROOT.iterdir()
    if p.is_file()
    and p.suffix.lower() in EXTENSIONS
])

print("\n==============================")
print("✅ Nettoyage terminé")
print("==============================")
print(f"Images supprimées comme doublons exacts : {len(deleted)}")
print(f"Images restantes : {len(final_images)}")
print(f"Sauvegarde : {backup}")
print(f"Rapport renommage : {report.name}")

print("\n📁 Images finales :")
for name in final_images:
    print(" -", name)
