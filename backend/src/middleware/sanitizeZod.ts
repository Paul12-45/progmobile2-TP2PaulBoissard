// Middleware de sécurité Zod devant obligatoirement être utilisé 
// dans chaque route qui requiert des paramètres (URL ou body)
// RÈGLE IMPORTANTE EN SÉCURITÉ - NEVER TRUST USER INPUT
// Vous devez définir des schémas Zod et les utiliser dans vos routes
// pour vous protéger contre les injections NoSQL ou XSS
import { z } from 'zod';
import { type Request, type Response, type NextFunction } from 'express';

export const sanitizeZod = (schema: { body?: z.ZodObject<any>, params?: z.ZodObject<any>, query?: z.ZodObject<any> }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Remplacer le body par la version safe validée par Zod
      if (schema.body) {
        req.body = schema.body.strict().parse(req.body);
      }

      // 2. Validation des paramètres de l'URL. Exemple : GET /voyage/:id => req.params.id
      if (schema.params) {
        // Remplacer les paramètres par la version safe validée par Zod
        req.params = schema.params.strict().parse(req.params) as any;
      }

      // 3. Validation des paramètres query de l'URL. Exemple : GET /voyage?depart=Montréal&arrivee=St-Félicien 
      // => req.query.depart et req.query.arrivee
      if (schema.query) {
        const safeQuery = schema.query.strict().parse(req.query);
        // Faire le ménage de req.query et le remplacer par la version safe validéee par Zod
        for (const key in req.query) delete req.query[key];
        Object.assign(req.query, safeQuery);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // On renvoie un message simple et explicite
        const messages = error.issues.map(i => i.message).join(". ");
        return res.status(400).json({
          message: `Données invalides : ${messages}`
        });
      }
      next(error);
    }
  };
};