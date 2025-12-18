import { handleCors } from "../_lib/cors.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { auth: { persistSession: false } }
);

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { session_key, title } = req.body;
    if (!session_key) {
      return res.status(400).json({ error: "session_key is required" });
    }

    // Get session
    const { data: session, error: sessErr } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("session_key", session_key)
      .maybeSingle();

    if (sessErr) throw new Error(sessErr.message);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Create new chat
    const { data: chat, error: chatErr } = await supabase
      .from("chats")
      .insert({ session_id: session.id, title: title || "New chat" })
      .select("*")
      .single();

    if (chatErr) throw new Error(chatErr.message);

    res.json({ success: true, chat });
  } catch (err) {
    console.error("Create Chat Error:", err);
    res
      .status(500)
      .json({ error: "Failed to create chat", details: err.message });
  }
}
