# 📱 Calculateur Brut/Net — Application Mobile Flutter/Dart

> Application mobile cross-platform (iOS & Android) de calcul de salaire brut/net selon la législation luxembourgeoise 2026. Développée en Dart/Flutter selon les best practices de l'architecture Flutter.

![Flutter](https://img.shields.io/badge/Flutter-02569B?style=flat&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=flat&logo=dart&logoColor=white)
![iOS](https://img.shields.io/badge/iOS-000000?style=flat&logo=apple&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=flat&logo=android&logoColor=white)
![Luxembourg](https://img.shields.io/badge/Luxembourg-Tax%20Rules%202026-EF3340?style=flat)

---

## 📋 Table des matières

1. [Description](#description)
2. [Stack technique](#stack-technique)
3. [Architecture](#architecture)
4. [Fonctionnalités](#fonctionnalités)
5. [Logique métier](#logique-métier)
6. [Installation](#installation)
7. [Screenshots](#screenshots)
8. [Roadmap](#roadmap)
9. [Auteur](#auteur)

---

## 📖 Description

### Problématique
Calculer précisément son salaire net au Luxembourg est complexe : règles d'imposition par classe, cotisations sociales variables, crédit d'impôt, avantages en nature. Les outils en ligne sont peu ergonomiques et pas disponibles offline.

### Contexte
**iApsal** est une application mobile native développée en **Dart/Flutter** pour iOS et Android. Elle implémente fidèlement les règles fiscales luxembourgeoises pour 2026 et permet le calcul dans les deux sens : Brut → Net et Net → Brut.

Ce dossier présente la **page de showcase web** de l'application mobile, intégrée dans le portfolio.

### Public cible
- Salariés luxembourgeois cherchant une app mobile offline (iOS/Android)
- RH et gestionnaires de paie au Luxembourg
- Développeurs Flutter cherchant un exemple d'implémentation de règles fiscales

---

## 🛠️ Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| Framework | Flutter (Dart) |
| Langage | Dart 3.x |
| Plateformes | iOS 14+ / Android 8+ |
| Architecture | Clean Architecture (Core / UI / Utils) |
| State Management | Provider (ou setState pour MVP) |
| Tests | Flutter Test |
| Showcase web | HTML/CSS/JS (page portfolio) |

---

## 🏗️ Architecture Flutter

```
lib/
├── main.dart                   # Point d'entrée de l'application
├── core/                       # Logique métier pure (no UI)
│   ├── salary_calculator.dart  # Moteur de calcul brut/net
│   └── tax_rules_2026.dart     # Barèmes fiscaux officiels 2026
├── ui/                         # Widgets & Écrans
│   ├── home_screen.dart        # Écran principal (tabs)
│   └── result_card.dart        # Widget résultat détaillé
└── utils/                      # Helpers & formatters
    └── formatters.dart
```

### Principes architecturaux

- **Séparation logique/UI** — `core/` ne dépend d'aucun widget Flutter
- **Single Responsibility** — chaque fichier a une responsabilité unique
- **Testabilité** — `salary_calculator.dart` est testable unitairement sans UI

---

## ✨ Fonctionnalités

### Calcul Brut → Net

| Paramètre | Description |
|-----------|-------------|
| Salaire brut | Mensuel en euros |
| HMC | Heures Mensuelles Contractuelles (défaut 173h) |
| Avantages en nature | Valeur mensuelle |
| Déductions | Montant mensuel |
| Classe imposition | 1 (célibataire) / 2 (marié) / 1A (autre) |
| Mutualité | Classe 1 à 4 |
| Crédit d'impôt | CI + CI CO2 + CI SSM |
| Taux personnalisé | Override du taux calculé |

**Résultat** : Brut → Cotisations salariales → Impôts → Crédits d'impôt → **Net à payer**

### Calcul Net → Brut

Algorithme itératif qui converge vers le brut correspondant au net désiré.

**Résultat** : Net → Brut estimé → **Coût total patronal**

### UX Mobile

- **Interface Material 3** — Design System Google
- **Navigation par tabs** — Brut/Net et Net/Brut
- **Saisie numérique optimisée** — clavier numérique automatique
- **Mode sombre** — support natif iOS/Android
- **Calcul offline** — aucune connexion internet requise

---

## ⚙️ Logique métier

### Structure fiscale Luxembourg 2026

```dart
// Exemple de structure tax_rules_2026.dart
class TaxRules2026 {
  static const Map<int, double> tauxCotisations = {
    2026: 0.1225,  // Assurance pension
    // ...
  };
  
  static double calculerImpot(double baseImposable, int classe) {
    // Barème progressif par classes
  }
}
```

### Algorithme Net → Brut

```dart
double calculNetBrut(double netCible, SalaireParams params) {
  double brut = netCible; // Approximation initiale
  
  for (int i = 0; i < 100; i++) {
    double netCalcule = calculBrutNet(brut, params);
    double delta = netCible - netCalcule;
    brut += delta;
    if (delta.abs() < 0.01) break; // Convergence
  }
  
  return brut;
}
```

---

## 🚀 Installation

### Prérequis

- Flutter SDK 3.x (`flutter --version`)
- Xcode (pour iOS) ou Android Studio (pour Android)
- Dart SDK inclus dans Flutter

```bash
# Cloner le projet
git clone <repository-url>
cd salary-calculator-dart

# Installer les dépendances
flutter pub get

# Lancer sur iOS simulator
flutter run -d ios

# Lancer sur Android emulator
flutter run -d android

# Build production iOS
flutter build ipa

# Build production Android
flutter build apk --release
```

---

## 📱 Screenshots

> Les screenshots de l'application sont disponibles dans `assets/screenshots/` et présentés sur la page de showcase web du portfolio.

| Écran | Description |
|-------|-------------|
| `screen1.png` | Écran principal — saisie paramètres Brut→Net |
| `screen2.png` | Paramètres avancés (classe, mutualité) |
| `screen3.png` | Résultats détaillés |
| `screen4.png` | Mode Net→Brut |
| `screen5.png` | Menu / Navigation |

---

## 🗺️ Roadmap

- [ ] Publication App Store (iOS)
- [ ] Publication Google Play Store (Android)
- [ ] Mise à jour barèmes 2027 (update annuel)
- [ ] Export PDF de la fiche de simulation
- [ ] Historique des simulations
- [ ] Widget iOS (affichage rapide)
- [ ] Intégration Apple Watch
- [ ] Multi-pays (FR, BE, LU)

---

## 🔒 Sécurité

- ✅ Aucune donnée transmise à un serveur externe
- ✅ Calculs 100% offline
- ✅ Aucune authentification requise
- ✅ Données non persistées (session uniquement)

> ⚠️ Outil indicatif — les résultats ne remplacent pas une consultation auprès d'un expert-comptable ou de l'Administration des Contributions Directes du Luxembourg.

---

## 👤 Auteur

**Soufiane EL RHADI**
Développeur Mobile Flutter & Web — étudiant en Master MIAGE

> Ce projet démontre la capacité à développer une application mobile cross-platform en Dart/Flutter, à implémenter des règles métier fiscales complexes (Luxembourg 2026), et à structurer le code selon les best practices Flutter (Clean Architecture, séparation UI/logique).

[![Portfolio](https://img.shields.io/badge/Portfolio-Voir%20en%20ligne-blue?style=flat)](../../index.html)
