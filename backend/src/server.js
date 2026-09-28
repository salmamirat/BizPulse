import "dotenv/config";
import app from "./app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await sequelize.sync({ alter: true });

  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

start();
