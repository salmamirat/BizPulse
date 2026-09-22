const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Entreprise = sequelize.define("Entreprise", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  motDePasseHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  secteur: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Entreprise;