# 🏎️ Rapport de Projet : Plateforme Digitale Garage 2A

Ce document constitue le rapport technique et fonctionnel de la solution logicielle développée pour **Garage 2A**.

---

## 📁 Structure du Projet

Voici l'organisation technique actuelle de la solution :

```text
Garage2A/
├── index.html              # Page d'accueil principale
├── frontend/               # Interface utilisateur (Livrée)
│   ├── garage.html         # Présentation des services
│   ├── carte-grise.html    # Tunnel de démarche carte grise
│   └── assets/
│       ├── css/            # Design et identité visuelle
│       └── js/             # Logique du simulateur et formulaires
├── backend/                # Architecture technique (En perspective)
│   ├── server.js           # Serveur API
│   ├── prisma/             # Modélisation base de données
│   └── routes/             # Logique métier (calcul, upload, paiement)
└── img/                    # Ressources visuelles
```

---

## 1. État Actuel du Projet (Phase 1 : Interface & Expérience Client)

La solution actuelle se concentre sur l'expérience utilisateur et la captation de l'intention client.

### 🌐 Interface Utilisateur (Frontend)
- **Site Vitrine** : Présentation professionnelle des services du garage.
- **Simulateur de Taxes 2026** : Calculateur dynamique de certificat d'immatriculation (Tarifs régionaux, abattements, exonérations électriques).
- **Tunnel de Dossier Digital** : Interface de saisie et système de dépôt de documents (Drag & Drop) prêt pour l'intégration.

---

## 2. Perspectives d'Évolution (Phases Suivantes)

Pour transformer cette interface en un outil 100% automatisé, les briques suivantes sont prévues en développement :

### ⚙️ Infrastructure Backend (Logique & Données)
*L'intelligence du système pour automatiser le traitement :*
- **API Node.js/Express** : Pour piloter les calculs complexes et les flux de données.
- **Base de Données PostgreSQL** : Archivage structuré et sécurisé de toutes les demandes clients.
- **Gestion Documentaire (Cloudinary)** : Stockage privé et chiffré des pièces justificatives.
- **Système de Statuts** : Tableau de bord interne pour le suivi des dossiers (`reçu`, `en cours`, `terminé`).

### 💳 Intégration du Paiement en Ligne (Stripe)
- Encaisser les frais de dossier directement à la fin du formulaire.
- Automatisation de la facturation et sécurisation des transactions bancaires.

### 📅 Module de Prise de Rendez-vous & Notifications
- Calendrier interactif pour la dépose de véhicule ou de documents physiques.
- Envoi automatique de confirmations par Email/SMS et relances intelligentes.

### 👤 Espace Client Privé
- Création d'un compte sécurisé permettant au client de suivre l'avancement de son dossier ANTS en temps réel.

---
*Rapport généré le 4 avril 2026 pour Garage 2A.*
