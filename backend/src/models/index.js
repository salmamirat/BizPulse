const Entreprise = require("./Entreprise");
const Transaction = require("./Transaction");
const Conversation = require("./Conversation");
const Message = require("./Message");

Entreprise.hasMany(Transaction, {
  foreignKey: "entrepriseId",
});

Transaction.belongsTo(Entreprise, {
  foreignKey: "entrepriseId",
});

Entreprise.hasMany(Conversation, {
  foreignKey: "entrepriseId",
});

Conversation.belongsTo(Entreprise, {
  foreignKey: "entrepriseId",
});

Conversation.hasMany(Message, {
  foreignKey: "conversationId",
});

Message.belongsTo(Conversation, {
  foreignKey: "conversationId",
});

module.exports = {
  Entreprise,
  Transaction,
  Conversation,
  Message,
};