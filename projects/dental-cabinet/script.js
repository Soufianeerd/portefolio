// ========================================
// DENTAL CABINET — script.js
// ========================================
// Vanilla JS uniquement • Aucune dépendance externe
// ========================================

// ========================================
// NAVIGATION MOBILE
// ========================================
// Ce bloc gère l'ouverture/fermeture du menu mobile.
// → Modifier ici si le client souhaite un menu différent.

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
// Ajoute la classe .is-scrolled au header après 80px de scroll.
// → Modifier la valeur du seuil selon la hauteur du hero.

(function () {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        header.classList.toggle('is-scrolled', window.scrollY > 80);
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

            const headerH = (document.querySelector('.header') || {}).offsetHeight || 72;
            const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH - 10;
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
// FORMULAIRE DE CONTACT
// ========================================
// Validation côté client : Nom, Téléphone, Email, Message obligatoires.
// → Remplacer l'URL action du formulaire par l'endpoint Formspree du client :
//    Ex : action="https://formspree.io/f/XXXXXXXX"

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const msgEl = document.getElementById('formMessage');
    if (!form || !msgEl) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const data = new FormData(form);
        const name = (data.get('name') || '').trim();
        const phone = (data.get('phone') || '').trim();
        const email = (data.get('email') || '').trim();
        const service = (data.get('service') || '').trim();
        const message = (data.get('message') || '').trim();

        if (!name || !phone || !email || !message) {
            showMsg('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMsg('Adresse email invalide.', 'error');
            return;
        }

        // ✅ Succès (simulation — remplacer par fetch() pour envoi réel)
        showMsg('Votre demande a bien été reçue. Nous vous contacterons dans les 24h pour votre rendez-vous. Merci !', 'success');
        form.reset();
    });

    function showMsg(text, type) {
        msgEl.textContent = text;
        msgEl.className = 'form-message ' + type;
        msgEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { msgEl.textContent = ''; msgEl.className = 'form-message'; }, 6000);
    }
});

// ========================================
// FAQ ACCORDÉON (prestations.html)
// ========================================
// Gère l'ouverture/fermeture des questions FAQ.

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
// ACTIVE LINK (détection section visible)
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', function () {
        let current = '';
        const headerH = (document.querySelector('.header') || {}).offsetHeight || 72;

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
