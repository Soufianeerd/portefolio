/* ============================================================
   TANTI GUSTI II — JAVASCRIPT
   Fichier : script.js
   Rôle    : Comportements interactifs du site.
             - Navbar qui change au scroll
             - Menu mobile (hamburger + drawer)
             - Animations d'apparition au scroll
             - Scrollspy (catégories du menu)
   ============================================================

   ✏️  AUCUNE IMAGE NI COULEUR ICI.
       Ce fichier gère uniquement les comportements.
       Vous n'avez normalement pas besoin de le modifier.

   📌 Ce qui est géré :
       1. Navbar scroll   → la navbar devient noire quand on scrolle
       2. Hamburger       → ouvre / ferme le menu mobile
       3. Animations      → les sections apparaissent au scroll
       4. Scrollspy       → le bouton actif dans la barre
                            de catégories suit la lecture
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {


  /* ──────────────────────────────────────────────────────────
     1. NAVBAR — Ajoute la classe .scrolled quand on scrolle
     ──────────────────────────────────────────────────────────
     La classe .scrolled est définie dans style.css.
     Elle rend la navbar noire et ajoute un flou.

     ✏️  Pour changer à quelle distance la navbar change :
         modifiez la valeur 60 (en pixels depuis le haut)
  ─────────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    /* requestAnimationFrame : le callback ne s'exécute qu'une seule fois
       par frame (≈ 16ms), même si le navigateur envoie plusieurs
       événements scroll dans le même intervalle → zéro jank */
    let scrollScheduled = false;
    const onScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        scrollScheduled = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* Vérifie au chargement */
  }


  /* ──────────────────────────────────────────────────────────
     2. HAMBURGER + DRAWER MOBILE
     ──────────────────────────────────────────────────────────
     Le hamburger (#hamburger) ouvre le drawer (#nav-drawer).
     Le fond semi-transparent (#nav-overlay) peut aussi
     fermer le drawer si on clique dessus.

     ✏️  Ces IDs correspondent aux balises dans index.html et menu.html :
         id="hamburger"   → le bouton hamburger
         id="nav-drawer"  → le panneau latéral mobile
         id="nav-overlay" → le fond transparent
  ─────────────────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('nav-drawer');
  const overlay   = document.getElementById('nav-overlay');

  /* Ouvre le menu mobile */
  function openDrawer() {
    hamburger?.classList.add('open');   /* Anime le hamburger en croix */
    drawer?.classList.add('open');      /* Fait glisser le drawer depuis la droite */
    overlay?.classList.add('open');     /* Affiche le fond sombre */
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; /* Empêche le scroll derrière */
  }

  /* Ferme le menu mobile
     ✏️  closeDrawer() est appelée depuis les liens du drawer
         Ex: <a href="#about" onclick="closeDrawer()">...
         Ne pas renommer cette fonction. */
  window.closeDrawer = function () {
    hamburger?.classList.remove('open');
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; /* Rétablit le scroll */
  };

  /* Gestion du clic sur le hamburger */
  hamburger?.addEventListener('click', () => {
    if (drawer?.classList.contains('open')) {
      window.closeDrawer();
    } else {
      openDrawer();
    }
  });

  /* Cliquer sur le fond ferme le drawer */
  overlay?.addEventListener('click', window.closeDrawer);


  /* ──────────────────────────────────────────────────────────
     3. ANIMATIONS FADE-UP (Apparition au scroll)
     ──────────────────────────────────────────────────────────
     Tous les éléments HTML avec l'attribut data-anim
     commencent invisibles et montent quand ils entrent
     dans l'écran.

     Le style de l'animation est dans style.css :
       [data-anim]         → invisible + décalé vers le bas
       [data-anim].visible → visible à sa position normale

     ✏️  Pour ajouter une animation sur un élément HTML :
         Ajoutez l'attribut data-anim à la balise.
         Optionel : ajoutez data-anim-delay="1" à "4"
         pour décaler l'apparition (effet cascade).

     ✏️  Pour changer le seuil d'apparition :
         threshold: 0.12 = l'animation démarre quand 12%
         de l'élément est visible.
  ─────────────────────────────────────────────────────────── */
  const animEls = document.querySelectorAll('[data-anim]');
  if (animEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible'); /* Déclenche l'animation CSS */
            observer.unobserve(entry.target);      /* S'arrête après la 1ère apparition */
          }
        });
      },
      {
        threshold: 0.12,              /* ← 12% visible = l'animation démarre */
        rootMargin: '0px 0px -40px 0px' /* Déclenche un peu avant d'arriver en bas */
      }
    );
    animEls.forEach(el => observer.observe(el));
  }


  /* ──────────────────────────────────────────────────────────
     4. PAGE CARTE — Barre de catégories (scrollspy)
     ──────────────────────────────────────────────────────────
     Sur menu.html :
     - Cliquer un bouton scrolle vers la section correspondante
     - En scrollant la page, le bouton actif se met à jour
       automatiquement pour suivre la section visible.

     ✏️  Si vous ajoutez une catégorie dans menu.html :
         Assurez-vous que data-target="xxx" du bouton
         correspond bien à id="xxx" de la section.

     ✏️  Pour changer l'offset de défilement (espace au-dessus
         de la section après le clic) :
         Modifiez SCROLL_OFFSET (actuellement 130px).
         Ce nombre doit être ≈ hauteur navbar + hauteur cat-bar.
  ─────────────────────────────────────────────────────────── */
  const catBtns = document.querySelectorAll('.cat-btn');

  if (catBtns.length) {

    /* Décalage en pixels pour éviter que la section soit cachée
       derrière la navbar fixe et la barre de catégories */
    const SCROLL_OFFSET = 130;

    /* Clic sur un bouton → scroll vers la section */
    catBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const section  = document.getElementById(targetId);
        if (!section) return;

        /* Plus précis : hauteur dynamique car la navbar change à scrolled */
        const dynamicOffset = document.querySelector('.navbar').offsetHeight + (catBar.offsetHeight || 0) + 10;

        const top = section.getBoundingClientRect().top + window.scrollY - dynamicOffset;
        window.scrollTo({ top, behavior: 'smooth' });

        /* Met à jour le bouton actif immédiatement */
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    /* Scrollspy : met à jour le bouton actif selon la section visible */
    const catSections = Array.from(catBtns).map(btn =>
      document.getElementById(btn.getAttribute('data-target'))
    ).filter(Boolean); /* Filtre les null (sections introuvables) */

    /* Récupère la barre de catégories pour le scroll horizontal uniquement */
    const catBar = document.getElementById('cat-bar');

    const scrollspyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            /* Active le bouton correspondant à la section visible */
            catBtns.forEach(btn => {
              btn.classList.toggle('active', btn.getAttribute('data-target') === id);
            });
            /* Fait défiler la barre de catégories HORIZONTALEMENT seulement
               (scrollIntoView scrollerait aussi verticalement → bug de scroll) */
            const activeBtn = document.querySelector(`.cat-btn[data-target="${id}"]`);
            if (activeBtn && catBar) {
              const barRect    = catBar.getBoundingClientRect();
              const btnRect    = activeBtn.getBoundingClientRect();
              const btnLeft    = activeBtn.offsetLeft;
              const btnWidth   = activeBtn.offsetWidth;
              const barScroll  = catBar.scrollLeft;
              const barWidth   = catBar.offsetWidth;
              /* Centre le bouton dans la barre */
              const targetScroll = btnLeft - barWidth / 2 + btnWidth / 2;
              catBar.scrollTo({ left: targetScroll, behavior: 'smooth' });
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: `-${SCROLL_OFFSET}px 0px -50% 0px`
      }
    );

    catSections.forEach(s => scrollspyObserver.observe(s));
  }


}); /* Fin du DOMContentLoaded */

/* ──────────────────────────────────────────────────────────
   5. LOGIQUE MODALE PRODUIT (Aperçu Photo)
   ────────────────────────────────────────────────────────── */
function openProductModal(imageSrc) {
  const modal = document.getElementById('pizza-modal');
  const modalImg = document.getElementById('pizza-img');
  if (!modal || !modalImg) return;

  modalImg.src = imageSrc;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Bloque le scroll du site
}

function closeProductModal() {
  const modal = document.getElementById('pizza-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Rétablit le scroll
  }
}
