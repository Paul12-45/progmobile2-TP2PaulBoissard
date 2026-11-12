import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './verifierAuth.ts';

/**
 * Middleware pour exiger un rôle spécifique sur une route protégée.
 * Utilisation : exigerRole('pilote')
 */
function exigerRole(role: string) {
    return function (req: AuthRequest, res: Response, next: NextFunction) {
        if (!req.authUsager || req.authUsager.role !== role) {
            return res.status(403).json({ message: 'Vous n’avez pas les permissions requises.' });
        }
        next();
    };
}

/**
 * Middleware prêt à l'emploi pour exiger le rôle "pilote".
 */
export function exigerRolePilote() {
    return exigerRole('pilote');
}
