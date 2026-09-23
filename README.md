# 📊 BizPulse

## Assistant intelligent de pilotage financier pour petites entreprises

BizPulse est une application mobile full-stack destinée aux petites entreprises.

Elle permet au dirigeant de gérer ses revenus et ses dépenses, de suivre sa situation financière depuis un tableau de bord et d'interagir avec un assistant IA capable d'analyser les données financières et de réaliser des simulations.

L'intelligence artificielle est intégrée comme une fonctionnalité principale grâce au Function Calling.

> Projet de fin de formation — Mobile Augmented AI

---

# 🎯 Objectif du projet

L'objectif de BizPulse est d'aider les petites entreprises à mieux comprendre leur situation financière.

L'application permet de :

- Gérer les revenus et les dépenses
- Consulter un tableau de bord financier
- Identifier les principales catégories de dépenses
- Suivre la situation financière
- Poser des questions à un assistant IA
- Réaliser des simulations financières

Exemples de questions :

- Quelle est ma situation financière ce mois-ci ?
- Quelle catégorie représente le plus de dépenses ?
- Combien me reste-t-il après mes dépenses ?
- Quel serait l'impact d'une nouvelle embauche à 4 000 DH par mois ?

L'assistant fournit uniquement des analyses et des simulations basées sur les données disponibles dans BizPulse.

---

# 🚀 Fonctionnalités principales

## 🔐 Authentification

L'utilisateur peut :

- Créer un compte
- Se connecter
- Se déconnecter
- Renouveler sa session avec un Refresh Token

L'authentification utilise :

- JWT Access Token
- JWT Refresh Token
- bcrypt
- Protection des routes privées

Les mots de passe sont hashés avant leur enregistrement dans PostgreSQL.

---

# 💰 Gestion des transactions

Les transactions représentent les mouvements financiers de l'entreprise.

Une transaction peut être :

- Un revenu
- Une dépense

L'utilisateur peut :

- Ajouter une transaction
- Consulter les transactions
- Modifier une transaction
- Supprimer une transaction
- Filtrer les transactions
- Trier les transactions
- Utiliser la pagination

Une transaction contient :

- Type
- Montant
- Catégorie
- Date

Exemples de catégories :

- Vente
- Loyer
- Transport
- Salaires
- Fournitures
- Marketing
- Autre

La gestion des transactions constitue le CRUD principal du projet.

```text
CREATE  → Ajouter une transaction

READ    → Consulter les transactions

UPDATE  → Modifier une transaction

DELETE  → Supprimer une transaction
```

---

# 📈 Tableau de bord financier

Le dashboard fournit une vue synthétique de la situation financière de l'entreprise.

Il affiche :

- Total des revenus
- Total des dépenses
- Solde estimé
- Répartition des dépenses par catégorie
- Évolution des revenus et dépenses

Le solde est calculé avec la formule :

```text
Solde estimé = Total des revenus - Total des dépenses
```

Les calculs sont basés sur les transactions enregistrées dans la base de données.

---

# 🤖 Assistant IA

BizPulse intègre un assistant conversationnel capable d'analyser les données financières disponibles.

L'assistant peut :

- Résumer la situation financière
- Analyser les revenus
- Analyser les dépenses
- Identifier les principales catégories de dépenses
- Réaliser des simulations financières
- Expliquer les résultats à l'utilisateur

L'assistant répond uniquement aux questions couvertes par les données et les outils disponibles dans BizPulse.

---

# 🧠 Function Calling

BizPulse utilise le Function Calling pour permettre à l'assistant d'utiliser les fonctions métier du backend.

L'intelligence artificielle n'accède jamais directement à PostgreSQL.

```text
Utilisateur
     ↓
Application Mobile
     ↓
Backend Express
     ↓
Agent IA
     ↓
Function Calling
     ↓
Fonction métier
     ↓
Sequelize
     ↓
PostgreSQL
     ↓
Résultat
     ↓
Agent IA
     ↓
Réponse utilisateur
```

Cette architecture permet de garder :

- L'accès aux données dans le backend
- Les calculs financiers dans le backend
- Le contrôle des actions autorisées
- L'intelligence artificielle séparée de la base de données

---

# 🛠️ Tools IA

Le projet utilise principalement trois fonctions.

## getFinancialSummary()

