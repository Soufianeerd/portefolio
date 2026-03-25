// frontend/assets/js/simulateur.js

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TARIFS CHEVAL FISCAL PAR DÉPARTEMENT 2025
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TARIFS_DEPT = {
  "01":43.00,"02":33.00,"03":43.00,"04":51.20,"05":49.80,
  "06":50.00,"07":30.00,"08":33.00,"09":36.50,"10":50.00,
  "11":35.00,"12":44.00,"13":51.20,"14":35.00,"15":43.00,
  "16":41.00,"17":43.00,"18":35.00,"19":42.00,
  "2A":0.00, "2B":0.00,
  "21":56.30,"22":51.00,"23":43.00,"24":35.00,"25":56.30,
  "26":30.00,"27":35.00,"28":35.00,"29":51.00,"30":44.00,
  "31":40.00,"32":40.00,"33":41.00,"34":44.00,"35":51.00,
  "36":35.00,"37":35.00,"38":30.00,"39":56.30,"40":41.00,
  "41":35.00,"42":43.00,"43":43.00,"44":51.00,"45":35.00,
  "46":40.00,"47":41.00,"48":44.00,"49":51.00,"50":35.00,
  "51":33.00,"52":33.00,"53":51.00,
  "54":48.20, // Meurthe-et-Moselle
  "55":48.20,"56":51.00,"57":48.20,"58":43.00,"59":33.00,
  "60":33.00,"61":35.00,"62":33.00,"63":43.00,"64":41.00,
  "65":40.00,"66":44.00,"67":48.00,"68":48.00,"69":43.00,
  "70":56.30,"71":43.00,"72":51.00,"73":43.00,"74":43.00,
  "75":46.15,"76":35.00,"77":34.15,"78":34.15,"79":43.00,
  "80":33.00,"81":40.00,"82":40.00,"83":51.20,"84":44.00,
  "85":51.00,"86":43.00,"87":42.00,"88":48.20,"89":43.00,
  "90":56.30,"91":34.15,"92":34.15,"93":34.15,"94":34.15,
  "95":34.15,"971":30.00,"972":30.00,"973":30.00,
  "974":51.20,"976":30.00
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FRAIS FIXES 2025 (ANTS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const FRAIS_FIXES = {
  gestion:       11.00,   // Taxe de gestion (Y4)
  acheminement:   2.76,   // Taxe d'acheminement (Y5)
  redevance:      4.00,   // Redevance traitement (Y6)
  serviceGarage: 29.90    // Frais Point Auto Services TTC
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES DE DÉMARCHES : frais spéciaux
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DEMARCHE_CONFIG = {
  "occasion_fr":     { taxeRegionale: true,  labelResult: "Changement de propriétaire" },
  "occasion_import": { taxeRegionale: true,  labelResult: "Immatriculation véhicule étranger" },
  "neuf":            { taxeRegionale: true,  labelResult: "Première immatriculation" },
  "duplicata":       { taxeRegionale: false, labelResult: "Duplicata (perte/vol/détérioration)" },
  "changement_adresse": { taxeRegionale: false, labelResult: "Changement d'adresse" },
  "changement_nom":  { taxeRegionale: false, labelResult: "Changement d'état civil" },
  "ww":              { taxeRegionale: true,  labelResult: "Immatriculation provisoire WW" }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FONCTION PRINCIPALE DE CALCUL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function calculerCG(params) {
  const { demarche, dept, cv, energie, annee } = params;
  const config = DEMARCHE_CONFIG[demarche];

  if (!config) return null;

  // 1. Taxe régionale Y1
  let taxeRegionale = 0;
  if (config.taxeRegionale && energie !== 'electrique') {
    const tarifCV = TARIFS_DEPT[dept] || 0;
    taxeRegionale = tarifCV * cv;

    // Abattement 50% si véhicule > 10 ans
    const age = new Date().getFullYear() - annee;
    if (age >= 10) taxeRegionale *= 0.5;

    // Exonération total Corse
    if (dept === '2A' || dept === '2B') taxeRegionale = 0;
  }

  // 2. Frais fixes
  const { gestion, acheminement, redevance, serviceGarage } = FRAIS_FIXES;

  // 3. Total
  const totalTaxes = taxeRegionale + gestion + acheminement + redevance;
  const totalTTC   = totalTaxes + serviceGarage;

  return {
    label:           config.labelResult,
    taxeRegionale:   taxeRegionale.toFixed(2),
    taxeGestion:     gestion.toFixed(2),
    taxeAcheminement: acheminement.toFixed(2),
    redevance:       redevance.toFixed(2),
    fraisService:    serviceGarage.toFixed(2),
    totalTaxes:      totalTaxes.toFixed(2),
    totalTTC:        totalTTC.toFixed(2),
    exonere:         energie === 'electrique',
    corse:           dept === '2A' || dept === '2B'
  };
}

// Logic to hook DOM variables
document.addEventListener('DOMContentLoaded', () => {
  const simForm = document.getElementById('form-simulateur');
  if (simForm) {
      simForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const params = {
              demarche: document.getElementById('sim-demarche').value,
              dept: document.getElementById('sim-dept').value,
              cv: parseInt(document.getElementById('sim-cv').value, 10),
              energie: document.getElementById('sim-energie').value,
              annee: parseInt(document.getElementById('sim-annee').value, 10)
          };

          const result = calculerCG(params);
          if (result) {
              afficherResultat(result);
              window.currentDemande = { ...params, ...result };
          }
      });
  }
});

function afficherResultat(result) {
  // Affiche et met à jour l'étape 1 (Tunnel de commande)
  const tunnel = document.getElementById('commande');
  tunnel.style.display = 'block';

  document.getElementById('res-label').textContent = result.label;
  document.getElementById('res-taxeRegionale').textContent = result.taxeRegionale + ' €';
  document.getElementById('res-fraisFixes').textContent = (parseFloat(result.taxeGestion) + parseFloat(result.taxeAcheminement) + parseFloat(result.redevance)).toFixed(2) + ' €';
  document.getElementById('res-fraisService').textContent = result.fraisService + ' €';
  document.getElementById('res-totalTTC').textContent = result.totalTTC + ' €';
  
  // Scroll to detail step 1
  tunnel.scrollIntoView({ behavior: 'smooth' });
}
