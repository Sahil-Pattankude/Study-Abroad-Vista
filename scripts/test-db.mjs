import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Load .env.local variables manually
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...values] = trimmed.split("=");
        if (key && values.length > 0) {
          const val = values.join("=").replace(/^[\"']|[\"']$/g, "").trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const secretKey = 
  process.env.SUPABASE_SECRET_KEY || 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  publishableKey;

async function main() {
  console.log("\n=======================================================");
  console.log("   STUDYABROAD VISTA • STARTUP DATABASE CHECK");
  console.log("=======================================================");

  if (!supabaseUrl || !publishableKey) {
    console.warn("⚠️  Warning: Supabase credentials missing in .env.local\n");
    return;
  }

  console.log(`📡 Supabase Project: ${supabaseUrl}`);

  const startTime = Date.now();

  try {
    const supabase = createClient(supabaseUrl, secretKey, {
      auth: { persistSession: false },
    });

    const { error } = await supabase
      .from("countries")
      .select("count", { count: "exact", head: true });

    const latency = Date.now() - startTime;

    if (error) {
      if (
        error.code === "PGRST204" || 
        error.code === "PGRST116" || 
        error.code === "42P01" ||
        error.message?.includes("relation") ||
        error.message?.includes("does not exist")
      ) {
        console.log(`✅ Database connected successfully! (API Latency: ${latency}ms)`);
        console.log("=======================================================\n");
        return;
      } else {
        console.log(`⚠️  Database ping notice: ${error.message} (${latency}ms)`);
        console.log("=======================================================\n");
        return;
      }
    }

    console.log(`✅ Database connected successfully! (API Latency: ${latency}ms)`);
    console.log("=======================================================\n");
  } catch (err) {
    console.log(`⚠️  Could not reach Supabase endpoint: ${err.message}`);
    console.log("=======================================================\n");
  }
}

main();
