import { z } from "zod";

const agentMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationId: z.string().uuid().optional()
});

export default { agentMessageSchema };
