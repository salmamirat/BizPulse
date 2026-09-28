import { Transaction } from "../models/index.js";

async function getFinancialSummary(entrepriseId) {
  const transactions = await Transaction.findAll({
    where: { entrepriseId }
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
    revenus,
    depenses,
    solde: revenus - depenses
  };
}

async function getExpensesByCategory(entrepriseId) {
  const transactions = await Transaction.findAll({
    where: { entrepriseId, type: "depense" }
  });

  const result = {};

  transactions.forEach((t) => {
    if (!result[t.categorie]) {
      result[t.categorie] = 0;
    }
    result[t.categorie] += Number(t.montant);
  });

  return result;
}

async function simulateNewHire(entrepriseId, salaire) {
  const summary = await getFinancialSummary(entrepriseId);

  return {
    soldeActuel: summary.solde,
    salaireSimule: salaire,
    soldeEstime: summary.solde - salaire
  };
}

const toolsSchema = [
  {
    type: "function",
    function: {
      name: "getFinancialSummary",
      description: "Retourne le résumé financier de l'entreprise",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getExpensesByCategory",
      description: "Retourne les dépenses regroupées par catégorie",
      parameters: {
        type: "object",
        properties: {},
        required: []
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
    return getFinancialSummary(entrepriseId);
  }

  if (name === "getExpensesByCategory") {
    return getExpensesByCategory(entrepriseId);
  }

  if (name === "simulateNewHire") {
    return simulateNewHire(entrepriseId, args.salaire);
  }

  return { error: "Fonction inconnue" };
}

export default { toolsSchema, executeFunctionByName };
