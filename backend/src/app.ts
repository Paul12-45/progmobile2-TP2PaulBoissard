import type { Request, Response, NextFunction } from 'express';
import express from 'express';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import apiRoutes from './routes/all.ts';

// Better Auth
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.ts';

export const app = express();

// Pour que Express détecte la vraie IP derrière un proxy (ex: cPanel, Nginx, etc.)
app.set('trust proxy', 1);

// CORS doit être appliqué EN PREMIER pour que les erreurs (rate limit, etc.) soient lisibles par le frontend
// Whitelist : Charger les origines autorisées depuis les variables d'environnement
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Rate limiter global : limite chaque IP à X requêtes par 15 minutes
// Limite élevée pour supporter les environnements avec IP partagée (ex: Cégep)
const isDev = process.env.NODE_ENV !== 'production';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 1000 : 500, // 1000 en dev (hot reload de Vite), 500 en prod (IP partagées)
  standardHeaders: true, // Retourne les infos de rate limit dans les headers standard
  legacyHeaders: false, // Désactive les headers obsolètes
  message: 'Protection anti DDoS, veuillez réessayer plus tard.'
});
app.use(limiter);

// Servir les images uploadées en statique (avant helmet)
app.use('/images', express.static(path.join(process.cwd(), '../upload_images'), {
  setHeaders: (res) => {
    // MAILLON FORT : Autorise uniquement le même domaine et ses sous-domaines
    res.set('Cross-Origin-Resource-Policy', 'same-site');
    // MAILLON DE PRÉCAUTION : Empêche l'exécution de scripts cachés
    res.set('X-Content-Type-Options', 'nosniff');
    // On n'ajoute PAS de CORS (Access-Control-Allow-Origin) car on'a pas de <canvas>
  }
}));

// Sécuriser les headers HTTP avec Helmet
// CSP : on ajoute Azure AD aux sources autorisées pour les connexions
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      connectSrc: ["'self'", "https://login.microsoftonline.com"],
    },
  },
}));

// Désactiver le header 'X-Powered-By' pour ne pas divulguer la techno serveur
app.disable('x-powered-by');

// Better Auth : Leur documentation indique de le placer avant express.json
app.all('/api/auth/{*splat}', toNodeHandler(auth)); // Format Express 5

// Middleware important pour gérer les requêtes POST
// qui nous permet d'extraire le JSON du Body de la requête http
// Sécurité : On limite la taille du body à 1kb pour éviter les attaques par déni de service (DoS)
// en envoyant de très gros payloads.
// Vous pouvez ajuster cette taille selon vos besoins.
app.use(express.json({ limit: '1kb' }));
app.use(express.urlencoded({ extended: true, limit: '1kb' }));

// Servir notre API REST sur le chemin /api
app.use('/api', apiRoutes);

// Servir le frontend React (build) depuis le même serveur
const frontendPath = path.join(process.cwd(), '../frontendCovoiturage/dist');

// Le frontend est optionnel : on ne le sert que si le build existe
const indexPath = path.join(frontendPath, 'index.html');

if (fs.existsSync(indexPath)) {
  app.use(express.static(frontendPath));

  // Frontend React: toutes les routes non-API retournent index.html pour React Router
  app.get('{*splat}', (req, res, next) => {
    // Ne pas intercepter les routes API
    if (req.path.startsWith('/api') || req.path.startsWith('/images')) {
      return next();
    }
    res.sendFile(indexPath);
  });
}

// Custom 404
app.use((req, res, next) => {
  res.status(404).send("Ressource non trouvée.");
});

// Custom error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Erreur interne du serveur.");
});

export default app;