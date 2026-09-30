import OpenAI from "openai";
import systemPrompt from "./systemPrompt.js";
import tools from "./tools.js";

const groq = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: process.env.AI_BASE_URL
});

async function askAgent(userMessage, entrepriseId, history = []) {
  const today = new Date().toISOString().slice(0, 10);

  const messages = [
    {
      role: "system",
content: `${systemPrompt}\nDate d'aujourd'hui : ${today}. Utilise toujours le paramètre "periode" des fonctions : "ce_mois", "mois_dernier" ou "tout".`    },
    ...history,
    { role: "user", content: userMessage }
  ];

  const firstResponse = await groq.chat.completions.create({
    model: process.env.AI_MODEL,
    messages,
    tools: tools.toolsSchema
  });

  const responseMessage = firstResponse.choices[0].message;
  const toolCall = responseMessage.tool_calls?.[0];

  if (!toolCall) {
    return {
      reply: responseMessage.content,
      functionCalled: null,
      functionParams: null
    };
  }

  const functionName = toolCall.function.name;
  const args = JSON.parse(toolCall.function.arguments || "{}");

  const functionResult = await tools.executeFunctionByName(functionName, args, entrepriseId);

  const secondResponse = await groq.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: [
      ...messages,
      { ...responseMessage, tool_calls: [toolCall] },
      {
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(functionResult)
      }
    ]
  });

  return {
    reply: secondResponse.choices[0].message.content,
    functionCalled: functionName,
    functionParams: args
  };
}

export default askAgent;