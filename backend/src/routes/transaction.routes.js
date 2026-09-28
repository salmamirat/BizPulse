import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import transactionValidation from "../validations/transaction.validation.js";
import transactionController from "../controllers/transaction.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", validate(transactionValidation.transactionSchema), transactionController.createTransaction);
router.get("/", transactionController.getTransactions);
router.put("/:id", validate(transactionValidation.transactionUpdateSchema), transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

export default router;
