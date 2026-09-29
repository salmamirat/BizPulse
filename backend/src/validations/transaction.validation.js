import { z } from "zod";

const transactionSchema = z.object({
  type: z.enum(["revenu", "depense"]),
  montant: z.number().positive(),
  categorie: z.string().min(1),
  date: z.string().date()
});

const transactionUpdateSchema = transactionSchema.partial();

export default { transactionSchema, transactionUpdateSchema };