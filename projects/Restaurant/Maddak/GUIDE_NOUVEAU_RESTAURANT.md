# 🍽️ Guide — Créer un site restaurant comme Maddak

> Ce document résume **tout ce qui a été fait** pour le projet Maddak et sert de **recette étape par étape** pour reproduire la même chose pour un autre restaurant.

---

## 📁 Architecture du projet

```
NomDuRestaurant/
├── index.html              ← Page d'accueil (vitrine)
├── style.css               ← Design system global (navbar, boutons, footer, animations)
├── index.css               ← Styles spécifiques à la page d'accueil
├── menu.html               ← Page menu complète (version desktop/tablette)
├── menu.css                ← Styles du menu desktop
│
├── assets/                 ← Images du site principal
│   ├── hero_bg.jpg         ← Photo plein écran d'accueil (recommandé 1920×1080)
│   ├── gourmet_burger.jpg  ← Photo spécialité 1
│   ├── smash_burger.jpg    ← Photo spécialité 2
│   ├── assiette.jpg        ← Photo spécialité 3
│   ├── dessert.jpg         ← Photo spécialité 4
│   └── (photos Instagram pour galerie)
│
└── MenuQrcode/             ← Menu flipbook pour QR Code (mobile-first)
    ├── index.html          ← Page du menu flipbook
    ├── menu.css            ← Styles du flipbook 3D
    ├── menu.js             ← Logique du flipbook (navigation, swipe, boucle)
    └── asset/
        ├── couverture.png  ← Image de couverture du menu
        └── logo.png        ← Logo du restaurant
```

---

## 🎨 Design System — Variables à changer

### Palette de couleurs (dans `style.css` et `menu.css`)

Pour Maddak, la palette est **Émeraude foncé + Or** :

```css
:root {
    /* COULEURS PRINCIPALES — à changer pour chaque restaurant */
    --bg:       #121212;        /* Fond global du site */
    --surface:  #1a1a1a;        /* Cartes / éléments en surface */
    --gold:     #D4AF37;        /* Accent principal (or) */
    --goldl:    #E8CC6A;        /* Or clair (hover, accents) */
    --goldd:    #9E7E1A;        /* Or foncé */
    --cream:    #F5F1E8;        /* Fond des pages du flipbook */

    /* FLIPBOOK SPÉCIFIQUE (MenuQrcode/menu.css) */
    --em:       #0D2C28;        /* Émeraude principal */
    --em2:      #0A2420;        /* Émeraude background */
    --em3:      #1F5047;        /* Émeraude accent */
}
```

### Typographies

```html
<!-- Google Fonts utilisées (dans le <head>) -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet">
```

| Police | Utilisation |
|--------|-------------|
| **Playfair Display** | Titres, noms de plats, prix (serif élégant) |
| **Poppins** | Corps de texte, boutons, navigation (sans-serif moderne) |

---

## 📄 Composant 1 : Site Vitrine (`index.html`)

### Sections de la page (dans l'ordre)

| # | Section | ID/Classe | Ce qu'elle contient |
|---|---------|-----------|---------------------|
| 1 | **Navbar** | `#navbar` | Logo texte + liens (À propos, Horaires, Accès, Réserver, La Carte) + hamburger mobile |
| 2 | **Hero** | `#hero` | Photo plein écran + titre + slogan + 3 boutons CTA |
| 3 | **Ribbon** | `.ribbon` | Bandeau défilant avec mots-clés (Fait Maison ✦ Produits Frais ✦ ...) |
| 4 | **À Propos** | `#about` | Grille 2 colonnes : photos + texte éditorial + stats (Halal/FR/🌿) |
| 5 | **Spécialités** | `.specialites` | 4 cartes photos des plats phares avec prix |
| 6 | **Horaires** | `#horaires` | 4 cartes par jour/groupe avec créneaux Midi/Soir |
| 7 | **Accès** | `#acces` | 3 fiches info (adresse, tel, Instagram) + Google Maps iframe |
| 8 | **Footer** | `.site-footer` | Logo + certifications + Instagram + copyright |


### Fonctionnalités JavaScript intégrées

1. **Hamburger mobile** — menu plein écran avec animation 3 barres → croix
2. **Navbar sticky** — classe `.scrolled` ajoutée au scroll > 80px
3. **Fade-up scroll** — `IntersectionObserver` anime les éléments `.fade-up` au scroll

