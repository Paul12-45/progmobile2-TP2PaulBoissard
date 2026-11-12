import type { Response, NextFunction } from 'express';
import type { AuthRequest } from "../middleware/verifierAuth";

// GET /api/hello
export const obtenirBonjour = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const {id, nom, email, role} = req.authUsager!;
  return res.status(200).json({message: `Bonjour, ${nom} ! Votre email est ${email}, votre identifiant est ${id} et votre rôle est ${role}.`});
};