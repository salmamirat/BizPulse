const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  role: {
    type: DataTypes.ENUM("user", "assistant"),
    allowNull: false,
  },

  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  horodatage: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Message;