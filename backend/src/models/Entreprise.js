import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Entreprise = sequelize.define("Entreprise", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  motDePasseHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  secteur: {
    type: DataTypes.STRING
  }
});

export default Entreprise;
