const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = val;
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SECRET_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("=== CHECKING SUPABASE SHORTLISTS ===");
  const { data: rows, error } = await supabase.from("student_shortlists").select("*");
  if (error) {
    console.error("Error selecting student_shortlists:", error);
  } else {
    console.log("Total rows in student_shortlists:", rows.length);
    rows.forEach((r) => {
      console.log(`User: [${r.user_email}] -> Slug: [${r.university_slug}] (User ID: ${r.user_id})`);
    });
  }

  const { data: usersData, error: userErr } = await supabase.auth.admin.listUsers();
  if (userErr) {
    console.error("Error listing auth users:", userErr);
  } else {
    console.log("\n=== AUTH USERS & METADATA SHORTLISTS ===");
    usersData.users.forEach((u) => {
      console.log(`Email: [${u.email}] | user_metadata.shortlists:`, u.user_metadata?.shortlists);
    });
  }
}

check().catch(console.error);

