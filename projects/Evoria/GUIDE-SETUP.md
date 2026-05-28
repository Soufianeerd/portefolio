# Guide de configuration — RSVP → Google Sheets
## Julien & Amandine · 13 Juin 2026

---

## Ce que vous allez obtenir

- ✅ Chaque réponse RSVP s'enregistre automatiquement dans un **Google Sheet**
- ✅ Vous recevez un **email de notification** à chaque nouvelle réponse
- ✅ L'email contient : les détails du nouvel invité + **le tableau complet mis à jour** (confirmés, absents, total de réponses)

---

## Étape 1 — Créer le Google Sheet

1. Allez sur [sheets.google.com](https://sheets.google.com) et créez un nouveau classeur
2. Nommez-le **"RSVP - Julien & Amandine"**
3. Laissez-le ouvert

---

## Étape 2 — Créer le Google Apps Script

1. Dans votre Google Sheet, cliquez sur **Extensions → Apps Script**
2. Supprimez tout le code présent dans l'éditeur
3. Ouvrez le fichier **`Code.gs`** (dans le dossier `Template_1`) et **copiez tout son contenu**
4. Collez-le dans l'éditeur Apps Script
5. Cliquez sur l'icône 💾 **Enregistrer**
6. Nommez le projet : **"RSVP Julien & Amandine"**

---

## Étape 3 — Tester et Autoriser le Script

1. Dans l'éditeur Apps Script, sélectionnez la fonction **`testRSVP`** dans le menu déroulant
2. Cliquez sur ▶️ **Exécuter**
3. Autorisez l'accès en validant les fenêtres de sécurité Google (cliquez sur "Paramètres avancés" puis "Accéder à RSVP Julien & Amandine (non sécurisé)" et enfin "Autoriser")
4. Vérifiez votre Google Sheet → un onglet "RSVP Julien & Amandine" doit apparaître avec une ligne de test
5. Vérifiez votre boîte mail → vous devez avoir reçu un e-mail récapitulatif stylisé

---

## Étape 4 — Déployer le script comme Application Web

1. Cliquez sur **Déployer → Nouveau déploiement**
2. Cliquez sur ⚙️ (engrenage) → **Application Web**
3. Configurez ainsi :
   - **Description** : RSVP Julien & Amandine
   - **Exécuter en tant que** : `Moi (votre adresse email)`
   - **Qui peut accéder** : `Tout le monde`
4. Cliquez sur **Déployer**
5. **Copiez l'URL** Web App fournie (format : `https://script.google.com/macros/s/ABC.../exec`)

---

## Étape 5 — Connecter le formulaire à votre script

1. Ouvrez le fichier **`invitation.js`** dans le dossier `Template_1`
2. Cherchez la ligne suivante (vers la ligne 50) :
   ```javascript
   const SCRIPT_URL = '...';
   ```
3. Remplacez l'URL par celle que vous venez de copier
4. **Sauvegardez** le fichier `invitation.js`

---

## Étape 6 — Tester le formulaire complet

1. Ouvrez le fichier `index.html` (de ce dossier `Template_1`) dans votre navigateur
2. Descendez jusqu'à la section RSVP, remplissez les informations et validez
3. Vérifiez l'insertion dans votre Google Sheet et la réception de votre notification par e-mail
