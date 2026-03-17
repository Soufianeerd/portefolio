# 🧮 Glass Calculator — Calculatrice Scientifique Glassmorphism

> Calculatrice scientifique moderne avec interface glassmorphism, fonctions mathématiques avancées, historique des calculs et design responsive.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-lightgrey?style=flat)

---

## 📋 Table des matières

1. [Description](#description)
2. [Stack technique](#stack-technique)
3. [Architecture](#architecture)
4. [Fonctionnalités](#fonctionnalités)
5. [Installation](#installation)
6. [Utilisation](#utilisation)
7. [Logique métier](#logique-métier)
8. [Roadmap](#roadmap)
9. [Auteur](#auteur)

---

## 📖 Description

### Problématique
Les calculatrices web existantes sont soit trop basiques (4 opérations), soit trop complexes visuellement (peu accessibles). Il manque un outil élégant, rapide et scientifiquement complet.

### Objectif
Démontrer la maîtrise du DOM JavaScript natif et du CSS avancé à travers un outil utilitaire avec une interface premium en glassmorphism.

### Public cible
- Étudiants et professionnels (besoin de calculs scientifiques rapides)
- Recruteurs tech (démonstration technique JS/CSS)

---

## 🛠️ Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Structure | HTML5 |
| Style | CSS3 Vanilla — Glassmorphism, backdrop-filter |
| Logique | JavaScript ES6+ (Vanilla) — Classe Calculator |
| Typographie | Google Fonts — Poppins 300/500 |
| Dépendances | **Aucune** — 0 framework, 0 bibliothèque |

---

## 🏗️ Architecture

```
calculator/
├── index.html     # Structure DOM de la calculatrice
├── style.css      # Design system glassmorphism
├── script.js      # Logique calculatrice + historique
└── README.md
```

### Séparation des responsabilités

| Fichier | Rôle |
|---------|------|
| `index.html` | Structure des boutons, layout displaypanel + history |
| `style.css` | Effets glassmorphism, grille boutons, responsive |
| `script.js` | État de la calculatrice, opérations, historique |

---

## ✨ Fonctionnalités

### Opérations standard

- ➕ Addition, ➖ Soustraction, ✖️ Multiplication, ➗ Division
- **Protection division par zéro** avec alerte utilisateur
- **Chaining d'opérations** — compute automatique si opérateur est appliqué sur résultat déjà calculé

### Fonctions scientifiques

| Fonction | Description |
|----------|-------------|
| `sin(x)` | Sinus (radians) |
| `cos(x)` | Cosinus (radians) |
| `tan(x)` | Tangente (radians) |
| `log(x)` | Logarithme base 10 |
| `√(x)` | Racine carrée (avec validation entrée négative) |
| `x²` | Mise au carré |
| `π` | Constante Pi (3.14159...) |
| `e` | Constante d'Euler (2.71828...) |

### Historique des calculs

- ✅ Affichage des 20 derniers calculs
- ✅ Clic sur un résultat → rechargement dans l'opérande actuel
- ✅ Bouton "Clear History"
- ✅ Formatage intelligent (max 6 décimales)

### Contrôles

- `AC` — Réinitialisation complète
- `DEL` — Suppression du dernier caractère
- `=` — Calcul du résultat

---

## 🚀 Installation

Aucune installation requise.

```bash
# Ouvrir directement
open projects/calculator/index.html

# Serveur local
npx serve projects/calculator/
```

---

## 💡 Utilisation

```
1. Saisir un nombre via les boutons chiffrés
2. Choisir une opération (+, -, ×, ÷) ou une fonction scientifique
3. Saisir le second opérande (si applicable)
4. Appuyer sur = pour obtenir le résultat
5. Consulter l'historique dans le panneau droit
6. Cliquer sur un résultat passé pour le réutiliser
```

---

## ⚙️ Logique métier

### Gestion de l'état (script.js)

```javascript
let currentOperand  = '0';    // Valeur affichée
let previousOperand = '';     // Valeur mémorisée
let operation       = undefined; // Opérateur en cours
let history         = [];     // Tableau des calculs (max 20)
```

### Flux de calcul chaîné

```
appendNumber() → chooseOperation() → compute() → addToHistory()
```

**Protection contre les doubles points décimaux :**
```javascript
if (number === '.' && currentOperand.includes('.')) return;
```

**Calcul enchaîné automatique :**
```javascript
function chooseOperation(op) {
    if (previousOperand !== '') compute(); // Calcule avant d'enchaîner
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
}
```

---

## 🗺️ Roadmap

- [ ] Mode clavier (saisie via touches physiques)
- [ ] Support des parenthèses `(` `)`
- [ ] Export historique (CSV)
- [ ] Thèmes de couleur
- [ ] Mode degrés / radians pour fonctions trigonométriques
- [ ] Persistance historique via `localStorage`

---

## 👤 Auteur

**Soufiane EL RHADI**
Développeur Web — étudiant en Master MIAGE

> Projet démontrant la maîtrise de la manipulation du DOM, de la logique algorithmique JavaScript, et des techniques modernes de design CSS (glassmorphism).

[![Portfolio](https://img.shields.io/badge/Portfolio-Voir%20en%20ligne-blue?style=flat)](../../index.html)
