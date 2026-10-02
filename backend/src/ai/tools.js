import { Op } from "sequelize";
import { Transaction } from "../models/index.js";
import { getDatesFromPeriode } from "./dates.js";

function buildWhere(entrepriseId, periode, type) {
  const where = { entrepriseId };
  const { dateDebut, dateFin } = getDatesFromPeriode(periode);

  if (type) {
    where.type = type;
  }

  if (dateDebut && dateFin) {
    where.date = { [Op.between]: [dateDebut, dateFin] };
  }

  return where;
}

async function getFinancialSummary(entrepriseId, periode = "tout") {
  const transactions = await Transaction.findAll({
    where: buildWhere(entrepriseId, periode)
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

  return {
    devise: "DH",
    periode,
    ...getDatesFromPeriode(periode),
    revenus,
    depenses,
    solde: revenus - depenses
  };
}

async function getExpensesByCategory(entrepriseId, periode = "tout") {
  const transactions = await Transaction.findAll({
    where: buildWhere(entrepriseId, periode, "depense")
  });

  const parCategorie = {};

  transactions.forEach((t) => {
    if (!parCategorie[t.categorie]) {
      parCategorie[t.categorie] = 0;
    }
    parCategorie[t.categorie] += Number(t.montant);
  });

  return {
    devise: "DH",
    periode,
    ...getDatesFromPeriode(periode),
    parCategorie
  };
}

async function simulateNewHire(entrepriseId, salaire) {
  const summaryTout = await getFinancialSummary(entrepriseId, "tout");
  const summaryMois = await getFinancialSummary(entrepriseId, "ce_mois");

  const soldeActuel = summaryTout.solde;
  const netCeMois = summaryMois.solde;

  return {
    devise: "DH",
    soldeActuel,
    salaireSimule: salaire,
    netCeMoisActuel: netCeMois,
    netCeMoisApresEmbauche: netCeMois - salaire,
    soldeApresUnMois: soldeActuel - salaire
  };
}

const periodeProperty = {
  periode: {
    type: "string",
    enum: ["tout", "ce_mois", "mois_dernier"],
    description:
      "Période demandée : 'ce_mois' pour le mois en cours, 'mois_dernier' pour le mois précédent, 'tout' si aucune période n'est précisée."
  }
};

const toolsSchema = [
  {
    type: "function",
    function: {
      name: "getFinancialSummary",
      description: "Retourne le résumé financier de l'entreprise (revenus, dépenses, solde) pour une période",
      parameters: {
        type: "object",
        properties: periodeProperty,
        required: ["periode"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getExpensesByCategory",
      description: "Retourne les dépenses regroupées par catégorie pour une période",
      parameters: {
        type: "object",
        properties: periodeProperty,
        required: ["periode"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "simulateNewHire",
      description: "Simule l'impact financier d'une nouvelle embauche",
      parameters: {
        type: "object",
        properties: {
          salaire: { type: "number" }
        },
        required: ["salaire"]
      }
    }
  }
];

async function executeFunctionByName(name, args, entrepriseId) {
  if (name === "getFinancialSummary") {
    return getFinancialSummary(entrepriseId, args.periode);
  }

  if (name === "getExpensesByCategory") {
    return getExpensesByCategory(entrepriseId, args.periode);
  }

  if (name === "simulateNewHire") {
    if (typeof args.salaire !== "number" || args.salaire <= 0) {
      return { error: "Salaire invalide" };
    }
    return simulateNewHire(entrepriseId, args.salaire);
  }

  return { error: "Fonction inconnue" };
}

export default { toolsSchema, executeFunctionByName };