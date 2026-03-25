import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const prisma = new PrismaClient();

router.post('/stripe', async (req, res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        // Validation stricte et construction de l'événement avec signature locale
        // Le endpointSecret doit obligatoirement être configuré sur le .env de prod
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';
        event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
        console.error(`🔴 Webhook Erreur (Signature invalide): ${err.message}`);
        // Il est crucial de renvoyer 400 pour que Stripe sache que l'event n'a pas été accepté
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Gestion du succès du paiement
    if (event.type === 'payment_intent.succeeded') {
        const intent = event.data.object;
        const demandeId = intent.metadata.demandeId;

        if (demandeId) {
            // Mise à jour du statut du dossier dans Prisma
            await prisma.demande.update({
                where: { id: demandeId },
                data: {
                    paiementStatut: 'paye',
                    paiementDate: new Date(),
                    statutDossier: 'en_cours'
                }
            });
            console.log(`✅ Webhook : Dossier ${demandeId} honoré avec succès.`);
            // TODO : Envoyer l'email Resend ici `sendConfirmationEmail(demandeId)`
        }
    }

    // On renvoie un statut 200 à la fin pour accuser réception
    res.json({ received: true });
});

export default router;
