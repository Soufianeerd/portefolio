// frontend/assets/js/paiement.js

// Déclaration de la clé publique Stripe (Sécurisé côté frontend)
// À remplacer par la vraie clé 'pk_live_...' ou via variable d'environnement Netlify
const STRIPE_PUBLISHABLE_KEY = 'pk_test_123456789'; 

let stripe, elements, cardElement;

window.initStripePaiement = function() {
    if (!stripe) {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        elements = stripe.elements();

        // Style aligné sur le Design System (main.css)
        cardElement = elements.create('card', {
            style: {
                base: {
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '16px',
                    color: '#0d0d0f',
                    '::placeholder': { color: '#6b6860' }
                },
                invalid: { color: '#e63030' }
            }
        });
        
        cardElement.mount('#stripe-card-element');
    }
};

window.payerCG = async function() {
    const btnPayer = document.getElementById('btn-payer');
    if(btnPayer.disabled) return;
    
    btnPayer.disabled = true;
    btnPayer.textContent = 'Traitement en cours...';

    try {
        /*
        // Code de production (Appel vers le backend Node.js réel)
        const res = await fetch('/api/paiement/intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ demandeId: window.currentDemandeId })
        });
        const { clientSecret } = await res.json();
        
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement }
        });
        
        if (error) { throw new Error(error.message); }
        */

        // Simulation de succès pour visualiser le parcours complet en local
        setTimeout(() => {
            document.getElementById('etape-3').style.display = 'none';
            document.getElementById('etape-sucess').style.display = 'block';
            document.getElementById('etape-sucess').innerHTML = `
                <h2 style="color:var(--c-green);">Paiement réussi ! ✅</h2>
                <p style="margin-top:20px; font-size:1.1rem;">Votre dossier de carte grise a bien été transmis. (Réf : <strong>${window.currentDemandeId}</strong>)</p>
                <p style="margin-bottom:30px; color:var(--c-muted);">Vous recevrez un e-mail de confirmation avec votre reçu et le suivi de vos démarches.</p>
                <button class="btn btn-outline" onclick="location.reload()">Retour à l'accueil</button>
            `;
        }, 1500);

    } catch (err) {
        console.error(err);
        alert(err.message || 'Une erreur est survenue lors du paiement. Veuillez réessayer.');
        btnPayer.disabled = false;
        btnPayer.textContent = 'Payer et finaliser →';
    }
};
