import sequelize from "../config/database.js";
import Entreprise from "./Entreprise.js";
import Transaction from "./Transaction.js";
import Conversation from "./Conversation.js";
import Message from "./Message.js";
import AgentLog from "./AgentLog.js";

Entreprise.hasMany(Transaction, { foreignKey: "entrepriseId" });
Transaction.belongsTo(Entreprise, { foreignKey: "entrepriseId" });

Entreprise.hasMany(Conversation, { foreignKey: "entrepriseId" });
Conversation.belongsTo(Entreprise, { foreignKey: "entrepriseId" });

Conversation.hasMany(Message, { foreignKey: "conversationId" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

Entreprise.hasMany(AgentLog, { foreignKey: "entrepriseId" });
AgentLog.belongsTo(Entreprise, { foreignKey: "entrepriseId" });

export { sequelize, Entreprise, Transaction, Conversation, Message, AgentLog };
