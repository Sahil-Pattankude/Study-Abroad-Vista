import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing supabase URL or service role key!");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function verifyTCD() {
  console.log("Checking university_claims for Dublin / TCD...");
  const { data: claims, error: claimsErr } = await supabaseAdmin
    .from("university_claims")
    .select("*")
    .or(
      "university_id.eq.tcd,university_id.eq.trinity-college-dublin,university_name.ilike.%Dublin%",
    );

  console.log("Claims found:", claims, claimsErr);

  // Update claim to approved
  const { data: claimUpdate, error: claimUpdateErr } = await supabaseAdmin
    .from("university_claims")
    .update({
      verification_status: "approved",
      reviewed_at: new Date().toISOString(),
    })
    .or(
      "university_id.eq.tcd,university_id.eq.trinity-college-dublin,university_name.ilike.%Dublin%",
    )
    .select();

  console.log("Claim update:", claimUpdate, claimUpdateErr);

  // Update universities table to verified
  const { data: uniUpdate, error: uniUpdateErr } = await supabaseAdmin
    .from("universities")
    .update({
      claimed_status: "verified",
      updated_at: new Date().toISOString(),
    })
    .or("slug.eq.trinity-college-dublin,slug.eq.tcd,name.ilike.%Dublin%")
    .select();

  console.log("Universities table update result:", uniUpdate, uniUpdateErr);

  // Check current status in universities table
  const { data: currentUni } = await supabaseAdmin
    .from("universities")
    .select("id, name, slug, claimed_status, official_email_domain")
    .or("slug.eq.trinity-college-dublin,slug.eq.tcd,name.ilike.%Dublin%");

  console.log("Current state in universities table:", currentUni);
}

verifyTCD().catch(console.error);
