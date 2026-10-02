# BizPulse - Gestion pour TPE/PME

Application de gestion de budget (revenus/dépenses) et d'assistance via IA pour les petites entreprises.

## Technologies
- **Backend:** Node.js, Express, Sequelize, PostgreSQL, Groq (SDK OpenAI)
- **Mobile:** React Native, Expo, Zustand, expo-video

## Installation
1. Cloner le projet.
2. Installer les dépendances :
   - `cd backend && npm install`
   - `cd mobile && npm install`
3. Configurer l'environnement :
   - Copier `backend/.env.example` en `backend/.env` et configurer.
   - Copier `mobile/.env.example` en `mobile/.env` et configurer.
4. Lancer le backend : `cd backend && npm run dev`
5. Lancer le mobile : `cd mobile && npx expo start`
