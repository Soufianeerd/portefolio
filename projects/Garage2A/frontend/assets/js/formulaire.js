// frontend/assets/js/formulaire.js

// Gère le passage à l'étape 2 (Dossier + Upload) puis l'étape 3 (Paiement)
document.addEventListener('DOMContentLoaded', () => {
    // Bouton de l'étape 1
    const btnDemarrer = document.getElementById('btn-demarrer-demarche');
    if (btnDemarrer) {
        btnDemarrer.addEventListener('click', () => {
            document.getElementById('etape-1').style.display = 'none';
            document.getElementById('etape-2').style.display = 'block';
        });
    }

    // Formulaire d'upload (Étape 2)
    const formDossier = document.getElementById('form-dossier');
    if (formDossier) {
        formDossier.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSubmit = formDossier.querySelector('button[type="submit"]');
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Envoi en cours...';

            try {
                // 1. Récupérer les champs formulaires
                const formData = new FormData(formDossier);
                
                // Envoyer la demande via API
                // const resDemande = await fetch('https://api.garage2a.fr/api/demande', {
                //    method: 'POST',
                //    headers: { 'Content-Type': 'application/json' },
                //    body: JSON.stringify({...window.currentDemande, ...dataObj})
                // });
                // const resultDemande = await resDemande.json();
                
                // Simulation API :
                setTimeout(() => {
                    const resultDemande = { success: true, demandeId: "D" + Date.now() };
                    window.currentDemandeId = resultDemande.demandeId;
                    
                    // Passage étape 3
                    document.getElementById('etape-2').style.display = 'none';
                    document.getElementById('etape-3').style.display = 'block';
                    
                    // Initialiser le composant Stripe (appel de la fonction dans paiement.js)
                    if (window.initStripePaiement) {
                        window.initStripePaiement();
                    }
                }, 1000);

            } catch (err) {
                console.error(err);
                alert("Erreur lors de la validation du dossier.");
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Continuer vers le paiement →';
            }
        });
    }

    // Bouton retour depuis étape 2
    const btnRetourEtape2 = document.getElementById('btn-retour-etape2');
    if (btnRetourEtape2) {
        btnRetourEtape2.addEventListener('click', () => {
            document.getElementById('etape-2').style.display = 'none';
            document.getElementById('etape-1').style.display = 'block';
        });
    }
});
