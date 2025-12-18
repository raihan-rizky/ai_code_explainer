import cron from "node-cron";
import { supabase } from "../db/supabase.js";

/**
 * Delete all data from the database.
 * Order matters to respect foreign key constraints:
 * 1. chat_messages (depends on chats)
 * 2. documents (depends on chat_sessions)
 * 3. chats (depends on chat_sessions)
 * 4. chat_sessions (root)
 */
export async function deleteAllData() {
  console.log("\n[CLEANUP] Starting daily database cleanup...");
  try {
    // 1. Delete all chat messages
    const { error: msgErr } = await supabase
      .from("chat_messages")
      .delete()
      .neq("id", 0); // Delete all rows
    if (msgErr) throw new Error(`Failed to delete messages: ${msgErr.message}`);
    console.log("[CLEANUP] ✓ Deleted all chat messages");

    // 2. Delete all documents
    const { error: docErr } = await supabase
      .from("documents")
      .delete()
      .neq("id", 0);
    if (docErr)
      throw new Error(`Failed to delete documents: ${docErr.message}`);
    console.log("[CLEANUP] ✓ Deleted all documents");

    // 3. Delete all chats
    const { error: chatErr } = await supabase
      .from("chats")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // UUID check
    if (chatErr) throw new Error(`Failed to delete chats: ${chatErr.message}`);
    console.log("[CLEANUP] ✓ Deleted all chats");

    // 4. Delete all sessions
    const { error: sessErr } = await supabase
      .from("chat_sessions")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (sessErr)
      throw new Error(`Failed to delete sessions: ${sessErr.message}`);
    console.log("[CLEANUP] ✓ Deleted all sessions");

    console.log("[CLEANUP] ✓ Database cleanup completed successfully\n");
  } catch (error) {
    console.error("[CLEANUP] ✗ Cleanup failed:", error.message);
  }
}

/**
 * Initialize cron job to run every day at midnight (00:00)
 */
export function initCronJob() {
  // Schedule task to run at 00:00 every day
  cron.schedule("0 0 * * *", async () => {
    console.log("[CRON] Running scheduled cleanup job...");
    await deleteAllData();
  });

  console.log("[CRON] Daily cleanup job scheduled for 00:00");
}
