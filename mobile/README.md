# BizPulse Mobile

Application mobile React Native / Expo de BizPulse, connectée à l'API backend Express.

## Structure du projet

- `app/` : 8 écrans Expo Router (`index.js` splash, `login.js`, `register.js`, `dashboard.js`, `transactions.js`, `transaction-form.js`, `profile.js`, `chat.js`) et configuration globale `_layout.js`
- `components/` : composants UI (`BottomNav.js`, `Button.js`, `Card.js`, `Input.js`, `TransactionItem.js`)
- `constants/` : `colors.js` (palette de couleurs et thème bordeaux `#800020`)
- `services/api.js` : client API centralisé (Axios, intercepteur de token et rafraîchissement automatique)
- `store/authStore.js` : gestion de l'état de session et du profil avec Zustand et SecureStore
- `assets/` : logo SVG et vidéo de lancement

## Installation et démarrage

```bash
cd mobile
npm install
npx expo start -c
```

- **Pour Android Émulateur** : appuyez sur `a` dans le terminal Expo (utilise par défaut `http://10.0.2.2:5000/api`).
- **Pour iOS Simulateur** : appuyez sur `i` dans le terminal Expo (utilise par défaut `http://localhost:5000/api`).

## Lancer sur un vrai téléphone (Expo Go)

1. Assurez-vous que votre téléphone et votre ordinateur sont connectés au **même réseau Wi-Fi**.
2. Trouvez l'adresse IP locale de votre ordinateur (ex. sous Windows : tapez `ipconfig` dans un terminal et notez l'IPv4, ex. `192.168.1.50`).
3. Créez un fichier `mobile/.env` à partir de `mobile/.env.example` :
   ```env
   EXPO_PUBLIC_API_URL=http://<IP-de-ton-PC>:5000/api
   ```
4. Autorisez le port 5000 dans votre pare-feu local si nécessaire.
5. Démarrez Expo avec le cache nettoyé :
   ```bash
   npx expo start -c
   ```
6. Scannez le QR code affiché dans l'application **Expo Go** sur votre téléphone.
