import { z } from "zod";

const transactionSchema = z.object({
  type: z.enum(["revenu", "depense"], {
    errorMap: () => ({ message: "Type invalide (revenu ou depense)" })
  }),
  montant: z
    .number({ invalid_type_error: "Le montant doit être un nombre" })
    .positive("Le montant doit être supérieur à 0")
    .max(99999999.99, "Montant trop élevé (max 99 999 999,99)"),
  categorie: z
    .string({ invalid_type_error: "La catégorie est obligatoire" })
    .trim()
    .min(1, "La catégorie est obligatoire")
    .max(100, "Catégorie trop longue"),
  date: z
    .string({ invalid_type_error: "Date invalide" })
    .date("Date invalide (format YYYY-MM-DD)")
});

const transactionUpdateSchema = transactionSchema.partial();

export default { transactionSchema, transactionUpdateSchema };