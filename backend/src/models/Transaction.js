import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  entrepriseId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM("revenu", "depense"),
    allowNull: false
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});

export default Transaction;
