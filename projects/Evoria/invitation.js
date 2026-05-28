document.addEventListener('DOMContentLoaded', () => {
    const seal = document.getElementById('introBtn');
    const screen = document.getElementById('introScreen');
    const main = document.getElementById('mainContent');

    // 1. APPARITION PROGRESSIVE DE L'ENVELOPPE AU CHARGEMENT
    setTimeout(() => {
        if (screen) screen.classList.add('ready');
    }, 500);

    if (seal && screen && main) {
        seal.addEventListener('click', () => {
            // Force le retour en haut
            window.scrollTo({ top: 0, behavior: 'instant' });

            // 2. DISPARITION DU SCEAU
            seal.style.opacity = '0';
            seal.style.transform = 'scale(1.2)';
            
            // 3. OUVERTURE DES PORTES
            setTimeout(() => {
                screen.classList.add('open');
                document.body.classList.remove('locked');
                
                // 4. RÉVÉLATION ÉCHELONNÉE DU CONTENU (Instantané pour éviter l'écran blanc)
                setTimeout(() => {
                    main.classList.add('revealed');
                    
                    const heroElements = main.querySelectorAll('.hero-premium .fade-in-up');
                    heroElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('is-visible');
                        }, 250 * index); // 250ms pour un enchaînement fluide
                    });
                }, 50); // Presque immédiat
                
                setTimeout(() => {
                    screen.style.display = 'none';
                }, 2000); 
            }, 400);
        });
    }

    // Force le retour en haut au chargement de la page
    window.onload = () => {
        window.scrollTo(0, 0);
    };

    // --- INTERSECTION OBSERVER POUR ANIMATIONS AU SCROLL ---
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in-up').forEach(el => io.observe(el));

    // --- GESTION DES WIDGETS DE DÉMO ---
    const demoAlert = document.getElementById('demoAlert');
    const closeDemoAlert = document.getElementById('closeDemoAlert');
    const demoBtns = document.querySelectorAll('.demo-widget-btn');

    let demoAlertTimeout;
    function showDemoAlert() {
        if (demoAlert) {
            clearTimeout(demoAlertTimeout);
            demoAlert.classList.add('show');
            demoAlertTimeout = setTimeout(() => {
                demoAlert.classList.remove('show');
            }, 4000);
        }
    }

    if (demoBtns) {
        demoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                showDemoAlert();
            });
        });
    }

    if (closeDemoAlert && demoAlert) {
        closeDemoAlert.addEventListener('click', () => {
            demoAlert.classList.remove('show');
        });
    }

    // --- PRÉ-REMPLISSAGE DU FORMULAIRE POUR LA DÉMO ---
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const presenceOui = document.querySelector('input[name="attendance"][value="oui"]');

    if (nameInput) nameInput.value = "Jean Dupont";
    if (emailInput) emailInput.value = ""; // Let the user type their email directly
    if (messageInput) messageInput.value = "Félicitations aux futurs mariés ! Nous sommes extrêmement heureux de pouvoir célébrer ce moment magique à vos côtés.";
    if (presenceOui) presenceOui.checked = true;

    // --- GESTION FORMULAIRE RSVP (DÉMO DUAL EMAIL VIA FORMSUBMIT) ---
    const rsvpForm = document.getElementById('rsvpForm');
    const successMsg = document.getElementById('successMessage');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const presenceEl = document.querySelector('input[name="attendance"]:checked');
            if (!presenceEl) {
                alert("Veuillez indiquer votre présence.");
                return;
            }

            const testerEmail = document.getElementById('email').value.trim();
            const testerName = document.getElementById('name').value.trim();
            const presenceVal = presenceEl.value;
            const messageVal = document.getElementById('message').value.trim();

            const btn = rsvpForm.querySelector('.btn');
            if (btn) {
                btn.disabled = true;
                btn.innerText = "ENVOI EN COURS...";
            }

            // Création des iframes cachées pour la soumission CORS-safe (fonctionne en local file:///)
            const iframe1 = document.createElement('iframe');
            iframe1.name = 'iframe_invite';
            iframe1.style.display = 'none';
            document.body.appendChild(iframe1);

            const iframe2 = document.createElement('iframe');
            iframe2.name = 'iframe_rsvp';
            iframe2.style.display = 'none';
            document.body.appendChild(iframe2);

            // Formulaire 1 : Invitation (Heureux de vous retrouver)
            const form1 = document.createElement('form');
            form1.method = 'POST';
            form1.action = `https://formsubmit.co/${testerEmail}`;
            form1.target = 'iframe_invite';
            form1.style.display = 'none';

            const fields1 = {
                "Invitation": "Julien & Amandine",
                "Message": "Heureux de vous retrouver parmi nous pour célébrer notre union !",
                "Célébration": "Le samedi 13 Juin 2026 à 14h00.",
                "Lieu Mairie": "Mairie de Bordeaux (Place Pey Berland, 33000 Bordeaux)",
                "Lieu Réception": "Château Pape Clément (216 Avenue Nancel Penard, 33600 Pessac)",
                "_subject": "Julien & Amandine — Heureux de vous retrouver parmi nous !",
                "_captcha": "false",
                "_template": "box"
            };

            for (const key in fields1) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fields1[key];
                form1.appendChild(input);
            }
            document.body.appendChild(form1);

            // Formulaire 2 : Confirmation de présence (RSVP)
            const form2 = document.createElement('form');
            form2.method = 'POST';
            form2.action = `https://formsubmit.co/${testerEmail}`;
            form2.target = 'iframe_rsvp';
            form2.style.display = 'none';

            const fields2 = {
                "Confirmation de Présence": "Réponse RSVP enregistrée",
                "Nom & Prénom": testerName,
                "Email du convive": testerEmail,
                "Présence": presenceVal === "oui" ? "Je serai présent(e) ! ✨" : "Je serai absent(e) 😔",
                "Message pour les mariés": messageVal || "Aucun message.",
                "_subject": "Julien & Amandine — Confirmation de votre présence (RSVP)",
                "_captcha": "false",
                "_template": "box"
            };

            for (const key in fields2) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fields2[key];
                form2.appendChild(input);
            }
            document.body.appendChild(form2);

            // Déclenchement de la soumission du premier formulaire
            form1.submit();

            // Attente légère pour sérialiser l'envoi réseau du second formulaire
            setTimeout(() => {
                form2.submit();

                rsvpForm.style.display = 'none';
                if (successMsg) {
                    successMsg.innerHTML = `
                        <p style="font-family: var(--font-serif); font-size: 1.5rem; font-style: italic; color: var(--bordeaux); margin-bottom: 1rem;">
                            Merci ! Vos réponses de démonstration ont bien été envoyées. ✨
                        </p>
                        <p style="font-family: var(--font-serif); font-size: 1rem; color: var(--muted); line-height: 1.5; max-width: 450px; margin: 0 auto; text-align: center;">
                            <strong>Important pour le test :</strong> S'il s'agit de votre premier essai avec cette adresse, vous recevrez un email de validation de <em>FormSubmit</em>.<br>
                            <strong>Veuillez cliquer sur le bouton de confirmation dans cet email</strong> pour recevoir immédiatement vos deux e-mails de démonstration (Invitation & Présence).
                        </p>
                    `;
                    successMsg.style.display = 'block';
                }

                // Nettoyage des formulaires et iframes injectés dans le DOM
                setTimeout(() => {
                    if (document.body.contains(iframe1)) document.body.removeChild(iframe1);
                    if (document.body.contains(iframe2)) document.body.removeChild(iframe2);
                    if (document.body.contains(form1)) document.body.removeChild(form1);
                    if (document.body.contains(form2)) document.body.removeChild(form2);
                }, 10000);
            }, 250);
        });
    }

    // --- FONCTION DE HASHAGE SHA-1 PURE JS (Fonctionne sous protocole file:///) ---
    function sha1(str) {
        var blockstart,
            i,
            j,
            W = new Array(80),
            H0 = 0x67452301,
            H1 = 0xEFCDAB89,
            H2 = 0x98BADCFE,
            H3 = 0x10325476,
            H4 = 0xC3D2E1F0,
            A, B, C, D, E,
            temp;

        var utf8 = [];
        for (i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                          0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                          0x80 | ((charcode >> 6) & 0x3f),
                          0x80 | (charcode & 0x3f));
            }
            else {
                i++;
                charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                          | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18),
                          0x80 | ((charcode >> 12) & 0x3f),
                          0x80 | ((charcode >> 6) & 0x3f),
                          0x80 | (charcode & 0x3f));
            }
        }

        var msgLen = utf8.length;
        var padLen = ((msgLen + 8) >> 6) + 1;
        var msg = new Array(padLen * 16);
        for (i = 0; i < msg.length; i++) msg[i] = 0;
        for (i = 0; i < msgLen; i++) msg[i >> 2] |= utf8[i] << (24 - (i & 3) * 8);
        msg[msgLen >> 2] |= 0x80 << (24 - (msgLen & 3) * 8);
        msg[msg.length - 1] = msgLen * 8;

        for (blockstart = 0; blockstart < msg.length; blockstart += 16) {
            for (i = 0; i < 16; i++) W[i] = msg[blockstart + i];
            for (i = 16; i < 80; i++) {
                W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                W[i] = (W[i] << 1) | (W[i] >>> 31);
            }

            A = H0; B = H1; C = H2; D = H3; E = H4;

            for (i = 0; i < 80; i++) {
                var f, K;
                if (i < 20) {
                    f = (B & C) | ((~B) & D);
                    K = 0x5A827999;
                } else if (i < 40) {
                    f = B ^ C ^ D;
                    K = 0x6ED9EBA1;
                } else if (i < 60) {
                    f = (B & C) | (B & D) | (C & D);
                    K = 0x8F1BBCDC;
                } else {
                    f = B ^ C ^ D;
                    K = 0xCA62C1D6;
                }

                temp = ((A << 5) | (A >>> 27)) + f + E + K + W[i];
                temp = temp & 0xFFFFFFFF;
                E = D;
                D = C;
                C = (B << 30) | (B >>> 2);
                B = A;
                A = temp;
            }

            H0 = (H0 + A) & 0xFFFFFFFF;
            H1 = (H1 + B) & 0xFFFFFFFF;
            H2 = (H2 + C) & 0xFFFFFFFF;
            H3 = (H3 + D) & 0xFFFFFFFF;
            H4 = (H4 + E) & 0xFFFFFFFF;
        }

        var hex = "";
        var H = [H0, H1, H2, H3, H4];
        for (i = 0; i < 5; i++) {
            var word = H[i];
            for (j = 7; j >= 0; j--) {
                var nibble = (word >>> (j * 4)) & 0xf;
                hex += nibble.toString(16);
            }
        }
        return hex;
    }

    // --- CONFIGURATION PAR DÉFAUT ---
    const DEFAULT_CONFIG = {
        groomName: 'Julien',
        brideName: 'Amandine',
        family1: 'Dumont & Lemaire',
        family2: 'Valois & Petit',
        weddingDate: '2026-06-13',
        colorTheme: '#0E3D26',
        colorGold: '#D4AF37',
        fontScript: 'Great Vibes',
        fontSerif: 'Playfair Display',
        fontSans: 'Montserrat',
        bgDoors: '',
        bgInvite: ''
    };

    let config = { ...DEFAULT_CONFIG };

    // Charger les réglages persistés
    try {
        const stored = localStorage.getItem('evoria_custom_config');
        if (stored) {
            config = { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.error("Erreur de lecture du localStorage :", e);
    }

    // Sauvegarder les réglages
    function saveConfig() {
        try {
            localStorage.setItem('evoria_custom_config', JSON.stringify(config));
        } catch (e) {
            console.error("Erreur d'écriture dans le localStorage :", e);
        }
    }

    // --- CHARGEMENT DYNAMIQUE DES POLICES GOOGLE FONTS ---
    function loadGoogleFont(fontName) {
        const id = 'font-' + fontName.replace(/\s+/g, '-').toLowerCase();
        if (!document.getElementById(id)) {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;700&display=swap`;
            document.head.appendChild(link);
        }
    }

    // --- ENGIN DE CONFIGURATION DYNAMIQUE DU DOM / CSS ---
    function applyConfig() {
        // 1. Textes
        const coupleNamesEl = document.getElementById('customCoupleNames');
        if (coupleNamesEl) coupleNamesEl.innerHTML = `${config.groomName} <span class="couple-amp">&</span> ${config.brideName}`;

        const coupleNamesFooterEl = document.getElementById('customCoupleNamesFooter');
        if (coupleNamesFooterEl) coupleNamesFooterEl.innerText = `${config.groomName} & ${config.brideName}`;

        const family1El = document.getElementById('customFamily1');
        if (family1El) family1El.innerText = config.family1;

        const family2El = document.getElementById('customFamily2');
        if (family2El) family2El.innerText = config.family2;

        // 2. Dates
        if (config.weddingDate) {
            const dateObj = new Date(config.weddingDate + 'T00:00:00'); // Évite les décalages de fuseau horaire
            const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            let formattedDate = dateObj.toLocaleDateString('fr-FR', options);
            formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
            if (!formattedDate.startsWith('Le ')) {
                formattedDate = 'Le ' + formattedDate;
            }

            const dateTextEl = document.getElementById('customDateText');
            if (dateTextEl) dateTextEl.innerText = formattedDate;

            const dateFooterEl = document.getElementById('customDateFooter');
            if (dateFooterEl) {
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();
                dateFooterEl.innerText = `${day} · ${month} · ${year}`;
            }

            // Générer le mini-calendrier
            renderCalendar(dateObj);
        }

        // 3. Couleurs
        document.documentElement.style.setProperty('--bordeaux', config.colorTheme);
        document.documentElement.style.setProperty('--bordeaux-luxe', config.colorTheme);
        document.documentElement.style.setProperty('--gold-sand', config.colorGold);

        // 4. Polices
        loadGoogleFont(config.fontScript);
        loadGoogleFont(config.fontSerif);
        loadGoogleFont(config.fontSans);

        document.documentElement.style.setProperty('--font-script', `'${config.fontScript}', cursive`);
        document.documentElement.style.setProperty('--font-serif', `'${config.fontSerif}', serif`);
        document.documentElement.style.setProperty('--font-sans', `'${config.fontSans}', sans-serif`);

        // 5. Visuels
        const doorLeft = document.querySelector('.door--left');
        const doorRight = document.querySelector('.door--right');
        if (config.bgDoors) {
            if (doorLeft) {
                doorLeft.style.backgroundImage = `url(${config.bgDoors})`;
                doorLeft.style.backgroundSize = '200% 100%';
                doorLeft.style.backgroundPosition = 'left center';
            }
            if (doorRight) {
                doorRight.style.backgroundImage = `url(${config.bgDoors})`;
                doorRight.style.backgroundSize = '200% 100%';
                doorRight.style.backgroundPosition = 'right center';
            }
        } else {
            if (doorLeft) {
                doorLeft.style.backgroundImage = '';
                doorLeft.style.backgroundSize = '';
                doorLeft.style.backgroundPosition = '';
            }
            if (doorRight) {
                doorRight.style.backgroundImage = '';
                doorRight.style.backgroundSize = '';
                doorRight.style.backgroundPosition = '';
            }
        }

        const customBgOverlay = document.getElementById('customBgOverlay');
        if (customBgOverlay) {
            if (config.bgInvite) {
                customBgOverlay.style.backgroundImage = `url(${config.bgInvite})`;
            } else {
                customBgOverlay.style.backgroundImage = '';
            }
        }
    }

    // --- ALGORITHME DE GÉNÉRATION D'UN CALENDRIER DYNAMIQUE ---
    function renderCalendar(targetDateObj) {
        const calendarHeader = document.getElementById('calendarHeader');
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarHeader || !calendarGrid) return;

        const year = targetDateObj.getFullYear();
        const month = targetDateObj.getMonth();
        const targetDay = targetDateObj.getDate();

        const monthsFr = [
            "JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN",
            "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"
        ];

        calendarHeader.innerText = `${monthsFr[month]} ${year}`;
        calendarGrid.innerHTML = '';

        // Noms de jours
        const dayNames = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
        dayNames.forEach(name => {
            const el = document.createElement('div');
            el.className = 'day-name';
            el.innerText = name;
            calendarGrid.appendChild(el);
        });

        // Déterminer le premier jour de la semaine pour le 1er du mois
        const firstDayDate = new Date(year, month, 1);
        let firstDayIndex = firstDayDate.getDay();
        firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Ajustement (Lundi = 0, Dimanche = 6)

        const totalDays = new Date(year, month + 1, 0).getDate();

        // Cases vides initiales
        for (let i = 0; i < firstDayIndex; i++) {
            const empty = document.createElement('div');
            calendarGrid.appendChild(empty);
        }

        // Cases de jours
        for (let day = 1; day <= totalDays; day++) {
            const dayEl = document.createElement('div');
            dayEl.innerText = day;
            if (day === targetDay) {
                dayEl.className = 'special-day';
            }
            calendarGrid.appendChild(dayEl);
        }
    }

    // --- TÉLÉVERSEMENT SIGNÉ SUR CLOUDINARY (SHA-1 LOCAL) ---
    async function uploadToCloudinary(file, progressCallback) {
        const cloudName = 'dgnjaoql6';
        const apiKey = '247761964419975';
        const apiSecret = '0Yp9LhjjFbvucXIdsJyn3IdQOsc';
        const timestamp = Math.round(new Date().getTime() / 1000);

        // Paramètres alphabétiques à signer
        const stringToSign = `timestamp=${timestamp}${apiSecret}`;
        
        // Calcul SHA-1 avec la fonction pure JS (compatible file:///)
        const signature = sha1(stringToSign);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

            if (progressCallback && xhr.upload) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percent = (e.loaded / e.total) * 100;
                        progressCallback(percent);
                    }
                });
            }

            xhr.onload = () => {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        if (response.secure_url) {
                            resolve(response.secure_url);
                        } else {
                            reject(new Error("URL non reçue de Cloudinary"));
                        }
                    } else {
                        reject(new Error(response.error ? response.error.message : "Erreur Cloudinary"));
                    }
                } catch (e) {
                    reject(new Error("Erreur de parsing de réponse JSON"));
                }
            };

            xhr.onerror = () => {
                reject(new Error("Échec de la connexion réseau"));
            };

            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', apiKey);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);

            xhr.send(formData);
        });
    }

    // --- LOGIQUE D'AFFICHAGE DU COMPTE À REBOURS DYNAMIQUE ---
    function updateCountdown() {
        if (!config.weddingDate) return;

        const targetDate = new Date(`${config.weddingDate}T14:00:00`).getTime();
        const now = new Date().getTime();
        const distance = targetDate - now;

        const countdownEl = document.getElementById('countdown');
        if (distance < 0) {
            if (countdownEl) countdownEl.innerHTML = "C'est le grand jour !";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
    }

    // --- INTERACTIVITÉ DU PANNEAU DE PERSONNALISATION ---
    const customizeBtn = document.getElementById('customizeBtn');
    const customizePanel = document.getElementById('customizePanel');
    const closeCustomizePanel = document.getElementById('closeCustomizePanel');

    if (customizeBtn && customizePanel) {
        customizeBtn.addEventListener('click', () => {
            customizePanel.classList.toggle('open');
        });
    }

    if (closeCustomizePanel && customizePanel) {
        closeCustomizePanel.addEventListener('click', () => {
            customizePanel.classList.remove('open');
        });
    }

    // Lier les inputs texte
    const inputsMap = [
        { id: 'custGroom', key: 'groomName' },
        { id: 'custBride', key: 'brideName' },
        { id: 'custFamily1', key: 'family1' },
        { id: 'custFamily2', key: 'family2' }
    ];

    inputsMap.forEach(item => {
        const input = document.getElementById(item.id);
        if (input) {
            input.addEventListener('input', (e) => {
                config[item.key] = e.target.value;
                applyConfig();
                saveConfig();
            });
        }
    });

    // Lier l'input date
    const dateInput = document.getElementById('custDate');
    if (dateInput) {
        dateInput.addEventListener('change', (e) => {
            config.weddingDate = e.target.value;
            applyConfig();
            saveConfig();
        });
    }

    // Lier les couleurs
    const colorThemeInput = document.getElementById('custColorTheme');
    if (colorThemeInput) {
        colorThemeInput.addEventListener('input', (e) => {
            config.colorTheme = e.target.value;
            applyConfig();
            saveConfig();
        });
    }

    const colorGoldInput = document.getElementById('custColorGold');
    if (colorGoldInput) {
        colorGoldInput.addEventListener('input', (e) => {
            config.colorGold = e.target.value;
            applyConfig();
            saveConfig();
        });
    }

    // Lier les sélecteurs de polices
    const fontsMap = [
        { id: 'custFontScript', key: 'fontScript' },
        { id: 'custFontSerif', key: 'fontSerif' },
        { id: 'custFontSans', key: 'fontSans' }
    ];

    fontsMap.forEach(item => {
        const select = document.getElementById(item.id);
        if (select) {
            select.addEventListener('change', (e) => {
                config[item.key] = e.target.value;
                applyConfig();
                saveConfig();
            });
        }
    });

    // Lier les téléversements Cloudinary
    const visualUploads = [
        { id: 'custDoors', key: 'bgDoors', progressId: 'progressDoors', statusId: 'statusDoors' },
        { id: 'custBg', key: 'bgInvite', progressId: 'progressBg', statusId: 'statusBg' }
    ];

    visualUploads.forEach(item => {
        const input = document.getElementById(item.id);
        const progressBar = document.getElementById(item.progressId);
        const progressContainer = progressBar ? progressBar.parentElement : null;
        const statusEl = document.getElementById(item.statusId);

        if (input) {
            input.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                if (progressContainer) progressContainer.style.display = 'block';
                if (progressBar) progressBar.style.width = '0%';
                if (statusEl) {
                    statusEl.className = 'upload-status uploading';
                    statusEl.innerText = "Téléversement en cours...";
                }

                try {
                    const url = await uploadToCloudinary(file, (percent) => {
                        if (progressBar) progressBar.style.width = percent + '%';
                    });

                    config[item.key] = url;
                    applyConfig();
                    saveConfig();

                    if (statusEl) {
                        statusEl.className = 'upload-status success';
                        statusEl.innerText = "Image téléversée avec succès !";
                    }
                    setTimeout(() => {
                        if (progressContainer) progressContainer.style.display = 'none';
                    }, 2000);
                } catch (err) {
                    console.error(err);
                    if (statusEl) {
                        statusEl.className = 'upload-status error';
                        statusEl.innerText = "Erreur : " + err.message;
                    }
                }
            });
        }
    });

    // --- RECHERCHE IMAGES UNSPLASH ---
    const unsplashAccessKey = '5wKdoMiPs6mPwJ4AYt7bfWg6Od8dS3blnMCNSChAnO8';
    let unsplashActiveTarget = null;
    let unsplashCurrentPage = 1;
    let unsplashCurrentQuery = '';

    const unsplashSearchPanel = document.getElementById('unsplashSearchPanel');
    const closeUnsplashSearch = document.getElementById('closeUnsplashSearch');
    const unsplashQueryInput = document.getElementById('unsplashQuery');
    const unsplashSearchBtn = document.getElementById('unsplashSearchBtn');
    const unsplashResultsGrid = document.getElementById('unsplashResults');
    const unsplashLoadMoreBtn = document.getElementById('unsplashLoadMore');
    const unsplashTriggers = document.querySelectorAll('.unsplash-btn');

    if (unsplashTriggers) {
        unsplashTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                unsplashActiveTarget = btn.getAttribute('data-target');
                unsplashCurrentPage = 1;
                if (unsplashResultsGrid) unsplashResultsGrid.innerHTML = '';
                if (unsplashQueryInput) unsplashQueryInput.value = '';
                if (unsplashLoadMoreBtn) unsplashLoadMoreBtn.style.display = 'none';
                if (unsplashSearchPanel) unsplashSearchPanel.classList.add('open');
            });
        });
    }

    if (closeUnsplashSearch && unsplashSearchPanel) {
        closeUnsplashSearch.addEventListener('click', (e) => {
            e.preventDefault();
            unsplashSearchPanel.classList.remove('open');
        });
    }

    async function searchUnsplash(append = false) {
        const query = unsplashQueryInput ? unsplashQueryInput.value.trim() : '';
        if (!query) return;

        unsplashCurrentQuery = query;
        if (!append) {
            unsplashCurrentPage = 1;
            if (unsplashResultsGrid) {
                unsplashResultsGrid.innerHTML = '<div style="grid-column: span 2; padding: 2rem; text-align: center; color: var(--muted);">Recherche...</div>';
            }
        }

        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&page=${unsplashCurrentPage}&client_id=${unsplashAccessKey}`, {
                headers: {
                    'Accept-Version': 'v1'
                }
            });

            if (!response.ok) {
                throw new Error("Erreur de connexion à Unsplash");
            }

            const data = await response.json();
            
            if (unsplashResultsGrid) {
                if (!append) {
                    unsplashResultsGrid.innerHTML = '';
                } else {
                    const loader = unsplashResultsGrid.querySelector('.unsplash-loading-more');
                    if (loader) loader.remove();
                }

                if (data.results.length === 0) {
                    if (!append) {
                        unsplashResultsGrid.innerHTML = '<div style="grid-column: span 2; padding: 2rem; text-align: center; color: var(--muted);">Aucun résultat trouvé.</div>';
                    }
                    if (unsplashLoadMoreBtn) unsplashLoadMoreBtn.style.display = 'none';
                    return;
                }

                data.results.forEach(photo => {
                    const card = document.createElement('div');
                    card.className = 'unsplash-img-card';
                    card.setAttribute('data-url', photo.urls.regular);

                    const img = document.createElement('img');
                    img.src = photo.urls.small;
                    img.alt = photo.alt_description || "Image Unsplash";
                    img.loading = 'lazy';

                    card.appendChild(img);
                    unsplashResultsGrid.appendChild(card);

                    card.addEventListener('click', () => {
                        const selectedUrl = card.getAttribute('data-url');
                        if (unsplashActiveTarget && selectedUrl) {
                            config[unsplashActiveTarget] = selectedUrl;
                            applyConfig();
                            saveConfig();
                            if (unsplashSearchPanel) unsplashSearchPanel.classList.remove('open');
                        }
                    });
                });
            }

            if (unsplashLoadMoreBtn) {
                if (data.total_pages > unsplashCurrentPage) {
                    unsplashLoadMoreBtn.style.display = 'block';
                } else {
                    unsplashLoadMoreBtn.style.display = 'none';
                }
            }

        } catch (err) {
            console.error(err);
            if (unsplashResultsGrid) {
                if (!append) {
                    unsplashResultsGrid.innerHTML = `<div style="grid-column: span 2; padding: 2rem; text-align: center; color: #c62828;">Erreur : ${err.message}</div>`;
                } else {
                    alert("Erreur lors du chargement des images : " + err.message);
                }
            }
        }
    }

    if (unsplashSearchBtn) {
        unsplashSearchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchUnsplash(false);
        });
    }

    if (unsplashQueryInput) {
        unsplashQueryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchUnsplash(false);
            }
        });
    }

    if (unsplashLoadMoreBtn) {
        unsplashLoadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            unsplashCurrentPage++;
            
            if (unsplashResultsGrid) {
                const loader = document.createElement('div');
                loader.className = 'unsplash-loading-more';
                loader.style.gridColumn = 'span 2';
                loader.style.textAlign = 'center';
                loader.style.padding = '1rem';
                loader.style.color = 'var(--muted)';
                loader.innerText = "Chargement...";
                unsplashResultsGrid.appendChild(loader);
            }

            searchUnsplash(true);
        });
    }

    // Bouton de réinitialisation
    const resetBtn = document.getElementById('resetCustomize');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Voulez-vous vraiment réinitialiser toutes vos personnalisations ?")) {
                config = { ...DEFAULT_CONFIG };
                saveConfig();
                applyConfig();
                updateInputValues();
            }
        });
    }

    // Mettre à jour la valeur des contrôles du volet à partir de l'état
    function updateInputValues() {
        const groomInput = document.getElementById('custGroom');
        if (groomInput) groomInput.value = config.groomName;

        const brideInput = document.getElementById('custBride');
        if (brideInput) brideInput.value = config.brideName;

        const fam1Input = document.getElementById('custFamily1');
        if (fam1Input) fam1Input.value = config.family1;

        const fam2Input = document.getElementById('custFamily2');
        if (fam2Input) fam2Input.value = config.family2;

        const dateInput = document.getElementById('custDate');
        if (dateInput) dateInput.value = config.weddingDate;

        const colThemeInput = document.getElementById('custColorTheme');
        if (colThemeInput) colThemeInput.value = config.colorTheme;

        const colGoldInput = document.getElementById('custColorGold');
        if (colGoldInput) colGoldInput.value = config.colorGold;

        const fontScriptSelect = document.getElementById('custFontScript');
        if (fontScriptSelect) fontScriptSelect.value = config.fontScript;

        const fontSerifSelect = document.getElementById('custFontSerif');
        if (fontSerifSelect) fontSerifSelect.value = config.fontSerif;

        const fontSansSelect = document.getElementById('custFontSans');
        if (fontSansSelect) fontSansSelect.value = config.fontSans;
    }

    // --- INITIALISATION AU CHARGEMENT ---
    updateInputValues();
    applyConfig();

    setInterval(updateCountdown, 1000);
    updateCountdown();
});
