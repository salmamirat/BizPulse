import { Transaction } from "../models/index.js";

async function createTransaction(req, res) {
  const { type, montant, categorie, date } = req.body;

  const transaction = await Transaction.create({
    entrepriseId: req.entrepriseId,
    type,
    montant,
    categorie,
    date
  });

  res.status(201).json(transaction);
}

async function getTransactions(req, res) {
  const { type, sort = "date" } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

  if (type && !["revenu", "depense"].includes(type)) {
    return res.status(400).json({ error: "Type invalide (revenu ou depense)" });
  }

  const allowedSort = ["date", "montant", "categorie"];
  const sortField = allowedSort.includes(sort) ? sort : "date";

  const where = { entrepriseId: req.entrepriseId };

  if (type) {
    where.type = type;
  }

  const transactions = await Transaction.findAndCountAll({
    where,
    order: [[sortField, "DESC"], ["createdAt", "DESC"]],
    limit,
    offset: (page - 1) * limit
  });

  res.json({
    total: transactions.count,
    page,
    limit,
    data: transactions.rows
  });
}

async function updateTransaction(req, res) {
  const { id } = req.params;

  const transaction = await Transaction.findOne({
    where: { id, entrepriseId: req.entrepriseId }
  });

  if (!transaction) {
    return res.status(404).json({ error: "Transaction introuvable" });
  }

  await transaction.update(req.body);
  res.json(transaction);
}

async function deleteTransaction(req, res) {
  const { id } = req.params;

  const transaction = await Transaction.findOne({
    where: { id, entrepriseId: req.entrepriseId }
  });

  if (!transaction) {
    return res.status(404).json({ error: "Transaction introuvable" });
  }

  await transaction.destroy();
  res.json({ message: "Transaction supprimée" });
}

export default { createTransaction, getTransactions, updateTransaction, deleteTransaction };