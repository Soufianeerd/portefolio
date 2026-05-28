document.addEventListener('DOMContentLoaded', () => {
    /* --- SCROLL NAV --- */
    const nav = document.getElementById('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 80) nav.classList.add('nav--scrolled');
            else nav.classList.remove('nav--scrolled');
        }, { passive: true });
    }

    /* --- INTERSECTION OBSERVER (REVEAL) --- */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* --- DYNAMIC FORM SUBMISSION (FORMSUBMIT) --- */
    const form = document.getElementById('contactForm');
    const statusContainer = document.getElementById('form-status');
    const statusText = document.getElementById('form-status-text');

    if (form && statusContainer && statusText) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Set loading state
            statusContainer.className = 'form-status loading visible';
            statusText.textContent = 'Envoi en cours...';

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            }

            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => object[key] = value);
            const jsonPayload = JSON.stringify(object);

            const url = form.getAttribute('action') || 'https://formsubmit.co/ajax/sinaproduction01@gmail.com';

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: jsonPayload
            })
            .then(async (response) => {
                let data = await response.json();
                if (response.ok || data.success === "true" || data.success === true) {
                    statusContainer.className = 'form-status success visible';
                    statusText.textContent = 'Votre message a bien été envoyé ! Merci.';
                    form.reset();
                    // trigger reset callback for custom inputs like date picker
                    if (typeof checkDateInput === 'function') checkDateInput();
                } else {
                    console.error(data);
                    statusContainer.className = 'form-status error visible';
                    statusText.textContent = data.message || 'Une erreur est survenue lors de l\'envoi.';
                }
            })
            .catch(error => {
                console.error(error);
                statusContainer.className = 'form-status error visible';
                statusText.textContent = 'Erreur réseau. Veuillez vérifier votre connexion et réessayer.';
            })
            .then(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }
            });
        });
    }

    /* --- DYNAMIC DATE PICKER HELPER --- */
    const dateInput = document.querySelector('.date-input');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        window.checkDateInput = () => {
            if (dateInput.value) {
                dateInput.classList.add('has-value');
            } else {
                dateInput.classList.remove('has-value');
            }
        };

        dateInput.addEventListener('input', window.checkDateInput);
        dateInput.addEventListener('change', window.checkDateInput);
        dateInput.addEventListener('focus', () => dateInput.classList.add('focused'));
        dateInput.addEventListener('blur', () => {
            dateInput.classList.remove('focused');
            window.checkDateInput();
        });
        
        window.checkDateInput();
    }
});
