/**
 * simulateur.js — Simulateur Carte Grise Grand Est (54)
 * Tarifs 2026 — Région Grand Est
 *
 * Règles :
 *  Y1 = CV × tarif_unitaire_regional
 *  Abattement : si véhicule > 10 ans → Y1 / 2
 *  Exonération : si électrique → Y1 = 0
 *  Frais fixes ANTS : Taxe de gestion (11€) + Redevance acheminement (2.76€)
 */
(function () {
  'use strict';

  // ─── Tarifs régionaux 2026 par département ──────────────────
  const TARIFS_REGIONAUX = {
    // AUVERGNE-RHONE-ALPES (43,00 €)
    "01": 43, "03": 43, "07": 43, "15": 43, "26": 43, "38": 43, 
    "42": 43, "43": 43, "63": 43, "69": 43, "73": 43, "74": 43,
    // BOURGOGNE-FRANCHE-COMTE (55,00 €)
    "21": 55, "25": 55, "39": 55, "58": 55, "70": 55, "71": 55, "89": 55, "90": 55,
    // BRETAGNE (55,00 €)
    "22": 55, "29": 55, "35": 55, "56": 55,
    // CENTRE-VAL DE LOIRE (55,00 €)
    "18": 55, "28": 55, "36": 55, "37": 55, "41": 55, "45": 55,
    // CORSE (27,00 €)
    "2A": 27, "2B": 27,
    // GRAND EST (48,00 €) - Secteur Garage 2A
    "08": 48, "10": 48, "51": 48, "52": 48, "54": 48, "55": 48, 
    "57": 48, "67": 48, "68": 48, "88": 48,
    // HAUTS-DE-FRANCE (36,20 €)
    "02": 36.2, "59": 36.2, "60": 36.2, "62": 36.2, "80": 36.2,
    // ILE-DE-FRANCE (54,95 €)
    "75": 54.95, "77": 54.95, "78": 54.95, "91": 54.95, "92": 54.95, "93": 54.95, "94": 54.95, "95": 54.95,
    // NORMANDIE (46,00 €)
    "14": 46, "27": 46, "50": 46, "61": 46, "76": 46,
    // NOUVELLE-AQUITAINE (49,00 €)
    "16": 49, "17": 49, "19": 49, "23": 49, "24": 49, "33": 49, 
    "40": 49, "47": 49, "64": 49, "79": 49, "86": 49, "87": 49,
    // OCCITANIE (54,50 €)
    "09": 54.5, "11": 54.5, "12": 54.5, "30": 54.5, "31": 54.5, "32": 54.5, 
    "34": 54.5, "46": 54.5, "48": 54.5, "65": 54.5, "66": 54.5, "81": 54.5, "82": 54.5,
    // PAYS DE LA LOIRE (51,00 €)
    "44": 51, "49": 51, "53": 51, "72": 51, "85": 51,
    // PROVENCE-ALPES-COTE D'AZUR (51,20 €)
    "04": 51.2, "05": 51.2, "06": 51.2, "13": 51.2, "83": 51.2, "84": 51.2,
    // DOM-TOM (Moyenne)
    "971": 30, "972": 30, "973": 42.5, "974": 51, "976": 30,
    DEFAULT: 48.00 // Fallback
  };

  // ─── Frais ───────────────────────────────────────
  const FRAIS_GESTION = 11.00;       // Taxe de gestion
  const FRAIS_ACHEMINEMENT = 2.76;   // Redevance d'acheminement
  const FRAIS_DOSSIER = 30.00;       // Frais de dossier Garage 2A

  // ─── Labels par démarche ────────────────────────────────────
  const LABELS_DEMARCHE = {
    occasion_fr:        'Changement de propriétaire — Occasion France',
    occasion_import:    'Immatriculation véhicule étranger (WW/Import)',
    duplicata:          'Duplicata (perte / vol / détérioration)',
    changement_adresse: 'Changement de domicile'
  };

  // ─── Stepper state ──────────────────────────────────────────
  let currentStep = 1;
  let calcResult = null;

  // ─── DOM refs ────────────────────────────────────────────────
  const formSim      = document.getElementById('form-simulateur');
  const etape1       = document.getElementById('etape-1');
  const etape2       = document.getElementById('etape-2');
  const formDossier  = document.getElementById('form-dossier');
  const btnDemarrer  = document.getElementById('btn-demarrer-demarche');
  const btnRetour2   = document.getElementById('btn-retour-etape2');

  // Result display refs
  const resLabel         = document.getElementById('res-label');
  const resTaxeReg       = document.getElementById('res-taxeRegionale');
  const resAbattement    = document.getElementById('res-abattement');
  const resFraisFixesEl  = document.getElementById('res-fraisFixes');
  const resFraisDossier  = document.getElementById('res-fraisDossier');
  const resTotalTTC      = document.getElementById('res-totalTTC');
  const resAbattRow      = document.getElementById('res-abatt-row');

  if (!formSim) return; // Guard: not on carte-grise page

  // ─── Calcul principal ────────────────────────────────────────
  function calculer(e) {
    e.preventDefault();

    const demarche = document.getElementById('sim-demarche').value;
    let rawDept    = (document.getElementById('sim-dept').value || '54').trim();
    const dept     = rawDept.toUpperCase();
    const cv       = parseInt(document.getElementById('sim-cv').value, 10) || 0;
    const annee    = parseInt(document.getElementById('sim-annee').value, 10) || 2020;
    const energie  = document.getElementById('sim-energie').value;

    const anneeActuelle = new Date().getFullYear();
    const age = anneeActuelle - annee;

    // Tarif unitaire régional
    const tarifUnitaire = TARIFS_REGIONAUX[dept] || TARIFS_REGIONAUX.DEFAULT;

    // Y1 brute
    let y1 = 0;
    if (demarche !== 'changement_adresse') {
      if (energie === 'electrique') {
        y1 = 0;  // 100% exonéré
      } else {
        y1 = cv * tarifUnitaire;
        if (age > 10) {
          y1 = y1 / 2; // Abattement ancienneté 50%
        }
      }
    }

    const fraisFixes = FRAIS_GESTION + FRAIS_ACHEMINEMENT;
    const total = y1 + fraisFixes + FRAIS_DOSSIER;

    // Enregistrer pour l'étape suivante
    calcResult = {
      demarche, dept, cv, annee, energie, age,
      tarifUnitaire, y1, fraisFixes, fraisDossier: FRAIS_DOSSIER, total,
      abattement: age > 10 && energie !== 'electrique' && demarche !== 'changement_adresse'
    };

    afficherResultat(calcResult);
  }

  function afficherResultat(r) {
    if (!etape1) return;

    // Description démarche
    if (resLabel) {
      resLabel.textContent = LABELS_DEMARCHE[r.demarche] || r.demarche;
    }

    // Taxe régionale
    let taxeLabel = `${r.y1.toFixed(2)} €`;
    if (r.energie === 'electrique') {
      taxeLabel = `0,00 € ✓ Exonéré (100% électrique)`;
    } else if (r.y1 === 0 && r.demarche === 'changement_adresse') {
      taxeLabel = `0,00 € ✓ Non applicable`;
    }
    if (resTaxeReg) resTaxeReg.textContent = taxeLabel;

    // Abattement row
    if (resAbattRow) {
      if (r.abattement) {
        resAbattRow.style.display = 'flex';
        if (resAbattement) resAbattement.textContent = `− 50 % (véhicule > 10 ans)`;
      } else {
        resAbattRow.style.display = 'none';
      }
    }

    // Frais fixes ANTS
    if (resFraisFixesEl) {
      resFraisFixesEl.textContent = `${r.fraisFixes.toFixed(2)} € (11€ gestion + 2,76€ acheminement)`;
    }

    // Frais de dossier
    if (resFraisDossier) {
      resFraisDossier.textContent = `${r.fraisDossier.toFixed(2)} €`;
    }

    // Total
    if (resTotalTTC) {
      resTotalTTC.textContent = `${r.total.toFixed(2)} €`;
    }

    // Afficher étape 1
    showStep(1);

    // Scroll to result
    etape1.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Animate
    etape1.style.animation = 'none';
    etape1.offsetHeight; // reflow
    etape1.style.animation = 'fadeInUp 0.5s ease forwards';
  }

  // ─── Stepper Navigation ──────────────────────────────────────
  function showStep(step) {
    currentStep = step;
    if (etape1) etape1.style.display = step === 1 ? 'block' : 'none';
    if (etape2) etape2.style.display = step === 2 ? 'block' : 'none';
    updateStepIndicator(step);
  }

  function updateStepIndicator(step) {
    document.querySelectorAll('.step-dot').forEach((dot, i) => {
      const n = i + 1;
      dot.classList.remove('active', 'done');
      if (n < step) dot.classList.add('done');
      if (n === step) dot.classList.add('active');
    });
    document.querySelectorAll('.step-line').forEach((line, i) => {
      line.classList.toggle('done', i + 1 < step);
    });
  }

  // ─── Event Listeners ─────────────────────────────────────────
  if (formSim) formSim.addEventListener('submit', calculer);

  if (btnDemarrer) {
    btnDemarrer.addEventListener('click', () => {
      if (!calcResult) { alert('Veuillez d\'abord calculer le tarif.'); return; }
      showStep(2);
      etape2.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (btnRetour2) {
    btnRetour2.addEventListener('click', () => {
      showStep(1);
      etape1.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ─── Formulaire dossier (Étape 2) ────────────────────────────
  if (formDossier) {
    formDossier.addEventListener('submit', (e) => {
      e.preventDefault();
      // En production : envoyer les données au backend
      // Pour l'instant : afficher un message de confirmation
      showConfirmationDossier();
    });
  }

  function showConfirmationDossier() {
    if (etape2) {
      etape2.innerHTML = `
        <div style="text-align:center; padding: 20px 0;">
          <div style="font-size:4rem; margin-bottom:20px;">✅</div>
          <h2 style="margin-bottom:16px;">Dossier reçu !</h2>
          <p style="color:rgba(0,0,0,0.65); margin-bottom:28px; line-height:1.7;">
            Votre demande a bien été enregistrée. Notre équipe de <strong>Point Auto Services</strong> 
            vous contacte sous 24h au numéro indiqué pour finaliser votre démarche.
          </p>
          <a href="tel:0383211002" class="btn btn-primary btn-lg">
            📞 03 83 21 10 02
          </a>
          <p style="margin-top:16px; font-size:0.82rem; color:var(--c-muted);">
            63 Rue St Nicolas, 54000 Nancy
          </p>
        </div>
      `;
    }
    updateStepIndicator(3);
  }

  // ─── Upload zone interactive ─────────────────────────────────
  const uploadZone = document.querySelector('.upload-zone');
  const fileInput  = document.querySelector('.upload-zone input[type="file"]');
  const uploadText = document.getElementById('upload-text');

  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--c-orange)';
      uploadZone.style.background = 'rgba(230,126,34,0.1)';
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.style.borderColor = '';
      uploadZone.style.background = '';
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = '';
      uploadZone.style.background = '';
      fileInput.files = e.dataTransfer.files;
      updateUploadText(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => updateUploadText(fileInput.files));

    function updateUploadText(files) {
      if (!uploadText) return;
      if (files.length === 0) return;
      uploadText.textContent = `${files.length} fichier(s) sélectionné(s) ✓`;
      uploadText.style.color = 'var(--c-success)';
    }
  }

})();
