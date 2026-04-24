# Guide de configuration — RSVP → Google Sheets
## Soufiane & Salma · 23 Octobre 2026

---

## Ce que vous allez obtenir

- ✅ Chaque réponse RSVP s'enregistre automatiquement dans un **Google Sheet**
- ✅ Vous recevez un **email à soufiane.erd@gmail.com** à chaque nouvelle réponse
- ✅ L'email contient : les infos du nouvel invité + **le tableau complet mis à jour** (confirmés, absents, nombre total de personnes)

---

## Étape 1 — Créer le Google Sheet

1. Allez sur [sheets.google.com](https://sheets.google.com) et créez un nouveau classeur
2. Nommez-le **"RSVP - Soufiane & Salma"**
3. Laissez-le ouvert (le script le remplira automatiquement)

---

## Étape 2 — Créer le Google Apps Script

1. Dans votre Google Sheet, cliquez sur **Extensions → Apps Script**
2. Supprimez tout le code présent dans l'éditeur
3. Ouvrez le fichier **`Code.gs`** (dans votre dossier Mariage) et **copiez tout son contenu**
4. Collez-le dans l'éditeur Apps Script
5. Cliquez sur l'icône 💾 **Enregistrer** (ou Ctrl+S)
6. Nommez le projet : **"RSVP Faire-part"**

---

## Étape 3 — Tester avant déploiement

1. Dans l'éditeur Apps Script, sélectionnez la fonction **`testRSVP`** dans le menu déroulant
2. Cliquez sur ▶️ **Exécuter**
3. Autorisez l'accès quand Google vous le demande (cliquez "Autoriser")
4. Vérifiez votre Google Sheet → un onglet "RSVP Invités" doit apparaître avec une ligne de test
5. Vérifiez votre email → vous devez recevoir un email de notification

---

## Étape 4 — Déployer le script comme Application Web

1. Cliquez sur **Déployer → Nouveau déploiement**
2. Cliquez sur ⚙️ (engrenage) → **Application Web**
3. Configurez ainsi :
   - **Description** : RSVP Faire-part
   - **Exécuter en tant que** : `Moi (soufiane.erd@gmail.com)`
   - **Qui peut accéder** : `Tout le monde`
4. Cliquez sur **Déployer**
5. **Copiez l'URL** qui apparaît (format : `https://script.google.com/macros/s/ABC.../exec`)

---

## Étape 5 — Connecter le formulaire à votre script

1. Ouvrez le fichier **`index.html`** dans un éditeur de texte (Notepad, VS Code, etc.)
2. Cherchez la ligne suivante (vers la fin du fichier) :
   ```
   const SCRIPT_URL = 'REMPLACER_PAR_VOTRE_URL_APPS_SCRIPT';
   ```
3. Remplacez `REMPLACER_PAR_VOTRE_URL_APPS_SCRIPT` par l'URL copiée à l'étape 4
4. **Sauvegardez** le fichier

---

## Étape 6 — Tester le formulaire complet

1. Ouvrez `index.html` dans votre navigateur
2. Descendez jusqu'à la section RSVP
3. Remplissez le formulaire avec vos infos et cliquez "Envoyer"
4. Vérifiez votre Google Sheet et votre email

---

## Structure du Google Sheet

| A — Date & Heure | B — Nom & Prénom | C — Email | D — Présence | E — Nb. Personnes | F — Allergies | G — Message |
|---|---|---|---|---|---|---|
| 23/10/2026 15:32 | Marie Dupont | marie@... | ✅ Présent(e) | 2 | Aucune | Super ! |

---

## À propos des SMS

Les SMS nécessitent un service tiers (ex: [Twilio](https://twilio.com)). Pour l'instant, vous recevrez les notifications par **email sur votre téléphone**.

Pour activer les SMS Twilio ultérieurement, contactez-moi et j'ajouterai la configuration dans le script.

---

## Résoudre les problèmes fréquents

**Le formulaire affiche une erreur** → Vérifiez que l'URL dans `index.html` est correcte et que le déploiement est bien en "Tout le monde".

**Je ne reçois pas d'email** → Dans Apps Script, allez dans Exécutions → vérifiez les logs d'erreur.

**L'onglet "RSVP Invités" n'apparaît pas** → Exécutez à nouveau `testRSVP` manuellement.

---

*Généré automatiquement pour Soufiane & Salma · 23 Octobre 2026*
