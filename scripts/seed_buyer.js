const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      env[key] = val;
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function seedBuyer() {
  const buyerEmail = "consultant@studyabroadvista.com";
  const buyerPassword = "Password123!";

  console.log(`Checking if buyer account exists: ${buyerEmail}`);
  const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
  const existing = usersData.users.find(u => u.email?.toLowerCase() === buyerEmail.toLowerCase());

  if (existing) {
    console.log("Updating existing buyer account...");
    await supabaseAdmin.auth.admin.updateUserById(existing.id, {
      password: buyerPassword,
      email_confirm: true,
      user_metadata: {
        name: "Global Horizons Consultancy",
        first_name: "Sahil",
        last_name: "Consultant",
        role: "buyer",
        organization: "Global Horizons Overseas Education",
        phone: "+919876543210",
        country_name: "India",
        country_slug: "india",
        wallet_balance_inr: 50000,
      }
    });
    console.log("Buyer account updated successfully!");
  } else {
    console.log("Creating new buyer account...");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: buyerEmail,
      password: buyerPassword,
      email_confirm: true,
      user_metadata: {
        name: "Global Horizons Consultancy",
        first_name: "Sahil",
        last_name: "Consultant",
        role: "buyer",
        organization: "Global Horizons Overseas Education",
        phone: "+919876543210",
        country_name: "India",
        country_slug: "india",
        wallet_balance_inr: 50000,
      }
    });
    if (error) {
      console.error("Error creating buyer:", error);
    } else {
      console.log("Buyer created with ID:", created.user.id);
    }
  }

  // Also verify user can log in
  const { data: signInRes, error: signErr } = await supabaseAdmin.auth.signInWithPassword({
    email: buyerEmail,
    password: buyerPassword
  });

  if (signErr) {
    console.error("Verification sign-in failed:", signErr);
  } else {
    console.log("Verification sign-in SUCCESSFUL!");
  }
}

seedBuyer().catch(console.error);
