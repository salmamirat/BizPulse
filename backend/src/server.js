import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    const requiredEnv = ["JWT_SECRET", "JWT_REFRESH_SECRET", "DB_NAME"];
    const missingEnv = requiredEnv.filter((key) => !process.env[key]);

    if (missingEnv.length > 0) {
      console.error(`Erreur de configuration : variables d'environnement manquantes (${missingEnv.join(", ")})`);
      process.exit(1);
    }

    if (!process.env.AI_API_KEY) {
      console.warn("Avertissement : AI_API_KEY non configurée. L'assistant IA sera indisponible.");
    }

    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("Échec du démarrage du serveur :", error.message);
    process.exit(1);
  }
}

start();

