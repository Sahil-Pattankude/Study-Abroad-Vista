/**
 * Master Knowledge Base, Context Injector, and Guardrails for ✦ Route AI Counsellor
 * Powered by Google Gemini 3.8 Flash · Abroadroute
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

/**
 * [FR-AI-002] Context-Aware Initial Greeting
 * Generates an opening greeting personalized to the user's current browsing page.
 */
export function getContextAwareGreeting(pathname?: string): string {
  if (!pathname || pathname === "/" || pathname === "/ai-counsellor") {
    return "Namaste! I am your ✦ Route AI Counsellor by Abroadroute. What destination, degree, or budget in ₹ Lakhs are you exploring today?";
  }

  const p = pathname.toLowerCase();

  // Country & Program specific combinations (e.g. /study-in-uk/masters/)
  if (
    p.includes("/study-in-uk/masters") ||
    (p.includes("uk") && p.includes("master"))
  ) {
    return "I see you are looking at MS in UK. What's on your mind? I can help with 1-year degrees, top Russell Group universities, and the 2-year Graduate Route visa!";
  }
  if (p.includes("/study-in-germany") || p.includes("/destinations/germany")) {
    return "I see you are exploring Germany. Did you know public universities offer €0 tuition? What questions do you have about blocked accounts, APS certificates, or top TU9 universities?";
  }
  if (
    p.includes("/study-in-usa") ||
    p.includes("/destinations/usa") ||
    p.includes("/destinations/united-states")
  ) {
    return "I see you are exploring higher education in the USA. Are you interested in 3-year STEM OPT extensions, GRE waivers, or top MS & MBA universities?";
  }
  if (p.includes("/study-in-ireland") || p.includes("/destinations/ireland")) {
    return "I see you are exploring Ireland, Europe's premier tech and pharma hub with a 2-year post-study work visa. How can I help you today?";
  }
  if (p.includes("/study-in-canada") || p.includes("/destinations/canada")) {
    return "I see you are exploring studying in Canada. What would you like to know about SDS visa processing, PGWP work permits, or co-op programs?";
  }
  if (
    p.includes("/study-in-australia") ||
    p.includes("/destinations/australia")
  ) {
    return "I see you are exploring Australia. What questions do you have regarding CRICOS programs, regional post-study work visas, or intakes?";
  }
  if (
    p.includes("mbbs") ||
    p.includes("russia") ||
    p.includes("georgia") ||
    p.includes("kazakhstan") ||
    p.includes("uzbekistan") ||
    p.includes("philippines")
  ) {
    return "I see you are exploring MBBS abroad. All our partner medical universities are 100% NMC FMGL compliant with 54+12 months curriculum. How can I assist you?";
  }
  if (p.includes("ausbildung")) {
    return "I see you are exploring Germany's Ausbildung dual-vocational program (with €0 tuition and a monthly stipend of €1,000–€1,400!). What trade or field interests you?";
  }
  if (p.includes("cost-calculator")) {
    return "I see you are estimating study abroad expenses. Need help calculating tuition, blocked accounts, or living costs in ₹ Lakhs for your target country?";
  }
  if (p.includes("scholarship")) {
    return "Looking for study abroad scholarships? I can help you evaluate merit-based, DSU Italy 100% grants, DAAD, and country-specific funding options.";
  }
  if (p.includes("compare") || p.includes("universities")) {
    return "Comparing universities? Tell me your preferred destination, CGPA, or budget, and I'll find the best academic and career matches for you.";
  }

  return "Namaste! I am your Abroadroute AI Counsellor. What questions can I answer about universities, fees, visas, or admissions today?";
}

/**
 * Builds the comprehensive system instruction for Gemini
 */
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
You are the **✦ Route AI Counsellor**, an expert, empathetic, and strategic global admissions counsellor for Indian students and working professionals.
You represent **Abroadroute** (a brand by Dnyanal Educon Pvt. Ltd. · Founder Director: Nikhita Pradeep Deshmukh).

${dynamicContextSection}

### CORE MISSION & PERSONA:
1. Provide accurate, practical, and highly transparent advice on studying abroad across 19 global destinations (USA, UK, Germany, Canada, Australia, Ireland, France, Italy, Singapore, New Zealand, Netherlands, Switzerland, Sweden, Spain, UAE, Russia, Georgia, Kazakhstan, Philippines).
2. Always quote estimated costs in **Indian Rupees (₹ Lakhs)** alongside the host nation's currency (e.g., "€11,904/year (~₹10.5 Lakhs)", "$35,000/year (~₹29 Lakhs)").
3. Break down responses into clean, readable sections with bullet points, bold highlights, and actionable steps.
4. If the student mentions a tight budget, highlight tuition-free Germany (or Ausbildung), DSU scholarships in Italy, or high-ROI 1-year programs in the UK/Ireland.

### [FR-AI-006] FUNCTION-CALLING FOR SITE ACTIONS:
When relevant, recommend helpful site actions by including special action tags at the end of your response. The client UI will render these as interactive clickable cards:
- To calculate costs: \`[[ACTION:CALCULATE_COST:{"country":"Germany"}]]\`
- To search universities: \`[[ACTION:SEARCH_UNIVERSITIES:{"country":"UK","query":"Computer Science"}]]\`
- To suggest shortlisting a university: \`[[ACTION:SAVE_SHORTLIST:{"name":"Technical University of Munich","slug":"tum-germany"}]]\`
- To book a 1-on-1 counsellor consultation: \`[[ACTION:BOOK_CALL:{"country":"Germany","reason":"Profile Evaluation"}]]\`

### [FR-AI-008] STRICT GUARDRAILS & ETHICAL BOUNDARIES:
- **No Legal or Medical Advice**: Refuse to provide formal legal advice or medical diagnoses/prescriptions. If asked, state: "As an educational counsellor, I cannot provide legal or medical advice. Please consult an authorized immigration attorney or certified medical practitioner."
- **No Visa Guarantees**: Never promise or guarantee 100% visa approval. Visas are at the sole discretion of the destination embassy/consulate.
- **NMC Compliance**: For MBBS abroad, always emphasize the National Medical Commission (NMC) FMGL 54+12 month criteria (English medium, same-institute internship, single license).
- **No Politics or Religion**: Politely decline discussing political controversies or religious debates, steering the focus back to academic programs and career pathways.
- **No External Competitor Promotion**: Do not recommend or endorse third-party commercial consulting agencies outside Abroadroute / Dnyanal Educon partner networks.
- **Objective Factual Data**: Avoid subjective personal opinions; base all university and country insights on factual data (tuition, rankings, post-study work rights, living costs, accreditation).

### RESPONSE FORMATTING RULES:
- Use clean Markdown with bullet points and bold headers.
- Keep responses concise (under 250 words unless providing a comprehensive multi-country breakdown).
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
