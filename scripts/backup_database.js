const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// 1. Read .env.local
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
      const val = trimmed
        .slice(idx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      env[key] = val;
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl =
  env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  env.SUPABASE_SECRET_KEY ||
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// All known tables in the platform schema
const TABLES = [
  "countries",
  "programs",
  "specialisations",
  "universities",
  "university_claims",
  "student_shortlists",
  "counsellor_conversations",
  "leads",
  "buyers",
  "courses",
  "scholarships",
];

function escapeSqlValue(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return val.toString();
  if (Array.isArray(val)) {
    const elements = val
      .map((v) => `"${String(v).replace(/"/g, '\\"')}"`)
      .join(",");
    return `'{${elements}}'`;
  }
  if (typeof val === "object") {
    const jsonStr = JSON.stringify(val).replace(/'/g, "''");
    return `'${jsonStr}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function exportDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.resolve(__dirname, "../backups");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const jsonBackupPath = path.join(
    backupDir,
    `supabase_backup_${timestamp}.json`,
  );
  const sqlBackupPath = path.join(
    backupDir,
    `supabase_backup_${timestamp}.sql`,
  );

  console.log(`\n📦 Starting Full Database Backup: ${timestamp}\n`);
  console.log(`Connecting to: ${supabaseUrl}\n`);

  const fullData = {
    metadata: {
      timestamp: new Date().toISOString(),
      supabaseUrl,
      tablesIncluded: [],
    },
    tables: {},
  };

  let sqlContent = `-- ============================================================\n`;
  sqlContent += `-- StudyAbroad Vista - Master Database Backup\n`;
  sqlContent += `-- Generated: ${new Date().toISOString()}\n`;
  sqlContent += `-- Database: ${supabaseUrl}\n`;
  sqlContent += `-- ============================================================\n\n`;

  for (const tableName of TABLES) {
    try {
      const { data, error } = await supabase.from(tableName).select("*");

      if (error) {
        console.warn(`⚠️  Table [${tableName}]: Notice - ${error.message}`);
        continue;
      }

      const rows = data || [];
      fullData.tables[tableName] = rows;
      fullData.metadata.tablesIncluded.push(tableName);

      console.log(`✓ [${tableName}]: ${rows.length} rows exported.`);

      if (rows.length > 0) {
        sqlContent += `-- Table: ${tableName} (${rows.length} rows)\n`;
        const columns = Object.keys(rows[0]);
        const colList = columns.map((c) => `"${c}"`).join(", ");

        for (const row of rows) {
          const values = columns
            .map((col) => escapeSqlValue(row[col]))
            .join(", ");
          sqlContent += `INSERT INTO "${tableName}" (${colList}) VALUES (${values}) ON CONFLICT DO NOTHING;\n`;
        }
        sqlContent += `\n`;
      }
    } catch (err) {
      console.warn(`⚠️  Error backing up table [${tableName}]:`, err.message);
    }
  }

  // Write JSON backup
  fs.writeFileSync(jsonBackupPath, JSON.stringify(fullData, null, 2), "utf-8");

  // Write SQL backup
  fs.writeFileSync(sqlBackupPath, sqlContent, "utf-8");

  console.log(`\n🎉 Backup Completed Successfully!`);
  console.log(`📁 JSON Backup: ${jsonBackupPath}`);
  console.log(`📁 SQL Script:  ${sqlBackupPath}`);
  console.log(
    `\nTip: You can restore this SQL file anytime directly in the Supabase SQL Editor.\n`,
  );
}

exportDatabase().catch(console.error);