Retourne un résumé de la situation financière.

```text
Revenus : 40 000 DH

Dépenses : 28 000 DH

Solde estimé : 12 000 DH
```

---

## getExpensesByCategory()

Analyse les dépenses par catégorie.

```text
Salaires : 12 000 DH

Loyer : 5 000 DH

Transport : 2 500 DH

Marketing : 1 500 DH
```

---

## simulateNewHire()

Permet de simuler l'impact financier d'une nouvelle embauche.

```text
Solde actuel : 12 000 DH

Salaire simulé : 4 000 DH

Solde estimé après simulation : 8 000 DH
```

Il s'agit uniquement d'une simulation.

Aucun employé n'est créé.

Aucune transaction n'est automatiquement ajoutée.

---

# 💬 Conversations

BizPulse conserve l'historique des conversations avec l'assistant IA.

Une entreprise peut avoir plusieurs conversations.

Une conversation peut contenir plusieurs messages.

Chaque message contient :

- Le rôle : `user` ou `assistant`
- Le contenu
- La date et l'heure

---

# ⚡ Streaming des réponses

Les réponses de l'assistant sont affichées progressivement dans l'application mobile grâce au streaming.

```text
Agent IA
   ↓
Streaming SSE
   ↓
Backend Express
   ↓
Application Mobile
   ↓
Affichage progressif
```

Le chat peut afficher :

- La réponse progressivement
- Un indicateur de génération
- Les erreurs éventuelles

---

# 🛡️ Garde-fous de l'assistant

## L'assistant peut

- Lire les données nécessaires à une analyse
- Utiliser les fonctions métier autorisées
- Réaliser des simulations
- Fournir des explications
- Utiliser l'historique des conversations

## L'assistant ne peut pas

- Modifier directement PostgreSQL
- Supprimer automatiquement une transaction
- Créer automatiquement une transaction
- Modifier automatiquement une transaction
- Inventer des données financières
- Afficher les mots de passe
- Prendre une décision à la place de l'utilisateur

---

# ✅ Validation avec Zod

Zod est utilisé pour vérifier les données reçues par l'API avant leur traitement.

Exemple pour une transaction :

```text
type       → revenu ou depense

montant    → nombre positif

categorie  → obligatoire

date       → obligatoire
```

Fonctionnement :

```text
Application Mobile
        ↓
Requête HTTP
        ↓
Validation Zod
        ↓
Controller
        ↓
Sequelize
        ↓
PostgreSQL
```

Si les données sont invalides, l'API retourne une erreur avant leur enregistrement.

---

# 🔒 Sécurité

BizPulse utilise :

- JWT
- Refresh Token
- bcrypt
- Zod
- Protection des routes privées
- Rate limiting
- Variables d'environnement
- Isolation des données par entreprise
- Gestion globale des erreurs
- Protection contre les tentatives de prompt injection

Les clés API, mots de passe et autres secrets ne sont jamais enregistrés directement dans le code.

---

# 🛠️ Stack technique

## Mobile

- React Native
- Expo
- Expo Router
- Zustand
- Axios
- Expo SecureStore

## Backend

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT
- bcrypt
- Zod

## Intelligence artificielle

- API LLM
- Function Calling
- Streaming SSE

## Documentation

- Swagger / OpenAPI
- Postman
- Mermaid
- Prompt Journal

## DevOps

- Docker
- Docker Desktop
- Railway ou Render

---

# 🏗️ Architecture générale

```text
Utilisateur
     ↓
React Native / Expo
     ↓
Node.js / Express
     │
     ├── Authentification
     │
     ├── Transactions
     │
     ├── Dashboard
     │
     └── Agent IA
            │
            ├── getFinancialSummary()
            ├── getExpensesByCategory()
            └── simulateNewHire()
     │
     ↓
PostgreSQL
```

Le backend représente le point central entre l'application mobile, PostgreSQL et l'assistant IA.

---

# 📁 Structure du projet

