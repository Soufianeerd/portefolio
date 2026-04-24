# Intégration Catalogue Excel — Kartell Nancy

Ce dossier est réservé à l'intégration du catalogue produits complet issu du fichier Excel fourni par le client.

---

## 1. Structure attendue du fichier Excel

| Colonne           | Description                             | Exemple              |
|-------------------|-----------------------------------------|----------------------|
| `reference`       | Référence article                       | `KT-4300-B4`         |
| `nom`             | Nom du produit                          | `Louis Ghost`        |
| `designer`        | Nom du designer                         | `Philippe Starck`    |
| `categorie`       | Catégorie principale                    | `Sièges`             |
| `sous_categorie`  | Sous-catégorie                          | `Chaises`            |
| `prix`            | Prix TTC en euros                       | `310`                |
| `description`     | Description courte                      | `Chaise transparente…`|
| `couleurs`        | Couleurs disponibles (séparées par `;`) | `Transparent;Rouge`  |
| `materiaux`       | Matériaux principaux                    | `Polycarbonate`      |
| `dimensions`      | Lxlxh en cm                            | `57x55x93 cm`        |
| `image_url`       | URL ou chemin relatif de l'image        | `assets/img/produits/louis-ghost.jpg` |

---

## 2. Conversion Excel → JSON

### Option A : Script Node.js (recommandé)
```bash
npm install xlsx
node scripts/convert-catalog.js
```

Script à créer (`scripts/convert-catalog.js`) :
```javascript
const XLSX = require('xlsx');
const fs   = require('fs');

const wb   = XLSX.readFile('catalog/catalogue-kartell.xlsx');
const ws   = wb.Sheets[wb.SheetNames[0]];
const json = XLSX.utils.sheet_to_json(ws);

fs.writeFileSync('catalog/data.json', JSON.stringify(json, null, 2));
console.log(`✓ ${json.length} produits exportés dans catalog/data.json`);
```

### Option B : Conversion en ligne
- [SheetJS Online](https://sheetjs.com/) — Convertir XLSX en JSON
- Sauvegarder le résultat dans `catalog/data.json`

---

## 3. Section HTML à ajouter dans `index.html`

Insérer ce bloc **après** la section `.collections` :

```html
<section class="catalog" id="catalogue">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-label">Catalogue Complet</span>
      <h2 class="section-title">Tous nos Produits</h2>
      <div class="section-divider"></div>
    </div>
    <div class="catalog__head">
      <div class="catalog__filters">
        <input type="search" id="catalog-search" class="catalog__search" placeholder="Rechercher un produit, designer…" aria-label="Recherche catalogue">
        <div id="catalog-filters" class="catalog__filter-buttons" role="group" aria-label="Filtrer par catégorie"></div>
      </div>
    </div>
    <div id="catalog-grid" class="catalog__grid" aria-live="polite" aria-atomic="true"></div>
    <div id="catalog-pagination" class="catalog__pagination" role="navigation" aria-label="Pagination du catalogue"></div>
  </div>
</section>
```

---

## 4. Activation dans `js/main.js`

Dans main.js, section `CATALOGUE`, **décommenter** tout le bloc encadré par `/* ... */` et appeler :
```javascript
loadCatalog();
```

---

## 5. Classes CSS disponibles (dans `css/style.css`)

- `.catalog` — Section conteneur
- `.catalog__search` — Barre de recherche
- `.catalog__filters` — Conteneur des filtres
- `.catalog__filter-btn` / `--active` — Boutons de catégorie
- `.catalog__grid` — Grille produits CSS Grid responsive
- `.catalog__card` — Carte produit
- `.catalog__card-img` — Image du produit
- `.catalog__card-name` — Nom
- `.catalog__card-designer` — Designer
- `.catalog__card-category` — Catégorie
- `.catalog__card-price` — Prix
- `.catalog__pagination` — Conteneur pagination
- `.catalog__page-btn` / `--active` — Boutons de page
