import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
// Initialise Stripe avec la clé secrète (doit être définie dans le .env en production)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const prisma = new PrismaClient();

// POST /api/paiement/intent
router.post('/intent', async (req, res) => {
    try {
        const { demandeId } = req.body;
        
        if (!demandeId) {
            return res.status(400).json({ error: "demandeId manquant" });
        }

        // Vérification de l'existence du dossier en base de données
        const demande = await prisma.demande.findUnique({ where: { id: demandeId } });
        if (!demande) return res.status(404).json({ error: 'Dossier introuvable' });

        const montantCentimes = Math.round(parseFloat(demande.totalTTC) * 100);

        // Création de l'intention de paiement Stripe
        const intent = await stripe.paymentIntents.create({
            amount: montantCentimes,
            currency: 'eur',
            metadata: { demandeId, email: demande.email },
            receipt_email: demande.email,
            description: `Carte grise - ${demande.typeDemarche} - ${demande.immatriculation || 'N/C'}`
        });

        // Met à jour la BDD pour associer le paiement
        await prisma.demande.update({
            where: { id: demandeId },
            data: { stripeIntentId: intent.id }
        });

        // Retourne UNIQUEMENT le client_secret qui permet de confirmer l'UI en Front
        res.json({ clientSecret: intent.client_secret });

    } catch (err) {
        console.error("Erreur Paiement Intent :", err);
        res.status(500).json({ error: "Erreur lors de l'initialisation du paiement Stripe. Vérifiez la clé API secrète." });
    }
});

export default router;
