/* ============================================================
   Soufiane EL RHADI — Portfolio
   - Filters & search (projects)
   - Scroll reveal (IntersectionObserver)
   - Smooth anchor scroll
   - Burger menu
   - Back-to-top button
   - Animated stat counters
   - Scroll progress bar
   - Navbar scrolled state
   - Subtle blob parallax
   ============================================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        wireFilters();
        wireScrollReveal();
        wireSmoothScroll();
        wireNavBurger();
        wireBackToTop();
        wireScrollProgress();
        wireNavbarScrolled();
        wireBlobParallax();
        wireProjectSearch();
        wireResetFilters();
        wireDynamicBackground();
        bootLucide();
    }

    /* --------------------------------------------------------
       Lucide icons : the CDN script is loaded with `defer`,
       so window.lucide may not exist when DOMContentLoaded
       fires. We poll briefly, then render.
       -------------------------------------------------------- */
    function bootLucide() {
        var attempts = 0;
        var max = 60;
        var iv = setInterval(function () {
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
                clearInterval(iv);
            } else if (++attempts > max) {
                clearInterval(iv);
            }
        }, 50);
    }

    /* --------------------------------------------------------
       State for filter + search combination
       -------------------------------------------------------- */
    var currentFilter = 'all';
    var currentSearch = '';

    function applyVisibility() {
        var cards = document.querySelectorAll('.project-card');
        var anyVisible = false;
        cards.forEach(function (card) {
            var cats = (card.getAttribute('data-category') || '').split(/\s+/);
            var search = (card.getAttribute('data-search') || '').toLowerCase()
                       + ' ' + (card.querySelector('h3') ? card.querySelector('h3').textContent.toLowerCase() : '')
                       + ' ' + (card.querySelector('p') ? card.querySelector('p').textContent.toLowerCase() : '');
            var matchFilter = currentFilter === 'all' || cats.indexOf(currentFilter) !== -1;
            var matchSearch = !currentSearch || search.indexOf(currentSearch) !== -1;
            if (matchFilter && matchSearch) {
                card.style.display = '';
                requestAnimationFrame(function () { card.classList.add('is-visible'); });
                anyVisible = true;
            } else {
                card.style.display = 'none';
            }
        });
        var empty = document.getElementById('projectsEmpty');
        if (empty) empty.hidden = anyVisible;
    }

    function wireFilters() {
        var filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                filterButtons.forEach(function (btn) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                currentFilter = button.getAttribute('data-filter');
                applyVisibility();
            });
        });
    }

    function wireProjectSearch() {
        var input = document.getElementById('projectSearch');
        if (!input) return;
        var debounce;
        input.addEventListener('input', function () {
            clearTimeout(debounce);
            debounce = setTimeout(function () {
                currentSearch = input.value.trim().toLowerCase();
                applyVisibility();
            }, 120);
        });
    }

    function wireResetFilters() {
        var btn = document.getElementById('resetFilters');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var input = document.getElementById('projectSearch');
            if (input) input.value = '';
            currentSearch = '';
            currentFilter = 'all';
            document.querySelectorAll('.filter-btn').forEach(function (b) {
                b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
                b.setAttribute('aria-selected', String(b.getAttribute('data-filter') === 'all'));
            });
            applyVisibility();
        });
    }

    /* --------------------------------------------------------
       IntersectionObserver — fade in sections + cards
       Also triggers stat counters & language bars
       -------------------------------------------------------- */
    function wireScrollReveal() {
        var targets = document.querySelectorAll(
            'section, .project-card, .expertise-card, .profil-card, .comp-card, .timeline-item, .contact-card'
        );
        targets.forEach(function (el) { el.classList.add('reveal'); });

        if (!('IntersectionObserver' in window)) {
            targets.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Trigger stat counters once when hero stats become visible
                    if (entry.target.id === 'hero') {
                        startCounters();
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(function (el) { observer.observe(el); });

        // Fallback : if hero is already in view at load, start counters immediately
        var hero = document.getElementById('hero');
        if (hero) {
            var rect = hero.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                setTimeout(startCounters, 200);
            }
        }
    }

    /* --------------------------------------------------------
       Animated stat counters
       -------------------------------------------------------- */
    var countersStarted = false;
    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        document.querySelectorAll('[data-counter]').forEach(function (el) {
            var target = parseInt(el.getAttribute('data-counter'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            var noformat = el.getAttribute('data-noformat') === '1';
            var duration = 1400;
            var start = performance.now();
            function tick(now) {
                var p = Math.min(1, (now - start) / duration);
                // ease-out cubic
                var eased = 1 - Math.pow(1 - p, 3);
                var v = Math.floor(eased * target);
                el.textContent = (noformat ? v : v.toLocaleString('fr-FR')) + suffix;
                if (p < 1) requestAnimationFrame(tick);
                else el.textContent = (noformat ? target : target.toLocaleString('fr-FR')) + suffix;
            }
            requestAnimationFrame(tick);
        });
    }

    /* --------------------------------------------------------
       Smooth scroll for in-page anchors (with navbar offset)
       -------------------------------------------------------- */
    function wireSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href === '#' || href.length < 2) return;
                var target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                var top = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: top, behavior: 'smooth' });

                var navbar = document.querySelector('.navbar');
                if (navbar && navbar.classList.contains('menu-open')) {
                    navbar.classList.remove('menu-open');
                    var burger = document.getElementById('navBurger');
                    if (burger) burger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    /* --------------------------------------------------------
       Mobile nav burger
       -------------------------------------------------------- */
    function wireNavBurger() {
        var burger = document.getElementById('navBurger');
        var navbar = document.querySelector('.navbar');
        if (!burger || !navbar) return;

        burger.addEventListener('click', function () {
            var open = navbar.classList.toggle('menu-open');
            burger.setAttribute('aria-expanded', String(open));
        });
    }

    /* --------------------------------------------------------
       Back to top button — appears after 600px scroll
       -------------------------------------------------------- */
    function wireBackToTop() {
        var btn = document.querySelector('.back-to-top');
        if (!btn) return;

        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                if (window.scrollY > 600) btn.classList.add('visible');
                else btn.classList.remove('visible');
                ticking = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* --------------------------------------------------------
       Scroll progress bar
       -------------------------------------------------------- */
    function wireScrollProgress() {
        var bar = document.getElementById('scrollProgressBar');
        if (!bar) return;
        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var h = document.documentElement;
                var scrolled = h.scrollTop;
                var max = h.scrollHeight - h.clientHeight;
                var p = max > 0 ? (scrolled / max) * 100 : 0;
                bar.style.width = p + '%';
                ticking = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* --------------------------------------------------------
       Navbar gets a "scrolled" class once the page scrolled
       past 50px — adds bottom border + opaque background
       -------------------------------------------------------- */
    function wireNavbarScrolled() {
        var navbar = document.querySelector('.navbar');
        if (!navbar) return;
        var ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
                ticking = false;
            });
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* --------------------------------------------------------
       Subtle blob parallax — moves background blobs slightly
       on mouse move (desktop only, respects reduced-motion)
       -------------------------------------------------------- */
    function wireBlobParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;
        var b1 = document.querySelector('.bg-blob--1');
        var b2 = document.querySelector('.bg-blob--2');
        if (!b1 || !b2) return;
        window.addEventListener('mousemove', function (e) {
            var x = (e.clientX / window.innerWidth - 0.5) * 30;
            var y = (e.clientY / window.innerHeight - 0.5) * 30;
            b1.style.transform = 'translate(' + (-x) + 'px,' + (-y) + 'px)';
            b2.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        }, { passive: true });
    }

    /* --------------------------------------------------------
       Dynamic Background based on time of day
       -------------------------------------------------------- */
    function wireDynamicBackground() {
        const hero = document.querySelector('.hero-dynamic-bg');
        if (!hero) return;

        function updateBackground(testHour) {
            const now = new Date();
            const hour = testHour !== undefined ? testHour : now.getHours();
            let period = 'day';

            if (hour >= 5 && hour < 10) period = 'morning';
            else if (hour >= 10 && hour < 14) period = 'day';
            else if (hour >= 14 && hour < 18) period = 'afternoon';
            else if (hour >= 18 && hour < 20) period = 'sunset';
            else if (hour >= 20 && hour < 23) period = 'evening';
            else period = 'night';

            // Update body attribute
            document.body.setAttribute('data-time', period);

            // Update CSS variable for the background image
            const bgUrl = `url('assets/backgrounds/background-${period}.webp')`;
            hero.style.setProperty('--hero-bg', bgUrl);

            console.log(`[DynamicBG] Time: ${hour}h, Period: ${period}`);
        }

        // Run immediately
        updateBackground();

        // Check every minute
        setInterval(updateBackground, 60000);

        // Expose to window for easy testing
        // Example: window.setPortfolioTime(21)
        window.setPortfolioTime = (h) => updateBackground(h);
    }
})();
