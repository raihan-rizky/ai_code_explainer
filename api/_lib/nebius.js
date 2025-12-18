import OpenAI from "openai";

// Nebius OpenAI-compatible client
export const nebius = new OpenAI({
  baseURL: "https://api.tokenfactory.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});
