import { Router } from 'express';
import verifierAuth from '../middleware/verifierAuth.ts';
import { obtenirBonjour } from '../controllers/bonjour.ts';

// --- 1. LES RÉGLES DE VALIDATION DES ROUTES (SÉCURITÉ) ---
// RÈGLE IMPORTANTE EN SÉCURITÉ - NEVER TRUST USER INPUT
// Vous devez définir des schémas Zod et les appeler dans vos route pour
// vous protéger contre les injections SQL ou XSS

// --- 2. LES ROUTES ---
const router = Router();

// L'authentification est gérée part token (Azure AD) : middleware verifierAuth.ts
// Les tokens sont validés par le middleware verifierAuth.ts sur les routes protégées

// GET /api/bonjour -> Renvoie un message de bienvenue
router.get('/', verifierAuth, obtenirBonjour);

export default router;
