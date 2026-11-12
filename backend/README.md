# Lancer la migration Drizzle

npx drizzle-kit generate
npx drizzle-kit migrate

# Forcer la migration (en effaçant les données)

npx drizzle-kit push

# Installer drizzle

npm i drizzle-orm mysql2
npm i -D drizzle-kit
npm install @better-auth/drizzle-adapter

# Générer le schéma BD de Better-Auth (database/auth-schema.ts)

npx auth@latest generate
