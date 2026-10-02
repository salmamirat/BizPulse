# BizPulse Mobile

Frontend React Native / Expo de BizPulse, connecté au backend existant.

## Structure

- `app/` : écrans Expo Router
- `components/` : composants UI réutilisables
- `services/api.js` : appels API + refresh token
- `store/authStore.js` : session et profil
- `assets/` : ressources

## Installation

```bash
npm install
npx expo start -c
```

Pour Android Emulator : `a` dans le terminal Expo.

## Backend Android Emulator

L'API utilise `http://10.0.2.2:5000/api`, donc le backend doit tourner sur le port 5000 de la machine.
