// https://better-auth.com/docs/installation
// Pas besoin de générer de schéma en MongoDB (contrairement à SQL)
// https://better-auth.com/docs/adapters/mongo

import * as schema from "./database/auth-schema.ts";
import { bd } from "./database/bd.ts";
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';
import { betterAuth } from "better-auth/minimal";
import { expo } from "@better-auth/expo";
import { i18n, locales } from "@better-auth/i18n"

export const auth = betterAuth({
    database: drizzleAdapter(bd, {
        provider: "mysql",
        schema,
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: false, // On ne veut pas que l'usager puisse choisir son rôle (usager ou pilote) lors de l'inscription. Le rôle est géré par le serveur.
                defaultValue: "usager"
            },
            numeroTelephone: {
                type: "string",
                input: true // On veut que l'usager puisse saisir son numéro de téléphone lors de l'inscription. Ce champ est obligatoire.
            },
        }
    },

    // ... le reste de la configuration (socialProviders, etc.)
    emailAndPassword: {
        enabled: true,
        //disableSignUp : true, On pourrait désactiver l'inscription si on souhaiterait seulement un compte admin.
    },

    // Configuration spécifique pour les applications mobiles => plugins + trustedOrigins
    plugins: [
        expo(),
        // Pour la traduction des messages d'erreur que Better Auth affiche à l'usager - qui sont par défaut en anglais (ex : Password is too short)
        i18n({
            defaultLocale: "fr",
            translations: {
                //en: locales.en,
                fr: locales.fr,
            },
        })

    ],
    trustedOrigins: [
        "covoiturage://",
        "https://covoiturage.mathieulaprise.disf-sandbox.ca",
        // Development mode - Expo's exp:// scheme with local IP ranges
        ...(process.env.NODE_ENV !== "production" ? [
            // Pour tester notre appli mobile avec l'émulateur Android
            "exp://",                      // Trust all Expo URLs (prefix matching)
            "exp://**",                    // Trust all Expo URLs (wildcard matching)
            "exp://192.168.*.*:*/**",      // Trust 192.168.x.x IP range with any port and path,
            "http://localhost:*", // Trust localhost (pour test avec Google Chrome)
        ] : []),
    ],
    // Configuration pour pouvoir tester avec Expo en mode web localhost. Seulement pour le développement (mobile).
    advanced: {
        defaultCookieAttributes: {
            sameSite: process.env.NODE_ENV === "production" ? "lax" : "none",
            secure: true,
            partitioned: process.env.NODE_ENV === "production" ? false : true
        }
    }

});