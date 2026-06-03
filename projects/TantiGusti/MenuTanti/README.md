# 🏛️ Restaurant Operating System — Tanti Gusti II

Ce projet est un écosystème digital complet pour restaurant, alliant une interface client **"Quiet Luxury"** à un système de gestion professionnel (SaaS) en temps réel.

> [!IMPORTANT]
> **Statut Actuel** : Phase de test et pré-lancement.
> **Lancement Officiel** : **15 Juin 2026**.
> Tous les chiffres et graphiques affichés actuellement sont issus de **commandes de test**. Le système est conçu pour calculer le CA et les statistiques en **temps réel** à partir de la base de données dès le lancement effectif des opérations.

---

## 🏗️ Architecture du Projet (Structure des Fichiers)

```text
.
├── 📂 admin/                # Système d'Exploitation Restaurant (Admin)
│   ├── admin.html          # Dashboard principal (Structure modulaire : Dashboard, Live, Stock, Settings)
│   ├── admin.css           # Design System Pro (Support Dark/Light mode, iPad Optimized)
│   └── admin.js            # Moteur Analytique (ApexCharts), Real-time (PocketBase SDK) & Gestion d'état
├── 📂 assets/               # Ressources visuelles optimisées (WebP)
├── 📂 backend/              # Exécutable et données PocketBase
│   ├── pocketbase          # Serveur Go/SQLite
│   └── pb_data/            # Données de la base (SQLite)
├── index.html              # Landing Page (Hero, About, Horaires, Accès)
├── index.css               # Design "Quiet Luxury" de l'accueil
├── menu.html               # Carte interactive (Scrollspy, Catégories)
├── menu.css                # Styles spécifiques à la carte
├── commande.html           # Checkout (Formulaire de livraison & Récapitulatif)
├── commande.css            # Styles du processus de commande & Success Overlay
├── commande.js             # Pipeline de commande : Nettoyage d'adresse, Validation & Soumission PB
├── script.js               # Cœur client : Gestion du panier (LocalStorage), Navbar & Sync Restaurant Status
├── style.css               # Design System global : Variables CSS, Polices & Composants partagés
├── pocketbase.js           # Pont de communication : Initialisation du SDK window.pb
└── README.md               # Documentation Maîtresse (File d'Ariane du projet)
```

---

## 🔄 Flux de Données & Fonctionnement

### 1. Le Parcours d'une Commande
1.  **Sélection** (`menu.html`) : L'utilisateur clique sur un produit. `script.js` capture les attributs `data-id`, `data-price` et l'ajoute au `localStorage`.
2.  **Checkout** (`commande.html`) : `commande.js` récupère le panier, nettoie l'adresse saisie (Regex & Trim) et vérifie si le restaurant est **Ouvert** via une requête à la collection `settings`.
3.  **Persistance** : `commande.js` crée une entrée dans la collection `orders` puis, une fois l'ID récupéré, crée N entrées dans `order_items`.
4.  **Réception Admin** : Grâce au WebSocket de PocketBase (`pb.subscribe`), le dashboard admin (`admin.js`) détecte instantanément l'ajout, joue un signal sonore et déplace la commande dans la colonne "Nouvelles".

---

## 📊 Restaurant OS : Détails Techniques

### Moteur Analytique
Le dashboard utilise **ApexCharts** pour transformer les données brutes de PocketBase en intelligence métier :
- **Calcul du CA** : Filtrage dynamique des commandes au statut `finished` créées le jour même.
- **Panier Moyen** : Division en temps réel du CA par le nombre de commandes terminées.

### Synchronisation Bidirectionnelle
- **Restaurant Status** : Un changement de bouton dans la Topbar Admin modifie le champ `open` dans la collection `settings`. Le script client (`script.js`) écoute ce changement en temps réel et désactive/active les boutons de commande instantanément sans rafraîchissement.

---

## 🗄️ Architecture Backend (PocketBase)

