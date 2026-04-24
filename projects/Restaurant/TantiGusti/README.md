# TANTI GUSTI II — Documentation du projet

Site web et menu digital du restaurant **TANTI GUSTI II** — Pizzeria & Sandwicherie, 3 Rue de Bonsecours, 54000 Nancy.

---

## Structure du projet

```
TantiGusti/
├── MenuTanti/               # Site web principal (vitrine + carte)
│   ├── index.html           # Page d'accueil
│   ├── menu.html            # Page carte complète
│   ├── style.css            # Design system global (couleurs, typo, navbar, footer)
│   ├── index.css            # Styles spécifiques à l'accueil
│   ├── menu.css             # Styles spécifiques à la page carte
│   ├── script.js            # JavaScript (navbar scroll, menu mobile, animations)
│   └── assets/              # Images du site principal
│       ├── hero.webp        # Photo plein écran de la page d'accueil
│       ├── cuisto.webp      # Photo cuisine / équipe (section À propos)
│       ├── four.webp        # Photo du four napolitain (section À propos)
│       ├── menu.webp        # Photo header de la page carte
│       ├── texture.webp     # Texture de fond (grain) appliquée à tout le site
│       ├── logo.webp        # Logo du restaurant
│       ├── plat-1.webp      # Incontournable 1 : Pizza Tanti Gusti
│       ├── plat-2.webp      # Incontournable 2 : Le Vosgien
│       ├── plat-3.webp      # Incontournable 3 : Chausson Gratiné
│       └── plat-4.webp      # Incontournable 4 : Desserts
│
├── MenuQrcode/              # Menu digital interactif (flipbook 3D, accès via QR)
│   ├── index.html           # Menu flipbook (12 pages : couverture + 11 pages de contenu)
│   ├── menu.css             # Styles du flipbook (couverture, pages, modal, responsive)
│   ├── menu.js              # JavaScript (navigation pages, swipe, clavier, modal photo)
│   └── asset/               # Images du menu QR code
│       ├── couverture.webp  # Image de couverture du flipbook
│       ├── texture.webp     # Texture de fond des pages internes
│       ├── margherita.webp  # Photo pizza Margherita
│       ├── n2.webp          # Photo pizza N°2
│       ├── 4fromages.webp   # Photo pizza 4 Fromages
│       ├── thon.webp        # Photo pizza Thon
│       ├── Orientales.webp  # Photo pizza Orientales
│       ├── Végétarienne.webp# Photo pizza Végétarienne
│       ├── royale.webp      # Photo pizza Royale
│       ├── linda.webp       # Photo pizza Linda
│       ├── Pizza gourmet italienne avec burrata.webp  # Photo pizza Tanti Gusti (signature)
│       ├── poulet-curry.webp# Photo pizza Poulet Curry
│       ├── paesana.webp     # Photo pizza Paesana
│       ├── raclette.webp    # Photo pizza Raclette
│       ├── suitzeria.webp   # Photo pizza Suitzeria
│       ├── nicco.webp       # Photo pizza Nicco
│       ├── chevre-miel.webp # Photo pizza Chèvre Miel
│       ├── saumon.webp      # Photo pizza Saumon
│       ├── pizza-nono.webp  # Photo pizza Nono
│       ├── chausson.webp    # Photo chausson gratiné
│       ├── le-belge.webp    # Photo sandwich Le Belge
│       ├── american-cheese.webp  # Photo sandwich Américain Cheese
│       ├── poulet.webp      # Photo sandwich Poulet
│       └── brie-baguette.webp    # Photo sandwich Brie Baguette
│
├── assets/                  # Images globales (photos Instagram, etc.)
├── Menu.docx                # Source du menu (Word)
├── Menu.pdf                 # Source du menu (PDF)
├── test_modal.js            # Fichier de test Puppeteer (hors production)
└── README.md                # Ce fichier
```

---

## Description des deux sites

### MenuTanti/ — Site vitrine principal

**Accès :** Ouvrir `MenuTanti/index.html` dans un navigateur.

Composé de deux pages :

