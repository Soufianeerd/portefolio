/**
 * devis.js — Formulaire de devis atelier Garage 2A
 * Gère la sélection de type d'intervention + soumission
 */
(function () {
  'use strict';

  const form = document.getElementById('form-devis');
  if (!form) return;

  // ── Sélection intervention ─────────────────────────────────
  let selectedIntervention = '';

  const interventionBtns = document.querySelectorAll('.intervention-btn');
  interventionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      interventionBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedIntervention = btn.dataset.value;
    });
  });

  // ── Validation & Soumission ───────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nom      = document.getElementById('devis-nom').value.trim();
    const tel      = document.getElementById('devis-tel').value.trim();
    const immat    = document.getElementById('devis-immat').value.trim();
    const message  = document.getElementById('devis-message')?.value.trim() || '';

    if (!nom || !tel) {
      showError('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    if (!selectedIntervention) {
      showError('Veuillez sélectionner un type d\'intervention.');
      return;
    }

    const telRegex = /^(\+33|0)[0-9]{9}$/;
    if (!telRegex.test(tel.replace(/\s/g, ''))) {
      showError('Numéro de téléphone invalide. Format attendu : 06XXXXXXXX ou 03XXXXXXXX.');
      return;
    }

    // Simuler l'envoi (en production → API backend)
    submitDevis({ nom, tel, immat, intervention: selectedIntervention, message });
  });

  function submitDevis(data) {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';
    }

    // Simule un délai réseau
    setTimeout(() => {
      showSuccess();
    }, 900);
  }

  function showSuccess() {
    const container = document.getElementById('devis-container');
    if (container) {
      container.innerHTML = `
        <div class="card" style="text-align:center; padding: 48px 32px; border-color: var(--c-orange);">
          <div style="font-size:3.5rem; margin-bottom:20px;">🎉</div>
          <h2 style="margin-bottom:12px;">Demande envoyée !</h2>
          <p style="color:rgba(0,0,0,0.65); max-width:400px; margin:0 auto 28px; line-height:1.7;">
            Votre demande de devis a bien été reçue. Notre équipe du <strong>Garage 2A</strong> 
            vous rappelle rapidement au numéro indiqué.
          </p>
          <a href="tel:0383211002" class="btn btn-primary btn-lg" style="margin-bottom:12px;">
            📞 03 83 21 10 02
          </a>
          <p style="font-size:0.82rem; color:var(--c-muted);">
            33 Rte de Ville en Vermois, 54210 Saint-Nicolas-de-Port
          </p>
        </div>
      `;
    }

    showToast('✅ Votre demande a bien été envoyée !');
  }

  function showError(msg) {
    const existing = form.querySelector('.form-error');
    if (existing) existing.remove();

    const err = document.createElement('div');
    err.className = 'form-error';
    err.style.cssText = `
      background: rgba(231,76,60,0.12);
      border: 1px solid rgba(231,76,60,0.3);
      border-radius: var(--r-md);
      padding: 12px 16px;
      color: #e74c3c;
      font-size: 0.88rem;
      margin-top: 16px;
    `;
    err.textContent = `⚠️ ${msg}`;
    form.appendChild(err);
    setTimeout(() => err.remove(), 5000);
  }

  function showToast(text) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

})();
