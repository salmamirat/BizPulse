📊 BizPulse

Assistant intelligent de pilotage financier pour petites entreprises

BizPulse est une application mobile full-stack destinée aux petites entreprises.
Elle permet au dirigeant de gérer les revenus, les dépenses et les employés, de suivre sa situation financière depuis un tableau de bord et d'interagir avec un agent IA capable d'analyser les données de l'entreprise et de réaliser des simulations financières.

L'intelligence artificielle est intégrée comme une fonctionnalité principale de l'application grâce à Claude API, au Function Calling et au streaming SSE.

«Projet Fil Rouge — Mobile Augmented AI»

---

🎯 Présentation

Les petites entreprises ont besoin d'une vision simple de leur situation financière pour prendre des décisions au quotidien.

BizPulse centralise les principales données financières de l'entreprise et permet à l'utilisateur de poser des questions directement à un agent IA.

L'agent peut notamment répondre à des questions comme :

«« Quelle est ma situation financière ce mois-ci ? »»

«« Quelle catégorie représente le plus de dépenses ? »»

«« Est-ce que mes revenus augmentent ? »»

«« Est-ce que je peux embaucher un employé à 4000 DH par mois ? »»

«« Est-ce que je peux me permettre une dépense de 8000 DH ? »»

L'agent analyse les données disponibles et fournit une recommandation.
Il ne prend jamais de décision à la place de l'utilisateur.

---

🚀 Fonctionnalités

🔐 Authentification

- Inscription
- Connexion
- Déconnexion
- Authentification avec JWT
- Protection des routes privées
- Hashage des mots de passe avec bcrypt

💰 Gestion des transactions

L'utilisateur peut :

- Ajouter un revenu
- Ajouter une dépense
- Modifier une transaction
- Supprimer une transaction
- Consulter les transactions
- Filtrer les transactions
- Trier les résultats
- Utiliser la pagination

Une transaction contient :

- Type : "revenu" ou "dépense"
- Montant
- Catégorie
- Date

👨‍💼 Gestion des employés

L'utilisateur peut :

- Ajouter un employé
- Consulter ses employés
- Modifier un employé
- Supprimer un employé

Un employé contient :

- Nom
- Salaire
- Date d'embauche

Les informations salariales peuvent être utilisées par l'agent IA pour analyser les charges de l'entreprise et simuler une nouvelle embauche.

📈 Tableau de bord financier

Le dashboard permet de consulter :

- Total des revenus
- Total des dépenses
- Marge
- Évolution des revenus
- Évolution des dépenses
- Informations financières synthétiques

🤖 Agent IA

BizPulse utilise Claude API comme modèle d'intelligence artificielle.

L'agent conversationnel peut :

- Analyser la situation financière
- Résumer les revenus et dépenses
- Analyser les dépenses par catégorie
- Analyser l'évolution des revenus
- Simuler une nouvelle embauche
- Simuler une nouvelle dépense
- Fournir des recommandations basées sur les données disponibles

Les réponses sont envoyées progressivement au mobile grâce au streaming SSE (Server-Sent Events).

---

🧠 Agent IA — Function Calling

L'agent utilise le Function Calling pour accéder aux fonctions métier de BizPulse.

Claude ne récupère pas directement la base de données.
Il demande au backend d'exécuter les fonctions nécessaires, puis utilise les résultats pour construire sa réponse.

Tools disponibles

Fonction| Description
"getFinancialSummary()"| Analyse les revenus, dépenses et marge sur une période
"getExpensesByCategory()"| Analyse la répartition des dépenses par catégorie
"getRevenueTrend()"| Analyse l'évolution des revenus sur plusieurs mois
"simulateNewHire()"| Simule l'impact financier d'une nouvelle embauche
"simulateExpense()"| Simule l'impact financier d'une nouvelle dépense

Exemple

L'utilisateur demande :

«« Est-ce que je peux embaucher un employé à 4000 DH/mois ? »»

L'agent :

Question utilisateur
        ↓
Claude
        ↓
Function Calling
        ↓
simulateNewHire()
        ↓
Données financières
        ↓
Calcul de simulation
        ↓
Résultat
        ↓
Claude
        ↓
Réponse à l'utilisateur

L'agent explique ensuite l'impact de la décision et laisse la décision finale à l'utilisateur.

---

🛡️ Garde-fous et sécurité

L'agent possède un périmètre clairement défini.

Il peut :

- Lire les données nécessaires à l'analyse financière
- Utiliser les fonctions métier disponibles
- Réaliser des simulations
- Fournir des recommandations

Il ne peut pas :

- Prendre une décision à la place de l'utilisateur
- Inventer des données financières
- Modifier automatiquement les données de l'entreprise
- Donner un conseil juridique ou fiscal officiel
- Effectuer une opération sensible sans confirmation de l'utilisateur

Mesures de sécurité

- JWT Authentication
- bcrypt
- Validation des données avec Zod
- Protection des routes
- Rate limiting
- Isolation des données par entreprise
- Protection contre les tentatives de prompt injection
- Journalisation des interactions avec l'agent
- Variables d'environnement pour les secrets