| Page | Fichier | Sections |
|------|---------|---------|
| Accueil | `index.html` | Hero · Ribbon · À propos · Spécialités · Horaires · Contact |
| Carte | `menu.html` | Header · Barre catégories · Menu complet (9 catégories) |

**Fonctionnalités JavaScript (`script.js`) :**
- **Navbar scroll** — la barre de navigation devient opaque après 60 px de scroll
- **Menu mobile** — hamburger qui ouvre un drawer depuis la droite (< 900 px)
- **Animations fade-up** — les éléments avec `data-anim` apparaissent au scroll via `IntersectionObserver`
- **Scrollspy** — sur `menu.html`, le bouton de catégorie actif suit la lecture et la barre défile horizontalement

**Catégories du menu (`menu.html`) :**
1. 🍕 Pizzas Base Tomate (9 pizzas)
2. 🍕 Pizzas Base Crème (8 pizzas)
3. 🥟 Chaussons
4. 🥪 Sandwichs Classiques
5. 🥪 Sandwichs Spéciaux + Suppléments
6. 🍗 TexMex (Nuggets / Wings / Tenders)
7. 🍟 Frites
8. 🍰 Desserts
9. 🥤 Boissons

---

### MenuQrcode/ — Menu digital flipbook (QR Code)

**Accès :** Ouvrir `MenuQrcode/index.html` dans un navigateur, ou via un QR Code.

Menu interactif en **flipbook 3D** avec 12 pages (couverture + 11 pages de contenu).

**Navigation :**
- Clic / tap sur la page → page suivante
- Bouton "pback" (arrière de la page) → page précédente
- Swipe gauche → page suivante
- Swipe droit → page précédente
- Flèche droite `→` / gauche `←` au clavier
- Fin du menu → reboucle sur la couverture

**Modal photo produit :**
Cliquer sur un plat marqué 📸 ouvre une photo plein écran. Cliquer n'importe où ferme la modal.

**Contenu des 12 pages :**

| Page | Contenu |
|------|---------|
| Couverture (p0) | Photo du restaurant + bouton "Ouvrir la carte" |
| 1 | Présentation, adresse, horaires |
| 2 | Pizzas Base Tomate (Margherita, N°2, 4 Fromages, Thon) |
| 3 | Pizzas Base Tomate suite (Orientales, Végétarienne, Royale, Linda, Tanti Gusti) |
| 4 | Pizzas Base Crème (Poulet Curry, Paesana, Raclette, Suitzeria) |
| 5 | Pizzas Base Crème suite (Nicco, Chèvre Miel, Saumon, Pizza Nono) |
| 6 | Chaussons Gratiné · Sandwichs Classiques |
| 7 | Sandwichs Spéciaux |
| 8 | Suppléments |
| 9 | TexMex · Frites |
| 10 | Desserts · Boissons |
| 11 | Réseaux sociaux (Instagram · TikTok) |

---

## Comment modifier le site

### Changer une photo

1. Déposez la nouvelle image dans le dossier `assets/` (MenuTanti) ou `asset/` (MenuQrcode)
2. Renommez-la avec le même nom que l'image à remplacer
   **OU** modifiez l'attribut `src="..."` dans le HTML correspondant

Toutes les images sont en format **WebP** (meilleure compression, chargement rapide). Les versions `.jpg` / `.png` sont des sauvegardes.

### Modifier les prix ou le contenu du menu

**MenuTanti :** Ouvrir `MenuTanti/menu.html` et chercher le nom du plat à modifier. Chaque plat est structuré ainsi :

```html
<article class="menu-item">
  <div class="menu-item-top">
    <span class="menu-item-name">NOM DU PLAT</span>
    <span class="menu-item-dots"></span>
    <span class="menu-item-price">PRIX</span>
  </div>
  <p class="menu-item-desc">Description</p>
</article>
```

**MenuQrcode :** Ouvrir `MenuQrcode/index.html` et chercher le nom du plat. Chaque plat est structuré ainsi :

