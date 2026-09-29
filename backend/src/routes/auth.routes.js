import { Router } from "express";
import rateLimit from "express-rate-limit";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import authValidation from "../validations/auth.validation.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Trop de tentatives, réessayez dans 15 minutes" }
});

router.post("/register", validate(authValidation.registerSchema), authController.register);
router.post("/login", loginLimiter, validate(authValidation.loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export default router;