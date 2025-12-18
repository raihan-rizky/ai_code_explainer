import { createClient } from "@supabase/supabase-js";

console.log("[DB] 🔌 Initializing Supabase client...");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl) {
  console.error("[DB] ✗ SUPABASE_URL is not set!");
} else {
  console.log("[DB] ✓ SUPABASE_URL configured");
}

if (!supabaseKey) {
  console.error("[DB] ✗ SUPABASE_KEY is not set!");
} else {
  console.log("[DB] ✓ SUPABASE_KEY configured");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

console.log("[DB] ✓ Supabase client created successfully");
