import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 1. CONFIGURATION CORS (Sécurité)
// ============================================
const allowedOrigins = [
  'https://garage2a.fr',
  'https://www.garage2a.fr',
  process.env.CORS_ORIGIN,
  process.env.NODE_ENV === 'development' && 'http://localhost:5500',
  process.env.NODE_ENV === 'development' && 'http://127.0.0.1:5500',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Si l'origine est autorisée ou postman (en dev), on laisse passer
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS bloqué'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
  credentials: true
}));

// ============================================
// 2. MIDDLEWARES ET WEBHOOKS
// ============================================
// Attention: le webhook Stripe exige raw payload (Buffer)
import webhookRoute from './routes/webhook.js';
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoute);

// Body Parser natif de express pour le reste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// 3. ROUTES API (Endpoints Rest)
// ============================================
import calculRoute from './routes/calcul.js';
import demandeRoute from './routes/demande.js';
import uploadRoute from './routes/upload.js';
import paiementRoute from './routes/paiement.js';

app.use('/api/calcul-cg', calculRoute);
app.use('/api/demande', demandeRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/paiement', paiementRoute);

// ============================================
// 4. LANCEMENT DU SERVEUR
// ============================================
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Garage2A API - Node.js Express Serveur fonctionnel',
        env: process.env.NODE_ENV
    });
});

app.listen(PORT, () => {
    console.log(`[Garage2A-API] Serveur démarré sur le port ${PORT} [Mode: ${process.env.NODE_ENV || 'production'}]`);
});
