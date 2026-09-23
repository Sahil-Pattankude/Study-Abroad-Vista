/**
 * Master Knowledge Base and Context Injector for StudyAbroad Vista AI Counsellor
 * Powered by Google Gemini 3.8 Flash
 */

export interface AIUserProfile {
  name?: string;
  email?: string;
  phone?: string;
  targetDegree?: string;
  targetCountry?: string;
  budgetRange?: string;
  cgpa?: string | number;
  testScores?: {
    ielts?: string | number;
    toefl?: string | number;
    gre?: string | number;
    gmat?: string | number;
    neet?: string | number;
  };
  preferredIntake?: string;
}

export interface AIPageContext {
  url?: string;
  country?: string;
  program?: string;
  university?: string;
  courseTitle?: string;
}

export function buildSystemPrompt(
  pageContext?: AIPageContext,
  userProfile?: AIUserProfile,
  shortlistCount?: number,
): string {
  const dynamicContext: string[] = [];

  if (pageContext?.country) {
    dynamicContext.push(`CURRENT PAGE DESTINATION: ${pageContext.country}`);
  }
  if (pageContext?.program) {
    dynamicContext.push(
      `CURRENT PAGE PROGRAM CATEGORY: ${pageContext.program}`,
    );
  }
  if (pageContext?.university) {
    dynamicContext.push(`CURRENT PAGE UNIVERSITY: ${pageContext.university}`);
  }
  if (pageContext?.courseTitle) {
    dynamicContext.push(`CURRENT VIEWED COURSE: ${pageContext.courseTitle}`);
  }

  if (userProfile?.name) {
    dynamicContext.push(`STUDENT NAME: ${userProfile.name}`);
  }
  if (userProfile?.targetDegree) {
    dynamicContext.push(`TARGET DEGREE: ${userProfile.targetDegree}`);
  }
  if (userProfile?.budgetRange) {
    dynamicContext.push(`BUDGET PREFERENCE: ${userProfile.budgetRange}`);
  }
  if (shortlistCount && shortlistCount > 0) {
    dynamicContext.push(
      `USER HAS ${shortlistCount} UNIVERSITIES IN THEIR SHORTLIST`,
    );
  }

  const dynamicContextSection =
    dynamicContext.length > 0
      ? `\n### ACTIVE STUDENT SESSION CONTEXT:\n${dynamicContext.map((c) => `- ${c}`).join("\n")}\n`
      : "";

  return `
You are the **StudyAbroad Vista AI Counsellor**, an expert, empathetic, and strategic global admissions counsellor for Indian students and working professionals.
You represent StudyAbroad Vista (a venture by Dnyanal Educon Pvt. Ltd.).

${dynamicContextSection}

### CORE MISSION & PERSONA:
1. Provide accurate, practical, and highly transparent advice on studying abroad.
2. Always quote estimated costs in **Indian Rupees (₹ Lakhs)** alongside the host nation's currency (e.g., "€11,904/year (~₹10.5 Lakhs)", "$35,000/year (~₹29 Lakhs)").
3. Break down responses into clear, readable sections with bullet points, bold highlights, and actionable steps.
4. If the student mentions a tight budget, highlight tuition-free Germany (or Ausbildung), DSU scholarships in Italy, or high-ROI 1-year programs in the UK/Ireland.

### STUDYABROAD VISTA DOMAIN KNOWLEDGE:

1. **19 GLOBAL DESTINATIONS**:
   - **USA**: 4,000+ accredited universities. 3-year OPT for STEM degrees (1 yr regular + 2 yr STEM extension). Top for MS CS, Data Science, MBA. Tuition: ₹22L–₹50L/year.
   - **UK**: 1-year Master's degree (saving 1 year of living costs). 2-year Graduate Route Post-Study Work (PSW) Visa. Russell Group prestige. Tuition: ₹15L–₹35L/year.
   - **Germany (English-taught degrees)**: 0 tuition at nearly all 300+ public universities (only €250–€350 semester fee). Blocked Account requirement: €11,904/year (~₹10.5 Lakhs). 18-month Post-Study Jobseeker Visa.
   - **Germany Ausbildung (Dual Vocational Training)**: 3-year government-recognized training (Nursing, IT, Mechatronics, Hotel/Culinary). 100% Free Tuition + Monthly Stipend of €1,000–€1,400 (~₹90,000–₹1,25,000/mo). Requires German B1/B2 level.
   - **Canada**: High post-study immigration pathways. 1–3 years PGWP (Post-Graduation Work Permit). Co-op internship programs. Tuition: ₹14L–₹30L/year.
   - **Australia**: High minimum wages, Group of Eight (G8) universities, 2–4 years Subclass 485 Post-Study Work rights. Tuition: ₹18L–₹38L/year.
   - **Ireland**: European Tech Headquarters (Google, Apple, Meta, Pfizer). 2-year PSW for Master's. Tuition: ₹13L–₹24L/year.
   - **France**: 5-year post-study Schengen visa for Master's graduates from France. World-class Business (HEC, INSEAD, ESSEC) and Engineering.
   - **Italy**: DSU Regional Scholarships offering 100% tuition waivers + up to €7,000 annual living grant based on family ISEE income (< €25,000/year). Top for Design, Architecture, and Engineering.
   - **Medical / MBBS Destinations**:
     - Russia, Georgia, Kazakhstan, Kyrgyzstan, Uzbekistan, Philippines.
     - **NMC Foreign Medical Graduate Licentiate (FMGL) Regulations 2021**:
       * Mandatory 54 months of course duration.
       * Mandatory 12 months internship in the *same* foreign medical institution.
       * Medium of instruction MUST be 100% English.
       * Must be eligible for license to practice in the host country.
       * Mandatory NEXT (National Exit Test) / FMGE exam clearance to practice in India.
       * 5–6 year total budget: ₹18L–₹35L including hostel, tuition, and Indian mess food.

2. **6 DEGREE LEVELS**:
   - Master's (MS/MSc, MEng, MIM)
   - MBA / Executive MBA
   - Germany Ausbildung (Vocational Apprenticeship)
   - MBBS / Medical
   - Nursing (BSc / Adaptation programs in UK, Germany, Australia)
   - Bachelor's (UG)

3. **GUARDRAILS & ETHICAL BOUNDARIES**:
   - **No Visa Guarantees**: Never promise or guarantee 100% visa approval. Visas are at the sole discretion of the destination embassy/consulate.
   - **Medical Verification**: Always alert MBBS candidates about NMC 54+12 month compliance before enrolling anywhere.
   - **Human Counsellor Escalation**: Encourage booking a free 1-on-1 advisor session on StudyAbroad Vista for document evaluation, visa file preparation, and scholarship applications.

### RESPONSE FORMATTING RULES:
- Use clean Markdown with bullet points and bold headers.
- Keep responses concise (under 250 words unless doing a detailed multi-country comparison).
- Include practical next steps at the end of every answer.
`.trim();
}

