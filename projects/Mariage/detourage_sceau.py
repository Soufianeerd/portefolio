from rembg import remove
from PIL import Image
import os

# Configuration des chemins
input_path = 'assets/sceau-generic.png' # Votre image actuelle
output_path = 'assets/sceau-generic-pro.png' # Le PNG transparent final

print("🔄 IA de détourage en cours... (Patience, ça travaille)")

try:
    if not os.path.exists(input_path):
        print(f"❌ Erreur : Je ne trouve pas '{input_path}'.")
    else:
        img_brute = Image.open(input_path)
        img_detouree = remove(img_brute)
        img_detouree.save(output_path)
        print(f"✅ SUCCÈS ! Sceau détouré créé : {output_path}")
except Exception as e:
    print(f"❌ Erreur : {e}")
