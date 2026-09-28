import { Transaction } from "../models/index.js";

async function getSummary(req, res) {
  const transactions = await Transaction.findAll({
    where: { entrepriseId: req.entrepriseId }
  });

  let revenus = 0;
  let depenses = 0;

  transactions.forEach((t) => {
    if (t.type === "revenu") {
      revenus += Number(t.montant);
    } else {
      depenses += Number(t.montant);
    }
  });

  res.json({
    revenus,
    depenses,
    solde: revenus - depenses
  });
}

export default { getSummary };
