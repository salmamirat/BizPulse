const { z } = require('zod');

const registerSchema = z.object({
  nom: z.string().min(1, 'Le nom est obligatoire'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  secteur: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est obligatoire')
});

module.exports = {
  registerSchema,
  loginSchema
};
