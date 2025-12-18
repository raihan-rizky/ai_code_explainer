import { handleCors } from "./_lib/cors.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { auth: { persistSession: false } }
);

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method === "DELETE") {
    try {
      const { session_key, filename } = req.body;
      if (!session_key || !filename) {
        return res
          .status(400)
          .json({ error: "session_key and filename required" });
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

      // Delete document chunks
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("session_id", session.id)
        .filter("metadata->>filename", "eq", filename);

      if (error) throw new Error(error.message);
      res.json({ success: true, message: "Document deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