```text
BizPulse/
│
├── backend/
│   │
│   ├── src/
│   │   ├── ai/
│   │   │   ├── agent.js
│   │   │   ├── tools.js
│   │   │   └── systemPrompt.js
│   │   │
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── agent.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   └── transaction.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── error.middleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Entreprise.js
│   │   │   ├── Transaction.js
│   │   │   ├── Conversation.js
│   │   │   ├── Message.js
│   │   │   └── index.js
│   │   │
│   │   ├── routes/
│   │   │   ├── agent.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── transaction.routes.js
│   │   │
│   │   ├── validations/
│   │   │   ├── agent.validation.js
│   │   │   ├── auth.validation.js
│   │   │   └── transaction.validation.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── mobile/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── transactions.tsx
│   │   └── chat.tsx
│   │
│   ├── components/
│   ├── services/
│   ├── store/
│   ├── assets/
│   └── app.json
│
├── docs/
│   ├── use-case.mermaid
│   ├── class-diagram.mermaid
│   ├── architecture.mermaid
│   └── ai-sequence.mermaid
│
├── prompts-journal.md
├── README.md
└── .gitignore
```

---

# 📱 Écrans de l'application

L'application contient cinq écrans principaux.

## Login

Permet à l'utilisateur de se connecter.

## Register

Permet à l'utilisateur de créer un compte.

## Dashboard

Affiche :

- Total des revenus
- Total des dépenses
- Solde estimé
- Répartition des dépenses
- Résumé financier

## Transactions

Permet de :

- Ajouter une transaction
- Consulter les transactions
- Modifier une transaction
- Supprimer une transaction
- Filtrer les transactions
- Trier les transactions

## Chat IA

Permet de :

- Poser des questions financières
- Consulter des analyses
- Réaliser des simulations
- Voir progressivement les réponses
- Consulter l'historique

---

# 🗄️ Modèle de données

Le projet utilise quatre entités principales.

```text
Entreprise
   │
   ├── Transaction
   │
   └── Conversation
           │
           └── Message
```

## Entreprise

```text
id
nom
email
motDePasseHash
secteur
```

## Transaction

```text
id
entrepriseId
type
montant
categorie
date
```

## Conversation

```text
id
entrepriseId
dateCreation
```

## Message

```text
id
conversationId
role
contenu
horodatage
```

Le champ `role` peut être :

```text
user
assistant
```

---

# 🔗 Relations

```text
Entreprise 1 ───── 0..* Transaction

Entreprise 1 ───── 0..* Conversation

Conversation 1 ─── 0..* Message
```

---

# 🔌 API REST

## Authentification

```http
POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

POST /api/auth/refresh
```

## Transactions

```http
GET    /api/transactions

POST   /api/transactions

PUT    /api/transactions/:id

DELETE /api/transactions/:id
```

Exemple avec pagination, filtre et tri :

```http
GET /api/transactions?page=1&limit=10&type=depense&sort=date
```

## Dashboard

```http
GET /api/dashboard/summary
```

Exemple de réponse :

```json
{
  "revenus": 40000,
  "depenses": 28000,
  "solde": 12000
}
```

## Assistant IA

```http
POST /api/agent/chat
```

Exemple :

```json
{
  "message": "Quelle est ma situation financière ce mois-ci ?"
}
```

---

# 🔄 Exemple de Function Calling

L'utilisateur demande :

```text
Quel serait l'impact d'une embauche à 4 000 DH par mois ?
```

Fonctionnement :

```text
Utilisateur
     ↓
Application Mobile
     ↓
Backend
     ↓
Agent IA
     ↓
simulateNewHire(4000)
     ↓
Lecture des transactions
     ↓
Calcul du solde actuel
     ↓
Simulation
     ↓
Résultat
     ↓
Agent IA
     ↓
Réponse utilisateur
```

Cette opération ne modifie aucune donnée dans PostgreSQL.

---

# ⚙️ Installation

## Prérequis

- Node.js
- npm
- PostgreSQL
- Expo
- Docker Desktop
- Une clé API pour le modèle IA utilisé

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Mobile

```bash
cd mobile

npm install

npx expo start
```

---

# 🔑 Variables d'environnement

Créer un fichier `.env` dans le dossier `backend`.

```env
PORT=5000

DATABASE_URL=postgresql://user:password@localhost:5432/bizpulse

JWT_SECRET=change-me

JWT_REFRESH_SECRET=change-me

AI_API_KEY=your-api-key
```

Le fichier `.env` ne doit jamais être ajouté dans Git.

---

# 🐳 Docker

Le backend peut être exécuté avec Docker.

