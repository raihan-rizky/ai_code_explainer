import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ============ STARTUP LOGGING ============
const startTime = Date.now();
console.log("\n" + "=".repeat(60));
console.log("🚀 SERVER STARTUP INITIALIZED");
console.log("=".repeat(60));
console.log(`[${new Date().toISOString()}] Starting server...`);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log("[ENV] 📂 Working directory:", __dirname);

process.chdir(__dirname);
console.log("[ENV] ✓ Changed to server directory");

const envResult = dotenv.config();
if (envResult.error) {
  console.error("[ENV] ✗ Failed to load .env file:", envResult.error.message);
} else {
  console.log("[ENV] ✓ Environment variables loaded from .env");
}

// Export start time for measuring total startup duration
export { startTime };
