import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qylhvlvcgjugwyjrpblp.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseKey;

const client = createClient(supabaseUrl, secretKey);

async function testInsert() {
  console.log("Testing insert into Supabase leads table...");
  const { data, error } = await client.from("leads").insert([
    {
      full_name: "Amit Patel",
      email: "amit.patel@example.com",
      phone: "+91 9812345678",
      country_target: "usa",
      program_target: "ms",
      budget_range_inr: "15-25Lakhs",
      intake_year: "Fall 2026",
      status: "raw",
    },
  ]).select();

  console.log("Insert result data:", data);
  console.log("Insert result error:", error);

  console.log("\nTesting select from leads table...");
  const { data: selData, error: selErr } = await client.from("leads").select("*");
  console.log("Select result count:", selData ? selData.length : 0);
  console.log("Select result data:", selData);
  console.log("Select result error:", selErr);
}

testInsert();
