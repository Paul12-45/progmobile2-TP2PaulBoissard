import { Router } from 'express';
import bonjourRoutes from './bonjour.ts';

const router = Router();

// --- DÉBUT DÉFINITIONS DES ROUTES  ---

router.use('/bonjour', bonjourRoutes);

// --- FIN DES DÉFINITIONS DES ROUTES ---

export default router;