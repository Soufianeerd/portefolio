# Prompt à envoyer à une IA pour créer un menu flipbook restaurant

> **Comment utiliser ce fichier** : Copie tout le contenu ci-dessous (à partir de la ligne "---") et colle-le dans une conversation avec une IA (ChatGPT, Claude, Gemini, etc.). Remplace les `[PLACEHOLDER]` par les infos du nouveau restaurant.

---

## LE PROMPT :

Crée-moi un menu digital flipbook 3D pour un restaurant, optimisé mobile (QR Code sur les tables). Le menu se présente comme un livre qu'on feuillette par swipe ou clic. Design premium et élégant.

### Informations du restaurant :
- **Nom** : [NOM DU RESTAURANT]
- **Adresse** : [ADRESSE COMPLÈTE]
- **Téléphone** : [NUMÉRO]
- **Instagram** : [@ DU COMPTE]
- **Certifications** : [ex: Viandes Halal AVS, Produits frais, etc.]

### Palette de couleurs souhaitée :
- Couleur principale foncée : [ex: #0D2C28 émeraude]
- Couleur d'accent : [ex: #D4AF37 or]
- Fond des pages intérieures : [ex: #F5F1E8 crème]

### Menu du restaurant (à répartir sur les pages) :

**[Catégorie 1 — ex: Burgers]**
- [Nom du plat] — [Prix] €
- [Nom du plat] — [Prix] €
- (description optionnelle)

**[Catégorie 2 — ex: Assiettes]**
- [Nom du plat] — [Prix] €
- [Nom du plat] — [Prix] €

**[Catégorie 3 — ex: Desserts]**
- [Nom du plat] — [Prix] €

**[Catégorie 4 — ex: Boissons]**
- [Nom de la boisson] — [Prix] €

*(Ajouter autant de catégories que nécessaire)*

### Structure demandée :

Génère **3 fichiers** dans un dossier `MenuQrcode/` :
1. `index.html` — Structure HTML du flipbook
2. `menu.css` — Styles du flipbook
3. `menu.js` — Logique de navigation

Plus un dossier `MenuQrcode/asset/` où je placerai :
- `couverture.png` — image de couverture du menu

### Spécifications techniques obligatoires :

**Architecture HTML :**
- Page de couverture (p0) avec image et bouton "Ouvrir la Carte"
- Pages intérieures (p1, p2, ...) avec le contenu du menu
- Dernière page avec "Bon appétit", adresse, Instagram, certifications
- Back cover avec un SVG décoratif
- Barre de navigation en bas (bouton ← / indicateur de page / bouton →)

**Chaque page intérieure suit ce template HTML :**
```html
<div class="page pint" id="pX">
    <div class="pface" onclick="next()">
        <div class="pc">
            <div class="phd">
                <span class="phd-logo">NomRestaurant</span>
                <span class="phd-num">X / TOTAL</span>
            </div>
            <div class="ms">
                <div class="ms-title">🍔 Catégorie</div>
                <p class="ms-note">Note optionnelle</p>
                <div class="mi">
                    <span class="mn">Nom du plat</span>
                    <span class="md"></span>
                    <span class="mp">XX,XX €</span>
                </div>
                <p class="mi-desc">Description en italique</p>
            </div>
        </div>
    </div>
    <div class="pback" onclick="prev()"></div>
</div>
```

**Classes CSS clés :**
- `.ms` = section (catégorie)
- `.ms-title` = titre de catégorie avec ligne décorative dorée auto-extensible (::after)
- `.mi` = item menu (flex row : nom + dots + prix)
- `.mn` = nom du plat (Playfair Display)
- `.md` = séparateur pointillé doré
- `.mp` = prix (aligné à droite)
- `.mi-desc` = description en italique sous un item
- `.info-block` = bloc d'infos encadré (suppléments, notes)
- `.sup-item` = item de supplément

**CSS obligatoire :**
- Reset box-sizing, margin, padding
- `html` et `body` : `position: fixed; inset: 0; overflow: hidden; touch-action: none;` (empêche tout scroll/zoom)
- PWA meta tags : `apple-mobile-web-app-capable`, `viewport-fit=cover`
- Fond avec double radial-gradient + texture noise SVG en pseudo-element (::before et ::after sur body)
- Le book utilise `perspective: 1800px` sur le wrapper, `transform-style: preserve-3d` sur les pages
- Les pages tournent avec `transform: rotateY(-180deg)` + classe `.flipped`
- **Anti Z-fighting** : chaque page a un `translateZ` distinct (1px d'écart entre chaque page, PAS 0.15px). La page active a le z-index le plus élevé. Les faces avant/arrière ont des translateZ différents (0.5px / 0.4px)
- `will-change: transform, z-index` sur `.page`
- `-webkit-backface-visibility: hidden` sur `.pface` et `.pback`
- Ombre de reliure : `.pint .pface::after` avec gradient de gauche (simulant la pliure du livre)
- Typography responsive avec `clamp()` partout
- Boutons de navigation ronds avec `backdrop-filter: blur(8px)`
- Polices : Playfair Display (titres/prix) + Poppins (corps)

**JavaScript obligatoire :**

Le JS doit contenir exactement ces fonctionnalités :

1. **`syncUI()`** — met à jour l'indicateur de page (texte) et l'état disabled des boutons prev/next
2. **`updateStacking()`** — organise le z-index et translateZ de chaque page :
   - Pages tournées (i < cur) : z-index croissant, translateZ croissant (i+1 * 1px)
   - Page active (i === cur) : z-index le plus élevé (TOTAL+1), translateZ = (TOTAL+1) * 1px
   - Pages à venir (i > cur) : z-index décroissant, translateZ = (TOTAL-i) * 1px
3. **`next()`** — tourne la page suivante avec z-index=200 et translateZ=60px pendant l'animation. **À la dernière page, retourne instantanément à la couverture** (sans animation, en retirant toutes les classes .flipped, resetant cur=0, forçant un reflow puis réactivant les transitions)
4. **`prev()`** — retourne à la page précédente avec même principe de lift Z
5. **`hideHint()`** — masque le texte "← glisser pour feuilleter →" au premier swipe
6. **`resizeBook()`** — calcul responsive de la taille du livre (ratio 2:3, max 400px sur desktop)
7. **Swipe tactile** — touchstart/touchend, seuil 50px horizontal, ratio 1.5x vs vertical
8. **Navigation clavier** — ← / → / Espace
9. **Anti-scroll iOS** — `touchmove` avec `preventDefault` sur `#book`
10. **LABELS[]** — tableau de noms pour chaque page affiché dans l'indicateur

Le `transitionTime` doit être **820ms** avec courbe `cubic-bezier(.645, .045, .355, 1)`.

Les fonctions `next`, `prev`, `openBook` doivent être exposées sur `window` pour les `onclick` du HTML.

### Voici le code CSS de référence à reproduire (en adaptant les couleurs) :

```css
/* Copie exacte du menu.css fonctionnel */

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

:root {
    --em: #0D2C28;
    --em2: #0A2420;
    --em3: #1F5047;
    --gold: #D4AF37;
    --goldl: #E8CC6A;
    --goldd: #9E7E1A;
    --cream: #F5F1E8;
    --cream2: #EDE8D8;
    --td: #2D2D2D;
    --tm: #5A4F3E;
    --pw: 340px;
    --ph: 510px;
    --fs-base: clamp(11px, 3.2vw, 14px);
}

html {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overscroll-behavior: none;
    -webkit-overflow-scrolling: touch;
    touch-action: none;
}

body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overscroll-behavior: none;
    background: var(--em2);
    font-family: 'Poppins', sans-serif;
    -webkit-font-smoothing: antialiased;
    touch-action: none;
    position: fixed;
    inset: 0;
}

body::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
        radial-gradient(ellipse at 30% 20%, rgba(31, 80, 71, .45) 0%, transparent 60%),
        radial-gradient(ellipse at 70% 80%, rgba(31, 80, 71, .3) 0%, transparent 60%),
        linear-gradient(135deg, #061A15, #0D2C28 45%, #0A2420);
    pointer-events: none;
}

body::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 170px;
    opacity: .04;
    pointer-events: none;
}

#scene {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(8px, 2svh, 18px);
    z-index: 1;
    padding-top: env(safe-area-inset-top, 0px);
    padding-right: env(safe-area-inset-right, 0px);
    padding-bottom: max(env(safe-area-inset-bottom, 0px), 8px);
    padding-left: env(safe-area-inset-left, 0px);
}

#bwrap {
    perspective: 1800px;
    position: relative;
}

#book {
    width: var(--pw);
    height: var(--ph);
    position: relative;
    transform-style: preserve-3d;
}

.page {
    position: absolute;
    inset: 0;
    width: var(--pw);
    height: var(--ph);
    transform-origin: left center;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    transition: transform .82s cubic-bezier(.645, .045, .355, 1);
    will-change: transform, z-index;
    border-radius: 2px 8px 8px 2px;
    -webkit-font-smoothing: subpixel-antialiased;
    -webkit-transform-style: preserve-3d;
}

.page.flipped {
    transform: rotateY(-180deg);
}

.pface,
.pback {
    position: absolute;
    inset: 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
    cursor: pointer;
    outline: 1px solid transparent;
}

.pface {
    transform: rotateY(0deg) translateZ(0.5px);
    -webkit-transform: rotateY(0deg) translateZ(0.5px);
}

.pback {
    transform: rotateY(180deg) translateZ(0.4px);
    -webkit-transform: rotateY(180deg) translateZ(0.4px);
    background: var(--cream2);
}
```

### Voici le code JS de référence à reproduire :

```javascript
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const pages = [...document.querySelectorAll('.page')];
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const pgind = document.getElementById('pgind');
    const TOTAL = pages.length;
    
    const LABELS = [
        'Couverture', 
        // ... adapter selon les pages du restaurant
        'Fin'
    ];

    let cur = 0;
    let animating = false;
    const transitionTime = 820;

    function syncUI() {
        if (pgind) pgind.textContent = LABELS[cur] || `Page ${cur}`;
        if (btnPrev) btnPrev.disabled = cur <= 0;
        if (btnNext) btnNext.disabled = cur >= TOTAL - 1;
    }

    function updateStacking() {
        pages.forEach((page, i) => {
            page.style.transition = `transform ${transitionTime}ms cubic-bezier(.645, .045, .355, 1)`;
            if (i < cur) {
                page.classList.add('flipped');
                page.style.zIndex = i + 1;
                page.style.transform = `rotateY(-180deg) translateZ(${(i + 1) * 1}px)`;
            } else if (i === cur) {
                page.classList.remove('flipped');
                page.style.zIndex = TOTAL + 1;
                page.style.transform = `rotateY(0deg) translateZ(${(TOTAL + 1) * 1}px)`;
            } else {
                page.classList.remove('flipped');
                page.style.zIndex = TOTAL - i;
                page.style.transform = `rotateY(0deg) translateZ(${(TOTAL - i) * 1}px)`;
            }
        });
    }

    function next() {
        if (animating) return;
        if (cur >= TOTAL - 1) {
            animating = true;
            pages.forEach(p => {
                p.style.transition = 'none';
                p.classList.remove('flipped');
            });
            cur = 0;
            updateStacking();
            syncUI();
            void pages[0].offsetWidth;
            pages.forEach(p => {
                p.style.transition = `transform ${transitionTime}ms cubic-bezier(.645, .045, .355, 1)`;
            });
            animating = false;
            return;
        }
        animating = true;
        hideHint();
        const page = pages[cur];
        page.style.zIndex = 200;
        page.style.transform = `rotateY(-180deg) translateZ(60px)`;
        page.classList.add('flipped');
        cur++;
        setTimeout(() => {
            updateStacking();
            syncUI();
            animating = false;
        }, transitionTime);
    }

    function prev() {
        if (animating || cur <= 0) return;
        animating = true;
        cur--;
        const page = pages[cur];
        page.style.zIndex = 200;
        page.style.transform = `rotateY(0deg) translateZ(60px)`;
        page.classList.remove('flipped');
        setTimeout(() => {
            updateStacking();
            syncUI();
            animating = false;
        }, transitionTime);
    }

    function hideHint() {
        const hint = document.querySelector('.swipe-hint');
        if (hint) {
            hint.style.opacity = '0';
            setTimeout(() => hint.remove(), 400);
        }
    }

    window.next = next;
    window.prev = prev;
    window.openBook = next;

    updateStacking();
    syncUI();

    let startX = 0, startY = 0;
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const diffX = startX - e.changedTouches[0].clientX;
        const diffY = startY - e.changedTouches[0].clientY;
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
            if (diffX > 0) next();
            else prev();
        }
    }, { passive: true });

    const root = document.documentElement;
    function resizeBook() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const availW = vw - 32;
        const availH = vh - 80;
        let width = Math.min(Math.floor(availH * 0.66), availW);
        if (vw >= 768) width = Math.min(width, 400);
        const height = Math.floor(width * 1.5);
        root.style.setProperty('--pw', `${width}px`);
        root.style.setProperty('--ph', `${height}px`);
    }
    window.addEventListener('resize', resizeBook);
    resizeBook();

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') next();
        if (e.key === 'ArrowLeft') prev();
    });

    document.addEventListener('touchmove', (e) => {
        if (e.target.closest('#book')) e.preventDefault();
    }, { passive: false });
});
```

### IMPORTANT — Points critiques à respecter :
1. **Pas de framework** — HTML/CSS/JS vanilla uniquement
2. **Mobile-first** — Tout doit être parfait sur téléphone (c'est le cas d'usage principal via QR Code)
3. **Aucun scroll** — Le body et html doivent être `position: fixed; overflow: hidden`
4. **Anti Z-fighting** — Utiliser des gaps translateZ de **1px minimum** entre chaque page (pas 0.1px, ça scintille sur les GPU mobiles)
5. **Boucle** — À la dernière page, un swipe suivant ramène à la couverture **instantanément** (pas d'animation de retour)
6. **Pas de librairie externe** sauf Google Fonts
7. **Répartir le contenu** intelligemment : max 4-5 sections par page pour que tout reste lisible sans scroll

Génère les 3 fichiers complets (`index.html`, `menu.css`, `menu.js`) prêts à l'emploi.
