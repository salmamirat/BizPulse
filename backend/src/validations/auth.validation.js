import { z } from "zod";

const registerSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est obligatoire").max(100, "Nom trop long"),
  email: z.string().trim().email("Email invalide").max(255, "Email trop long"),
  motDePasse: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  secteur: z.string().trim().max(100, "Secteur trop long").optional()
});

const loginSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  motDePasse: z.string().min(1, "Le mot de passe est obligatoire")
});

const profileSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est obligatoire").max(100, "Nom trop long"),
  email: z.string().trim().email("Email invalide").max(255, "Email trop long"),
  secteur: z.string().trim().max(100, "Secteur trop long").optional().or(z.literal("")),
  about: z.string().trim().max(500, "Texte à propos trop long").optional().or(z.literal("")),
  owner: z.string().trim().max(100, "Nom du gérant trop long").optional().or(z.literal(""))
});

export default { registerSchema, loginSchema, profileSchema };