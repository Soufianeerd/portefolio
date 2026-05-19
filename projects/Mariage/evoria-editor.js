/**
 * EVORIA EDITOR - VERSION PREMIUM FINALE
 * Restauration complète des fonctionnalités avec correction du fond global.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- INJECT CSS ---
    const style = document.createElement('style');
    style.innerHTML = `
        .evoria-editor {
            position: fixed; right: 0; top: 0; width: 400px; height: 100vh;
            background: #fff; border-left: 1px solid rgba(0,0,0,0.1);
            box-shadow: -10px 0 50px rgba(0,0,0,0.2);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(100%);
            z-index: 9999; display: flex; flex-direction: column;
            color: #111; font-family: 'Montserrat', sans-serif;
        }
        .evoria-editor.active { transform: translateX(0); }
        
        .editor-toggle {
            position: fixed; right: 20px; top: 20px; width: 55px; height: 55px;
            background: #7A1F2B; color: white; border-radius: 50%;
            display: flex; justify-content: center; align-items: center;
            cursor: pointer; font-size: 1.5rem; box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            border: 2px solid white; z-index: 10000;
            transition: transform 0.3s ease, right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .evoria-editor.active .editor-toggle { right: 425px; }
        .editor-toggle:hover { transform: scale(1.1) rotate(30deg); }

        .editor-header { padding: 25px 20px; background: #fff; border-bottom: 1px solid #eee; }
        .editor-header h3 { margin: 0 0 5px 0; font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #111; }
        .editor-header p { margin: 0; font-size: 0.8rem; color: #666; }
        
        .editor-scroll { overflow-y: auto; flex: 1; padding-bottom: 40px; }
        
        /* Accordions */
        .editor-accordion { border-bottom: 1px solid #eee; }
        .accordion-header { 
            padding: 18px 20px; background: #fafafa; cursor: pointer; 
            font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;
            display: flex; justify-content: space-between; align-items: center;
        }
        .accordion-header:hover { background: #f0f0f0; }
        .accordion-content { padding: 20px; display: none; background: #fff; }
        .editor-accordion.active .accordion-content { display: block; }
        
        /* Image Cards */
        .img-card { border: 1px solid #eee; padding: 15px; border-radius: 10px; margin-bottom: 20px; background: #fcfcfc; }
        .img-card h5 { margin: 0 0 8px 0; font-size: 0.95rem; color: #111; font-family: 'Playfair Display', serif; }
        .img-card p.desc { font-size: 0.75rem; color: #777; margin: 0 0 15px 0; line-height: 1.4; }
        
        .flex-row { display: flex; gap: 8px; margin-bottom: 10px; }
        .img-card input[type="text"] {
            flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 6px;
            background: #fff; font-family: inherit; font-size: 0.85rem; box-sizing: border-box;
        }
        .btn-small { padding: 10px 15px; background: #111; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: 600; }
        
        .search-results { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
        .search-thumb { width: 100%; height: 70px; object-fit: cover; border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: 0.2s; }
        .search-thumb:hover { border-color: #7A1F2B; transform: scale(1.05); }
        
        .btn-reset-img { width: 100%; padding: 8px; background: transparent; border: 1px solid #ddd; color: #999; border-radius: 6px; cursor: pointer; font-size: 0.7rem; margin-top: 8px; }
        .btn-reset-img:hover { color: #555; background: #f5f5f5; }

        /* Controls */
        .editor-group { margin-bottom: 20px; }
        .editor-group label { display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; color: #444; }
        .editor-group input[type="text"], .editor-group select {
            width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; font-family: inherit; font-size: 0.9rem;
        }
        
        .color-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .color-row span { font-size: 0.85rem; color: #333; }
        .color-row input[type="color"] { border: 1px solid #ddd; width: 40px; height: 40px; border-radius: 6px; cursor: pointer; padding: 0; }
        
        .checkbox-row { display: flex; align-items: center; margin-bottom: 12px; font-size: 0.9rem; cursor: pointer; }
        .checkbox-row input { margin-right: 12px; width: 18px; height: 18px; }

        .editor-actions { padding: 20px; background: #fff; border-top: 1px solid #eee; }
        .btn-editor { width: 100%; padding: 15px; background: #111; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; }
    `;
    document.head.appendChild(style);

    // --- CONFIG ---
    const UNSPLASH_KEY = "5wKdoMiPs6mPwJ4AYt7bfWg6Od8dS3blnMCNSChAnO8";
    const STATE_KEY = 'evoria_premium_vFinal';

    const defaultImages = {
        global: { src: 'url("assets/texture-porte.png")' },
        doors: { src: 'url("assets/fond-ivoire-oriental.jpg")' }
    };

    let state = {
        texts: {},
        colors: { 
            '--bordeaux': '#7A1F2B', 
            '--color-title': '#2d1214', 
            '--color-couple': '#D4B07B', 
            '--color-family': '#5D1A23', 
            '--color-body': '#9a7c7e', 
            '--color-countdown-bg': '#7A1F2B',
            '--color-countdown-text': '#ffffff', 
            '--color-button-text': '#ffffff', 
            '--gold-sand': '#D4B07B' 
        },
        fonts: { '--font-titles': "'Cormorant Garamond', serif", '--font-couple': "'Playfair Display', serif", '--font-body': "'Montserrat', sans-serif", '--font-quote': "'Cormorant Garamond', serif" },
        images: JSON.parse(JSON.stringify(defaultImages)),
        sectionImages: {
            hero: { src: 'none' },
            quote: { src: 'none' },
            program: { src: 'none' },
            countdown: { src: 'none' },
            rsvp: { src: 'none' }
        },
        sections: { hero: true, quote: true, program: true, countdown: true, souvenirs: true, rsvp: true, 'infos-pratiques': false }
    };

    // Load state
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
        // Ensure images keys exist
        state.images = { ...defaultImages, ...parsed.images };
        state.sectionImages = { ...state.sectionImages, ...parsed.sectionImages };
    }

    // --- APPLICATION ---
    const applyDesign = () => {
        // Couleurs & Polices
        Object.entries(state.colors).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
        document.documentElement.style.setProperty('--color-button-bg', state.colors['--bordeaux']);
        Object.entries(state.fonts).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));

        // 1. Fond Global (Zéro répétition, Zéro porte, Contraste Max)
        const basmala = document.querySelector('.hero__basmala-img');
        const wrapper = document.querySelector('.hero__basmala-wrapper');
        
        let bgOverlay = document.getElementById('evoria-bg-fix');
        if (!bgOverlay) {
            bgOverlay = document.createElement('div');
            bgOverlay.id = 'evoria-bg-fix';
            Object.assign(bgOverlay.style, {
                position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
                zIndex: '-1', backgroundSize: 'cover', backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat', display: 'none'
            });
            document.body.prepend(bgOverlay);
            
            const tint = document.createElement('div');
            Object.assign(tint.style, {
                position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.65)' 
            });
            bgOverlay.appendChild(tint);

            // Tuer les pseudo-éléments (portes, textures) via une classe CSS injectée
            const s = document.createElement('style');
            s.id = 'kill-pseudos-style';
            s.innerHTML = `.global-bg-active *:before, .global-bg-active *:after { background-image: none !important; display: none !important; }`;
            document.head.appendChild(s);
        }

        if (state.images.global.src !== 'none') {
            bgOverlay.style.display = 'block';
            bgOverlay.style.setProperty('background-image', state.images.global.src, 'important');
            document.body.classList.add('global-bg-active');
            
            document.querySelectorAll('body, .main-content, section, .hero-premium, .container').forEach(el => {
                el.style.setProperty('background-image', 'none', 'important');
                el.style.setProperty('background-color', 'transparent', 'important');
            });

            if (basmala) basmala.style.setProperty('display', 'none', 'important');
            if (wrapper) wrapper.style.setProperty('display', 'none', 'important');
        } else {
            bgOverlay.style.display = 'none';
            document.body.classList.remove('global-bg-active');
            document.querySelectorAll('body, .main-content, section, .hero-premium, .container').forEach(el => {
                el.style.backgroundImage = ''; el.style.backgroundColor = '';
            });
            if (basmala) basmala.style.display = 'block';
            if (wrapper) wrapper.style.display = 'block';
        }

        // 1.1 Sections Backgrounds (Overriding global if set)
        Object.entries(state.sectionImages || {}).forEach(([id, img]) => {
            const el = document.querySelector(sectionMap[id]);
            if (el) {
                if (img.src !== 'none') {
                    el.style.setProperty('background-image', img.src, 'important');
                    el.style.setProperty('background-color', 'transparent', 'important');
                    el.style.setProperty('background-blend-mode', 'normal', 'important');
                } else if (state.images.global.src !== 'none') {
                    el.style.setProperty('background-image', 'none', 'important');
                    el.style.setProperty('background-color', 'transparent', 'important');
                } else {
                    el.style.backgroundImage = '';
                    el.style.backgroundColor = '';
                }
            }
        });

        // 2. Portes
        document.querySelectorAll('.door').forEach(el => {
            if (state.images.doors.src !== 'none') {
                el.style.backgroundImage = state.images.doors.src;
                el.style.backgroundSize = '200% 100%';
            }
        });

        // 5. Sceau
        const sealEl = document.querySelector('.intro-seal');
        if (sealEl) {
            sealEl.src = state.images.seal.src;
            sealEl.style.filter = state.images.seal.filter || 'none';
        }

        // Textes & Sections
        Object.entries(state.texts).forEach(([k, v]) => {
            const el = document.querySelector(`[data-editable="${k}"]`);
            if (el) el.innerText = v;
        });
        const sectionMap = { hero: '.hero-premium', quote: '#histoire', program: '#parcours', countdown: '#compte-a-rebours', souvenirs: '#souvenirs', rsvp: '#rsvp', 'infos-pratiques': '#infos-pratiques' };
        Object.entries(state.sections).forEach(([id, vis]) => {
            const el = document.querySelector(sectionMap[id]);
            if (el) vis ? el.classList.remove('hidden-section') : el.classList.add('hidden-section');
        });

        // Sync boutons
        document.querySelectorAll('.btn, .itinerary-btn, button[type="submit"]').forEach(el => {
            el.style.backgroundColor = 'var(--color-button-bg)';
            el.style.color = 'var(--color-button-text)';
        });

        // Sync Compte à rebours
        document.querySelectorAll('.countdown-section').forEach(el => {
            if (state.colors['--color-countdown-bg']) {
                el.style.setProperty('background-color', state.colors['--color-countdown-bg'], 'important');
            }
        });
        document.querySelectorAll('.countdown__timer-value, .countdown__timer-label, .countdown__title, .countdown__subtitle, .countdown-section *').forEach(el => {
            if (state.colors['--color-countdown-text']) {
                el.style.setProperty('color', state.colors['--color-countdown-text'], 'important');
            }
        });
    };

    const saveState = () => { localStorage.setItem(STATE_KEY, JSON.stringify(state)); applyDesign(); };

    // --- UI BUILDER ---
    const buildUI = () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="editor-toggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </div>
            <div class="evoria-editor">
                <div class="editor-header"><h3>Configurateur Premium</h3><p>Design Quiet Luxury</p></div>
                <div class="editor-scroll">
                    <div class="editor-accordion active">
                        <div class="accordion-header">📸 Images Unsplash <span>+</span></div>
                        <div class="accordion-content">
                            ${renderImageCard('Fond Global (Toute la page)', 'global', "Remplace l'arrière-plan de toute l'invitation.")}
                            ${renderImageCard('Portes', 'doors', "Texture des portes d'entrée.")}
                        </div>
                    </div>
                    <div class="editor-accordion">
                        <div class="accordion-header">🖼️ Fonds par Section <span>+</span></div>
                        <div class="accordion-content">
                            ${renderSectionImageCard('Accueil (Hero)', 'hero', "Fond spécifique pour l'accueil.")}
                            ${renderSectionImageCard('Citation / Duaa', 'quote', "Fond spécifique pour la section Citation.")}
                            ${renderSectionImageCard('Programme', 'program', "Fond spécifique pour le programme.")}
                            ${renderSectionImageCard('Compte à rebours', 'countdown', "Fond spécifique pour le compte à rebours.")}
                            ${renderSectionImageCard('RSVP', 'rsvp', "Fond spécifique pour le formulaire.")}
                        </div>
                    </div>
                    <div class="editor-accordion">
                        <div class="accordion-header">🎨 Couleurs <span>+</span></div>
                        <div class="accordion-content">
                            ${renderColorControl('Couleur Dominante & Boutons', '--bordeaux')}
                            ${renderColorControl('Accent Doré', '--gold-sand')}
                            ${renderColorControl('Titres', '--color-title')}
                            ${renderColorControl('Paragraphes', '--color-body')}
                            ${renderColorControl('Fond Compte à rebours', '--color-countdown-bg')}
                            ${renderColorControl('Texte Compte à rebours', '--color-countdown-text')}
                        </div>
                    </div>
                    <div class="editor-accordion">
                        <div class="accordion-header">✍️ Typographies <span>+</span></div>
                        <div class="accordion-content">
                            ${renderFontControl('Titres', '--font-titles')}
                            ${renderFontControl('Paragraphes', '--font-body')}
                        </div>
                    </div>
                    <div class="editor-accordion">
                        <div class="accordion-header">👁️ Visibilité <span>+</span></div>
                        <div class="accordion-content">
                            ${renderSectionToggle('hero', 'Hero / Accueil')}
                            ${renderSectionToggle('quote', 'Citation / Duaa')}
                            ${renderSectionToggle('program', 'Programme')}
                            ${renderSectionToggle('countdown', 'Compte à rebours')}
                            ${renderSectionToggle('souvenirs', 'Souvenirs (Livre d\'Or / Photos)')}
                            ${renderSectionToggle('rsvp', 'Formulaire RSVP')}
                        </div>
                    </div>
                </div>
                <div class="editor-actions"><button class="btn-editor" id="btn-reset-all">Reset Global</button></div>
            </div>
        `;
        document.body.appendChild(container);

        const editor = container.querySelector('.evoria-editor');
        const toggle = container.querySelector('.editor-toggle');
        toggle.onclick = () => editor.classList.toggle('active');
        editor.querySelectorAll('.accordion-header').forEach(h => h.onclick = () => h.parentElement.classList.toggle('active'));
        
        // Search Logic
        editor.querySelectorAll('.img-card').forEach(card => {
            const key = card.dataset.imgKey;
            const btn = card.querySelector('.btn-search');
            const input = card.querySelector('.img-search');
            const results = card.querySelector('.search-results');
            let currentPage = 1;

            const performSearch = (page = 1) => {
                const q = input.value.trim(); if(!q) return;
                fetch(`https://api.unsplash.com/search/photos?query=${q}&client_id=${UNSPLASH_KEY}&per_page=8&page=${page}`)
                    .then(r => r.json()).then(d => {
                        if (page === 1) results.innerHTML = '';
                        
                        // Bouton "Voir Plus"
                        const existingMore = card.querySelector('.btn-more');
                        if (existingMore) existingMore.remove();

                        d.results.forEach(img => {
                            const i = document.createElement('img'); i.src = img.urls.thumb; i.className = 'search-thumb';
                            i.onclick = () => {
                                state.images[key].src = (key === 'seal') ? img.urls.regular : `url('${img.urls.regular}')`;
                                saveState();
                            };
                            results.appendChild(i);
                        });

                        if (d.total_pages > page) {
                            const more = document.createElement('button');
                            more.innerText = "Afficher d'autres images";
                            more.className = 'btn-reset-img btn-more';
                            more.style.borderColor = '#7A1F2B';
                            more.style.color = '#7A1F2B';
                            more.onclick = () => performSearch(page + 1);
                            card.appendChild(more);
                        }
                    });
            };

            btn.onclick = () => { currentPage = 1; performSearch(1); };
            card.querySelector('.btn-reset-img').onclick = () => { state.images[key] = JSON.parse(JSON.stringify(defaultImages[key])); saveState(); };
        });

        // Section Search Logic
        editor.querySelectorAll('.section-img-card').forEach(card => {
            const key = card.dataset.sectionKey;
            const btn = card.querySelector('.btn-search');
            const input = card.querySelector('.img-search');
            const results = card.querySelector('.search-results');
            
            btn.onclick = () => {
                const q = input.value.trim(); if(!q) return;
                fetch(`https://api.unsplash.com/search/photos?query=${q}&client_id=${UNSPLASH_KEY}&per_page=8`)
                    .then(r => r.json()).then(d => {
                        results.innerHTML = '';
                        d.results.forEach(img => {
                            const i = document.createElement('img'); i.src = img.urls.thumb; i.className = 'search-thumb';
                            i.onclick = () => {
                                state.sectionImages[key].src = `url('${img.urls.regular}')`;
                                saveState();
                            };
                            results.appendChild(i);
                        });
                    });
            };
            card.querySelector('.btn-reset-img').onclick = () => { state.sectionImages[key].src = 'none'; saveState(); };
        });

        editor.querySelectorAll('input[type="color"]').forEach(i => i.oninput = (e) => { state.colors[e.target.dataset.colorKey] = e.target.value; saveState(); });
        editor.querySelectorAll('select').forEach(s => s.onchange = (e) => { state.fonts[e.target.dataset.fontKey] = e.target.value; saveState(); });
        editor.querySelectorAll('.section-toggle').forEach(c => c.onchange = (e) => { state.sections[e.target.dataset.sectionId] = e.target.checked; saveState(); });

        document.getElementById('btn-reset-all').onclick = () => { localStorage.clear(); window.location.reload(); };
    };

    const renderImageCard = (title, key, desc) => `
        <div class="img-card" data-img-key="${key}">
            <h5>${title}</h5><p class="desc">${desc}</p>
            <div class="flex-row"><input type="text" class="img-search" placeholder="fleur, forêt..."><button class="btn-small btn-search">OK</button></div>
            <div class="search-results"></div>
            <button class="btn-reset-img">Réinitialiser</button>
        </div>
    `;

    const renderColorControl = (label, key) => `
        <div class="color-row"><span>${label}</span><input type="color" data-color-key="${key}" value="${state.colors[key]}"></div>
    `;

    const renderFontControl = (label, key) => `
        <div class="editor-group"><label>${label}</label>
            <select data-font-key="${key}">
                <option value="'Cormorant Garamond', serif" ${state.fonts[key].includes('Cormorant') ? 'selected' : ''}>Cormorant (Classique)</option>
                <option value="'Playfair Display', serif" ${state.fonts[key].includes('Playfair') ? 'selected' : ''}>Playfair (Élégant)</option>
                <option value="'Montserrat', sans-serif" ${state.fonts[key].includes('Montserrat') ? 'selected' : ''}>Montserrat (Moderne)</option>
            </select>
        </div>
    `;

    const renderSectionToggle = (id, label) => `
        <label class="checkbox-row"><input type="checkbox" class="section-toggle" data-section-id="${id}" ${state.sections[id] ? 'checked' : ''}> ${label}</label>
    `;

    const renderSectionImageCard = (title, key, desc) => `
        <div class="img-card section-img-card" data-section-key="${key}">
            <h5>${title}</h5><p class="desc">${desc}</p>
            <div class="flex-row"><input type="text" class="img-search" placeholder="nature, texture..."><button class="btn-small btn-search">OK</button></div>
            <div class="search-results"></div>
            <button class="btn-reset-img">Réinitialiser (Auto)</button>
        </div>
    `;

    buildUI();
    applyDesign();
});
