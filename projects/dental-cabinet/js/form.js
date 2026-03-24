document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      
      // Reset errors
      inputs.forEach(input => input.classList.remove('error'));
      formMessage.className = 'form-message';
      formMessage.style.display = 'none';
      formMessage.innerText = '';

      // Basic required validation
      inputs.forEach(input => {
        if (!input.value.trim() && input.type !== 'checkbox') {
          isValid = false;
          input.classList.add('error');
        }
        if (input.type === 'checkbox' && !input.checked) {
          isValid = false;
        }
      });

      // Email validation
      const emailInput = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && emailInput.value && !emailRegex.test(emailInput.value)) {
        isValid = false;
        emailInput.classList.add('error');
      }

      // Phone validation (very basic: at least 10 figures if provided)
      const phoneInput = document.getElementById('telephone');
      const phoneRegex = /^[\d\s\+\-\.()]{10,}$/;
      if (phoneInput && phoneInput.value && !phoneRegex.test(phoneInput.value)) {
        isValid = false;
        phoneInput.classList.add('error');
      }

      if (isValid) {
        // Simulate sending data
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Envoi en cours...';
        submitBtn.disabled = true;

        setTimeout(() => {
          formMessage.innerText = 'Votre demande a été envoyée avec succès. Nous vous recontacterons dans les plus brefs délais.';
          formMessage.className = 'form-message success';
          formMessage.style.display = 'block';
          form.reset();
          
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
        }, 1500);

      } else {
        formMessage.innerText = 'Veuillez corriger les erreurs dans le formulaire avant de l\'envoyer.';
        formMessage.className = 'form-message error-msg';
        formMessage.style.display = 'block';
      }
    });
  }
});
