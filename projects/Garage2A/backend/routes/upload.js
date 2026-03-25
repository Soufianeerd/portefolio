import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const router = express.Router();
const prisma = new PrismaClient();

// Configuration Cloudinary avec les ENVs
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'garage2a_placeholder',
  api_key: process.env.CLOUDINARY_API_KEY || 'api_key_placeholder',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'api_secret_placeholder'
});

// Configuration de réception temporaire Multer
const storage = multer.diskStorage({
    destination: '/tmp', // Stockage temporaire (utile pour Render/Railway)
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Validation Anti-Abus strict
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format non accepté. JPG, PNG ou PDF uniquement.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 6 } // 5MB max / 6 Fichiers min
});

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { demandeId, type } = req.body;
        
        if (!req.file) throw new Error("Aucun fichier reçu");
        if (!demandeId) throw new Error("Paramètre demandeId manquant");
        if (!type) throw new Error("Type de document manquant");
        
        // Upload vers le Cloudinary avec permissions en 'private' (url non-publique et conteneur unique)
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `garage2a/dossiers/${demandeId}`,
            type: 'private', 
            resource_type: 'auto'
        });

        // Insertion du document en base attachée à la demande
        const doc = await prisma.document.create({
            data: { 
                demandeId, 
                type, 
                url: result.secure_url, 
                publicId: result.public_id 
            }
        });
        
        res.json({ success: true, message: "Fichier réceptionné avec succès", documentId: doc.id });
    } catch (err) {
        console.error("Erreur Upload Document:", err);
        res.status(500).json({ success: false, error: err.message || "Erreur upload" });
    }
});

export default router;
