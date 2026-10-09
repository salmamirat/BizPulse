import { Transaction } from "../models/index.js";

async function getSummary(req, res) {
  const transactions = await Transaction.findAll({
    where: { entrepriseId: req.entrepriseId }
  });

  let revenus = 0;
  let depenses = 0;
  const evolutionMap = {};

  transactions.forEach((t) => {
    const montant = Number(t.montant);
    if (t.type === "revenu") {
      revenus += montant;
    } else {
      depenses += montant;
    }

    // Grouper par mois en utilisant la colonne 'date' (ex: "2026-10")
    const dateObj = t.date ? new Date(t.date) : new Date(t.createdAt);
    const month = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
    
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
    solde: revenus - depenses,
    evolution
  });
}

export default { getSummary };
