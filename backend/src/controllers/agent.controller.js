import askAgent from "../ai/agent.js";
import { Conversation, Message, AgentLog } from "../models/index.js";

async function getHistory(conversationId) {
  const messages = await Message.findAll({
    where: { conversationId },
    order: [["createdAt", "DESC"]],
    limit: 10
  });

  return messages.reverse().map((m) => {
    return { role: m.role, content: m.contenu };
  });
}

async function runChat(req, res) {
  const { message, conversationId } = req.body;
  const entrepriseId = req.entrepriseId;

  let conversation = null;
  let history = [];

  if (conversationId) {
    conversation = await Conversation.findOne({
      where: { id: conversationId, entrepriseId }
    });

    if (!conversation) {
      res.status(404).json({ error: "Conversation introuvable" });
      return null;
    }

    history = await getHistory(conversation.id);
  }

  const result = await askAgent(message, entrepriseId, history);

  if (!conversation) {
    conversation = await Conversation.create({ entrepriseId });
  }

  await Message.create({
    conversationId: conversation.id,
    role: "user",
    contenu: message
  });

  await Message.create({
    conversationId: conversation.id,
    role: "assistant",
    contenu: result.reply
  });

  await AgentLog.create({
    entrepriseId,
    userMessage: message,
    functionCalled: result.functionCalled,
    functionParams: result.functionParams,
    assistantReply: result.reply
  });

  return { conversation, result };
}

async function chat(req, res) {
  const data = await runChat(req, res);

  if (!data) {
    return;
  }

  res.json({
    reply: data.result.reply,
    conversationId: data.conversation.id
  });
}

async function chatStream(req, res) {
  const data = await runChat(req, res);

  if (!data) {
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(`event: conversation\ndata: ${data.conversation.id}\n\n`);

  const words = data.result.reply.split(" ");

  for (const word of words) {
    res.write(`data: ${word}\n\n`);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  res.write("data: [DONE]\n\n");
  res.end();
}

async function getConversations(req, res) {
  const conversations = await Conversation.findAll({
    where: { entrepriseId: req.entrepriseId },
    order: [["createdAt", "DESC"]]
  });

  res.json(conversations);
}

async function getMessages(req, res) {
  const { id } = req.params;

  const conversation = await Conversation.findOne({
    where: { id, entrepriseId: req.entrepriseId }
  });

  if (!conversation) {
    return res.status(404).json({ error: "Conversation introuvable" });
  }

  const messages = await Message.findAll({
    where: { conversationId: id },
    order: [["createdAt", "ASC"]]
  });

  res.json(messages);
}

export default { chat, chatStream, getConversations, getMessages };
