import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import dashboardController from "../controllers/dashboard.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/summary", dashboardController.getSummary);
router.get("/categories", dashboardController.getCategories);

export default router;