```html
<div class="mi">
  <span class="mn">NOM DU PLAT</span>
  <span class="md"></span>
  <div class="mp-wrapper">
    <span class="mp">PRIX</span>
  </div>
</div>
<p class="mi-desc">Description</p>
```

### Modifier les horaires

**MenuTanti/index.html** — chercher `<section class="horaires-section">` et modifier les `.heure-slot`.

**MenuQrcode/index.html** — chercher `<div class="hours-box">` sur la page 1.

### Modifier les couleurs

**MenuTanti :** Ouvrir `MenuTanti/style.css`, modifier les variables dans `:root` (section 2).

**MenuQrcode :** Ouvrir `MenuQrcode/menu.css`, modifier les variables dans `:root`.

| Variable | Rôle |
|----------|------|
| `--or` / `--gold-main` | Or principal (titres, bordures, boutons) |
| `--or-clair` / `--gold-light` | Or clair (hover, accents) |
| `--noir` / `--bg-dark` | Fond principal sombre |
| `--creme` / `--cream` | Texte sur fond sombre |

### Ajouter un plat ou une catégorie

Voir les commentaires `<!-- ✏️ -->` directement dans les fichiers HTML.

---

## Informations du restaurant

| Information | Valeur |
|-------------|--------|
| Nom | TANTI GUSTI II |
| Adresse | 3 Rue de Bonsecours, 54000 Nancy |
| Téléphone | 03 72 91 78 80 |
| Instagram | [@tanti_gustiii](https://www.instagram.com/tanti_gustiii/) |
| TikTok | [@tantigusti2](https://www.tiktok.com/@tantigusti2) |
| Horaires Lun–Ven | 11h30–14h00 · 18h30–02h00 |
| Horaires Sam–Dim | 18h30–02h00 |

---

## Corrections apportées (avril 2026)

### MenuQrcode/index.html
- **BUG CRITIQUE** : balise de fermeture `</div>` manquante pour la page `p1`, ce qui imbriquait les pages `p2` à `p11` à l'intérieur de `p1` — le flipbook 3D ne fonctionnait pas correctement
- **BUG CRITIQUE** : fragment HTML orphelin corrompu (`ss="footer-loop">...`) supprimé en fin de fichier
- **BUG** : attributs `loading="lazy" decoding="async"` retirés d'une balise `<p>` (réservés aux `<img>`)
- **CONTENU** : titre de page et en-têtes de pages unifiés de "TANTI GUSTI 2" → "TANTI GUSTI II"
- **IMAGES** : `asset/vosgien.webp` et `asset/special.webp` manquants → images de remplacement temporaires indiquées en commentaire
- **LIEN** : `rel="noopener noreferrer"` ajouté sur les liens sociaux `target="_blank"`

### MenuQrcode/menu.css
- **BUG** : variable `--font-sans` utilisée (`.price-size`) mais non définie dans `:root` — ajoutée
- **BUG** : 5 blocs de règles CSS en double (`.mp-wrapper`, `.mn`, `.md`, `.mp`, `.price-size`) — fusionnés
- **PERF** : `asset/texture.png` → `asset/texture.webp` (format optimisé disponible)

### MenuTanti/index.css
- **COMMENTAIRES** : extensions de fichiers obsolètes corrigées (`.jpg`/`.png` → `.webp`)

---

## Déploiement

Ce site est **entièrement statique** (HTML + CSS + JS). Aucun serveur, base de données ou framework requis.

**Pour le mettre en ligne :**
1. Uploader le dossier `MenuTanti/` sur un hébergeur web (OVH, o2switch, Vercel, Netlify, etc.)
2. Le fichier `index.html` est la page d'entrée principale

**Pour le menu QR Code :**
1. Uploader le dossier `MenuQrcode/` sur le même hébergeur (ou un sous-domaine)
2. Générer un QR Code pointant vers l'URL de `MenuQrcode/index.html`
3. Imprimer et afficher le QR Code en salle / en vitrine

**Compatibilité navigateurs :** Chrome, Firefox, Safari, Edge (versions modernes). Le flipbook requiert un navigateur supportant les transformations CSS 3D (`transform-style: preserve-3d`).
