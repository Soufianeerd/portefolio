/**
 * ═══════════════════════════════════════════════════════
 *  LIVRE D'OR AUDIO — Backend Node.js / Express
 *  Soufiane & Salma · 23 Octobre 2026
 * ═══════════════════════════════════════════════════════
 *
 *  Routes :
 *    POST /upload           → Reçoit et sauvegarde un audio
 *    GET  /audios           → Liste tous les fichiers audio
 *    GET  /download/:file   → Télécharge un fichier audio
 *    GET  /                 → Statut du serveur
 *
 *  Usage :
 *    node server.js
 *    # ou en développement :
 *    npx nodemon server.js
 */

'use strict';

const express = require('express');
const multer  = require('multer');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');

const app  = express();

/* ── CONFIGURATION ─────────────────────────────────────
   [EDIT] PORT  → port d'écoute du serveur
   [EDIT] Modifiez MAX_FILE_SIZE si besoin (en octets)    */
const PORT          = process.env.PORT || 3000;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 Mo max par fichier
const UPLOAD_DIR    = path.join(__dirname, 'uploads');

/* ── CRÉATION DU DOSSIER UPLOADS ────────────────────── */
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log('📁 Dossier uploads créé :', UPLOAD_DIR);
}

/* ── MIDDLEWARES ─────────────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS : autorise toutes les origines en développement
// [EDIT] En production, restreignez à votre domaine :
//   origin: 'https://votre-site.netlify.app'
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

/* ── MULTER (gestion des uploads) ───────────────────── */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),

  filename: (_req, file, cb) => {
    // Nom du fichier défini côté client — on l'accepte tel quel
    // Sécurité : on nettoie les caractères dangereux
    const safe = file.originalname
      .replace(/[^a-zA-Z0-9À-öø-ÿ._-]/g, '_')
      .slice(0, 120);
    cb(null, safe);
  }
});

const fileFilter = (_req, file, cb) => {
  // Types MIME autorisés (WebM, MP4/M4A, OGG, WAV)
  const allowed = [
    'audio/webm',
    'audio/mp4',
    'audio/x-m4a',
    'audio/mpeg',
    'audio/ogg',
    'audio/wav',
    'audio/wave',
    'video/webm' // certains navigateurs déclarent video/webm pour l'audio
  ];
  if (allowed.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error(`Type MIME non autorisé : ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

/* ═══════════════════════════════════════════════════════
   ROUTES
   ═══════════════════════════════════════════════════════ */

/* ── GET / — Statut du serveur ── */
app.get('/', (_req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR).filter(isAudioFile);
  res.json({
    status:  '✅ Serveur Livre d\'Or Audio opérationnel',
    version: '1.0.0',
    audios:  files.length,
    uptime:  Math.floor(process.uptime()) + 's'
  });
});

/* ── POST /upload — Recevoir un audio ── */
app.post('/upload', upload.single('audio'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu.' });
    }

    const { name = 'Anonyme', relation = '', duration = '?' } = req.body;

    // Log dans la console du serveur
    const line = '─'.repeat(50);
    console.log(`\n${line}`);
    console.log(`🎤  NOUVEAU MESSAGE AUDIO`);
    console.log(`    Prénom   : ${name}`);
    if (relation) console.log(`    Relation : ${relation}`);
    console.log(`    Durée    : ${duration}s`);
    console.log(`    Fichier  : ${req.file.filename}`);
    console.log(`    Taille   : ${(req.file.size / 1024).toFixed(1)} Ko`);
    console.log(`    MIME     : ${req.file.mimetype}`);
    console.log(`    Chemin   : ${req.file.path}`);
    console.log(`    Heure    : ${new Date().toLocaleString('fr-FR')}`);
    console.log(`${line}\n`);

    return res.status(200).json({
      success:  true,
      message:  'Audio enregistré avec succès.',
      filename: req.file.filename,
      size:     req.file.size
    });

  } catch (err) {
    console.error('❌ Erreur upload :', err);
    return res.status(500).json({ error: 'Erreur serveur interne.' });
  }
});

/* ── GET /audios — Lister tous les fichiers ── */
app.get('/audios', (_req, res) => {
  try {
    const files = fs.readdirSync(UPLOAD_DIR)
      .filter(isAudioFile)
      .map(f => {
        const fullPath = path.join(UPLOAD_DIR, f);
        const stats    = fs.statSync(fullPath);
        // Extraire prénom depuis le nom de fichier (timestamp_prenom_relation.ext)
        const parts    = f.replace(/\.[^.]+$/, '').split('_');
        const prenom   = parts.slice(1).join(' ') || f;
        return {
          filename:  f,
          prenom,
          size:      stats.size,
          sizeKo:    (stats.size / 1024).toFixed(1) + ' Ko',
          created:   stats.birthtime,
          url:       `/download/${encodeURIComponent(f)}`
        };
      })
      // Tri par date de création (plus récent en dernier)
      .sort((a, b) => new Date(a.created) - new Date(b.created));

    return res.json({
      count: files.length,
      files
    });
  } catch (err) {
    console.error('❌ Erreur lecture :', err);
    return res.status(500).json({ error: 'Impossible de lire le dossier.' });
  }
});

/* ── GET /download/:filename — Télécharger un fichier ── */
app.get('/download/:filename', (req, res) => {
  const filename = path.basename(decodeURIComponent(req.params.filename));
  const filePath = path.join(UPLOAD_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Fichier introuvable.' });
  }

  // Sécurité : vérifier que le chemin est bien dans uploads/
  if (!filePath.startsWith(UPLOAD_DIR)) {
    return res.status(403).json({ error: 'Accès interdit.' });
  }

  res.download(filePath, filename);
});

/* ═══════════════════════════════════════════════════════
   GESTION DES ERREURS
   ═══════════════════════════════════════════════════════ */
app.use((err, _req, res, _next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Fichier trop volumineux (max 15 Mo).' });
  }
  console.error('❌ Erreur non gérée :', err.message);
  return res.status(500).json({ error: err.message || 'Erreur serveur.' });
});

/* ═══════════════════════════════════════════════════════
   DÉMARRAGE
   ═══════════════════════════════════════════════════════ */
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║    LIVRE D\'OR AUDIO — Serveur démarré   ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`🚀 URL locale   : http://localhost:${PORT}`);
  console.log(`📁 Dossier audios : ${UPLOAD_DIR}`);
  console.log(`📋 Liste audios : http://localhost:${PORT}/audios`);
  console.log('──────────────────────────────────────────\n');
});

/* ── HELPERS ── */
function isAudioFile(name) {
  return /\.(webm|m4a|mp4|ogg|wav|mp3)$/i.test(name);
}
