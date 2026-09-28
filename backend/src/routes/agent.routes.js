import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import filterMessage from "../middlewares/filter.middleware.js";
import agentValidation from "../validations/agent.validation.js";
import agentController from "../controllers/agent.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/chat", validate(agentValidation.agentMessageSchema), filterMessage, agentController.chat);
router.post("/chat/stream", validate(agentValidation.agentMessageSchema), filterMessage, agentController.chatStream);
router.get("/conversations", agentController.getConversations);
router.get("/conversations/:id/messages", agentController.getMessages);

export default router;
