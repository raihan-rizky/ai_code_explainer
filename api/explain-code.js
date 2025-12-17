import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

const llm = new ChatOpenAI({
  model: "meta-llama/Llama-3.3-70B-Instruct",
  temperature: 0.3,
  maxTokens: 400,

  // IMPORTANT: point LangChain to Nebius's OpenAI-compatible endpoint
  apiKey: process.env.NEBIUS_API_KEY,
  configuration: {
    baseURL: "https://api.tokenfactory.nebius.com/v1/",
  },
});
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { code, language } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });

    const prompt = `Please explain this ${language || ""} code in simple terms:

\`\`\`${language || ""}
${code}
\`\`\`

Keep it concise and beginner-friendly.`;

    // LangChain returns an AIMessage; `.content` is the text
    const msg = await llm.invoke([new HumanMessage(prompt)]);
    const explanation = msg?.content;
    if (!explanation)
      return res.status(500).json({ error: "Failed to explain code" });

    res.json({ explanation, language: language || "unknown" });
  } catch (err) {
    console.error("Code Explain API Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
