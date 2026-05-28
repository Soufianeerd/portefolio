document.addEventListener('DOMContentLoaded', () => {
    // Header scroll effect
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    // Scroll reveal animations (fade-up)
    const obs = new IntersectionObserver((entries, o) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                o.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
    
    // Initial animations trigger for hero section
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-up').forEach(el => el.classList.add('visible'));
    }, 100);

    // Dynamic contact form submission via FormSubmit
    const contactForm = document.querySelector('.contact-form');
    const statusContainer = document.getElementById('form-status');
    const statusText = document.getElementById('form-status-text');

    if (contactForm && statusContainer && statusText) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Show loading status
            statusContainer.className = 'form-status loading visible';
            statusText.textContent = 'Envoi en cours...';
            
            // Disable submit button to prevent double submits
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            }

            const formData = new FormData(contactForm);
            const object = {};
            formData.forEach((value, key) => {
                // Ignore empty honeypot fields or helpers not needed in email body if wanted,
                // but FormSubmit handles them natively
                object[key] = value;
            });
            const jsonPayload = JSON.stringify(object);
            
            const url = contactForm.getAttribute('action') || 'https://formsubmit.co/ajax/shoot.event@outlook.fr';

            // Send request to FormSubmit
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
                    contactForm.reset();
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
                // Re-enable button after response
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }
            });
        });
    }

    // Dynamic date picker helper
    const dateInput = document.querySelector('.date-input');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        const checkValue = () => {
            if (dateInput.value) {
                dateInput.classList.add('has-value');
            } else {
                dateInput.classList.remove('has-value');
            }
        };
        
        dateInput.addEventListener('input', checkValue);
        dateInput.addEventListener('change', checkValue);
        dateInput.addEventListener('focus', () => dateInput.classList.add('focused'));
        dateInput.addEventListener('blur', () => {
            dateInput.classList.remove('focused');
            checkValue();
        });
        checkValue();
    }
});
