import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config();

const estBDLocal = process.env.BD_SERVEUR === "localhost"; // CPanel : BD Local. Tandis que Layerbase : BD distante (cloud).

export default defineConfig({
  out: "./drizzle",
  schema: ["./src/database/schema.ts", "./src/database/auth-schema.ts"],
  dialect: "mysql",
  dbCredentials: {
    host: process.env.BD_SERVEUR!,
    port: Number(process.env.BD_PORT),
    user: process.env.BD_USAGER,
    password: process.env.BD_MOT_DE_PASSE,
    database: process.env.BD_NOM!,
    ...(!estBDLocal && { ssl: { rejectUnauthorized: true } }),
  },
});
