# Modifications apportées

## 1. Mises à jour Frontend (Mobile)
- Migration de `expo-av` vers `expo-video` (dépréciation d'expo-av).
- Création du `splash-video.mp4` et implémentation dans `index.js` (timeout de 6s ajouté, et possibilité de passer l'intro en cliquant).
- Refactorisation de la récupération du profil: appel à `/api/auth/me` lors du login et de la restauration de la session, pour peupler le store Zustand avec de vraies données.
- Modification de la vue Profile (`profile.js`) pour la rendre "read-only".
- Modification du formulaire de création de compte (`register.js`) pour ne pas sauvegarder le profil dans le store local avant même la validation.
- Écran Chat: Auto-scroll en bas de page implémenté, les suggestions rapides disparaissent dès qu'il y a un message, suppression des titres de conversation, et optimisation du chargement sur montage/focus.
- Formulaire transaction (`transaction-form.js`): La date par défaut utilise la date locale, catégorie par défaut désactivée, et deux listes de catégories distinctes créées selon le type de transaction.
- Dashboard et Transactions (`dashboard.js`, `transactions.js`): Implémentation des états de chargement (ActivityIndicator) et gestion des erreurs (message "Impossible de charger les données" avec bouton "Réessayer").
- Nettoyage du code : suppression des packages inutilisés (`date-fns`) et des imports / styles non utilisés (`Image`, etc.).
- Modification de l'API (`services/api.js`) pour prendre en compte le backend distant et un parsing propre du `Server-Sent Events` pour le streaming.

## 2. Mises à jour Backend
- Refonte des prompts système IA (`systemPrompt.js`) pour répondre de manière plus concise, afficher en DH, et utiliser la langue de l'utilisateur.
- Refonte de la logique des fonctions IA (`agent.js`, `tools.js`) : utilisation de try/catch, limitation au 1er tool call, température à 0.2, extraction des dates vers `dates.js`, et implémentation du calcul exact pour `simulateNewHire`.
- Dashboard API (`dashboard.controller.js`, `dashboard.routes.js`): Ajout de l'endpoint `GET /api/dashboard/categories` pour retourner les 5 principales catégories de dépense.
- Authentication (`auth.controller.js`, `auth.routes.js`, `auth.validation.js`): Ajout de l'endpoint `GET /api/auth/me` et sécurisation des vérifications email (trim, toLowerCase) avec Zod.
- Transactions (`transaction.controller.js`) : Ajout d'un tri secondaire sur `createdAt` DESC.
- Server (`server.js`) : Ajout des vérifications bloquantes pour s'assurer que les variables d'environnement clés sont définies.
- Tests : Implémentation des tests sur `dates.js` via le framework natif node:test.
- OpenAPI : Mise à jour de `openapi.js` pour inclure la route `/api/dashboard/categories`.
- Nettoyage : Création de la collection Postman dans `backend/docs/BizPulse.postman_collection.json`.

## 3. Autres Actions
- Création et structuration des `.env.example` et `.gitignore`.
- Nettoyage du dossier cache `.expo`.
- Configuration documentée dans `README.md` et `prompts-journal.md`.
