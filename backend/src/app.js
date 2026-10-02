import express from "express";
import rateLimit from "express-rate-limit";

import { apiReference } from "@scalar/express-api-reference";
import openApiDocument from "./config/openapi.js";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();
app.set("trust proxy", 1);

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
});

app.use(limiter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use(
  "/api/scalar",
  apiReference({
    spec: {
      content: openApiDocument,
    },
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/agent", agentRoutes);

app.use(errorMiddleware);

export default app;
