/* ============================================
   SHOOTEVENT TEMPLATE - script.js
   ============================================ */

// 1. CONFIGURATION (Anciennement config.js)
const CONFIG = {
    brand: {
        name: "SHOOT EVENT",
        slogan: "Élégance, Qualité & Professionnalisme.",
        description: "Photographe et vidéaste professionnel spécialisé dans les événements de prestige.",
        logo: "SHOOT EVENT"
    },
    contact: {
        email: "shoot.event@outlook.fr",
        phone: "+33 6 12 34 56 78",
        address: "Paris, France",
        social: {
            instagram: "#",
            facebook: "#",
            whatsapp: "#",
            youtube: "#"
        }
    },
    packs: [
        {
            id: 1,
            name: "PACK ESSENTIAL",
            price: 1350,
            description: "L'essentiel pour immortaliser votre événement",
            features: ["Photos illimitées", "Retouches professionnelles", "Galerie en ligne", "Livraison 15j", "1 photographe"],
            popular: false
        },
        {
            id: 2,
            name: "PACK CINEMA",
            price: 1950,
            description: "Photo + Vidéo pour un souvenir complet",
            features: ["Photos illimitées", "Film cinématographique 1h30", "Drone 4K inclus", "Coffret USB", "2 opérateurs"],
            popular: true
        },
        {
            id: 3,
            name: "PACK PRESTIGE",
            price: 2800,
            description: "L'excellence absolue pour votre événement",
            features: ["Tout inclus", "Album photo luxe", "Deuxième cadreur", "Teaser 48h", "Drone + Steadicam"],
            popular: false
        }
    ],
    options: [
        { id: 'drone', name: 'Option Drone 4K', price: 150 },
        { id: 'proj', name: 'Vidéoprojecteur', price: 600 },
        { id: 'album', name: 'Album Photo Physique', price: 250 },
        { id: 'teaser', name: 'Teaser Express 48h', price: 200 }
    ],
    portfolio: [
        { id: 1, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', title: 'Mariage Château', category: 'Mariage' },
        { id: 2, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', title: 'Gala Corporate', category: 'Corporate' },
        { id: 3, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', title: 'Réception Prestige', category: 'Mariage' },
        { id: 4, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', title: 'Soirée Privée', category: 'Événement' }
    ],
    testimonials: [
        { name: "Sophie & Thomas", event: "Mariage 2025", text: "Magnifique travail, des émotions capturées à jamais.", rating: 5, image: "https://i.pravatar.cc/150?u=sophie" },
        { name: "Marie Dubois", event: "Baptême 2025", text: "Très discret et professionnel. Je recommande vivement.", rating: 5, image: "https://i.pravatar.cc/150?u=marie" }
    ],
    faq: [
        { question: "Quelle est votre zone d'intervention ?", answer: "Je me déplace dans toute la France et à l'international." },
        { question: "Quel est le délai de livraison ?", answer: "15 jours pour les photos, 6 semaines pour le film complet." },
        { question: "Peut-on personnaliser les packs ?", answer: "Absolument, contactez-moi pour un devis sur mesure." }
    ]
};

// 2. ÉTAT GLOBAL
let state = {
    selectedPack: null,
    selectedOptions: [],
    currentTestimonial: 0,
    theme: localStorage.getItem('theme') || 'light'
};

// 3. INITIALISATION
function init() {
    initBranding();
    initPacks();
    initOptions();
    initPortfolio();
    initTestimonials();
    initFAQ();
    initContactForm();
    initFooter();
    initTheme();
    initScrollAnimations();
    initMobileMenu();
    hideLoader();
}

function initBranding() {
    document.getElementById('site-logo').innerText = CONFIG.brand.name;
    document.getElementById('hero-title').innerText = CONFIG.brand.name;
    document.getElementById('hero-subtitle').innerText = CONFIG.brand.slogan;
}

// 4. PACKS & DEVIS
function initPacks() {
    const container = document.getElementById('packs-container');
    if (!container) return;
    container.innerHTML = CONFIG.packs.map(pack => `
        <div class="pack-card ${pack.popular ? 'popular' : ''}" onclick="selectPack(${pack.id})">
            ${pack.popular ? '<div class="pack-badge">POPULAIRE</div>' : ''}
            <h3>${pack.name}</h3>
            <p class="pack-description">${pack.description}</p>
            <div class="pack-price">${pack.price}€</div>
            <ul class="pack-features">${pack.features.map(f => `<li>${f}</li>`).join('')}</ul>
            <button class="btn-select">Choisir ce pack</button>
        </div>
    `).join('');
}

window.selectPack = function (id) {
    const pack = CONFIG.packs.find(p => p.id === id);
    state.selectedPack = pack;
    document.getElementById('display-pack-name').innerText = pack.name;
    document.querySelectorAll('.pack-card').forEach((c, i) => c.classList.toggle('active', CONFIG.packs[i].id === id));
    updateTotal();
};

function initOptions() {
    const container = document.getElementById('options-container');
    if (!container) return;
    container.innerHTML = CONFIG.options.map(opt => `
        <div class="option-item" onclick="toggleOption('${opt.id}')">
            <label>
                <input type="checkbox" id="opt-${opt.id}" ${state.selectedOptions.includes(opt.id) ? 'checked' : ''}>
                <span>${opt.name}</span>
            </label>
            <span>+${opt.price}€</span>
        </div>
    `).join('');
}

window.toggleOption = function (id) {
    const idx = state.selectedOptions.indexOf(id);
    if (idx > -1) state.selectedOptions.splice(idx, 1);
    else state.selectedOptions.push(id);
    const cb = document.getElementById(`opt-${id}`);
    if (cb) cb.checked = state.selectedOptions.includes(id);
    updateTotal();
};

function updateTotal() {
    let total = (state.selectedPack ? state.selectedPack.price : 0);
    state.selectedOptions.forEach(oid => {
        const opt = CONFIG.options.find(o => o.id === oid);
        if (opt) total += opt.price;
    });
    const el = document.getElementById('total-price');
    if (el) el.innerText = total + "€";
}

// 5. FONCTIONS RÉUTILISABLES
function initPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    grid.innerHTML = CONFIG.portfolio.map(item => `
        <div class="portfolio-item" onclick="openLightbox('${item.image}')">
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.category}</p>
            </div>
        </div>
    `).join('');
}

window.openLightbox = function (src) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    img.src = src;
    lb.classList.add('active');
};

window.closeLightbox = function () {
    document.getElementById('lightbox').classList.remove('active');
};

function initTestimonials() {
    const carousel = document.getElementById('testimonials-carousel');
    if (!carousel) return;
    carousel.innerHTML = CONFIG.testimonials.map((t, i) => `
        <div class="testimonial-card ${i === 0 ? 'active' : ''}">
            <img src="${t.image}" alt="${t.name}" class="testimonial-image">
            <p class="testimonial-text">"${t.text}"</p>
            <p><strong>${t.name}</strong> • ${t.event}</p>
        </div>
    `).join('');
    setInterval(() => {
        const cards = document.querySelectorAll('.testimonial-card');
        cards[state.currentTestimonial].classList.remove('active');
        state.currentTestimonial = (state.currentTestimonial + 1) % cards.length;
        cards[state.currentTestimonial].classList.add('active');
    }, 5000);
}

function initFAQ() {
    const container = document.getElementById('faq-container');
    if (!container) return;
    container.innerHTML = CONFIG.faq.map(item => `
        <div class="faq-item">
            <button class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                <span>${item.question}</span>
                <span class="faq-icon">▼</span>
            </button>
            <div class="faq-answer"><p>${item.answer}</p></div>
        </div>
    `).join('');
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('form-success').classList.add('show');
        form.reset();
        setTimeout(() => document.getElementById('form-success').classList.remove('show'), 4000);
    });
}

