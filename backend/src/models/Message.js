import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM("user", "assistant"),
    allowNull: false
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

export default Message;
