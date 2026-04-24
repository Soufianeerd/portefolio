/**
 * BURGER TACOS NANCY — script.js
 * Fonctionnalités :
 *   1. Navbar : style au scroll + scroll spy actif
 *   2. Menu mobile : open/close avec overlay
 *   3. Hero : animation d'entrée différée
 *   4. Filtre menu par catégorie
 *   5. Reveal au scroll (IntersectionObserver)
 *   6. Badge "ouvert/fermé" dynamique selon heure réelle
 *   7. Lightbox galerie simple
 *   8. Smooth scroll des ancres
 *   9. FAB appel visible uniquement sur mobile
 */

'use strict';

/* ============================================================
   1. NAVBAR — scroll opacity + sticky
============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 60;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // état initial
})();


/* ============================================================
   2. MENU MOBILE — burger toggle + overlay
============================================================ */
(function initMobileMenu() {
  const toggle  = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('navOverlay');
  if (!toggle || !navLinks || !overlay) return;

  function openMenu() {
    toggle.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('active');
    overlay.removeAttribute('aria-hidden');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Fermer au clic sur un lien de navigation interne
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fermer avec Échap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ============================================================
   3. HERO — animation d'entrée (différée après chargement)
============================================================ */
(function initHeroAnimations() {
  window.addEventListener('load', () => {
    document.querySelectorAll('.fade-up').forEach(el => {
      el.classList.add('ready');
    });
  });
})();


/* ============================================================
   4. FILTRE MENU
============================================================ */
(function initMenuFilter() {
  const buttons  = document.querySelectorAll('.filter-btn');
  const cards    = document.querySelectorAll('.menu-card');
  const menuGrid = document.getElementById('menuGrid');
  if (!buttons.length || !cards.length) return;

  function filterMenu(category) {
    cards.forEach(card => {
      const cardCat = card.dataset.category;
      const match   = category === 'all' || cardCat === category;

      if (match) {
        card.classList.remove('hidden');
        // Micro-animation à l'apparition
        card.style.animation = 'none';
        card.offsetHeight;   // reflow
        card.style.animation = 'menuCardIn 0.3s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  }

  // Injection du keyframe dynamiquement (une seule fois)
  if (!document.getElementById('menu-filter-style')) {
    const style = document.createElement('style');
    style.id = 'menu-filter-style';
    style.textContent = `
      @keyframes menuCardIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Mise à jour des états actifs (ARIA + CSS)
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      filterMenu(btn.dataset.filter);
    });
  });
})();


/* ============================================================
   5. REVEAL AU SCROLL — IntersectionObserver
============================================================ */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Si le navigateur ne supporte pas IntersectionObserver, tout afficher
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // ne pas re-observer une fois visible
      }
    });
  }, {
    threshold: 0.12,        // déclencher à 12% de visibilité
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ============================================================
   6. BADGE "OUVERT / FERMÉ" dans le hero — temps réel
============================================================ */
(function initOpenStatus() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;

  /**
   * Horaires d'ouverture (0=dim, 1=lun, ..., 6=sam)
   * Valeur en minutes depuis minuit
   * null = fermé toute la journée
   */
  const HORAIRES = {
    0: null,                         // Dimanche — fermé
    1: { open: 10*60+30, close: 24*60+30 }, // Lundi
    2: { open: 11*60,    close: 24*60+30 }, // Mardi
    3: { open: 11*60+30, close: 24*60+30 }, // Mercredi
    4: { open: 11*60+30, close: 24*60+30 }, // Jeudi
    5: { open: 11*60+30, close: 25*60    }, // Vendredi (01h00 = 25h)
    6: { open: 12*60,    close: 24*60+30 }, // Samedi
  };

  function getStatus() {
    const now     = new Date();
    const dayOfW  = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();

    const schedule = HORAIRES[dayOfW];
    if (!schedule) return { open: false, label: '⚪ Fermé aujourd\'hui (dimanche)' };

    // Gérer les horaires after-midnight (ex : close = 24h30 = 1460 min)
    const isOpen = minutes >= schedule.open && minutes < schedule.close;
    if (isOpen) {
      const closeH = Math.floor(schedule.close / 60) % 24;
      const closeM = schedule.close % 60;
      const closeStr = `${closeH}h${closeM.toString().padStart(2,'0')}`;
      return { open: true, label: `⚡ Ouvert ce soir jusqu'à ${closeStr}` };
    }
    
    // Calcul prochaine ouverture
    const openH = Math.floor(schedule.open / 60);
    const openM = schedule.open % 60;
    const openStr = `${openH}h${openM.toString().padStart(2,'0')}`;
    return { open: false, label: `🕐 Ouverture aujourd'hui à ${openStr}` };
  }

  function updateBadge() {
    const { open, label } = getStatus();
    badge.textContent = label;
    badge.style.borderColor = open
      ? 'rgba(230, 170, 50, .4)'
      : 'rgba(150, 150, 150, .3)';
    badge.style.color = open ? '' : 'rgba(200,200,200,.7)';
    badge.style.background = open
      ? 'rgba(230, 170, 50, .15)'
      : 'rgba(100, 100, 100, .1)';
  }

  updateBadge();
  // Mettre à jour toutes les minutes
  setInterval(updateBadge, 60_000);
})();


/* ============================================================
   7. LIGHTBOX GALERIE (simple, accessible)
============================================================ */
(function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (!galleryItems.length) return;

  // Créer la lightbox dans le DOM
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Visionneuse d\'image');
  lightbox.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-inner">
      <button class="lb-close" aria-label="Fermer">✕</button>
      <img class="lb-img" src="" alt="" />
      <div class="lb-caption"></div>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Style inline minimal (évite une dépendance CSS supplémentaire)
  const lbStyle = document.createElement('style');
  lbStyle.textContent = `
    #lightbox {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }
    #lightbox.lb-visible { opacity: 1; pointer-events: all; }
    .lb-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,.92);
      backdrop-filter: blur(8px);
    }
    .lb-inner {
      position: relative;
      z-index: 1;
      max-width: min(90vw, 960px);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .lb-img {
      max-width: 100%;
      max-height: 80vh;
      border-radius: 8px;
      box-shadow: 0 24px 64px rgba(0,0,0,.7);
      object-fit: contain;
    }
    .lb-close {
      position: absolute;
      top: -2.5rem;
      right: 0;
      background: rgba(255,255,255,.1);
      border: 1px solid rgba(255,255,255,.2);
      color: #fff;
      font-size: 1rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      transition: background 0.2s;
    }
    .lb-close:hover { background: rgba(255,255,255,.25); }
    .lb-caption {
      font-size: 0.82rem;
      color: rgba(255,255,255,.55);
      text-align: center;
    }
  `;
  document.head.appendChild(lbStyle);

  const lbImg       = lightbox.querySelector('.lb-img');
  const lbCaption   = lightbox.querySelector('.lb-caption');
  const lbClose     = lightbox.querySelector('.lb-close');
  const lbBackdrop  = lightbox.querySelector('.lb-backdrop');
  let previousFocus = null;

  function openLightbox(src, alt) {
    previousFocus = document.activeElement;
    lbImg.src = src;
    lbImg.alt = alt;
    lbCaption.textContent = alt;
    lightbox.classList.add('lb-visible');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('lb-visible');
    document.body.style.overflow = '';
    if (previousFocus) previousFocus.focus();
  }

  // Rendre les images cliquables avec tabindex
  galleryItems.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');

    img.addEventListener('click', () => openLightbox(img.src, img.alt));
    img.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('lb-visible')) {
      closeLightbox();
    }
  });
})();


/* ============================================================
   8. SMOOTH SCROLL (polyfill pour ancres internes)
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href   = this.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const navbarH = document.getElementById('navbar')?.offsetHeight || 70;
      const y = target.getBoundingClientRect().top + window.scrollY - navbarH - 12;

      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   9. FAB mobile — masquer sur desktop, animer sur mobile
============================================================ */
(function initFab() {
  const fab = document.getElementById('mobile-call-fab');
  if (!fab) return;

  // Déjà géré en CSS (display:none sur desktop)
  // Ajouter classe "show" après scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      fab.style.display = 'flex';
    }
  }, { passive: true });
})();


/* ============================================================
   10. ACTIVE NAV LINK — scroll spy
============================================================ */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function updateActive() {
    const scrollY   = window.scrollY;
    const offset    = 120; // hauteur navbar + marge
    let currentId   = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - offset;
      if (scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();


/* ============================================================
   11. LAZY LOADING — fallback si <img loading="lazy"> non supporté
============================================================ */
(function initLazyFallback() {
  if ('loading' in HTMLImageElement.prototype) return; // natif supporté

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length) return;

  const imgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        obs.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imgObserver.observe(img));
})();
