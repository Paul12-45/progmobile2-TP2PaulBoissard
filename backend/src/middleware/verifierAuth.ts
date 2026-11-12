import type { Request, Response, NextFunction } from 'express';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth.ts';

export interface AuthRequest extends Request {
    authUsager?: {
        id: string;
        nom: string;
        email: string;
        role: string;
    };
}

// Middleware principal à utiliser dans les routes
export default async function verifierAuth(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        // Sécurité : s'assurer qu'aucune donnée client ne pollue req.authUsager
        delete req.authUsager;

        // 1. Récupération de la session en traduisant les headers d'Express pour Better Auth
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        // 2. Si aucune session ou aucun usager n'est trouvé, on bloque immédiatement
        if (!session || !session.user) {
            return res.status(401).json({ error: 'Authentification échouée' });
        }

        // 3. Extraction de l'usager injecté par Better Auth
        const usager = session.user;

        // Ajout des infos utiles dans req pour les controllers
        req.authUsager = {
            id: usager.id,
            nom: usager.name,
            email: usager.email,
            role: usager.role || 'usager', // Par défaut, on considère le rôle comme "usager" si non défini
        };

        next();
    } catch (erreur: any) {
        console.error("Erreur critique dans le middleware verifierAuth :", erreur.message);
        return res.status(500).json({ error: 'Erreur interne lors de la vérification de l\'authentification.' });
    }
}