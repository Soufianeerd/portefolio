# Évoria — Portfolio Edition & Customization Engine

Évoria est un template de faire-part digital "Quiet Luxury" universel, dérivé d'un projet premium sur-mesure. 
Ce dépôt représente la version **Portfolio Ready** : il s'agit d'un clone structurel exact (1:1) du projet d'origine, débarrassé des données personnelles et augmenté d'un puissant moteur de personnalisation en temps réel, conçu spécifiquement pour être testé par des recruteurs ou des visiteurs sans compromettre l'intégrité du code source.

---

## 🛠 Ce qui a été accompli (Architecture & Refonte)

### 1. Clonage 1:1 et Neutralisation Non-Destructrice
- **Respect absolu du design** : La structure HTML, les classes CSS, les animations cinématiques (ouverture des portes 3D, fade-in), les proportions et les cartes interactives Google Maps ont été conservées à 100%. Aucune section n'a été simplifiée.
- **Anonymisation** : Toutes les données personnelles (prénoms, lieux, références privées) ont été remplacées par des contenus génériques (Élise & Gabriel).
- **Remplacement des Assets** : Les images personnelles ont été substituées par des assets premium génériques :
  - Un sceau classique E&G véritablement détouré via IA (`rembg`) pour une transparence parfaite sans `mix-blend-mode`.
  - Une texture de porte neutre et élégante.
  - Une photographie "Quiet Luxury" Unsplash intégrée nativement pour le Hero Background.

### 2. Le Moteur "Evoria Editor" (Widget de Personnalisation)
Un widget latéral (glassmorphism) a été injecté dynamiquement via `evoria-editor.js` pour permettre aux visiteurs de personnaliser le template en temps réel :
- **Textes dynamiques** : Prénoms, date, avec mise à jour automatique des variables.
- **Couleurs & Thèmes** : Modification de la variable `--bordeaux` à la volée.
- **Gestionnaire d'images** : Grâce aux variables CSS (`--bg-hero`, `--bg-doors`, etc.), le visiteur peut remplacer les images cibles :
  - Soit en collant une URL d'image.
  - Soit via une intégration native de l'**API Unsplash** permettant de chercher des photos directement dans le widget.
- **Affichage modulaire** : Possibilité d'activer/désactiver visuellement les différentes sections (Hero, Programme, RSVP, Compte à rebours) via des *toggles* non-destructeurs (`.hidden-section`).
- **Persistance & Export** : Toutes les modifications sont sauvegardées dans le `localStorage`. Un bouton permet d'exporter la configuration finale en fichier `.json`.

### 3. Logique Applicative (Javascript)
- **Calendrier Dynamique** : Le fichier `invitation.js` a été entièrement recodé pour générer la grille mensuelle (`generateMiniCalendar`) de manière autonome selon la date choisie par le visiteur dans l'éditeur (calcul automatique des jours de la semaine, décalage, et marquage du jour J).
- **Compte à Rebours** : Synchronisé avec la date dynamique.
- **Smart ICS/Google Calendar** : Le bouton "Ajouter au calendrier" compile désormais à la volée les données fictives pour générer un vrai fichier d'événement.

### 4. Mode Démo RSVP (Portfolio Security)
Le système RSVP a été repensé pour être testable sans exposer le propriétaire du portfolio.
- L'interface inclut un champ `demoEmail` prévenant le testeur qu'il est en mode démo.
- **Le backend Apps Script (`Code.gs`)** a été complètement réécrit :
  1. Il stocke les réponses dans un onglet `RSVP Demo Evoria`.
  2. Il simule une **"Vue Mariés"** en envoyant au testeur le mail récapitulatif qu'un administrateur recevrait.
  3. Il simule une **"Vue Invité"** en envoyant au testeur le mail de confirmation automatique.
  4. Il envoie **silencieusement une notification administrateur** à l'email du développeur pour le prévenir qu'un recruteur ou un visiteur est en train de tester son projet.

---

## 🚀 Guide de Configuration et Déploiement

### 1. Activer la recherche d'images Unsplash
L'éditeur intègre une barre de recherche Unsplash. Pour l'activer :
1. Ouvrez `config.js`.
2. Remplacez `"A_REMPLACER_PAR_VOTRE_CLE"` par votre clé API publique Unsplash.
*(Assurez-vous d'ignorer `config.js` lors du push sur un repo public !)*

### 2. Configurer le système RSVP (Google Apps Script)
Pour que les visiteurs de votre portfolio reçoivent bien l'expérience RSVP complète (et que vous soyez notifié discrètement) :

1. Allez sur [Google Sheets](https://docs.google.com/spreadsheets) et créez un tableau vide.
2. Allez dans **Extensions > Apps Script**.
3. Copiez le contenu du fichier `Code.gs` d'Evoria et collez-le dans l'éditeur.
4. À la ligne 2, mettez **votre propre adresse email** dans `OWNER_EMAIL`. Sauvegardez.
5. Cliquez sur **Déployer > Nouveau déploiement > Application Web**.
6. Dans "Qui a accès", choisissez impérativement **"Tout le monde"**, puis validez et acceptez les autorisations Google.
7. Copiez **l'URL de l'application Web** générée.
8. Dans votre fichier `index.html` (ligne 279 environ), remplacez le `SCRIPT_URL` par votre nouvelle URL :
   ```javascript
   const SCRIPT_URL = window.EVORIA_SCRIPT_URL || 'VOTRE_NOUVELLE_URL_ICI';
   ```

Désormais, tout est en place. Ouvrez `index.html` via Live Server et l'expérience complète Evoria est fonctionnelle !
