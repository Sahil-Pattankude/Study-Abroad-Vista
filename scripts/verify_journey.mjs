import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qylhvlvcgjugwyjrpblp.supabase.co";
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const client = createClient(supabaseUrl, secretKey);

async function verifyFullJourneyBackend() {
  console.log("=== STEP 1: TESTING SUPABASE LEAD INSERTION ===");
  const testLead = {
    full_name: "Rohan Varma Test",
    email: "rohan.test@gmail.com",
    phone: "+91 9876599999",
    country_target: "usa",
    program_target: "ms",
    budget_range_inr: "25-40Lakhs",
    intake_year: "Fall 2026",
    status: "raw",
  };

  const { data: insertData, error: insertErr } = await client
    .from("leads")
    .insert([testLead])
    .select();

  if (insertErr) {
    console.error("FAILED to insert lead into Supabase:", insertErr);
    return;
  }
  console.log("SUCCESS: Lead inserted into Supabase `leads` table!");
  console.log("Inserted Lead Record:", insertData[0]);

  console.log("\n=== STEP 2: VERIFYING B2B MARKETPLACE FEED QUERY ===");
  const { data: feedData, error: feedErr } = await client
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (feedErr) {
    console.error("FAILED to fetch marketplace feed from Supabase:", feedErr);
    return;
  }
  console.log(`SUCCESS: Fetched ${feedData.length} recent leads from Supabase for B2B Marketplace Feed.`);
  console.log("Top Lead in Feed:", feedData[0].full_name, "-", feedData[0].email, "-", feedData[0].country_target);

  console.log("\n=== SYSTEM HEALTH CHECK: ALL BACKEND JOURNEY CHECKS PASSED 100% ===");
}

verifyFullJourneyBackend();
