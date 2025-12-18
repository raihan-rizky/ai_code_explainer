import { handleCors } from "../_lib/cors.js";
import { nebius } from "../_lib/nebius.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { auth: { persistSession: false } }
);

// Add message to database
async function addMessage({ sessionId, chatId, role, content, meta, title }) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      chat_id: chatId,
      role,
      content,
      meta: meta ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  // Update chat title if user message
  if (role === "user" && title) {
    await supabase.from("chats").update({ title }).eq("id", chatId);
  }

  // Update chat last_active_at
  await supabase
    .from("chats")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", chatId);

  return data;
}

// Simple RAG query (without full vector search for Hobby plan timeout)
async function simpleQuery(question) {
  const response = await nebius.chat.completions.create({
    model: "meta-llama/Llama-3.3-70B-Instruct",
    max_tokens: 512,
    messages: [
      {
        role: "system",
        content:
          "You are a helpful code assistant. Answer questions concisely.",
      },
      { role: "user", content: question },
    ],
  });
  return response.choices[0]?.message?.content || "No response";
}

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { session_key, chat_id, message, mode, language, title } = req.body;

    if (!session_key || !chat_id || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get session
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("session_key", session_key)
      .maybeSingle();

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Save user message
    const userMsg = await addMessage({
      sessionId: session.id,
      chatId: chat_id,
      role: "user",
      content: message,
      meta: { mode, language },
      title: title || message.split("\n")[0].substring(0, 50),
    });

    // Get AI response
    let aiText;
    if (mode === "code") {
      const response = await nebius.chat.completions.create({
        model: "meta-llama/Llama-3.3-70B-Instruct",
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content: `You are a helpful code assistant. Explain the following ${
              language || "code"
            } code in a clear, educational manner.`,
          },
          { role: "user", content: message },
        ],
      });
      aiText = response.choices[0]?.message?.content || "No response";
    } else {
      // Simple response for RAG mode (full RAG might timeout on Hobby plan)
      aiText = await simpleQuery(message);
    }

    // Save assistant message
    const assistantMsg = await addMessage({
      sessionId: session.id,
      chatId: chat_id,
      role: "assistant",
      content: aiText,
      meta: { mode, language },
    });

    res.json({ success: true, messages: [userMsg, assistantMsg] });
  } catch (err) {
    console.error("Chat Send Error:", err);
    res
      .status(500)
      .json({ error: "Failed to send message", details: err.message });
  }
}