### Ce qu'il faut personnaliser

```
✏️ index.html :
   - Titre <title> (SEO)
   - Meta description
   - Nom du restaurant dans .nav-logo, .hero-title, .footer-logo
   - Texte du slogan (.hero-slogan)
   - Texte "À propos" (3 paragraphes dans .about-text)
   - Spécialités : noms, descriptions, prix, photos
   - Horaires : jours et créneaux
   - Adresse, téléphone, Instagram
   - Lien Google Maps (iframe src=)

✏️ assets/ :
   - hero_bg.jpg → Photo d'ambiance du restaurant
   - smash_burger.jpg → Photo spécialité 1
   - gourmet_burger.jpg → Photo spécialité 2
   - assiette.jpg → Photo spécialité 3
   - dessert.jpg → Photo spécialité 4
```

---

## 📄 Composant 2 : Menu Desktop (`menu.html`)

Page complète du menu avec toutes les catégories, stylisée avec `menu.css`.
Design premium avec en-têtes dorés, séparateurs et layout responsive.

---

## 📄 Composant 3 : Menu Flipbook QR Code (`MenuQrcode/`)

### C'est quoi ?
Un menu numérique **mobile-first** conçu comme un **livre 3D** qu'on feuillette par swipe ou clic.
Pensé pour être scanné via **QR Code** sur les tables du restaurant.

### Structure des pages

| Page | Contenu |
|------|---------|
| **Couverture** (p0) | Image de couverture + bouton "Ouvrir la Carte" |
| **Page 1** | Smash Burgers + Philly's |
| **Page 2** | Burgers Gourmets (1/2) |
| **Page 3** | Burgers Gourmets (2/2) + Suppléments |
| **Page 4** | Assiettes |
| **Page 5** | Bowls + Salades + Snacks |
| **Page 6** | Menu Enfant + Desserts |
| **Page 7** | Boissons |
| **Page 8** | Page de fin (adresse, Instagram, certifications) + back cover SVG |

### Comment ajouter/supprimer des pages

Chaque page suit ce template :

```html
<!-- ══ PAGE X — Titre ══ -->
<div class="page pint" id="pX">
    <div class="pface" onclick="next()">
        <div class="pc">
            <!-- En-tête page -->
            <div class="phd">
                <span class="phd-logo">NomRestaurant</span>
                <span class="phd-num">X / TOTAL</span>
            </div>

            <!-- Section du menu -->
            <div class="ms">
                <div class="ms-title">🍔 Nom de la catégorie</div>
                <p class="ms-note">Note optionnelle en italique</p>

                <!-- Un item du menu -->
                <div class="mi">
                    <span class="mn">Nom du plat</span>
                    <span class="md"></span><!-- Ligne pointillée -->
                    <span class="mp">XX,XX €</span>
                </div>
                <!-- Description optionnelle sous l'item -->
                <p class="mi-desc">Description en italique</p>
            </div>
        </div>
    </div>
    <div class="pback" onclick="prev()"></div>
</div>
```

### Si tu ajoutes/supprimes des pages → modifier `menu.js`

```javascript
// Mettre à jour le tableau LABELS avec les noms de chaque page
const LABELS = [
    'Couverture',        // p0
    "Smash & Philly's",  // p1
    'Gourmets 1/2',      // p2
    // ... etc
    'Fin'                // dernière page
];
```

### Classes CSS utiles pour le menu

| Classe | Usage |
|--------|-------|
| `.ms` | Section (catégorie de plats) |
| `.ms-title` | Titre de catégorie avec ligne dorée |
| `.ms-note` | Note en petit sous le titre |
| `.mi` | Item de menu (ligne avec nom + prix) |
| `.mn` | Nom du plat |
| `.md` | Dots de séparation (pointillés) |
| `.mp` | Prix |
| `.mp.tba` | Prix en mode "Prochainement" (grisé) |
| `.mi-desc` | Description du plat en italique |
| `.info-block` | Bloc d'info encadré (supplément, note) |
| `.sup-item` | Item de supplément (nom + prix) |

### Fonctionnalités du flipbook (`menu.js`)

