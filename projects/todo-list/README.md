# ✅ Todo List — Application de Tâches avec Persistance Locale

> Application de gestion de tâches minimaliste et élégante, avec persistance via `localStorage`, filtrage et comptage dynamique des tâches restantes.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![localStorage](https://img.shields.io/badge/localStorage-Persistence-orange?style=flat)

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
Les applications de to-do list sont souvent trop complexes ou perdent les données à chaque rechargement de page. Ce projet répond au besoin d'un outil simple, persistant et instantanément opérationnel.

### Objectif
Implémenter les fondamentaux du développement frontend moderne : **manipulation du DOM**, **état applicatif**, **persistance `localStorage`**, et **rendu dynamique**.

### Public cible
- Recruteurs évaluant les bases JavaScript
- Utilisateurs cherchant un outil de productivité léger

---

## 🛠️ Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Structure | HTML5 sémantique |
| Style | CSS3 Vanilla |
| Logique | JavaScript ES6+ (Vanilla) |
| Persistance | `localStorage` API (navigateur) |
| Icônes | Font Awesome 6 (check, trash) |
| Dépendances | **Aucune** — 0 framework |

---

## 🏗️ Architecture

```
todo-list/
├── index.html    # Structure HTML + layout
├── style.css     # Design, animations, états visuels
├── script.js     # Logique d'état + CRUD + localStorage
└── README.md
```

### Gestion de l'état

```javascript
// State = tableau de todos persisté en localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Structure d'un todo
{
  id:        Date.now(),   // Identifiant unique (timestamp)
  text:      "Ma tâche",  // Contenu
  completed: false         // État
}
```

---

## ✨ Fonctionnalités

### Fonctionnalités principales

- ➕ **Ajout de tâche** — input + bouton Add ou touche Entrée
- ✅ **Marquer complète** — clic sur bouton check → strikethrough visuel
- 🗑️ **Suppression** — icône poubelle par tâche
- 🧹 **Clear Completed** — supprime toutes les tâches terminées en un clic
- 💾 **Persistance** — données sauvegardées entre sessions (localStorage)
- 📅 **Date dynamique** — affiche le jour et la date actuels

### Fonctionnalités secondaires

- Compteur "X items left" mis à jour en temps réel
- État visuel distinct pour tâches complètes (opacité + barré)
- Empêche l'ajout de tâches vides
- Date localisée en anglais (`en-US`)

---

## 🚀 Installation

```bash
# Ouvrir directement
open projects/todo-list/index.html

# Serveur local
npx serve projects/todo-list/
```

Aucune configuration nécessaire.

---

## 💡 Utilisation

```
1. Taper une tâche dans le champ de saisie
2. Appuyer sur le bouton Add ou la touche Entrée
3. Cocher une tâche pour la marquer comme complète
4. Supprimer une tâche avec l'icône poubelle
5. "Clear Completed" pour vider les tâches terminées
6. Les tâches persistent au rechargement de la page
```

---

## ⚙️ Logique métier

### CRUD complet

```javascript
// Créer
function addTodo()       { todos.push(newTodo); save(); render(); }

// Lire
function renderTodos()   { todos.forEach(todo => buildDOMItem(todo)); }

// Mettre à jour
function toggleComplete(id) { todos.map(t => t.id === id ? {...t, completed: !t.completed} : t) }

// Supprimer
function deleteTodo(id)  { todos = todos.filter(t => t.id !== id); }
```

### Persistance localStorage

```javascript
// Sauvegarde
localStorage.setItem('todos', JSON.stringify(todos));

// Lecture au chargement
let todos = JSON.parse(localStorage.getItem('todos')) || [];
```

### Génération dynamique du DOM

Chaque todo est construit programmatiquement :

```javascript
const todoItem     = document.createElement('li');
const checkBtn     = document.createElement('button');  // FontAwesome fa-check
const todoText     = document.createElement('span');
const trashBtn     = document.createElement('button');  // FontAwesome fa-trash
```

---

## 🗺️ Roadmap

- [ ] Drag & drop pour réorganiser les tâches
- [ ] Filtres : Tous / Actifs / Complétés
- [ ] Catégories / tags par tâche
- [ ] Date limite (due date) par tâche
- [ ] Synchronisation cloud (Firebase)
- [ ] Notifications (due date reminder)

---

## 👤 Auteur

**Soufiane EL RHADI**
Développeur Web — étudiant en Master MIAGE

> Projet démontrant la maîtrise du cycle complet CRUD en JavaScript Vanilla (Create, Read, Update, Delete), de la persistance locale et du rendu dynamique du DOM sans aucune dépendance externe.

[![Portfolio](https://img.shields.io/badge/Portfolio-Voir%20en%20ligne-blue?style=flat)](../../index.html)
