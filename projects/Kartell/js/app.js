/* Kartell Nancy — app.js — Interactions premium */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ----- Header scroll effect ----- */
    var header = document.querySelector('.header');
    window.addEventListener('scroll', function () {
      header && header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    /* ----- Burger menu ----- */
    var burger = document.getElementById('burgerBtn');
    var nav    = document.getElementById('mainNav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      /* Fermer menu au clic sur un lien */
      nav.querySelectorAll('.nav__link').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('is-open');
          burger.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* ----- Scroll Reveal (IntersectionObserver) ----- */
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('revealed'); });
    }

    /* ----- Switcher Pièces Iconiques ----- */
    var thumbs     = document.querySelectorAll('.iconic__thumb');
    var mainImg    = document.querySelector('.iconic__main-img');
    var heroName   = document.querySelector('.iconic__name');
    var heroDesign = document.querySelector('.designer-name');
    var heroDesc   = document.querySelector('.iconic__desc');
    var heroPrice  = document.querySelector('.product-price');
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        if (mainImg)    mainImg.src             = this.dataset.img      || '';
        if (heroName)   heroName.textContent    = this.dataset.name     || '';
        if (heroDesign) heroDesign.textContent  = this.dataset.designer || '';
        if (heroDesc)   heroDesc.textContent    = this.dataset.desc     || '';
        if (heroPrice && this.dataset.price)    heroPrice.textContent   = this.dataset.price;
      });
    });

    /* ----- Modale Mentions Légales ----- */
    var modal    = document.getElementById('legalModal');
    var openBtn  = document.getElementById('legalOpenBtn');
    var closeBtn = document.getElementById('legalClose');
    var overlay  = modal ? modal.querySelector('.modal__overlay') : null;

    function openModal()  { if (!modal) return; modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
    function closeModal() { if (!modal) return; modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

    if (openBtn)  openBtn.addEventListener('click',  function(e){ e.preventDefault(); openModal(); });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay)  overlay.addEventListener('click',  closeModal);
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

    /* ----- Empêcher href="#" de remonter ----- */
    document.querySelectorAll('a[href="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) { e.preventDefault(); });
    });

    /* ----- Bouton Retour en haut ----- */
    var backToTop = document.getElementById('backToTop');
    if (backToTop) {
      window.addEventListener('scroll', function () {
        backToTop.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ----- Newsletter form ----- */
    var newsletterForm = document.querySelector('.newsletter__form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = this.querySelector('.newsletter__input');
        if (input && input.value) {
          input.value = '';
          input.placeholder = 'Merci pour votre inscription !';
          setTimeout(function () { input.placeholder = 'VOTRE ADRESSE E-MAIL'; }, 3000);
        }
      });
    }

  });
})();
