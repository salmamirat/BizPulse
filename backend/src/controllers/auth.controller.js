import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Entreprise } from "../models/index.js";

function generateAccessToken(entreprise) {
  return jwt.sign({ entrepriseId: entreprise.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

function generateRefreshToken(entreprise) {
  return jwt.sign({ entrepriseId: entreprise.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
  });
}

async function register(req, res) {
  const { nom, email, motDePasse, secteur } = req.body;

  const existing = await Entreprise.findOne({ where: { email } });

  if (existing) {
    return res.status(400).json({ error: "Email déjà utilisé" });
  }

  const motDePasseHash = await bcrypt.hash(motDePasse, 10);

  const entreprise = await Entreprise.create({
    nom,
    email,
    motDePasseHash,
    secteur
  });

  res.status(201).json({
    id: entreprise.id,
    nom: entreprise.nom,
    email: entreprise.email
  });
}

async function login(req, res) {
  const { email, motDePasse } = req.body;

  const entreprise = await Entreprise.findOne({ where: { email } });

  if (!entreprise) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const valid = await bcrypt.compare(motDePasse, entreprise.motDePasseHash);

  if (!valid) {
    return res.status(401).json({ error: "Identifiants invalides" });
  }

  const accessToken = generateAccessToken(entreprise);
  const refreshToken = generateRefreshToken(entreprise);

  res.json({ accessToken, refreshToken });
}

async function refresh(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token manquant" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const entreprise = await Entreprise.findByPk(decoded.entrepriseId);

    if (!entreprise) {
      return res.status(401).json({ error: "Entreprise introuvable" });
    }

    const accessToken = generateAccessToken(entreprise);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ error: "Refresh token invalide" });
  }
}

async function logout(req, res) {
  res.json({ message: "Déconnexion réussie" });
}

async function updateProfile(req, res) {
  const { nom, email, secteur, about, owner } = req.body;
  const entreprise = await Entreprise.findByPk(req.entrepriseId);

  if (!entreprise) {
    return res.status(404).json({ error: "Entreprise introuvable" });
  }

  if (email && email !== entreprise.email) {
    const existing = await Entreprise.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
  }

  await entreprise.update({ nom, email, secteur, about, owner });

  res.json({
    id: entreprise.id,
    nom: entreprise.nom,
    email: entreprise.email,
    secteur: entreprise.secteur,
    about: entreprise.about,
    owner: entreprise.owner
  });
}

export default { register, login, refresh, logout, updateProfile };
