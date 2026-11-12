import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';
import { createPool } from 'mysql2';

// Charger les variables d'environnement immédiatement
dotenv.config();

console.log('✓ Variables d\'environnement chargées');

// 1. Initialisation de la connexion à la base de données MySQL/MariaDB via Drizzle ORM
// On utilise le driver moderne mysql2

const estBDLocal = process.env.BD_SERVEUR === "localhost"; // CPanel : BD Local. Tandis que Layerbase : BD distante (cloud).

export const bd = drizzle({
    client: createPool({
        host: process.env.BD_SERVEUR,
        port: process.env.BD_PORT ? Number(process.env.BD_PORT) : 3306,
        user: process.env.BD_USAGER,
        password: process.env.BD_MOT_DE_PASSE,
        database: process.env.BD_NOM,
        ...(!estBDLocal && { ssl: { rejectUnauthorized: true } }),
    })
});

// 2. Top-Level await : Bloque l'importation tant que la BD n'est pas prête
async function connecterBD() {
    try {
        await bd.execute('select 1');
        console.log('✅ Connexion à la BD réussie !');
    } catch (error: any) {
        console.error('❌ Erreur de connexion à la BD :');
        console.error('   Message:', error.message, error.cause?.message);
        process.exit(1); // On arrête le serveur si la BD ne répond pas
    }
}

connecterBD();



