import { Transaction } from "../models/index.js";
import { getFinancialSummary, getExpensesByCategory } from "../ai/tools.js";

async function getSummary(req, res) {
  const [financialSummary, expensesByCategory, transactions] = await Promise.all([
    getFinancialSummary(req.entrepriseId, "tout"),
    getExpensesByCategory(req.entrepriseId, "tout"),
    Transaction.findAll({
      where: { entrepriseId: req.entrepriseId },
      attributes: ["type", "montant", "date", "createdAt"]
    })
  ]);

  const { revenus, depenses, solde } = financialSummary;
  const parCategorie = expensesByCategory.parCategorie;

  const evolutionMap = {};

  transactions.forEach((t) => {
    const montant = Number(t.montant);
    // Déduire le mois avec t.date.slice(0, 7) (type DATEONLY YYYY-MM-DD)
    const month = t.date ? String(t.date).slice(0, 7) : new Date(t.createdAt).toISOString().slice(0, 7);

    if (!evolutionMap[month]) {
      evolutionMap[month] = { revenu: 0, depense: 0 };
    }
    if (t.type === "revenu") {
      evolutionMap[month].revenu += montant;
    } else {
      evolutionMap[month].depense += montant;
    }
  });

  const sortedMonths = Object.keys(evolutionMap).sort();
  const lastMonths = sortedMonths.slice(-6);

  const evolution = {
    labels: lastMonths.length > 0 ? lastMonths : ["Aucun"],
    revenus: lastMonths.length > 0 ? lastMonths.map(m => evolutionMap[m].revenu) : [0],
    depenses: lastMonths.length > 0 ? lastMonths.map(m => evolutionMap[m].depense) : [0]
  };

  res.json({
    revenus,
    depenses,
    solde,
    parCategorie,
    evolution
  });
}

export default { getSummary };