### Schéma de Données
| Collection | Champs Clés | Rôle |
| :--- | :--- | :--- |
| `orders` | `nom, phone, adress, total, status, order_type` | En-tête de la commande |
| `order_items` | `order_id (rel), product_name, quantity, price` | Détails des articles |
| `products` | `name, category, price, stock, threshold, active` | Inventaire & Menu |
| `settings` | `open (bool), close_message, max_orders` | Configuration du système |

---

## 📅 Journal d'Évolution (Chronologie du projet)

#### 🟢 **Étape 1 : Fondations & Design (15h30)**
- **Demande** : Création d'un site vitrine premium sans backend.
- **Réalisation** : Mise en place de `index.html` et `menu.html`. Focus sur l'esthétique Or/Noir et l'expérience mobile.

#### 🟡 **Étape 2 : Moteur de Panier & Tunnel d'Achat (16h10)**
- **Demande** : Ajouter un système de panier moderne avec animation.
- **Réalisation** : Développement de `script.js` pour la gestion du panier (`localStorage`). Création de `commande.html` pour le récapitulatif.

#### 🔵 **Étape 3 : Backend & Persistance (16h40)**
- **Demande** : Sauvegarder les commandes en base de données.
- **Réalisation** : Connexion SDK PocketBase. Développement du tunnel de soumission asynchrone dans `commande.js`.

#### 🟠 **Étape 4 : Dashboard Admin Temps Réel (17h20)**
- **Demande** : Gérer les commandes sans rafraîchir la page.
- **Réalisation** : Utilisation du SDK PocketBase en mode `subscribe`. Création de la vue Kanban admin.

#### 🔴 **Étape 5 : Debugging & Itinéraires (18h00)**
- **Demande** : Sécuriser les envois et supprimer les frais Google Maps.
- **Réalisation** : Ajout de logs PB détaillés. Remplacement de l'API Maps par un système d'URL dynamique gratuit encodant l'adresse client.

#### 🟣 **Étape 6 : Restaurant Operating System (18h45)**
- **Demande** : Transformer l'admin en logiciel pro ultra-premium (SaaS).
- **Réalisation** : 
  - Centralisation de la sidebar et du design iPad-first.
  - Intégration de **ApexCharts** pour le pilotage financier.
  - Système de **Gestion de Stock** avec alertes visuelles.
  - **Status Sync** : Verrouillage du site client à distance via l'admin.
  - **Theming** : Gestion complète du mode Sombre et Clair.

---

## ⚙️ Configuration & Lancement
1. **Démarrage** : Exécutez `./pocketbase serve` dans le dossier backend.
2. **Identifiants** : Créez un administrateur dans l'UI PocketBase (`/_/`).
3. **Frontend** : Ouvrez le projet avec un serveur local (ex: Live Server) pour le fonctionnement des scripts.
4. **Accès Admin** : Rendez-vous sur `/admin/admin.html` pour piloter le restaurant.

#### 🟣 **Étape 7 : Finalisation & Pré-lancement (19h50)**
- **Demande** : Clarifier que les chiffres actuels sont des tests et fixer la date de lancement officielle.
- **Réalisation** : Mise à jour de la documentation pour refléter la phase de pré-lancement. Lancement officiel prévu le **15 Juin 2026**. Confirmation que le système de calcul de CA est strictement basé sur les données réelles de PocketBase sans invention de chiffres.

#### 💎 **Étape 8 : Refonte Premium SaaS (Style Apple/Linear/Square)**
- **Demande** : Transformer l'interface en un outil pro compact, raffiné et ultra-lisible pour tablette.
- **Réalisation** : 
  - **Aesthetics** : Design "Matte Black", typographie Inter, suppression des effets superflus.
  - **Logiciel POS** : Kanban haute densité avec timers live et badge "Urgent" automatique (après 15min).
  - **Analytics Pro** : Système de filtrage temporel [Jour/Semaine/Mois] pour les KPIs et graphiques.
  - **Stock & Menu** : Refonte du tableau d'inventaire avec toggles iOS et badges de statut.
  - **Optimisation iPad** : Interface pensée pour le tactile et la consultation à distance en cuisine.
