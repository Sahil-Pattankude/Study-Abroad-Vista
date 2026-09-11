// Editorial Content Dataset conforming to Document W11 (Website Content Plan)
// Provides 8-section deep content for Country Hubs, Program Hubs, Country x Program, and University Profiles

export interface CountryContent {
  slug: string;
  name: string;
  heroSubtitle: string;
  overviewHeading: string;
  overviewParagraphs: string[];
  whyChooseReasons: { title: string; desc: string }[];
  tradeoffsToKnow: { title: string; desc: string }[];
  programsOfferedNotes: string;
  costBreakdown: {
    programType: string;
    tuitionRangeINR: string;
    livingCostINR: string;
    totalAnnualINR: string;
    notes: string;
  }[];
  hiddenCosts: { item: string; costINR: string; frequency: string }[];
  scholarships: {
    name: string;
    type: "Government" | "University" | "Private";
    amount: string;
    eligibility: string;
    deadline: string;
  }[];
  visaDetails: {
    visaType: string;
    processingTime: string;
    workHoursDuringTerm: string;
    postStudyWorkDuration: string;
    financialProofRequired: string;
    prPathwaySummary: string;
  };
  faqs: { question: string; answer: string }[];
}

export const COUNTRY_EDITORIAL_CONTENT: Record<string, CountryContent> = {
  germany: {
    slug: "germany",
    name: "Germany",
    heroSubtitle: "Zero Tuition at Top Public Universities • 18-Month Jobseeker Visa • Europe's #1 Economy",
    overviewHeading: "Why Indian Students Choose Germany for Technical & Business Excellence",
    overviewParagraphs: [
      "Germany has emerged as one of the most favored international education destinations for Indian students, hosting over 45,000 Indian scholars in public technical universities and business schools.",
      "The country's public education mandate provides virtually tuition-free education (charging only a nominal administrative semester fee of €250 to €350) across renowned TU9 universities such as TU Munich, RWTH Aachen, and TU Berlin.",
      "With a severe engineering and IT talent shortage, graduates enjoy an 18-month post-study work visa (Jobseeker Permit) with pathways to EU Blue Cards and permanent residency within 21 to 33 months."
    ],
    whyChooseReasons: [
      { title: "Zero to Low Tuition Fees", desc: "Most public universities charge €0 tuition for international students, saving ₹25–40 Lakhs compared to US or UK counterparts." },
      { title: "18-Month Jobseeker Visa", desc: "Graduates receive a generous 1.5-year post-study residence permit to find full-time employment matching their qualifications." },
      { title: "Industrial Innovation & Co-ops", desc: "Direct partnerships with automotive and tech giants (BMW, Siemens, Bosch, SAP) offer paid student-worker (Werkstudent) contracts." }
    ],
    tradeoffsToKnow: [
      { title: "German Language Barrier", desc: "While master's degrees are taught in English, conversational German (B1/B2 level) is vital for local corporate hiring and daily integration." },
      { title: "Strict APS Verification", desc: "Indian students must clear the mandatory APS Certificate verification process before applying for their German student visa." },
      { title: "Mandatory Blocked Account", desc: "You must deposit €11,904 (approx. ₹11 Lakhs) in a designated blocked bank account (Coracle, Expatrio, or Fintiba) prior to visa approval." }
    ],
    programsOfferedNotes: "Germany is renowned globally for Engineering (Mechanical, Automotive, Mechatronics), Data Science & AI, Renewable Energy, and its unique zero-tuition Ausbildung dual vocational programs.",
    costBreakdown: [
      { programType: "Master's (MS/MSc - Public)", tuitionRangeINR: "₹0 - ₹60,000 / yr (Semester fee only)", livingCostINR: "₹9 - 11 Lakhs / yr", totalAnnualINR: "₹9 - 11.5 Lakhs", notes: "TU9 and state public universities charge no tuition." },
      { programType: "MBA / Private Business", tuitionRangeINR: "₹14 - 24 Lakhs / yr", livingCostINR: "₹9 - 11 Lakhs / yr", totalAnnualINR: "₹23 - 35 Lakhs", notes: "Private universities like ESMT Berlin, Frankfurt School." },
      { programType: "Bachelor's Degrees", tuitionRangeINR: "₹0 - ₹80,000 / yr", livingCostINR: "₹9 - 11 Lakhs / yr", totalAnnualINR: "₹9 - 12 Lakhs", notes: "Requires Studienkolleg foundation year for 12-year Indian schooling." },
      { programType: "Ausbildung (Vocational)", tuitionRangeINR: "₹0 (Zero Tuition + Paid Stipend)", livingCostINR: "Covered by monthly €1,000 - €1,400 stipend", totalAnnualINR: "₹0 Net Cost", notes: "Dual vocational training with healthcare, IT, and mechanics." }
    ],
    hiddenCosts: [
      { item: "APS Certificate Processing Fee", costINR: "₹18,000", frequency: "One-time" },
      { item: "Blocked Account Setup & Fee", costINR: "₹12,000", frequency: "One-time" },
      { item: "Public Health Insurance (TK / Barmer)", costINR: "₹11,500 / month", frequency: "Monthly" },
      { item: "Semester Ticket (Free Regional Transit)", costINR: "Included in Semester Fee", frequency: "Per Semester" }
    ],
    scholarships: [
      { name: "DAAD Master Studies Scholarships", type: "Government", amount: "€934/month + Travel allowance", eligibility: "Top academic performers in Bachelor's applying for German master's", deadline: "October - November annually" },
      { name: "Deutschlandstipendium", type: "Government", amount: "€300/month", eligibility: "Enrolled students with outstanding high-school/college grades & social commitment", deadline: "Rolling per university" },
      { name: "Konrad-Adenauer-Stiftung Fellowship", type: "Private", amount: "€861/month + insurance coverage", eligibility: "Students with proven leadership and interest in public policy/academics", deadline: "July 15 annually" }
    ],
    visaDetails: {
      visaType: "German National Student Visa (Subtype D)",
      processingTime: "4 to 8 weeks (Requires prior APS Certificate)",
      workHoursDuringTerm: "140 full days or 280 half days per calendar year (approx. 20 hours/week)",
      postStudyWorkDuration: "18 Months (1.5 Years) Jobseeker Residence Permit",
      financialProofRequired: "€11,904 in a government-recognized Blocked Account (Sperrkonto)",
      prPathwaySummary: "Fast-track German Permanent Residence (Niederlassungserlaubnis) eligible after 21 months of employment with B1 German (or 27 months with A1 German)."
    },
    faqs: [
      { question: "Is studying in Germany truly tuition-free for Indian students?", answer: "Yes. At public universities in 15 out of 16 German federal states (except Baden-Württemberg which charges €1,500/sem), both EU and non-EU international students pay zero tuition fees, only a semester admin fee of €250–€350." },
      { question: "What is an APS Certificate and why is it mandatory?", answer: "The Akademische Prüfstelle (APS) certificate verifies the authenticity of Indian academic marksheets. Issued by the German Embassy in New Delhi, it is a mandatory prerequisite before applying for a student visa." },
      { question: "Can I study a Master's degree in Germany in English?", answer: "Yes, over 1,800 master's degree programs in Germany are conducted 100% in English, specifically in STEM, Business, Computer Science, and Data Analytics." },
      { question: "How much money do I need in my blocked account for 2026-2027?", answer: "The official requirement is €11,904 per year (€992 per month) deposited into an approved blocked account provider like Expatrio, Coracle, or Fintiba before your visa appointment." },
      { question: "What is Germany Ausbildung for Indian students?", answer: "Ausbildung is a government-regulated 3-year dual apprenticeship where you work for a company 3–4 days a week while attending vocational school 1–2 days. You pay zero tuition and receive a monthly stipend of €1,000 to €1,400." }
    ]
  },

  usa: {
    slug: "usa",
    name: "United States",
    heroSubtitle: "World-Leading STEM Research • Ivy League Prestige • 3-Year STEM OPT Work Authorization",
    overviewHeading: "The Epicenter of Global Technology, Research, and Corporate Leadership",
    overviewParagraphs: [
      "The United States remains the premier destination for Indian graduate students, hosting over 260,000 Indian scholars across tech, engineering, and MBA programs.",
      "With premier institutions like MIT, Stanford, Georgia Tech, and Carnegie Mellon, the US offers unmatched research infrastructure, Silicon Valley venture networks, and high starting compensation.",
      "Under the F-1 visa STEM OPT extension, graduates in STEM disciplines receive up to 36 months (3 years) of post-study employment authorization without needing an immediate H-1B visa lottery sponsor."
    ],
    whyChooseReasons: [
      { title: "3-Year STEM OPT Work Rights", desc: "Work for up to 36 months post-graduation in the US tech and engineering ecosystem on an F-1 student visa." },
      { title: "Top Starting Compensation", desc: "US STEM master's and MBA graduates command median starting salaries of $85,000 to $130,000 (₹75 Lakhs to ₹1.1 Crore)." },
      { title: "Research & Teaching Assistantships", desc: "Graduate Assistantships (GRA/GTA) often waive 50%–100% of tuition while providing a living monthly stipend." }
    ],
    tradeoffsToKnow: [
      { title: "Higher Cost of Attendance", desc: "Average annual tuition ranges between ₹25 and ₹45 Lakhs, making education loans and financial planning critical." },
      { title: "Competitive Visa Interview", desc: "F-1 student visa approval relies heavily on a 2-minute consular interview proving strong non-immigrant intent and funding." },
      { title: "H-1B Lottery Cap", desc: "Transition from F-1 STEM OPT to long-term work authorization is subject to the annual US H-1B lottery cap." }
    ],
    programsOfferedNotes: "The US excels in Computer Science, AI/ML, Electrical Engineering, Mechanical Engineering, Healthcare Management, and Full-time / STEM MBA programs.",
    costBreakdown: [
      { programType: "Master's (STEM MS)", tuitionRangeINR: "₹25 - 42 Lakhs / yr", livingCostINR: "₹10 - 15 Lakhs / yr", totalAnnualINR: "₹35 - 57 Lakhs", notes: "Public state universities (e.g. GaTech, Purdue) offer high ROI." },
      { programType: "MBA (Top 50 Schools)", tuitionRangeINR: "₹38 - 65 Lakhs / yr", livingCostINR: "₹14 - 20 Lakhs / yr", totalAnnualINR: "₹52 - 85 Lakhs", notes: "Top MBA programs yield six-figure dollar starting packages." },
      { programType: "Undergraduate (BS/BA)", tuitionRangeINR: "₹28 - 48 Lakhs / yr", livingCostINR: "₹12 - 16 Lakhs / yr", totalAnnualINR: "₹40 - 64 Lakhs", notes: "4-year degrees with rich campus life and Co-op options." }
    ],
    hiddenCosts: [
      { item: "SEVIS I-901 Fee", costINR: "₹30,500 ($350)", frequency: "One-time" },
      { item: "DS-160 Visa Application Fee", costINR: "₹16,100 ($185)", frequency: "One-time" },
      { item: "University Mandatory Health Insurance", costINR: "₹1.5 - 2.5 Lakhs / yr", frequency: "Annual" },
      { item: "Standardized Tests (GRE/TOEFL/IELTS)", costINR: "₹40,000 total", frequency: "One-time" }
    ],
    scholarships: [
      { name: "Fullbright-Nehru Master’s Fellowships", type: "Government", amount: "Full tuition + Airfare + Living Stipend", eligibility: "Indian graduates with 3+ years professional work experience", deadline: "Mid-May annually" },
      { name: "University Graduate Assistantships (GRA/GTA)", type: "University", amount: "50% - 100% Tuition waiver + $1,500 - $2,500/mo", eligibility: "Strong undergraduate research, coding skills, and GRE scores", deadline: "Departmental intake deadlines" },
      { name: "Inlaks Shivdasani Foundation Scholarships", type: "Private", amount: "Up to $100,000 for elite institutions", eligibility: "Top-tier Indian admits to Harvard, Stanford, MIT, Columbia, etc.", deadline: "March 30 annually" }
    ],
    visaDetails: {
      visaType: "F-1 Academic Student Visa",
      processingTime: "2 to 6 weeks (Requires I-20 form from university)",
      workHoursDuringTerm: "Up to 20 hours/week strictly on-campus during academic terms",
      postStudyWorkDuration: "12 Months Initial OPT + 24 Months STEM Extension = 36 Months Total",
      financialProofRequired: "Liquid funds covering 1 full year's estimated Cost of Attendance (approx. ₹35 - 55 Lakhs on I-20)",
      prPathwaySummary: "F-1 → 3-Year STEM OPT → Employer-sponsored H-1B Visa → EB-2 / EB-3 Employment-based Green Card."
    },
    faqs: [
      { question: "What is STEM OPT and how does it help Indian students?", answer: "STEM OPT allows graduates of science, technology, engineering, and mathematics programs to work in the US for up to 3 years post-graduation on their student visa, giving them multiple chances in the H-1B visa lottery." },
      { question: "Is the GRE mandatory for MS in the USA in 2026-2027?", answer: "Many top US universities (such as GaTech, UIUC, Columbia) have made GRE optional or waived it for select master's programs, though submitting a 315+ GRE score significantly strengthens scholarship chances." },
      { question: "How much total budget should an Indian family plan for a 2-year MS in USA?", answer: "A typical 2-year MS in the US requires ₹45 to ₹75 Lakhs all-inclusive. However, students who secure Graduate Assistantships or internships can recover 40%–60% of this cost during their degree." }
    ]
  },

  uk: {
    slug: "uk",
    name: "United Kingdom",
    heroSubtitle: "1-Year Fast-Track Master’s • 2-Year Graduate Route Visa • Prestigious Russell Group Heritage",
    overviewHeading: "World-Class Academic Rigor with Accelerated 1-Year Master's Degrees",
    overviewParagraphs: [
      "The United Kingdom is famous for its intensive 1-year master's degrees that enable Indian students to enter the global workforce a full year earlier than in other countries, dramatically lowering total living costs.",
      "With 160+ universities—including historic Russell Group institutions like Oxford, Cambridge, Imperial, and Manchester—the UK maintains exceptional global brand prestige.",
      "Graduates benefit from the 2-year Graduate Route Post-Study Work Visa, allowing international scholars to work in any sector without requiring employer sponsorship."
    ],
    whyChooseReasons: [
      { title: "1-Year Master's Programs", desc: "Complete your MSc or MA in just 12 months, saving a full year of overseas living expenses." },
      { title: "2-Year Unrestricted Graduate Visa", desc: "Work for up to 2 years after graduation with no minimum salary or sponsorship requirements." },
      { title: "Russell Group Global Recognition", desc: "Degrees from historic research powerhouses carry immense weight with Indian MNCs and global recruiters." }
    ],
    tradeoffsToKnow: [
      { title: "Competitive Skilled Worker Threshold", desc: "Transitioning to a Skilled Worker Visa after the 2-year Graduate Route requires meeting current Home Office salary thresholds." },
      { title: "Higher London Living Costs", desc: "Living expenses in Central London (approx. ₹13–15 Lakhs/yr) are considerably higher than in Northern England or Scotland." }
    ],
    programsOfferedNotes: "Strongest in Data Science, Finance, International Business, Public Health, Nursing, and Law (LLM).",
    costBreakdown: [
      { programType: "Master's (1-Year MSc)", tuitionRangeINR: "₹18 - 32 Lakhs total", livingCostINR: "₹10 - 13 Lakhs total", totalAnnualINR: "₹28 - 45 Lakhs total", notes: "Entire degree is completed in 1 year, minimizing total spend." },
      { programType: "MBA (1-Year)", tuitionRangeINR: "₹25 - 45 Lakhs total", livingCostINR: "₹11 - 15 Lakhs total", totalAnnualINR: "₹36 - 60 Lakhs total", notes: "Fast-track executive and management training." },
      { programType: "Bachelor's (3-Year)", tuitionRangeINR: "₹16 - 28 Lakhs / yr", livingCostINR: "₹10 - 13 Lakhs / yr", totalAnnualINR: "₹26 - 41 Lakhs / yr", notes: "Standard UK undergraduate honours degree." }
    ],
    hiddenCosts: [
      { item: "Immigration Health Surcharge (IHS)", costINR: "₹85,000 (£776) / yr", frequency: "Annual" },
      { item: "Student Visa Application Fee", costINR: "₹54,000 (£490)", frequency: "One-time" },
      { item: "CAS Deposit to University", costINR: "₹2 - 4 Lakhs", frequency: "Adjusted against tuition" }
    ],
    scholarships: [
      { name: "Chevening Scholarships", type: "Government", amount: "Full tuition + flights + monthly living allowance", eligibility: "Indian graduates with 2+ years work experience & leadership acumen", deadline: "Early November annually" },
      { name: "Commonwealth Scholarships", type: "Government", amount: "Full funding for master's & PhD", eligibility: "Talented Indian students unable to afford overseas education", deadline: "December annually" },
      { name: "GREAT Scholarships (India)", type: "Government", amount: "£10,000 tuition fee discount", eligibility: "Open to Indian passport holders applying to participating UK institutions", deadline: "March - May annually" }
    ],
    visaDetails: {
      visaType: "UK Student Visa (formerly Tier 4)",
      processingTime: "3 weeks (Priority visa available in 5 days)",
      workHoursDuringTerm: "Up to 20 hours/week during term time; 40 hours/week during vacations",
      postStudyWorkDuration: "2 Years Graduate Route (3 Years for PhD graduates)",
      financialProofRequired: "Remaining tuition + 9 months living costs (approx. £1,023/mo outside London, £1,334/mo in London)",
      prPathwaySummary: "Student Visa → 2-Year Graduate Route → Skilled Worker Visa (5 years continuous employment) → Indefinite Leave to Remain (ILR)."
    },
    faqs: [
      { question: "Is the UK Graduate Route (Post-Study Work Visa) still active for Indian students?", answer: "Yes, the UK Government has officially confirmed the continuation of the 2-Year Graduate Route visa for international students completing eligible degrees." },
      { question: "Can Indian students study in the UK without IELTS?", answer: "Many UK universities waive the IELTS requirement if you scored 70%+ in 12th Standard English from CBSE, ICSE, or selected State Boards." },
      { question: "Are 1-year UK master’s degrees recognized in India by AIU?", answer: "Yes, the Association of Indian Universities (AIU) and the Ministry of Education have signed an MoU on mutual recognition of educational qualifications with the UK." }
    ]
  },

  russia: {
    slug: "russia",
    name: "Russia",
    heroSubtitle: "30+ Years of Medical Trust • NMC & WHO Compliant MBBS • ₹18 - 25 Lakhs All-Inclusive",
    overviewHeading: "The Most Affordable, High-Exposure Destination for Global MBBS Aspirants",
    overviewParagraphs: [
      "Russia has been the trusted destination for Indian medical aspirants for over three decades, currently educating more than 20,000 Indian students across government medical universities.",
      "Russian medical degrees are recognized by the National Medical Commission (NMC), World Health Organization (WHO), and ECFMG (USA), providing a direct pathway to FMGE/NExT licensure in India.",
      "With total 6-year MBBS budgets starting at just ₹18 to ₹25 Lakhs (inclusive of tuition, hostel, and Indian food), it offers an accessible alternative to expensive private medical colleges in India."
    ],
    whyChooseReasons: [
      { title: "100% NMC & WHO Compliant", desc: "5+1 year curriculum adhering strictly to NMC 2021 Gazette regulations with English instruction." },
      { title: "Low Tuition & Cost of Living", desc: "Complete your entire 6-year medical degree for the cost of a single year in an Indian private medical college." },
      { title: "Indian Food & Dedicated Hostels", desc: "Major universities feature dedicated Indian mess facilities, hostel wardens, and established senior alumni networks." }
    ],
    tradeoffsToKnow: [
      { title: "Russian Language for Clinicals", desc: "While classes are in English, conversational Russian is taught from Year 1 to interact with local hospital patients during clinical rotations." },
      { title: "Cold Winter Climate", desc: "Temperatures can drop below freezing during winter months, requiring appropriate thermal winterwear." }
    ],
    programsOfferedNotes: "Exclusively focused on General Medicine (MBBS / MD) with high clinical bed-to-student ratios.",
    costBreakdown: [
      { programType: "MBBS (6 Years Total)", tuitionRangeINR: "₹3 - 5 Lakhs / yr", livingCostINR: "₹1.5 - 2.5 Lakhs / yr (incl. hostel & food)", totalAnnualINR: "₹4.5 - 7.5 Lakhs / yr", notes: "Total 6-year package ranges between ₹20 and ₹32 Lakhs." }
    ],
    hiddenCosts: [
      { item: "Medical Insurance & Registration", costINR: "₹15,000 / yr", frequency: "Annual" },
      { item: "Hostel Fee", costINR: "₹40,000 - 80,000 / yr", frequency: "Annual" },
      { item: "Indian Food Mess", costINR: "₹10,000 - 12,000 / month", frequency: "Monthly" }
    ],
    scholarships: [
      { name: "Russian Government State Scholarships (Quota)", type: "Government", amount: "100% Tuition waiver for selected applicants", eligibility: "High marks in 12th PCB and Russian embassy entrance exam", deadline: "February - March annually" }
    ],
    visaDetails: {
      visaType: "Russian Student Visa",
      processingTime: "2 to 4 weeks",
      workHoursDuringTerm: "Part-time student employment allowed with university permission",
      postStudyWorkDuration: "Clinical Residency / Internship pathways",
      financialProofRequired: "Affidavit of parental support and basic bank balance (₹3 - 5 Lakhs)",
      prPathwaySummary: "Students typically return to India to clear the NExT/FMGE licensing examination or pursue USMLE/PLAB."
    },
    faqs: [
      { question: "Is NEET qualification mandatory for Indian students studying MBBS in Russia?", answer: "Yes, per National Medical Commission (NMC) regulations, NEET qualification is mandatory to study MBBS abroad if you wish to practice medicine in India." },
      { question: "Are Russian medical degrees taught in English?", answer: "Yes, universities like Bashkir State Medical University and Kazan Federal University offer complete 6-year MBBS instruction in English." },
      { question: "Can I practice as a doctor in India after completing MBBS in Russia?", answer: "Yes. Once you complete the 5.4 years coursework + 1-year clinical internship in Russia, you are eligible to appear for the NExT / FMGE licensing exam to practice medicine across India." }
    ]
  }
};

export function getCountryEditorial(slug: string): CountryContent | null {
  return COUNTRY_EDITORIAL_CONTENT[slug] || null;
}