---

🛠️ Stack technique

Mobile

- React Native
- Expo
- Expo Router
- Zustand
- Axios

Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod

Intelligence artificielle

- Claude API
- Function Calling / Tool Use
- Server-Sent Events (SSE)
- Streaming des réponses

Documentation

- Swagger / OpenAPI
- Postman
- UML
- Prompt Journal

DevOps

- Docker
- Docker Compose
- Railway ou Render

---

📁 Structure du projet

bizpulse/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── services/
│   │   ├── ai/
│   │   │   ├── tools.js
│   │   │   ├── systemPrompt.js
│   │   │   └── agent.js
│   │   ├── utils/
│   │   └── app.js
│   │
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── mobile/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (tabs)/
│   │   └── _layout.tsx
│   │
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── assets/
│   └── package.json
│
├── docker-compose.yml
├── prompts-journal.md
└── README.md

---

📱 Écrans

L'application mobile comprend :

- 🔐 Login
- 📝 Register
- 📊 Dashboard
- 💰 Transactions
- 👨‍💼 Employés
- 🤖 Chat IA

Le chat permet de consulter l'historique des conversations et d'afficher progressivement les réponses de l'agent.

---

🗄️ Modèle de données

Les principales entités sont :

Entreprise
   │
   ├── Employé
   │
   ├── Transaction
   │
   └── Conversation
           │
           └── Message

Entreprise

- "id"
- "nom"
- "email"
- "motDePasseHash"
- "secteur"

Employé

- "id"
- "entrepriseId"
- "nom"
- "salaire"
- "dateEmbauche"

Transaction

- "id"
- "entrepriseId"
- "type"
- "montant"
- "categorie"
- "date"

Conversation

- "id"
- "entrepriseId"
- "dateCreation"

Message

- "id"
- "conversationId"
- "role"
- "contenu"
- "horodatage"

---

🔌 API REST

Authentication

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh

Transactions

GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id

Employés

GET    /api/employees
POST   /api/employees
PUT    /api/employees/:id
DELETE /api/employees/:id

Agent IA

POST /api/agent/chat

La route de l'agent utilise le streaming SSE afin de transmettre progressivement la réponse au frontend mobile.

---

⚙️ Installation

Prérequis

- Node.js ≥ 18
- npm
- Docker + Docker Compose
- Expo
- Une clé API Anthropic

1. Cloner le projet

git clone <url-du-repository>
cd bizpulse

2. Installer le backend

cd backend
npm install

3. Installer le mobile

cd ../mobile
npm install

---

🔑 Variables d'environnement

Créer un fichier ".env" dans "backend/" :

PORT=5000

DATABASE_URL="postgresql://user:password@localhost:5432/bizpulse"

JWT_SECRET="change-me"

ANTHROPIC_API_KEY="your-api-key"

⚠️ Le fichier ".env" ne doit jamais être commit dans Git.

---

🐳 Lancer avec Docker

docker-compose up --build

Pour arrêter les conteneurs :

docker-compose down

---

▶️ Lancer en développement

Backend

cd backend

npx prisma migrate dev

npm run dev

Mobile

Dans un autre terminal :

cd mobile

npx expo start

Puis scanner le QR code avec Expo Go.

---

📚 Documentation API

La documentation de l'API est disponible avec Swagger / OpenAPI.

Une collection Postman est également prévue pour tester les endpoints REST.

---

📝 Vibe Coding & Prompt Journal

Le développement de BizPulse est réalisé avec une démarche de vibe coding documentée.

Le fichier "prompts-journal.md" contient :

- Les prompts utilisés
- Les résultats générés
- Les corrections réalisées
- Les problèmes rencontrés
- Les solutions appliquées
- Les choix techniques effectués

L'utilisation de l'IA ne remplace pas la compréhension du code. Chaque fonctionnalité générée est relue, testée et validée avant son intégration.

---

🚀 Déploiement

Le backend est conteneurisé avec Docker.

Le projet peut être déployé sur une plateforme comme :

- Railway
- Render

Les clés API et autres secrets sont configurés via les variables d'environnement.

---

📌 Périmètre du MVP

Inclus

- Authentification JWT
- Gestion des transactions
- Gestion des employés
- Dashboard financier
- Agent conversationnel Claude
- Function Calling
- Streaming SSE
- Historique des conversations
- Garde-fous
- Validation et sécurité
- Swagger / Postman
- Docker
- Prompt Journal

Bonus / hors MVP

Pour garder un périmètre réaliste :

- RAG
- Base vectorielle
- MCP
- Automatisation n8n
- Gestion RH avancée
- OCR de documents
- Comptabilité et fiscalité avancées

Ces fonctionnalités pourront être étudiées comme évolutions ou bonus si le temps le permet.

---

📄 Licence

Projet académique — Projet Fil Rouge / Mobile Augmented AI.

Non destiné à un usage commercial en l'état.

---

👩‍💻 Auteur

Salma Mirat

Projet Fil Rouge — Mobile Augmented AI
