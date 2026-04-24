# Kartell Nancy — Site Vitrine

Site vitrine du flagship store Kartell Nancy.  
35 Ter Rue Saint-Nicolas, 54000 Nancy.

---

## Stack Technique

| Technologie     | Usage                                         |
|-----------------|-----------------------------------------------|
| HTML5 sémantique | Structure (sections, nav, article, header…)  |
| CSS3 natif (BEM) | Design, responsive, variables, animations    |
| Vanilla JS (ES6+) | Slider, menu, scroll reveal, catalogue      |
| Google Fonts    | Playfair Display, Cormorant Garamond, DM Sans |
| Font Awesome 6  | Icônes                                        |

---

## Structure du projet

```
kartell-nancy/
├── index.html              → Page principale (HTML uniquement)
├── css/
│   └── style.css           → Tous les styles (BEM, variables, responsive)
├── js/
│   └── main.js             → Scripts (menu, slider, reveal, catalogue skeleton)
├── assets/
│   ├── img/                → Images (voir assets/img/README.md)
│   │   └── README.md
│   ├── icons/
│   │   └── favicon.svg     → Favicon "K"
│   └── fonts/              → Polices locales (si nécessaire)
├── catalog/
│   └── README.md           → Instructions intégration catalogue Excel
└── README.md               → Ce fichier
```

---

## Lancement local

```bash
# Option 1 — Ouvrir directement dans le navigateur
open index.html

# Option 2 — Serveur local (recommandé pour éviter les restrictions CORS)
npx serve .

# Option 3 — Live Server (VS Code)
# Installer l'extension "Live Server" puis clic droit → Open with Live Server
```

---

## Fonctionnalités

- [x] 10 sections (Header, Hero, Univers, Collections, Icônes, Karchitect, Magasin, Avis, Newsletter, Footer)
- [x] Navigation sticky avec réduction au scroll
- [x] Menu hamburger mobile (overlay plein écran)
- [x] Animations fade-in au scroll (IntersectionObserver)
- [x] Slider produits avec navigation flèches + dots + swipe tactile
- [x] SVG placeholders élégants par catégorie
- [x] SEO on-page (JSON-LD FurnitureStore, Open Graph)
- [x] CSS classes `.catalog__*` prêtes pour le catalogue Excel
- [x] Squelette JS commenté pour le catalogue (fetch, filtre, recherche, pagination)
- [x] Responsive mobile-first (768px, 1024px, 1280px)

---

## TODO

- [ ] Ajouter les vraies photos showroom et produits (voir `assets/img/README.md`)
- [ ] Remplacer les avis fictifs par de vrais avis Google
- [ ] Intégrer le catalogue Excel (voir `catalog/README.md`)
- [ ] Configurer le formulaire newsletter (Mailchimp, Brevo…)
- [ ] Ajouter l'iframe Google Maps réelle (remplacer le placeholder)
- [ ] Renseigner l'adresse email du magasin (dans footer et JSON-LD)
- [ ] Ajouter Google Analytics / Tag Manager
- [ ] SEO : Générer un sitemap.xml

---

## Crédits

- Design & Développement : Réalisé sur-mesure pour Kartell Nancy
- Marque Kartell : © Kartell S.p.A., Milan — [kartell.com](https://www.kartell.com)
