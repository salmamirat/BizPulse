import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateId from "../middlewares/validateId.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import transactionValidation from "../validations/transaction.validation.js";
import transactionController from "../controllers/transaction.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(transactionValidation.transactionSchema), transactionController.createTransaction);
router.get("/", transactionController.getTransactions);
router.put("/:id", validateId, validate(transactionValidation.transactionUpdateSchema), transactionController.updateTransaction);
router.delete("/:id", validateId, transactionController.deleteTransaction);

export default router;