import pandas as pd
import os

def analyse(file):
    if not os.path.exists(file):
        print(f"❌ Fichier '{file}' introuvable. Exportezo le tableau Google Sheets de Julien & Amandine en format CSV sous ce nom.")
        return
    df = pd.read_csv(file)
    presents = len(df[df['Presence'].str.contains('✅', na=False)])
    print(f"📊 RÉSUMÉ (Julien & Amandine) : {presents} présents sur {len(df)} réponses.")

if __name__ == "__main__":
    analyse('reponses.csv')
