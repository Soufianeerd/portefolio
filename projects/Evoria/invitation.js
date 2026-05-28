/**
 * EVORIA — SaaS Faire-Part Digital Premium
 * invitation.js — Logique complète : intro, customiseur, Unsplash, RSVP, countdown, calendrier
 */

const UNSPLASH_ACCESS_KEY = '5wKdoMiPs6mPwJ4AYt7bfWg6Od8dS3blnMCNSChAnO8';

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════════════════════════════════════
    // 1. INTRO — ENVELOPPE SCELLÉE
    // ═══════════════════════════════════════════════════
    const seal = document.getElementById('introBtn');
    const screen = document.getElementById('introScreen');
    const main = document.getElementById('mainContent');
    const customizeBtn = document.getElementById('customizeBtn');

    // Apparition progressive du sceau
    setTimeout(() => {
        if (screen) screen.classList.add('ready');
    }, 600);

    // Force le scroll en haut au chargement
    window.scrollTo(0, 0);

    if (seal && screen && main) {
        seal.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'instant' });

            // Disparition du sceau
            seal.style.opacity = '0';
            seal.style.transform = 'scale(1.2)';

            // Ouverture de l'enveloppe
            setTimeout(() => {
                screen.classList.add('open');
                document.body.classList.remove('locked');

                // Révélation du contenu
                setTimeout(() => {
                    main.classList.add('revealed');
                    if (customizeBtn) customizeBtn.classList.add('force-show');

                    // Animation des éléments hero
                    const heroElements = main.querySelectorAll('.hero-premium .fade-in-up');
                    heroElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('is-visible');
                        }, 200 * index);
                    });
                }, 50);

                // Masquage de l'écran intro après transition
                setTimeout(() => {
                    screen.style.display = 'none';
                }, 1500);
            }, 300);
        });
    }

    // ═══════════════════════════════════════════════════
    // 2. ANIMATIONS AU SCROLL — INTERSECTION OBSERVER
    // ═══════════════════════════════════════════════════
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in-up').forEach(el => io.observe(el));

    // ═══════════════════════════════════════════════════
    // 3. COMPTE À REBOURS
    // ═══════════════════════════════════════════════════
    function updateCountdown() {
        const weddingDateEl = document.getElementById('customDateText');
        let targetDate = new Date('2026-06-13T14:00:00');

        // Si la date a été personnalisée, utiliser celle-là
        const custDateInput = document.getElementById('custDate');
        if (custDateInput && custDateInput.value) {
            targetDate = new Date(custDateInput.value + 'T14:00:00');
        }

        const now = new Date();
        const diff = targetDate - now;

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl) return;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(d).padStart(2, '0');
        hoursEl.textContent = String(h).padStart(2, '0');
        minutesEl.textContent = String(m).padStart(2, '0');
        secondsEl.textContent = String(s).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ═══════════════════════════════════════════════════
    // 4. MINI CALENDRIER
    // ═══════════════════════════════════════════════════
    function renderCalendar(year = 2026, month = 5, specialDay = 13) {
        // month est 0-indexé
        const grid = document.getElementById('calendarGrid');
        const header = document.getElementById('calendarHeader');
        if (!grid) return;

        const monthNames = ['JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN',
            'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'];
        const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

        if (header) header.textContent = `${monthNames[month]} ${year}`;

        grid.innerHTML = '';

        // Noms des jours
        dayNames.forEach(d => {
            const dayName = document.createElement('div');
            dayName.className = 'calendar-day-name';
            dayName.textContent = d;
            grid.appendChild(dayName);
        });

        // Premier jour du mois (0=dimanche, ajuster pour lundi=0)
        const firstDay = new Date(year, month, 1).getDay();
        const startOffset = (firstDay === 0) ? 6 : firstDay - 1;

        // Cases vides
        for (let i = 0; i < startOffset; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            grid.appendChild(empty);
        }

        // Jours du mois
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.textContent = d;

            const isToday = (d === today.getDate() && month === today.getMonth() && year === today.getFullYear());
            const isSpecial = d === specialDay;

            if (isSpecial) dayEl.classList.add('special-day');
            else if (isToday) dayEl.classList.add('today');

            grid.appendChild(dayEl);
        }
    }

    renderCalendar(2026, 5, 13); // Juin 2026 (mois 5 = juin), jour 13

    // ═══════════════════════════════════════════════════
    // 5. WIDGETS DÉMO
    // ═══════════════════════════════════════════════════
    const demoAlert = document.getElementById('demoAlert');
    const closeDemoAlert = document.getElementById('closeDemoAlert');
    const demoBtns = document.querySelectorAll('.demo-widget-btn');
    let demoAlertTimeout;

    function showDemoAlert() {
        if (!demoAlert) return;
        clearTimeout(demoAlertTimeout);
        demoAlert.classList.add('show');
        demoAlertTimeout = setTimeout(() => {
            demoAlert.classList.remove('show');
        }, 4500);
    }

    demoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showDemoAlert();
        });
    });

    if (closeDemoAlert) {
        closeDemoAlert.addEventListener('click', () => {
            demoAlert.classList.remove('show');
            clearTimeout(demoAlertTimeout);
        });
    }

    // ═══════════════════════════════════════════════════
    // 6. FORMULAIRE RSVP
    // ═══════════════════════════════════════════════════
    const rsvpForm = document.getElementById('rsvpForm');
    const successMessage = document.getElementById('successMessage');

    // Pré-remplissage démo
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    const presenceOui = document.querySelector('input[name="attendance"][value="oui"]');
    if (nameInput) nameInput.value = 'Jean Dupont';
    if (messageInput) messageInput.value = 'Félicitations ! Nous serons ravis de célébrer ce moment magique avec vous.';
    if (presenceOui) presenceOui.checked = true;

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Démo : afficher le message de succès
            rsvpForm.style.display = 'none';
            if (successMessage) successMessage.style.display = 'block';

            // Reset après 4 secondes pour la démo
            setTimeout(() => {
                rsvpForm.style.display = 'flex';
                if (successMessage) successMessage.style.display = 'none';
            }, 4000);
        });
    }

    // ═══════════════════════════════════════════════════
    // 7. PANNEAU DE PERSONNALISATION
    // ═══════════════════════════════════════════════════
    const customizePanel = document.getElementById('customizePanel');
    const closeCustomizePanel = document.getElementById('closeCustomizePanel');
    const resetCustomize = document.getElementById('resetCustomize');

    if (customizeBtn && customizePanel) {
        customizeBtn.addEventListener('click', () => {
            customizePanel.classList.toggle('open');
        });

        closeCustomizePanel?.addEventListener('click', () => {
            customizePanel.classList.remove('open');
        });
    }

    // Fermeture du panel en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        if (customizePanel && customizePanel.classList.contains('open')) {
            if (!customizePanel.contains(e.target) && e.target !== customizeBtn) {
                customizePanel.classList.remove('open');
            }
        }
    });

    // ─── Champs de personnalisation ────────────────────
    const custGroom = document.getElementById('custGroom');
    const custBride = document.getElementById('custBride');
    const custFamily1Input = document.getElementById('custFamily1');
    const custFamily2Input = document.getElementById('custFamily2');
    const custDate = document.getElementById('custDate');
    const custColorTheme = document.getElementById('custColorTheme');
    const custColorGold = document.getElementById('custColorGold');
    const custFontScript = document.getElementById('custFontScript');
    const custFontSerif = document.getElementById('custFontSerif');
    const custFontSans = document.getElementById('custFontSans');

    const coupleNamesEl = document.getElementById('customCoupleNames');
    const coupleNamesFooterEl = document.getElementById('customCoupleNamesFooter');
    const dateTextEl = document.getElementById('customDateText');
    const dateFooterEl = document.getElementById('customDateFooter');
    const family1El = document.getElementById('customFamily1');
    const family2El = document.getElementById('customFamily2');

    // Mise à jour des noms des mariés
    function updateCoupleNames() {
        const groom = custGroom?.value.trim() || 'Julien';
        const bride = custBride?.value.trim() || 'Amandine';
        const coupleText = `${groom} <span class="couple-amp">&amp;</span> ${bride}`;
        if (coupleNamesEl) coupleNamesEl.innerHTML = coupleText;
        if (coupleNamesFooterEl) coupleNamesFooterEl.innerHTML = `${groom} &amp; ${bride}`;
    }

    custGroom?.addEventListener('input', updateCoupleNames);
    custBride?.addEventListener('input', updateCoupleNames);

    // Mise à jour des familles
    custFamily1Input?.addEventListener('input', () => {
        if (family1El) family1El.textContent = custFamily1Input.value || 'Dumont & Lemaire';
    });

    custFamily2Input?.addEventListener('input', () => {
        if (family2El) family2El.textContent = custFamily2Input.value || 'Valois & Petit';
    });

    // Mise à jour de la date
    custDate?.addEventListener('change', () => {
        if (!custDate.value) return;
        const d = new Date(custDate.value + 'T12:00:00');
        const optionsLong = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const formattedLong = d.toLocaleDateString('fr-FR', optionsLong);
        const formattedShort = `${String(d.getDate()).padStart(2, '0')} · ${String(d.getMonth() + 1).padStart(2, '0')} · ${d.getFullYear()}`;

        const capitalizedLong = 'Le ' + formattedLong.charAt(0).toUpperCase() + formattedLong.slice(1);
        if (dateTextEl) dateTextEl.textContent = capitalizedLong;
        if (dateFooterEl) dateFooterEl.textContent = formattedShort;

        // Mettre à jour le calendrier
        renderCalendar(d.getFullYear(), d.getMonth(), d.getDate());
        updateCountdown();
    });

    // Couleur principale
    custColorTheme?.addEventListener('input', () => {
        document.documentElement.style.setProperty('--bordeaux', custColorTheme.value);
    });

    // Couleur accent
    custColorGold?.addEventListener('input', () => {
        document.documentElement.style.setProperty('--gold-sand', custColorGold.value);
    });

    // Typographie script (prénoms)
    custFontScript?.addEventListener('change', () => {
        document.documentElement.style.setProperty('--font-script', `'${custFontScript.value}', cursive`);
        loadGoogleFont(custFontScript.value);
    });

    // Typographie serif (titres)
    custFontSerif?.addEventListener('change', () => {
        document.documentElement.style.setProperty('--font-display', `'${custFontSerif.value}', serif`);
        loadGoogleFont(custFontSerif.value);
    });

    // Typographie sans (corps)
    custFontSans?.addEventListener('change', () => {
        document.documentElement.style.setProperty('--font-sans', `'${custFontSans.value}', sans-serif`);
        loadGoogleFont(custFontSans.value);
    });

    // Chargement dynamique des polices Google
    function loadGoogleFont(fontName) {
        const encoded = fontName.replace(/ /g, '+');
        const existing = document.querySelector(`link[data-gfont="${encoded}"]`);
        if (existing) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.setAttribute('data-gfont', encoded);
        link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700&display=swap`;
        document.head.appendChild(link);
    }

    // ─── Upload d'image locale ──────────────────────────
    const custBgInput = document.getElementById('custBg');
    const custDoorsInput = document.getElementById('custDoors');
    const progressBg = document.getElementById('progressBg');
    const progressDoors = document.getElementById('progressDoors');
    const statusBg = document.getElementById('statusBg');
    const statusDoors = document.getElementById('statusDoors');
    const bgOverlay = document.getElementById('customBgOverlay');
    const envelopeEl = document.getElementById('envelopeEl');

    function handleImageUpload(fileInput, progressEl, statusEl, target) {
        if (!fileInput) return;
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (progressEl) progressEl.style.width = '0%';
            if (statusEl) statusEl.textContent = 'Chargement…';

            const reader = new FileReader();
            reader.onprogress = (ev) => {
                if (ev.lengthComputable && progressEl) {
                    progressEl.style.width = `${(ev.loaded / ev.total) * 100}%`;
                }
            };
            reader.onload = (ev) => {
                if (progressEl) progressEl.style.width = '100%';
                if (statusEl) statusEl.textContent = '✓ Image appliquée';
                applyImageToTarget(ev.target.result, target);
                setTimeout(() => {
                    if (progressEl) progressEl.style.width = '0%';
                    if (statusEl) statusEl.textContent = '';
                }, 2500);
            };
            reader.readAsDataURL(file);
        });
    }

    function applyImageToTarget(src, target) {
        if (target === 'bgInvite' && bgOverlay) {
            bgOverlay.style.backgroundImage = `url('${src}')`;
            bgOverlay.style.opacity = '0.22';
        }
        if (target === 'bgDoors' && envelopeEl) {
            envelopeEl.style.backgroundImage = `url('${src}')`;
        }
    }

    handleImageUpload(custBgInput, progressBg, statusBg, 'bgInvite');
    handleImageUpload(custDoorsInput, progressDoors, statusDoors, 'bgDoors');

    // ─── Reset personnalisation ─────────────────────────
    resetCustomize?.addEventListener('click', () => {
        // Reset CSS vars
        document.documentElement.style.removeProperty('--bordeaux');
        document.documentElement.style.removeProperty('--gold-sand');
        document.documentElement.style.removeProperty('--font-script');
        document.documentElement.style.removeProperty('--font-display');
        document.documentElement.style.removeProperty('--font-sans');

        // Reset champs
        if (custGroom) custGroom.value = '';
        if (custBride) custBride.value = '';
        if (custFamily1Input) custFamily1Input.value = '';
        if (custFamily2Input) custFamily2Input.value = '';
        if (custDate) custDate.value = '';
        if (custColorTheme) custColorTheme.value = '#0E3D26';
        if (custColorGold) custColorGold.value = '#D4AF37';
        if (custFontScript) custFontScript.value = 'Great Vibes';
        if (custFontSerif) custFontSerif.value = 'Playfair Display';
        if (custFontSans) custFontSans.value = 'Montserrat';

        // Reset textes
        if (coupleNamesEl) coupleNamesEl.innerHTML = 'Julien <span class="couple-amp">&amp;</span> Amandine';
        if (coupleNamesFooterEl) coupleNamesFooterEl.innerHTML = 'Julien &amp; Amandine';
        if (dateTextEl) dateTextEl.textContent = 'Le samedi 13 Juin 2026';
        if (dateFooterEl) dateFooterEl.textContent = '13 · 06 · 2026';
        if (family1El) family1El.textContent = 'Dumont & Lemaire';
        if (family2El) family2El.textContent = 'Valois & Petit';

        // Reset image de fond
        if (bgOverlay) {
            bgOverlay.style.backgroundImage = "url('assets/fond-enveloppe.webp')";
            bgOverlay.style.opacity = '0.18';
        }

        // Reset calendrier
        renderCalendar(2026, 5, 13);
    });

    // ═══════════════════════════════════════════════════
    // 8. UNSPLASH SEARCH
    // ═══════════════════════════════════════════════════
    const unsplashSearchPanel = document.getElementById('unsplashSearchPanel');
    const closeUnsplashSearch = document.getElementById('closeUnsplashSearch');
    const unsplashQueryInput = document.getElementById('unsplashQuery');
    const unsplashSearchBtn = document.getElementById('unsplashSearchBtn');
    const unsplashResults = document.getElementById('unsplashResults');
    const unsplashLoadMore = document.getElementById('unsplashLoadMore');

    let currentUnsplashTarget = 'bgInvite';
    let currentUnsplashPage = 1;
    let currentUnsplashQuery = '';

    // Ouvrir le panel Unsplash
    document.querySelectorAll('.unsplash-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentUnsplashTarget = btn.getAttribute('data-target') || 'bgInvite';
            unsplashSearchPanel?.classList.add('open');
            unsplashQueryInput?.focus();

            // Réinitialiser les résultats
            if (unsplashResults) unsplashResults.innerHTML = '';
            if (unsplashLoadMore) unsplashLoadMore.style.display = 'none';
            currentUnsplashPage = 1;
            currentUnsplashQuery = '';
        });
    });

    // Fermer le panel Unsplash
    closeUnsplashSearch?.addEventListener('click', () => {
        unsplashSearchPanel?.classList.remove('open');
    });

    // Recherche Unsplash
    async function searchUnsplash(query, page = 1) {
        if (!query.trim()) return;

        if (page === 1) {
            if (unsplashResults) unsplashResults.innerHTML = '<div class="unsplash-loading">Recherche en cours…</div>';
            if (unsplashLoadMore) unsplashLoadMore.style.display = 'none';
        }

        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&page=${page}&orientation=landscape`,
                {
                    headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
                }
            );

            if (!response.ok) throw new Error('Erreur API Unsplash');
            const data = await response.json();

            if (page === 1) {
                if (unsplashResults) unsplashResults.innerHTML = '';
                if (data.results.length === 0) {
                    if (unsplashResults) unsplashResults.innerHTML = '<div class="unsplash-no-results">Aucun résultat. Essayez un autre mot-clé.</div>';
                    if (unsplashLoadMore) unsplashLoadMore.style.display = 'none';
                    return;
                }
            }

            data.results.forEach(photo => {
                const img = document.createElement('img');
                img.className = 'unsplash-img-thumb';
                img.src = photo.urls.small;
                img.alt = photo.alt_description || 'Photo Unsplash';
                img.loading = 'lazy';
                img.setAttribute('data-full', photo.urls.regular);
                img.setAttribute('data-id', photo.id);

                img.addEventListener('click', () => {
                    // Désélectionner les autres
                    document.querySelectorAll('.unsplash-img-thumb.selected').forEach(el => el.classList.remove('selected'));
                    img.classList.add('selected');

                    // Appliquer l'image
                    applyImageToTarget(photo.urls.regular, currentUnsplashTarget);

                    // Fermer le panel Unsplash après sélection
                    setTimeout(() => {
                        unsplashSearchPanel?.classList.remove('open');
                    }, 600);
                });

                if (unsplashResults) unsplashResults.appendChild(img);
            });

            // Bouton "Afficher plus"
            if (unsplashLoadMore) {
                if (data.total_pages > page) {
                    unsplashLoadMore.style.display = 'block';
                } else {
                    unsplashLoadMore.style.display = 'none';
                }
            }

        } catch (err) {
            console.error('Unsplash search error:', err);
            if (unsplashResults) {
                unsplashResults.innerHTML = '<div class="unsplash-no-results">Impossible de charger les images. Vérifiez votre connexion.</div>';
            }
        }
    }

    unsplashSearchBtn?.addEventListener('click', () => {
        currentUnsplashPage = 1;
        currentUnsplashQuery = unsplashQueryInput?.value || '';
        searchUnsplash(currentUnsplashQuery, 1);
    });

    unsplashQueryInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            currentUnsplashPage = 1;
            currentUnsplashQuery = unsplashQueryInput.value || '';
            searchUnsplash(currentUnsplashQuery, 1);
        }
    });

    unsplashLoadMore?.addEventListener('click', () => {
        currentUnsplashPage++;
        searchUnsplash(currentUnsplashQuery, currentUnsplashPage);
    });

});
