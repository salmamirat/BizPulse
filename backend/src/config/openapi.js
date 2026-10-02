const bearer = [{ bearerAuth: [] }];

const json = (properties, required) => {
  return {
    required: true,
    content: {
      "application/json": {
        schema: { type: "object", properties, required }
      }
    }
  };
};

const openApiDocument = {
  openapi: "3.0.0",
  info: {
    title: "BizPulse API",
    version: "1.0.0",
    description: "API de BizPulse : transactions, dashboard et assistant IA"
  },
  servers: [{ url: "http://localhost:5000" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Vérifier que le serveur fonctionne",
        responses: { 200: { description: "OK" } }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Créer un compte",
        requestBody: json(
          {
            nom: { type: "string", example: "Ma Societe" },
            email: { type: "string", example: "test@test.com" },
            motDePasse: { type: "string", example: "123456" },
            secteur: { type: "string", example: "Commerce" }
          },
          ["nom", "email", "motDePasse"]
        ),
        responses: { 201: { description: "Compte créé" }, 400: { description: "Données invalides" } }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Se connecter",
        requestBody: json(
          {
            email: { type: "string", example: "test@test.com" },
            motDePasse: { type: "string", example: "123456" }
          },
          ["email", "motDePasse"]
        ),
        responses: { 200: { description: "accessToken + refreshToken" }, 401: { description: "Identifiants invalides" } }
      }
    },
    "/api/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Renouveler l'access token",
        requestBody: json({ refreshToken: { type: "string" } }, ["refreshToken"]),
        responses: { 200: { description: "Nouvel accessToken" }, 401: { description: "Refresh token invalide" } }
      }
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Se déconnecter",
        responses: { 200: { description: "Déconnexion réussie" } }
      }
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Obtenir le profil",
        security: bearer,
        responses: { 200: { description: "{ id, nom, email, secteur }" } }
      }
    },
    "/api/transactions": {
      get: {
        tags: ["Transactions"],
        summary: "Lister les transactions (pagination, filtre, tri)",
        security: bearer,
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "type", in: "query", schema: { type: "string", enum: ["revenu", "depense"] } },
          { name: "sort", in: "query", schema: { type: "string", enum: ["date", "montant", "categorie"] } }
        ],
        responses: { 200: { description: "Liste paginée" } }
      },
      post: {
        tags: ["Transactions"],
        summary: "Ajouter une transaction",
        security: bearer,
        requestBody: json(
          {
            type: { type: "string", enum: ["revenu", "depense"] },
            montant: { type: "number", example: 5000 },
            categorie: { type: "string", example: "Vente" },
            date: { type: "string", example: "2026-09-26" }
          },
          ["type", "montant", "categorie", "date"]
        ),
        responses: { 201: { description: "Transaction créée" }, 400: { description: "Données invalides" } }
      }
    },
    "/api/transactions/{id}": {
      put: {
        tags: ["Transactions"],
        summary: "Modifier une transaction",
        security: bearer,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: json({ montant: { type: "number", example: 7000 } }, []),
        responses: { 200: { description: "Transaction modifiée" }, 404: { description: "Introuvable" } }
      },
      delete: {
        tags: ["Transactions"],
        summary: "Supprimer une transaction",
        security: bearer,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Transaction supprimée" }, 404: { description: "Introuvable" } }
      }
    },
    "/api/dashboard/summary": {
      get: {
        tags: ["Dashboard"],
        summary: "Résumé financier",
        security: bearer,
        responses: { 200: { description: "revenus, depenses, solde" } }
      }
    },
    "/api/dashboard/categories": {
      get: {
        tags: ["Dashboard"],
        summary: "Dépenses par catégorie",
        security: bearer,
        responses: { 200: { description: "Top 5 des dépenses par catégorie" } }
      }
    },
    "/api/agent/chat": {
      post: {
        tags: ["Agent IA"],
        summary: "Poser une question à l'assistant",
        security: bearer,
        requestBody: json(
          {
            message: { type: "string", example: "Quelle est ma situation financière ?" },
            conversationId: { type: "string", description: "Optionnel : continuer une conversation" }
          },
          ["message"]
        ),
        responses: { 200: { description: "reply + conversationId" }, 400: { description: "Demande non autorisée" } }
      }
    },
    "/api/agent/chat/stream": {
      post: {
        tags: ["Agent IA"],
        summary: "Même chose avec affichage progressif (SSE)",
        security: bearer,
        requestBody: json({ message: { type: "string" }, conversationId: { type: "string" } }, ["message"]),
        responses: { 200: { description: "Flux text/event-stream" } }
      }
    },
    "/api/agent/conversations": {
      get: {
        tags: ["Agent IA"],
        summary: "Lister les conversations",
        security: bearer,
        responses: { 200: { description: "Liste des conversations" } }
      }
    },
    "/api/agent/conversations/{id}/messages": {
      get: {
        tags: ["Agent IA"],
        summary: "Messages d'une conversation",
        security: bearer,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Liste des messages" }, 404: { description: "Introuvable" } }
      }
    }
  }
};

export default openApiDocument;
