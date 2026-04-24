# 📱 Livre d'Or Audio — Guide de déploiement
**Soufiane & Salma · 23 Octobre 2026**

> **Architecture 100% Google** — Même principe que le formulaire RSVP :
> Google Apps Script + Google Drive + Google Sheets.
> Zéro serveur à louer, zéro coût.

---

## ✅ CHECKLIST RAPIDE

```
□ 1. Créer le Google Apps Script (Code-livre-or.gs)
□ 2. Renseigner SHEET_ID dans le script (optionnel)
□ 3. Déployer le script → copier l'URL
□ 4. Coller l'URL dans index.html → CONFIG.API_URL
□ 5. Déployer index.html sur Netlify
□ 6. Tester sur iPhone ET Android
□ 7. Générer le QR code + imprimer
```

---

## 1️⃣ CRÉER LE GOOGLE APPS SCRIPT (10 minutes)

### Étape A — Ouvrir Apps Script
1. Aller sur **script.google.com** (connecté avec votre compte Google)
2. Cliquer **Nouveau projet**
3. Renommer le projet : **"Livre d'Or Audio - Mariage S&S"**

### Étape B — Coller le code
1. Supprimer le code existant dans l'éditeur
2. Copier-coller tout le contenu de **`Code-livre-or.gs`**
3. Enregistrer (Ctrl+S)

### Étape C — Configurer les constantes

Dans le fichier, renseignez :

```javascript
// Nom du dossier Drive (sera créé automatiquement)
const DRIVE_FOLDER_NAME = "Livre d'Or Audio — Mariage S&S 🎙️";

// ID de votre Google Sheet (optionnel — pour avoir un registre)
const SHEET_ID = 'VOTRE_ID_SHEET_ICI';
```

**Trouver l'ID du Sheet :**
```
URL du Sheet : https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit
                                                        ↑ c'est cet ID
```

> 💡 Vous pouvez réutiliser le même Sheet que les RSVP (onglet séparé),
> ou créer un nouveau Sheet dédié.

### Étape D — Autoriser les permissions
1. Cliquer **▶ Exécuter** (sur la fonction `doGet`)
2. Une fenêtre demande d'autoriser Google Drive et Google Sheets
3. Cliquer **Examiner les autorisations → Autoriser**

### Étape E — Déployer
1. Cliquer **Déployer → Nouvelle déploiement**
2. Type : **Application Web**
3. Paramètres :
   - Exécuter en tant que : **Moi (votre compte)**
   - Accès : **N'importe qui**
4. Cliquer **Déployer**
5. **Copier l'URL** — elle ressemble à :
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

> ⚠️ À chaque modification du script, faites **Déployer → Gérer les déploiements
> → Modifier → Nouvelle version → Déployer** pour mettre à jour.

---

## 2️⃣ BRANCHER LE FRONTEND

Dans `index.html`, trouvez la section CONFIG (vers la fin du fichier) :

```javascript
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/VOTRE_ID_ICI/exec', // ⚠️ À CHANGER
  ...
};
```

Remplacez `VOTRE_ID_ICI` par l'URL complète copiée à l'étape E.

---

## 3️⃣ DÉPLOYER LE FRONTEND — Netlify (2 minutes)

1. Aller sur **netlify.com** → se connecter
2. **Add new site → Deploy manually**
3. Glisser-déposer **uniquement `index.html`**
4. URL obtenue : `https://livre-or-mariage.netlify.app`

> 💡 Personnalisez l'URL : Settings → Domain → Change site name

---

## 4️⃣ GÉNÉRER LE QR CODE

### Rapide (en ligne)
1. Aller sur **qr.io** ou **qr-code-generator.com**
2. Coller l'URL Netlify
3. Couleur foncée : `#5D262C` (bordeaux du faire-part)
4. Couleur claire : `#F9F7F2` (crème)
5. Télécharger PNG 500×500px minimum

### Idées de supports
- Carton posé sur chaque table
- Adhesif sur le menu
- Chevalet à l'entrée de la salle

---

## 5️⃣ RÉCUPÉRER LES AUDIOS APRÈS LE MARIAGE

### Option A — Via Google Drive (le plus simple)
1. Aller sur **drive.google.com**
2. Chercher le dossier **"Livre d'Or Audio — Mariage S&S 🎙️"**
3. Tous les fichiers audio sont là, nommés :
   ```
   1729687200000_Sarah_Amie_de_Salma.webm
   1729687800000_Mohamed.m4a
   ```
4. Sélectionner tout → Télécharger → un ZIP est créé

### Option B — Via Google Sheet
Si vous avez configuré `SHEET_ID`, un tableau liste tous les messages avec :
- Prénom, relation, durée
- Lien cliquable **▶ Écouter** directement dans le Sheet

### Option C — Via le script
1. Ouvrir Apps Script → Fonction `listerTousLesAudios()`
2. Cliquer **▶ Exécuter**
3. Affichage → Journaux d'exécution → liste complète avec liens

---

## 6️⃣ COMPATIBILITÉ MOBILE

| Navigateur        | Format audio | Statut      |
|------------------|-------------|-------------|
| Chrome Android   | WebM / Opus  | ✅ Parfait   |
| Safari iOS 14.3+ | MP4 / AAC    | ✅ Parfait   |
| Firefox Android  | WebM         | ✅ OK        |
| Samsung Internet | WebM         | ✅ OK        |

> ⚠️ Le micro nécessite **HTTPS** en production.
> Netlify active HTTPS automatiquement. ✅

---

## 7️⃣ PROBLÈMES FRÉQUENTS

**"Accès micro refusé"**
→ iPhone : Réglages → Safari → Microphone → Autoriser
→ Android : Paramètres du site Chrome → Microphone → Autoriser

**"Erreur lors de l'envoi"**
→ Vérifier que CONFIG.API_URL est bien l'URL Apps Script complète (`/exec` à la fin)
→ Vérifier que le déploiement Apps Script a bien **"Accès : N'importe qui"**
→ Ouvrir l'URL Apps Script directement dans un navigateur → doit afficher "✅ OK"

**Les fichiers n'apparaissent pas dans Drive**
→ Vérifier dans Apps Script → Affichage → Journaux d'exécution
→ S'assurer que les permissions Drive ont bien été accordées (étape D)

**Le Sheet n'est pas mis à jour**
→ Vérifier que SHEET_ID est correct (pas l'URL complète, juste l'ID)
→ Vérifier que le compte Google qui a déployé a accès au Sheet

---

## ⏱️ TEMPS TOTAL ESTIMÉ

| Étape                          | Durée    |
|-------------------------------|----------|
| Créer + déployer Apps Script   | 10 min   |
| Modifier + déployer sur Netlify| 5 min    |
| Générer + imprimer QR code     | 15 min   |
| Tests iPhone + Android         | 10 min   |
| **Total**                      | **~40 min** |
