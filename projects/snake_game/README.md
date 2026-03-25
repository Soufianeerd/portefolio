# 🐍 Snake.py — Jeu Snake en Python via PyScript

> Le classique jeu Snake entièrement écrit en **Python**, s'exécutant nativement dans le navigateur grâce à **PyScript**. Aucun backend, aucune installation.

![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![PyScript](https://img.shields.io/badge/PyScript-2024.1.1-3776AB?style=flat)
![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26?style=flat)
![Asyncio](https://img.shields.io/badge/asyncio-Game%20Loop-green?style=flat)

---

## 📋 Table des matières

1. [Description](#description)
2. [Stack technique](#stack-technique)
3. [Architecture](#architecture)
4. [Fonctionnalités](#fonctionnalités)
5. [Installation](#installation)
6. [Utilisation](#utilisation)
7. [Logique métier](#logique-métier)
8. [Performance](#performance)
9. [Roadmap](#roadmap)
10. [Auteur](#auteur)

---

## 📖 Description

### Problématique
Démontrer qu'il est possible d'exécuter du **Python dans un navigateur web** sans serveur, sans transpilation, grâce à WebAssembly — et d'écrire un jeu complet avec la game loop, le rendu canvas et la gestion des inputs.

### Contexte
Ce projet est intégré dans un portfolio développeur. Il prouve la maîtrise de **PyScript**, de la programmation asynchrone Python (`asyncio`) et de l'interaction entre Python et les APIs web du navigateur.

### Public cible
- Recruteurs tech cherchant un profil polyvalent Python/Web
- Développeurs intéressés par PyScript et WebAssembly
- Utilisateurs du portfolio (démo interactive jouable)

---

## 🛠️ Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Langage | Python 3 |
| Runtime navigateur | PyScript 2024.1.1 (WebAssembly/Pyodide) |
| Rendu | HTML5 Canvas API (via JS bridge) |
| Async | `asyncio` Python — game loop non-bloquante |
| Bridge JS ↔ Python | `pyodide.ffi.create_proxy` |
| Typographie | Google Fonts — Outfit, Source Code Pro |
| Configuration | `pyscript.toml` |

---

## 🏗️ Architecture

```
snake_game/
├── index.html        # Shell HTML + styles neon + chargement PyScript
├── main.py           # Logique complète du jeu (classe SnakeGame)
├── pyscript.toml     # Configuration PyScript (paquets, environnement)
└── README.md
```

### Flux d'exécution

```
Navigateur charge index.html
  → PyScript charge le runtime WebAssembly (Pyodide)
    → main.py est exécuté
      → SnakeGame() est instancié
        → Event listeners attachés (keydown, click)
          → asyncio.ensure_future(game_loop()) lancé
            → Rendu canvas @ 10 fps (SPEED = 0.10s)
```

### Classe principale

```python
class SnakeGame:
    def __init__(self)  # Initialisation canvas + event binding
    def start_game()    # Déclenché au clic PLAY
    def reset()         # Réinitialise l'état du jeu
    def spawn_food()    # Position aléatoire (hors serpent)
    def handle_keydown()# Contrôles flèches + Espace
    def update()        # Logique de déplacement + collisions
    def draw()          # Rendu canvas (snake, food, game over)
    async def game_loop()  # Boucle infinie asyncio
```

---

## ✨ Fonctionnalités

### Gameplay

- **Déplacement** — 4 directions via touches ↑ ↓ ← →
- **Protection 180°** — impossible de faire demi-tour immédiat
- **Nourriture aléatoire** — spawn garanti hors du corps du serpent
- **Score** — +10 points par nourriture mangée
- **Collisions** — murs et auto-collision (tête vs corps)
- **Game Over** — affichage sur canvas + restart via `SPACE`
- **Overlay de démarrage** — bouton PLAY avant le premier lancement

### Design

- **Neon aesthetic** — vert fluo `#39ff14` (serpent), magenta `#ff00ff` (nourriture)
- **Glow effects** — `shadowBlur` sur serpent et nourriture
- **Fond sombre** — `#050505` pour contraste maximal
- **Loading screen** — indicateur pendant le chargement du runtime Python

---

## 🚀 Installation

### Prérequis
- Navigateur moderne (Chrome, Firefox, Edge, Safari)
- Connexion internet (premier chargement — PyScript CDN)

```bash
# Ouvrir directement
open projects/snake_game/index.html

# Ou via serveur local (recommandé)
npx serve projects/snake_game/
```

> ⚠️ PyScript nécessite un serveur HTTP local (pas `file://`). Utilisez `npx serve` ou un extension Live Server.

---

## 🎮 Utilisation

| Action | Contrôle |
|--------|---------|
| Démarrer | Bouton **PLAY** |
| Haut | `↑` Arrow Up |
| Bas | `↓` Arrow Down |
| Gauche | `←` Arrow Left |
| Droite | `→` Arrow Right |
| Restart | `ESPACE` (après Game Over) |

---

## ⚙️ Logique métier

### Configuration de la grille

```python
CANVAS_SIZE = 500   # 500x500 pixels
GRID_SIZE   = 20    # Taille d'une case
TILE_COUNT  = 25    # 500 / 20 = 25 cases par ligne
SPEED       = 0.10  # Secondes entre chaque tick
```

### Détection de collision

```python
# Collision murs
if new_head[0] < 0 or new_head[0] >= TILE_COUNT or \
   new_head[1] < 0 or new_head[1] >= TILE_COUNT:
    self.game_over = True

# Collision corps (auto-collision)
if new_head in self.snake:
    self.game_over = True
```

### Bridge PyScript ↔ JavaScript

```python
from js import document, window    # Accès aux APIs navigateur
from pyodide.ffi import create_proxy  # Sérialisation callbacks Python → JS

self.key_handler_proxy = create_proxy(self.handle_keydown)
window.addEventListener("keydown", self.key_handler_proxy)
```

---

## ⚡ Performance

| Métrique | Valeur |
|----------|--------|
| FPS | ~10 fps (configurable via `SPEED`) |
| Chargement initial | ~3-8s (téléchargement Pyodide ~5MB) |
| Taille du code | < 6KB (main.py) |
| Empreinte mémoire | < 50MB (Pyodide runtime inclus) |

**Limite connue** : Le chargement initial de PyScript/Pyodide est lent (WebAssembly ~5MB). Après le premier chargement, la fluidité est satisfaisante.

---

## 🗺️ Roadmap

- [ ] Niveaux de difficulté (vitesse variable)
- [ ] Leaderboard `localStorage`
- [ ] Contrôles tactiles (mobile swipe)
- [ ] Son (Web Audio API)
- [ ] Mode multijoueur (WebSocket)
- [ ] Obstacle walls (niveaux avancés)

---

## 👤 Auteur

**Soufiane EL RHADI**
Développeur Web & Python — étudiant en Master MIAGE

> Ce projet démontre la capacité à explorer des technologies émergentes (PyScript/WebAssembly), à implémenter une game loop asynchrone en Python, et à interfacer Python avec les APIs navigateur — compétence rare et différenciante.

[![Portfolio](https://img.shields.io/badge/Portfolio-Voir%20en%20ligne-blue?style=flat)](../../index.html)
