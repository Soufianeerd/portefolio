// ========================================
// RESTAURANT MENU — script.js
// ========================================
// Vanilla JS uniquement • Aucune dépendance externe
// ========================================

// ========================================
// NAVIGATION MOBILE
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navToggle.classList.toggle('is-open');
            navLinks.classList.toggle('is-open');
        });
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
(function () {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', function () {
        header.classList.toggle('is-scrolled', window.scrollY > 72);
    }, { passive: true });
})();

// ========================================
// FILTRES DE MENU PAR CATÉGORIE
// ========================================
// Ce bloc gère le filtrage des plats par catégorie via data-category.
// → Pour ajouter une catégorie : ajouter un <button data-category="ma-cat"> dans .menu-categories
//   et data-category="ma-cat" aux articles .menu-item correspondants.
// → Le filtre 'all' affiche tous les plats.
// → Animation légère ajoutée à chaque transition de filtre.

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.cat-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    if (!buttons.length || !menuItems.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            // 1. Mettre à jour le bouton actif
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.category;

            // 2. Afficher/masquer les items avec transition
            menuItems.forEach((item, i) => {
                const match = filter === 'all' || item.dataset.category === filter;

                // Réinitialiser l'animation
                item.style.animation = 'none';
                item.offsetHeight; // force reflow

                if (match) {
                    item.style.display = '';
                    // Stagger (délai progressif par item visible)
                    const delay = Array.from(menuItems)
                        .filter(it => it.style.display !== 'none')
                        .indexOf(item) * 0.05;
                    item.style.animation = `menuFadeIn 0.4s ease ${delay}s both`;
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// ========================================
// ANIMATIONS AU SCROLL
// ========================================
// Utilise IntersectionObserver pour déclencher les animations d'apparition.
// → Peut être entièrement désactivé si le client préfère un site sobre.
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
// FAQ ACCORDÉON (prestations.html)
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.closest('.faq-item');
            const isOpen = item.classList.contains('is-open');
            document.querySelectorAll('.faq-item.is-open').forEach(el => el.classList.remove('is-open'));
            if (!isOpen) item.classList.add('is-open');
        });
    });
});

// ========================================
// SMOOTH SCROLL
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;
            e.preventDefault();
            const headerH = (document.querySelector('.header') || {}).offsetHeight || 72;
            const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH - 10;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        });
    });
});
