import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const AgentLog = sequelize.define("AgentLog", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  entrepriseId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userMessage: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  functionCalled: {
    type: DataTypes.STRING,
    allowNull: true
  },
  functionParams: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  assistantReply: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

export default AgentLog;
