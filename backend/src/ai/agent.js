import OpenAI from "openai";
import systemPrompt from "./systemPrompt.js";
import tools from "./tools.js";

const groq = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL
});

const FALLBACK_REPLY = "Je n'ai pas pu produire de réponse, reformulez votre question.";

async function askAgent(userMessage, entrepriseId, history = []) {
  const today = new Date().toISOString().slice(0, 10);

  const messages = [
    {
      role: "system",
      content: `${systemPrompt}\nDate d'aujourd'hui : ${today}. Utilise toujours le paramètre "periode" des fonctions : "ce_mois", "mois_dernier" ou "tout".`
    },
    ...history,
    { role: "user", content: userMessage }
  ];

  const firstResponse = await groq.chat.completions.create({
    model: process.env.AI_MODEL,
    messages,
    tools: tools.toolsSchema,
    tool_choice: "auto"
  });

  const responseMessage = firstResponse.choices[0].message;
  const toolCall = responseMessage.tool_calls?.[0];

  if (!toolCall) {
    return {
      reply: responseMessage.content?.trim() || FALLBACK_REPLY,
      functionCalled: null,
      functionParams: null
    };
  }

  const functionName = toolCall.function.name;
  let args = {};
  try {
    args = JSON.parse(toolCall.function.arguments || "{}");
  } catch {
    args = {};
  }

  const functionResult = await tools.executeFunctionByName(functionName, args, entrepriseId);

  // Second appel sans tools ni tool_choice pour contraindre le modèle à répondre en texte
  const secondResponse = await groq.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: [
      ...messages,
      {
        role: "assistant",
        content: responseMessage.content || null,
        tool_calls: [toolCall]
      },
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(functionResult)
      }
    ]
  });

  const finalReply = secondResponse.choices[0]?.message?.content?.trim();

  return {
    reply: finalReply || FALLBACK_REPLY,
    functionCalled: functionName,
    functionParams: args
  };
}

export default askAgent;