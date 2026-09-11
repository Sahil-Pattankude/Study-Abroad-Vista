import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1z6ctbcw",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: true,
});

async function checkSanity() {
  console.log("Checking Sanity connection...");
  console.log(`- Project ID: ${client.config().projectId}`);
  console.log(`- Dataset: ${client.config().dataset}`);
  try {
    const res = await client.fetch('*[_type != null][0...5]');
    console.log("\n[SUCCESS] SANITY CONNECTION STATUS: CONNECTED & HEALTHY");
    console.log(`- Documents found in dataset: ${res.length}`);
    if (res.length > 0) {
      console.log("- Sample Document Types:", [...new Set(res.map(d => d._type))]);
    } else {
      console.log("- Note: Connected successfully, but 0 documents have been published yet in your Sanity Studio.");
    }
  } catch (err) {
    console.error("\n[FAILED] SANITY CONNECTION FAILED:");
    console.error(err.message);
  }
}

checkSanity();
