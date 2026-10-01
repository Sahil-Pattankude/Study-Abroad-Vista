const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      env[key] = val;
    }
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runIsolationTest() {
  console.log("=== Testing Student Shortlist Isolation ===");

  const timestamp = Date.now();
  const testStudentA = `student_a_${timestamp}@testvista.com`;
  const testStudentB = `student_b_${timestamp}@testvista.com`;

  // 1. Create Student A
  console.log(`\n1. Creating Student A: ${testStudentA}`);
  const { data: userA, error: errA } = await supabaseAdmin.auth.admin.createUser({
    email: testStudentA,
    password: "Password123!",
    email_confirm: true,
    user_metadata: {
      name: "Student Alpha",
      role: "student",
      shortlists: []
    }
  });
  if (errA) throw errA;
  console.log("Student A created with ID:", userA.user.id);

  // 2. Create Student B
  console.log(`\n2. Creating Student B: ${testStudentB}`);
  const { data: userB, error: errB } = await supabaseAdmin.auth.admin.createUser({
    email: testStudentB,
    password: "Password123!",
    email_confirm: true,
    user_metadata: {
      name: "Student Beta",
      role: "student",
      shortlists: []
    }
  });
  if (errB) throw errB;
  console.log("Student B created with ID:", userB.user.id);

  // 3. Student A shortlists 1 university: 'technical-university-of-munich'
  console.log(`\n3. Student A shortlists 'technical-university-of-munich'`);
  await supabaseAdmin.from('student_shortlists').insert({
    user_id: userA.user.id,
    user_email: testStudentA,
    university_slug: 'technical-university-of-munich'
  });
  await supabaseAdmin.auth.admin.updateUserById(userA.user.id, {
    user_metadata: {
      ...userA.user.user_metadata,
      shortlists: ['technical-university-of-munich']
    }
  });

  // 4. Query Student A's shortlists
  const { data: listA } = await supabaseAdmin
    .from('student_shortlists')
    .select('university_slug')
    .eq('user_email', testStudentA);
  console.log("Student A shortlists:", listA.map(r => r.university_slug));

  // 5. Query Student B's shortlists
  const { data: listB } = await supabaseAdmin
    .from('student_shortlists')
    .select('university_slug')
    .eq('user_email', testStudentB);
  console.log("Student B shortlists (must be empty []):", listB.map(r => r.university_slug));

  // 6. Student B shortlists 'trinity-college-dublin'
  console.log(`\n6. Student B shortlists 'trinity-college-dublin'`);
  await supabaseAdmin.from('student_shortlists').insert({
    user_id: userB.user.id,
    user_email: testStudentB,
    university_slug: 'trinity-college-dublin'
  });

  const { data: updatedListA } = await supabaseAdmin
    .from('student_shortlists')
    .select('university_slug')
    .eq('user_email', testStudentA);
  const { data: updatedListB } = await supabaseAdmin
    .from('student_shortlists')
    .select('university_slug')
    .eq('user_email', testStudentB);

  console.log("\n=== Final Verification Results ===");
  console.log(`Student A (${testStudentA}):`, updatedListA.map(r => r.university_slug));
  console.log(`Student B (${testStudentB}):`, updatedListB.map(r => r.university_slug));

  const isIsolated = 
    updatedListA.length === 1 && updatedListA[0].university_slug === 'technical-university-of-munich' &&
    updatedListB.length === 1 && updatedListB[0].university_slug === 'trinity-college-dublin';

  if (isIsolated) {
    console.log("\n SUCCESS: Shortlists are 100% strictly isolated between accounts!");
  } else {
    console.error("\n FAILED: Shortlist isolation failed.");
  }

  // Cleanup test users
  await supabaseAdmin.from('student_shortlists').delete().in('user_email', [testStudentA, testStudentB]);
  await supabaseAdmin.auth.admin.deleteUser(userA.user.id);
  await supabaseAdmin.auth.admin.deleteUser(userB.user.id);
  console.log("\nTest accounts cleaned up.");
}

runIsolationTest().catch(console.error);
