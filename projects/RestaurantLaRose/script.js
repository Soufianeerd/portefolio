// ========================================
// RESTAURANT LA ROSE — script.js
// ========================================
// Vanilla JS uniquement • Aucune dépendance externe
// ========================================

// ========================================
// NAVIGATION MOBILE
// ========================================
// Ce bloc gère l'ouverture/fermeture du menu mobile.
// → Modifier ici si le client souhaite un menu différent (mega menu, sidebar, etc.)

document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('is-open');
      navLinks.classList.toggle('is-open');
    });

    // Fermer le menu au clic sur un lien
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        navToggle.classList.remove('is-open');
        navLinks.classList.remove('is-open');
      });
    });
  }
});

// ========================================
// STICKY HEADER
// ========================================
// Ajoute la classe .is-scrolled au header après 80px de scroll.
// → Modifier la valeur du seuil selon la hauteur du hero.

(function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const SCROLL_THRESHOLD = 80;

  window.addEventListener('scroll', function () {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }, { passive: true });
})();

// ========================================
// SMOOTH SCROLL
// ========================================
// Gère le scroll fluide vers les ancres (#section).
// → Aucune modification nécessaire sauf si changement de structure HTML.

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const header     = document.querySelector('.header');
      const headerH    = header ? header.offsetHeight : 0;
      const targetPos  = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH - 10;

      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });
});

// ========================================
// ANIMATIONS AU SCROLL
// ========================================
// Utilise IntersectionObserver pour déclencher les animations d'apparition.
// → Peut être entièrement désactivé si le client préfère un site sobre.
// → Modifier le threshold (0.15 = dès que 15% de l'élément est visible).

document.addEventListener('DOMContentLoaded', function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => observer.observe(el));
});

// ========================================
// FORMULAIRE DE CONTACT / RÉSERVATION
// ========================================
// Validation côté client : tous les champs required sont vérifiés.
// Retour visuel : message de succès ou d'erreur sous le formulaire.
// → Remplacer l'URL action du formulaire par l'endpoint Formspree du client :
//    Ex : action="https://formspree.io/f/XXXXXXXX"
// → Pour un backend custom, modifier la fonction sendForm() ci-dessous.

document.addEventListener('DOMContentLoaded', function () {
  const form    = document.getElementById('reservationForm');
  const msgEl   = document.getElementById('formMessage');
  if (!form || !msgEl) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const data    = new FormData(form);
    const name    = (data.get('name')  || '').trim();
    const phone   = (data.get('phone') || '').trim();
    const email   = (data.get('email') || '').trim();
    const date    = data.get('date');
    const time    = data.get('time');
    const guests  = data.get('guests');

    // Champs obligatoires
    if (!name || !phone || !email || !date || !time || !guests) {
      showMsg('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    // Validation email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showMsg('Veuillez entrer une adresse email valide.', 'error');
      return;
    }

    // Validation date future
    const selected = new Date(date);
    const today    = new Date();
    today.setHours(0, 0, 0, 0);
    if (selected < today) {
      showMsg('Veuillez sélectionner une date future.', 'error');
      return;
    }

    // ✅ Succès (simulation — remplacer par fetch() pour envoi réel)
    showMsg('Réservation envoyée ! Nous vous confirmons par téléphone dans les plus brefs délais. Merci !', 'success');
    form.reset();
  });

  function showMsg(text, type) {
    msgEl.textContent = text;
    msgEl.className   = 'form-message ' + type;
    msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => { msgEl.textContent = ''; msgEl.className = 'form-message'; }, 6000);
  }
});

// ========================================
// FAQ ACCORDÉON (prestations.html)
// ========================================
// Gère l'ouverture/fermeture des questions FAQ.
// → Modifier le sélecteur si la structure HTML change.

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');

      // Ferme tous les items ouverts
      document.querySelectorAll('.faq-item.is-open').forEach(el => el.classList.remove('is-open'));

      // Ouvre le cliqué si pas déjà ouvert
      if (!isOpen) item.classList.add('is-open');
    });
  });
});

// ========================================
// ACTIVE LINK (détection section visible)
// ========================================
// Met en évidence le lien de nav correspondant à la section visible.
// → Aucune modification nécessaire sauf changement des IDs de sections.

document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', function () {
    let current = '';
    const headerH = (document.querySelector('.header') || {}).offsetHeight || 80;

    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - headerH - 40) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('is-active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('is-active');
      }
    });
  }, { passive: true });
});
