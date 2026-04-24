/**
 * nav.js — Burger Menu & Navbar Scroll Behaviour
 * Commun à toutes les pages Garage 2A
 */
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');

  // ── Scroll behaviour ──────────────────────────────────
  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Burger toggle ─────────────────────────────────────
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      if (isOpen) {
        mobileNav.classList.add('open');
        document.body.style.overflow = 'hidden';
      } else {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Scroll-reveal (Intersection Observer) ────────────
  const animItems = document.querySelectorAll('.animate-in');
  if (animItems.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animItems.forEach((el) => observer.observe(el));
  } else {
    animItems.forEach((el) => el.classList.add('visible'));
  }

  // ── Active nav link (anchor-based) ───────────────────
  const currentPath = window.location.pathname.split('/').pop() || '.../index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href === currentPath || (currentPath === '' && href === '.../index.html')) {
      a.classList.add('active');
    }
  });
})();
