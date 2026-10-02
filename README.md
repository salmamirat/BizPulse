# BizPulse

Application de gestion de budget (revenus/dépenses) et d'assistance via IA pour les petites entreprises.

## Structure
- **Backend:** Node.js, Express, Sequelize, PostgreSQL, Groq (SDK OpenAI)
- **Mobile:** React Native, Expo, Zustand, expo-video

L'application mobile contient 7 écrans (`.js`) : login, register, dashboard, transactions, transaction-form, chat, profile, plus une vidéo de splash screen.

Le dashboard affiche :
- Revenus
- Dépenses
- Solde
- Répartition par catégorie

Le profil est en lecture seule (nom, email, secteur) avec option de déconnexion.

## Installation et lancement

### Backend
Le backend est configuré pour être lancé via Docker :
```bash
docker compose --env-file backend/.env up --build
```
La documentation de l'API (Scalar) est accessible sur : `http://localhost:5000/api/scalar`

L'API inclut notamment :
- `GET /api/auth/me`
- `GET /api/dashboard/categories`

### Mobile
Le mobile nécessite un fichier `mobile/.env` avec la variable `EXPO_PUBLIC_API_URL`.
- Sur un émulateur Android, l'URL est typiquement `http://10.0.2.2:5000/api`.
- Sur un téléphone physique, utilisez l'adresse IP locale de votre machine (ex: `http://192.168.1.X:5000/api`).

Lancement :
```bash
cd mobile
npm install
npx expo start
```

## Tests automatisés
Pour lancer les tests automatisés :
```bash
cd backend && npm test
```
**Attention :** Les tests automatisés couvrent uniquement la logique des dates (fichier `dates.js`). Tout le reste de l'application (backend et mobile) est testé manuellement. L'API se teste à la main avec la documentation Scalar : http://localhost:5000/api/scalar

## Limites connues
- Le streaming de l'IA renvoie l'intégralité de la réponse mot par mot après avoir reçu la réponse complète du LLM.
- La déconnexion (logout) ne révoque pas le refresh token côté serveur.
- La base de données utilise `sync({ alter: true })` au lieu d'un système de migrations formel.
- Le filtre par mot-clé n'est pas une véritable protection contre le prompt-injection.
- L'agent gère un seul appel de fonction (function call) par question.

## Déploiement
Le projet est prêt à être déployé sur des plateformes comme Render ou Railway, mais n'est non déployé à ce stade.

## Arborescence du projet
Voici les fichiers clés du projet :
- `backend/tests/` : Dossier contenant les tests (ex: `dates.test.js`)
- `backend/src/ai/dates.js` : Logique de calcul des dates
- `mobile/.env.example` : Exemple de configuration mobile
- `mobile/assets/splash.mp4` : Vidéo de démarrage
- `prompts-journal.md` : Journal des prompts utilisés