1. **Navigation** — `next()` / `prev()` avec animation 3D (`rotateY`)
2. **Swipe tactile** — Détection du glissement horizontal > 50px
3. **Anti Z-fighting** — Chaque page a un `translateZ` distinct (1px d'écart) pour éviter le scintillement sur GPU mobile
4. **Boucle** — Arrivé à la dernière page, un swipe "suivant" ramène instantanément à la couverture
5. **Clavier** — `←` / `→` / `Espace` pour naviguer
6. **Responsive** — Le livre se redimensionne selon la taille d'écran (ratio 2/3)
7. **PWA-ready** — `apple-mobile-web-app-capable` pour affichage plein écran sur iOS

---

## 🖼️ Assets à préparer pour un nouveau restaurant

### Images site principal (`assets/`)

| Fichier | Dimensions recommandées | Usage |
|---------|------------------------|-------|
| `hero_bg.jpg` | 1920×1080 | Photo plein écran d'accueil |
| `gourmet_burger.jpg` | 800×600 | Carte spécialité |
| `smash_burger.jpg` | 800×600 | Carte spécialité |
| `assiette.jpg` | 800×600 | Carte spécialité |
| `dessert.jpg` | 800×600 | Carte spécialité |

### Images flipbook (`MenuQrcode/asset/`)

| Fichier | Dimensions | Usage |
|---------|-----------|-------|
| `couverture.png` | ~400×600 (ratio 2:3) | Couverture du menu flipbook |
| `logo.png` | ~200×200 | Logo (optionnel, pas utilisé dans la version actuelle) |

---

## ✅ Checklist pour un nouveau restaurant

### 1. Copier la structure
```bash
cp -r Maddak/ NouveauRestaurant/
```

### 2. Personnaliser les textes
- [ ] Nom du restaurant (partout : navbar, hero, footer, flipbook)
- [ ] Slogan / accroche
- [ ] Texte "À propos" (3 paragraphes)
- [ ] Adresse complète
- [ ] Numéro de téléphone (format `tel:` et affiché)
- [ ] Lien Instagram
- [ ] Certifications (Halal, Label Rouge, etc.)
- [ ] Copyright / année

### 3. Personnaliser le menu
- [ ] Catégories de plats
- [ ] Noms des plats + prix
- [ ] Descriptions
- [ ] Suppléments
- [ ] Organiser les pages du flipbook (max ~4-5 sections par page)
- [ ] Mettre à jour `LABELS[]` dans `menu.js`
- [ ] Mettre à jour les numéros `X / TOTAL` dans chaque page

### 4. Personnaliser le design
- [ ] Palette de couleurs dans les `:root` de `style.css` et `menu.css`
- [ ] Photo hero
- [ ] Photos spécialités (4)
- [ ] Couverture du flipbook
- [ ] Logo

### 5. Personnaliser les horaires
- [ ] Jours d'ouverture et de fermeture
- [ ] Créneaux midi / soir
- [ ] Jours "featured" (service continu)

### 6. Configurer Google Maps
- [ ] Aller sur Google Maps → chercher l'adresse
- [ ] Partager → Intégrer une carte → Copier le code iframe
- [ ] Remplacer le `src=` de l'iframe dans `index.html`

### 7. Déploiement
- [ ] Héberger les fichiers (GitHub Pages, Netlify, OVH...)
- [ ] Générer un QR Code pointant vers `MenuQrcode/index.html`
- [ ] Imprimer le QR Code pour les tables

---

## 🐛 Problèmes résolus (à connaître)

### Z-fighting / scintillement sur mobile
**Problème** : Les pages du flipbook scintillent ou "s'effritent" lors du changement de page sur téléphone.

**Solution** : Augmenter l'écart `translateZ` entre chaque page (1px au lieu de 0.15px) et séparer les `translateZ` des faces avant/arrière (`.pface` = 0.5px, `.pback` = 0.4px).

### Fonction `syncUI()` manquante
**Problème** : L'indicateur de page et les boutons prev/next ne se mettaient pas à jour.

**Solution** : Ajout de la fonction `syncUI()` dans `menu.js` pour synchroniser l'affichage avec la page courante.

### Boucle du flipbook
**Comportement** : À la dernière page, un swipe "suivant" ramène instantanément à la couverture (reset sans animation pour éviter un retour visuel bizarre).

---

## 🔗 Liens et ressources

- **Google Fonts** : https://fonts.google.com

- **QR Code Generator** : https://www.qr-code-generator.com
- **Optimisation images** : https://squoosh.app
- **Hébergement gratuit** : https://pages.github.com ou https://netlify.com

---

*Guide créé le 01/04/2026 — basé sur le projet Maddak (Nancy)*
