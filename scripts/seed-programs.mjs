/**
 * Seeds the Supabase `programs` table from the PROGRAMS array in
 * src/lib/data/masterData.ts, so the homepage can read disciplines
 * from the backend instead of importing static data.
 *
 * Run supabase/migrations/0001_programs_emba_phd_top_destinations.sql
 * FIRST — without it the 'emba' and 'phd' rows fail the enum check and
 * top_destinations does not exist.
 *
 *   node scripts/seed-programs.mjs --dry-run   # print rows, write nothing
 *   node scripts/seed-programs.mjs             # upsert into Supabase
 */
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const DRY_RUN = process.argv.includes("--dry-run");

// ---- load .env.local (the app's own env file) --------------------
function loadEnvLocal() {
  let raw;
  try {
    raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue; // skips blank lines and anything commented out
    const [, key, rawVal] = m;
    if (process.env[key]) continue;
    process.env[key] = rawVal.trim().replace(/^["']|["']$/g, "");
  }
}
loadEnvLocal();

// ---- extract PROGRAMS from masterData.ts -------------------------
// The array literal is plain data, so it can be evaluated directly
// rather than duplicating all 8 disciplines in this file.
function loadPrograms() {
  const src = readFileSync(
    new URL("../src/lib/data/masterData.ts", import.meta.url),
    "utf8",
  );
  const start = src.indexOf("export const PROGRAMS");
  if (start === -1) throw new Error("PROGRAMS not found in masterData.ts");
  // Skip past the type annotation (`: Program[]`) to the real array.
  const assign = src.indexOf("=", start);
  const open = src.indexOf("[", assign);

  let depth = 0;
  let end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error("Could not find end of PROGRAMS array");

  const literal = src.slice(open, end + 1);
  return new Function(`return (${literal});`)();
}

const programs = loadPrograms();

const rows = programs.map((p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  level: p.level,
  duration: p.duration,
  key_fields: p.keyFields || [],
  summary: p.summary || "",
  roi_score: p.roiScore ?? 90,
  top_destinations: p.topDestinations || [],
}));

console.log(`Parsed ${rows.length} programs from masterData.ts:\n`);
for (const r of rows) {
  console.log(
    `  ${r.slug.padEnd(11)} ${r.name.padEnd(26)} ROI ${String(r.roi_score).padStart(3)}  ${r.level}`,
  );
}

if (DRY_RUN) {
  console.log("\n--dry-run: nothing written.");
  process.exit(0);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "\nMissing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.\n" +
      "Uncomment them in .env.local (or export them) and re-run.",
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase
  .from("programs")
  .upsert(rows, { onConflict: "id" })
  .select();

if (error) {
  console.error("\nSeed failed:", error.message);
  if (/invalid input value for enum/.test(error.message)) {
    console.error(
      "Run supabase/migrations/0001_programs_emba_phd_top_destinations.sql first.",
    );
  }
  process.exit(1);
}

console.log(`\nUpserted ${data.length} programs.`);
