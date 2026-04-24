/**
 * KARTELL NANCY — FLAGSHIP STORE
 * main.js — Luxe Éditorial Italien 2026
 * Vanilla JS (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {



    // ===== STICKY HEADER & SCROLL EFFECTS =====
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Header transition
        if (scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });


    // ===== MOBILE MENU =====
    const burgerBtn = document.getElementById('burgerBtn');
    const nav = document.getElementById('mainNav');

    if (burgerBtn && nav) {
        burgerBtn.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('nav--open');
            burgerBtn.classList.toggle('is-active');
            burgerBtn.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        nav.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav--open');
                burgerBtn.classList.remove('is-active');
                document.body.style.overflow = '';
            });
        });
    }


    // ===== SCROLL REVEAL (Intersection Observer) =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal--visible');
                // Optional: stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));


    // ===== ICONIC PRODUCTS / THUMB SWITCHER =====
    const iconicThumbs = document.querySelectorAll('.iconic__thumb');
    const mainVisual = document.querySelector('.iconic__hero-visual img');
    const mainName = document.querySelector('.iconic__name');
    const mainDesc = document.querySelector('.iconic__desc');
    const mainDesigner = document.querySelector('.designer-name');

    if (iconicThumbs.length && mainVisual) {
        iconicThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Remove active class from all
                iconicThumbs.forEach(t => t.classList.remove('active'));
                // Add to clicked
                thumb.classList.add('active');

                // Update content with fade effect
                const content = {
                    img: thumb.dataset.img,
                    name: thumb.dataset.name,
                    desc: thumb.dataset.desc,
                    designer: thumb.dataset.designer
                };

                // Simple transition
                mainVisual.style.opacity = 0;
                mainName.style.opacity = 0;

                setTimeout(() => {
                    if (content.img) mainVisual.src = content.img;
                    mainName.textContent = content.name;
                    mainDesc.textContent = content.desc;
                    mainDesigner.textContent = content.designer;

                    mainVisual.style.opacity = 1;
                    mainName.style.opacity = 1;
                }, 300);
            });
        });
    }


    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offset = header.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ===== MODAL MENTIONS LÉGALES =====
    const legalOpenBtn = document.getElementById('legalOpenBtn');
    const legalModal = document.getElementById('legalModal');
    const legalClose = document.getElementById('legalClose');

    if (legalOpenBtn && legalModal && legalClose) {
        const openModal = () => {
            legalModal.classList.add('modal--open');
            legalModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            legalModal.classList.remove('modal--open');
            legalModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        legalOpenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });

        legalClose.addEventListener('click', closeModal);
        legalModal.querySelector('.modal__overlay').addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && legalModal.classList.contains('modal--open')) {
                closeModal();
            }
        });
    }


    // ===== BACK TO TOP =====
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('back-to-top--visible');
            } else {
                backToTopBtn.classList.remove('back-to-top--visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.querySelector('.newsletter__form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const btn = newsletterForm.querySelector('button');
            
            if (input.value) {
                const originalText = btn.textContent;
                btn.textContent = 'MERCI';
                input.value = '';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 3000);
            }
        });
    }

});
