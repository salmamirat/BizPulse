import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 5000;

async function start() {
  const requiredEnv = ["JWT_SECRET", "JWT_REFRESH_SECRET", "DB_NAME", "AI_API_KEY"];
  for (const env of requiredEnv) {
    if (!process.env[env]) {
      console.error(`Erreur critique : La variable d'environnement ${env} est manquante.`);
      process.exit(1);
    }
  }

  await sequelize.sync({ alter: true });

  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

start();
