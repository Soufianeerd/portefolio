from rembg import remove
from PIL import Image
import os

# Configuration des chemins pour le Template 1
input_path = 'assets/seau.png' 
output_path = 'assets/seau_detouree.png' 

print("🔄 IA de détourage en cours... (Patience, ça travaille)")

try:
    if not os.path.exists(input_path):
        print(f"❌ Erreur : Je ne trouve pas '{input_path}'. Vous pouvez placer un fichier image dans un sous-dossier 'assets/'.")
    else:
        img_brute = Image.open(input_path)
        img_detouree = remove(img_brute)
        # Création du dossier assets s'il n'existe pas
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        img_detouree.save(output_path)
        print(f"✅ SUCCÈS ! Sceau détouré créé : {output_path}")
except Exception as e:
    print(f"❌ Erreur : {e}")
