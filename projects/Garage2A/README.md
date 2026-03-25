# Garage 2A — Guide de déploiement

## Ordre des opérations

### 1. Backend (Railway)
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm start
```

### 2. Variables d'environnement Railway (à remplir)
```
DATABASE_URL         = [Supabase → Settings → Database → Connection String]
STRIPE_SECRET_KEY    = sk_live_...
STRIPE_WEBHOOK_SECRET= whsec_... [Dashboard Stripe → Webhooks → Signing secret]
CLOUDINARY_CLOUD_NAME= ...
CLOUDINARY_API_KEY   = ...
CLOUDINARY_API_SECRET= ...
RESEND_API_KEY       = re_...
EMAIL_GERANT         = votre@email.fr
ADMIN_SECRET         = [chaine aleatoire longue]
NODE_ENV             = production
CORS_ORIGIN          = https://garage2a.fr
```

### 3. Frontend (Netlify)
- Upload du dossier `frontend/`
- Variables Netlify :
  ```
  STRIPE_PUBLISHABLE_KEY = pk_live_...
  ```
- Dans index.html, remplacer :
  - `pk_test_REMPLACER_PAR_VOTRE_CLE_PUBLISHABLE` → votre pk_live_...
  - `https://api.garage2a.fr` → URL de votre backend Railway

### 4. Stripe Webhook
- Dashboard Stripe → Webhooks → Add endpoint
- URL : `https://api.garage2a.fr/api/webhook/stripe`
- Events : `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
- Copier le Signing Secret → STRIPE_WEBHOOK_SECRET dans Railway

### 5. Test final
1. Mode test Stripe (sk_test_ / pk_test_)
2. Carte de test : 4242 4242 4242 4242 · 12/34 · 123
3. Vérifier : DB mise à jour + email reçu + alerte gérant
4. Passer en live (sk_live_ / pk_live_)
