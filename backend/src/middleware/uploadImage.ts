import multer, { type FileFilterCallback } from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';

// Dossier de stockage final
const UPLOADS_DIR = path.join(process.cwd(), '../upload_images');

// =====================
// SÉCURITÉ : Gestion de l'upload d'image
// =====================
// 1. Limite la taille des fichiers uploadés (5 Mo)
// 2. Filtre les extensions et types MIME pour éviter l'upload de fichiers dangereux (ex : .php renommé en .jpg)
// 3. Stocke l'image en mémoire (RAM) pour éviter d'écrire un fichier non validé sur le disque
// 4. Génère un nom de fichier unique pour éviter les collisions et l'injection de chemins
// 5. La sauvegarde sur disque n'est faite qu'après validation complète avec la librairie d'image sharp qui est capable de détecter
//    les images corrompues ou malicieuses encore plus précisément que le simple filtrage par extension/MIME qui peut être falsifié

// Filtre de sécurité : n'accepte que certaines extensions et types MIME d'image
// Première barrière pour empêcher l'upload de fichiers exécutables ou dangereux déguisés en image
const valideExtensionFichier = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // Le navigateur nous envoie le type MIME du fichier ex : image/jpeg
  // Et l'extension du fichier ex : .jpg
  // Rien n'empêche un utilisateur malveillant de renommer un fichier .php en .jpg
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images (jpg, png, webp, gif) sont autorisées.'));
  }
};

// Limite stricte de la taille des images uploadées (5 Mo)
const TAILLE_MAX_IMAGE = 5 * 1024 * 1024; // Sécurité : limite l'attaque par upload massif

// Stockage en mémoire vive (RAM) : l'image n'est jamais écrite sur le disque si elle n'est pas validée
const stockageRAM = multer.memoryStorage();

// Configuration de multer avec toutes les règles de sécurité
export const upload = multer({
  storage: stockageRAM,
  limits: { fileSize: TAILLE_MAX_IMAGE }, // 5 Mo max
  fileFilter: valideExtensionFichier
});


// Fonction utilitaire pour générer un nom de fichier image unique
export function genererNomFichierImage(): string {
  return `${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;
}

// Fonction utilitaire à appeler dans le contrôleur pour écrire l'image sur le disque
export async function sauvegarderImageSurDisque(fileBuffer: any, finalFilename: any): Promise<void> {
  console.log(finalFilename)
  if (!fileBuffer || !finalFilename) throw new Error('Buffer ou nom de fichier manquant');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  // 1) Sharp va tenter de lire le fichier. Si ce n'est pas une vraie image, il plantera.
  // 2) De plus, en convertissant en webp, on élimine tout code malveillant caché.
  const outputPath = path.join(UPLOADS_DIR, finalFilename);
  await sharp(fileBuffer)
    .resize(1500, 1500, { fit: 'inside', withoutEnlargement: true })
    .toFormat('webp')
    .webp({ quality: 80 })
    .toFile(outputPath);
}


// Fonction utilitaire pour supprimer une image par son nom de fichier
export async function supprimerImage(nomFichier: string): Promise<void> {
  if (!nomFichier) return;
  const imagePath = path.join(UPLOADS_DIR, nomFichier);
  fs.unlink(imagePath, (err) => {
    // On ignore l'erreur si le fichier n'existe pas
  });
}