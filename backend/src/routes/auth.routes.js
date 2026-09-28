import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import authValidation from "../validations/auth.validation.js";

const router = Router();

router.post("/register", validate(authValidation.registerSchema), authController.register);
router.post("/login", validate(authValidation.loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refresh);

export default router;