/**
 * Generate intelligent follow-up suggestions based on user query and destination
 */
export function getSmartFollowUpQuestions(
  query: string,
  pageContext?: AIPageContext,
): string[] {
  const q = query.toLowerCase();

  if (
    q.includes("germany") ||
    q.includes("ausbildung") ||
    pageContext?.country === "Germany"
  ) {
    return [
      "How much money is needed in a German Blocked Account?",
      "Can I study in Germany in English without German language?",
      "What are the eligibility requirements for Germany Ausbildung?",
      "How does the 18-month German jobseeker visa work?",
    ];
  }

  if (
    q.includes("mbbs") ||
    q.includes("doctor") ||
    q.includes("neet") ||
    pageContext?.program === "MBBS"
  ) {
    return [
      "Which MBBS countries are 100% NMC FMGL compliant?",
      "What is the total 6-year MBBS cost in Russia vs Georgia?",
      "Is NEET qualification mandatory for MBBS abroad?",
      "How does the NEXT exam work for foreign medical graduates?",
    ];
  }

  if (
    q.includes("uk") ||
    q.includes("england") ||
    pageContext?.country === "United Kingdom"
  ) {
    return [
      "Can I get a UK post-study work visa for 2 years?",
      "Top UK universities for MS Computer Science under ₹20 Lakhs?",
      "What is the difference between 1-year and 2-year UK Master's?",
      "How much living cost is required for UK student visa?",
    ];
  }

  if (
    q.includes("usa") ||
    q.includes("us") ||
    pageContext?.country === "United States"
  ) {
    return [
      "Which US programs offer 3-year STEM OPT extension?",
      "What are the average GRE and IELTS cutoffs for US universities?",
      "How to apply for Teaching/Research Assistantships (TA/RA)?",
      "What is the total cost for MS in CS in USA including living?",
    ];
  }

  if (
    q.includes("scholarship") ||
    q.includes("free") ||
    q.includes("budget") ||
    q.includes("low cost")
  ) {
    return [
      "How does Italy DSU 100% scholarship work?",
      "Which universities offer zero tuition in Europe?",
      "Top countries for study abroad under ₹15 Lakhs total budget?",
      "Can education loans cover living costs and blocked accounts?",
    ];
  }

  return [
    "Which European countries have free or low tuition fees?",
    "Best NMC-compliant MBBS universities under ₹25 Lakhs?",
    "How does Germany Ausbildung dual training work?",
    "Top 1-year Master's programs with post-study work visas?",
  ];
}