function initFooter() {
    const fn = document.getElementById('footer-name'); if (fn) fn.innerText = CONFIG.brand.name;
    const fe = document.getElementById('footer-email'); if (fe) fe.innerText = CONFIG.contact.email;
    const fp = document.getElementById('footer-phone'); if (fp) fp.innerText = CONFIG.contact.phone;
    const cy = document.getElementById('current-year'); if (cy) cy.innerText = new Date().getFullYear();
}

function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.innerText = state.theme === 'light' ? '🌙' : '☀️';
    btn.onclick = () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', state.theme);
        localStorage.setItem('theme', state.theme);
        btn.innerText = state.theme === 'light' ? '🌙' : '☀️';
    };
}

function initScrollAnimations() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

function initMobileMenu() {
    const tg = document.getElementById('menu-toggle');
    const lk = document.getElementById('nav-links');
    if (!tg) return;
    tg.onclick = () => { lk.classList.toggle('active'); };
}

function hideLoader() {
    const ld = document.getElementById('loader');
    if (ld) setTimeout(() => ld.classList.add('hidden'), 500);
}

window.generateLead = function () {
    if (!state.selectedPack) { alert('Veuillez choisir un pack.'); return; }
    window.location.href = `mailto:${CONFIG.contact.email}?subject=Devis ${CONFIG.brand.name}&body=Je souhaite réserver le ${state.selectedPack.name}. Total estimé : ${document.getElementById('total-price').innerText}`;
};

window.downloadPDF = function () {
    if (typeof html2pdf !== 'undefined') {
        html2pdf().from(document.getElementById('devis-result')).save('devis-photo.pdf');
    }
};

document.addEventListener('DOMContentLoaded', init);