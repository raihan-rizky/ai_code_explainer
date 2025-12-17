import { supabase } from "../db/supabase.js";

const LIMITS = {
  SESSION_KEY_MAX: 200,
  MESSAGE_MAX_CHARS: 8000,
  HISTORY_LIMIT: 200,
};

// ============ SESSION FUNCTIONS ============

export async function getOrCreateSession(sessionKey) {
  // find existing
  const { data: existing, error: selErr } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("session_key", sessionKey)
    .maybeSingle();

  if (selErr) throw new Error(selErr.message);

  if (existing) {
    // touch last_active_at
    const { error: updErr } = await supabase
      .from("chat_sessions")
      .update({ last_active_at: new Date().toISOString() })
      .eq("id", existing.id);

    if (updErr) throw new Error(updErr.message);
    return existing;
  }

  // create new
  const { data: created, error: insErr } = await supabase
    .from("chat_sessions")
    .insert({
      session_key: sessionKey,
      last_active_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (insErr) throw new Error(insErr.message);
  return created;
}

export async function ensureSession(sessionKey) {
  if (!sessionKey || sessionKey.length > LIMITS.SESSION_KEY_MAX) {
    const e = new Error("Invalid session_key");
    e.statusCode = 400;
    throw e;
  }
  return getOrCreateSession(sessionKey);
}

// ============ CHAT FUNCTIONS ============

export async function createChat({ sessionId, title }) {
  const { data, error } = await supabase
    .from("chats")
    .insert({
      session_id: sessionId,
      title: title ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(`Failed to create chat: ${error.message}`);
  return data;
}

export async function listChats(sessionId) {
  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("session_id", sessionId)
    .order("last_active_at", { ascending: false });

  if (error) throw new Error(`Failed to list chats: ${error.message}`);
  return data ?? [];
}

export async function updateChatLastActive(chatId) {
  const { error } = await supabase
    .from("chats")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", chatId);

  if (error) throw new Error(`Failed to update chat: ${error.message}`);
}

export async function setChatTitleIfEmpty(chatId, title) {
  if (!title) return;

  const { data: chat, error: selErr } = await supabase
    .from("chats")
    .select("id,title")
    .eq("id", chatId)
    .single();

  if (selErr) throw new Error(selErr.message);
  if (chat.title) return;

  const { error: updErr } = await supabase
    .from("chats")
    .update({ title })
    .eq("id", chatId);

  if (updErr) throw new Error(updErr.message);
}

// ============ MESSAGE FUNCTIONS ============

const ALLOWED_ROLES = new Set(["user", "assistant", "system"]);

export async function addMessage({ sessionId, chatId, role, content, meta }) {
  if (!sessionId) {
    const e = new Error("sessionId is required");
    e.statusCode = 400;
    throw e;
  }

  if (!chatId) {
    const e = new Error("chatId is required");
    e.statusCode = 400;
    throw e;
  }

  if (!ALLOWED_ROLES.has(role)) {
    const e = new Error("Invalid role");
    e.statusCode = 400;
    throw e;
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    const e = new Error("content is required");
    e.statusCode = 400;
    throw e;
  }

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

  if (error) {
    throw new Error(`Supabase insert chat_messages failed: ${error.message}`);
  }

  // Update chat last_active_at
  await updateChatLastActive(chatId);

  return data;
}

export async function getMessages(chatId, limit = LIMITS.HISTORY_LIMIT) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`Failed to get messages: ${error.message}`);
  return data ?? [];
}

// ============ COMBINED HELPERS ============

export async function getSessionWithChats(sessionKey) {
  const session = await ensureSession(sessionKey);
  let chats = await listChats(session.id);

  // Auto-create first chat if none exist
  let activeChat = chats[0];
  if (!activeChat) {
    activeChat = await createChat({ sessionId: session.id, title: "New chat" });
    chats = [activeChat];
  }

  const messages = await getMessages(activeChat.id);

  return { session, chats, activeChat, messages };
}
