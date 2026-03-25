import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/demande
// Instanciation de la demande dans la base de données PostgreSQL via Prisma
router.post('/', async (req, res) => {
    try {
        const { 
            nom, prenom, email, telephone, immatriculation, 
            typeDemarche, departement, cv, energie, annee, 
            taxeRegionale, totalTaxes, totalTTC 
        } = req.body;
        
        // Création du dossier sécurisé en BDD
        const demande = await prisma.demande.create({
            data: {
                nom,
                prenom,
                email,
                telephone,
                immatriculation,
                typeDemarche,
                departement,
                cv: parseInt(cv),
                energie,
                annee: parseInt(annee),
                taxeRegionale: parseFloat(taxeRegionale),
                totalTaxes: parseFloat(totalTaxes),
                totalTTC: parseFloat(totalTTC)
            }
        });
        
        res.json({ 
            success: true, 
            demandeId: demande.id, 
            message: "Dossier instancié avec succès" 
        });
    } catch (err) {
        console.error("Erreur serveur Demande:", err);
        res.status(500).json({ success: false, error: "Erreur serveur lors de la création de la demande BDD." });
    }
});

export default router;
