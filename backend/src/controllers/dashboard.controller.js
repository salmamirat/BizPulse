import { Transaction } from "../models/index.js";
import { fn, col } from "sequelize";

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

async function getCategories(req, res) {
  const categories = await Transaction.findAll({
    attributes: ["categorie", [fn("SUM", col("montant")), "total"]],
    where: { entrepriseId: req.entrepriseId, type: "depense" },
    group: ["categorie"],
    order: [[col("total"), "DESC"]],
    limit: 5,
    raw: true
  });
  res.json(categories);
}

export default { getSummary, getCategories };
