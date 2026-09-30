import { Op } from "sequelize";
import { Transaction } from "../models/index.js";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(y, m, d) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function getDatesFromPeriode(periode) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  if (periode === "ce_mois") {
    const lastDay = new Date(y, m + 1, 0).getDate();
    return { dateDebut: formatDate(y, m, 1), dateFin: formatDate(y, m, lastDay) };
  }

  if (periode === "mois_dernier") {
    const previous = new Date(y, m - 1, 1);
    const py = previous.getFullYear();
    const pm = previous.getMonth();
    const lastDay = new Date(y, m, 0).getDate();
    return { dateDebut: formatDate(py, pm, 1), dateFin: formatDate(py, pm, lastDay) };
  }

  return { dateDebut: null, dateFin: null };
}

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
  const summary = await getFinancialSummary(entrepriseId, "tout");

  return {
    devise: "DH",
    soldeActuel: summary.solde,
    salaireSimule: salaire,
    soldeEstime: summary.solde - salaire
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
    return simulateNewHire(entrepriseId, args.salaire);
  }

  return { error: "Fonction inconnue" };
}

export default { toolsSchema, executeFunctionByName };