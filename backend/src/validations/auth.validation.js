import { z } from "zod";

const registerSchema = z.object({
  nom: z.string().min(1),
  email: z.string().email(),
  motDePasse: z.string().min(6),
  secteur: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  motDePasse: z.string().min(1)
});

export default { registerSchema, loginSchema };