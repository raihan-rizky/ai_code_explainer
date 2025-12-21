import { createClient } from "@supabase/supabase-js";

console.log("[DB] 🔌 Initializing Supabase client...");

const supabaseUrl = process.env.SUPABASE_URL;
// Use service role key for server-side access (bypasses RLS)
// This is secure because this client only runs on the server, never in the browser
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl) {
  console.error("[DB] ✗ SUPABASE_URL is not set!");
} else {
  console.log("[DB] ✓ SUPABASE_URL configured");
}

if (!supabaseServiceKey) {
  console.error("[DB] ✗ SUPABASE_SERVICE_ROLE_KEY is not set!");
} else {
  console.log("[DB] ✓ SUPABASE_SERVICE_ROLE_KEY configured");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

console.log("[DB] ✓ Supabase client created successfully");