Le projet utilise un fichier :

```text
backend/Dockerfile
```

Construction de l'image :

```bash
docker build -t bizpulse-backend ./backend
```

Exécution du container :

```bash
docker run --env-file backend/.env -p 5000:5000 bizpulse-backend
```

Docker Compose n'est pas utilisé dans ce projet.

---

# 📚 Documentation API

L'API sera documentée avec Swagger / OpenAPI.

Postman sera utilisé pour tester les endpoints de l'application.

Les tests permettront notamment de vérifier :

- Register
- Login
- Routes protégées
- CRUD des transactions
- Dashboard
- Endpoints de l'assistant IA

---

# 📝 Vibe Coding & Prompt Journal

Le développement de BizPulse utilise une démarche de vibe coding documentée.

Le fichier :

```text
prompts-journal.md
```

permet de conserver :

- Les prompts utilisés
- L'objectif du prompt
- Le résultat obtenu
- Les problèmes rencontrés
- Les corrections apportées
- Les choix techniques

Exemple :

```text
Prompt :
Créer le modèle Sequelize Transaction.

Résultat :
Le modèle a été généré.

Problème :
Le montant utilisait FLOAT.

Correction :
Remplacement par DECIMAL(10,2).

Pourquoi :
DECIMAL est plus adapté aux données financières.
```

L'intelligence artificielle est utilisée comme outil d'assistance au développement.

Le développeur reste responsable du code et doit être capable de l'expliquer et de le modifier.

---

# 📊 Diagrammes

Le projet contient quatre diagrammes principaux.

```text
docs/
├── use-case.mermaid
├── class-diagram.mermaid
├── architecture.mermaid
└── ai-sequence.mermaid
```

## Use Case Diagram

Présente les principales actions disponibles pour l'utilisateur.

## Class Diagram

Présente les classes, leurs attributs, les clés PK/FK et leurs relations.

## Architecture Diagram

Présente les interactions entre l'application mobile, le backend, PostgreSQL et l'assistant IA.

## AI Sequence Diagram

Présente le déroulement d'une demande utilisant le Function Calling.

---

# 🚀 Déploiement

Le backend pourra être déployé sur :

- Railway
- Render

La base PostgreSQL pourra également être hébergée sur une plateforme cloud.

Les secrets et les clés API seront configurés grâce aux variables d'environnement.

---

# 📌 Périmètre du MVP

Le MVP comprend :

- Inscription
- Connexion
- Déconnexion
- Refresh Token
- JWT
- CRUD des transactions
- Pagination
- Tri
- Filtrage
- Dashboard financier
- Assistant conversationnel
- Function Calling
- `getFinancialSummary()`
- `getExpensesByCategory()`
- `simulateNewHire()`
- Historique des conversations
- Streaming SSE
- Validation avec Zod
- Protection des routes privées
- Isolation des données par entreprise
- Rate limiting
- Garde-fous de l'assistant
- Swagger / OpenAPI
- Postman
- Diagrammes
- Prompt Journal
- Docker

---

# 🚀 Évolutions possibles

## Intelligence artificielle

- RAG
- Base vectorielle
- Nouveaux tools
- Analyse financière avancée

## Intégrations

- MCP
- Connexion à des services externes

## Automatisation

- n8n
- Notifications automatiques
- Rapports périodiques

## Fonctionnalités métier

- Gestion des employés
- Plusieurs utilisateurs par entreprise
- Rôles et permissions
- OCR de factures
- Comptabilité avancée

---

# 🎓 Objectif pédagogique

BizPulse est réalisé dans le cadre d'un projet de fin de formation Mobile Augmented AI.

Le projet permet de mettre en pratique :

- Développement mobile
- Développement backend
- API REST
- CRUD
- Authentification
- Sécurité
- PostgreSQL
- Sequelize ORM
- Validation avec Zod
- Architecture MVC
- Architecture full-stack
- Intelligence artificielle
- Function Calling
- Streaming
- Prompt engineering
- Vibe coding
- Documentation
- Docker
- Déploiement

L'objectif est de construire une application simple, fonctionnelle et compréhensible intégrant une intelligence artificielle de manière contrôlée.

---

# 👩‍💻 Auteur

Salma Mirat

Projet de fin de formation — Mobile Augmented AI