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
  const { page = 1, limit = 10, type, sort = "date" } = req.query;

  const allowedSort = ["date", "montant", "categorie"];
  const sortField = allowedSort.includes(sort) ? sort : "date";

  const where = { entrepriseId: req.entrepriseId };

  if (type) {
    where.type = type;
  }

  const transactions = await Transaction.findAndCountAll({
    where,
    order: [[sortField, "DESC"]],
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit)
  });

  res.json({
    total: transactions.count,
    page: Number(page),
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
