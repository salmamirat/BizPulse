const { z } = require('zod');

const transactionSchema = z.object({
  type: z.enum(['revenu', 'depense']),
  montant: z.number().positive('Le montant doit être positif'),
  categorie: z.string().min(1, 'La catégorie est obligatoire'),
  date: z.string() // expected format YYYY-MM-DD
});

module.exports = {
  transactionSchema
};
