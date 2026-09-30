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
    heroSubtitle:
      "Zero Tuition at Top Public Universities • 18-Month Jobseeker Visa • Europe's #1 Economy",
    overviewHeading:
      "Why Indian Students Choose Germany for Technical & Business Excellence",
    overviewParagraphs: [
      "Germany has emerged as one of the most favored international education destinations for Indian students, hosting over 45,000 Indian scholars in public technical universities and business schools.",
      "The country's public education mandate provides virtually tuition-free education (charging only a nominal administrative semester fee of €250 to €350) across renowned TU9 universities such as TU Munich, RWTH Aachen, and TU Berlin.",
      "With a severe engineering and IT talent shortage, graduates enjoy an 18-month post-study work visa (Jobseeker Permit) with pathways to EU Blue Cards and permanent residency within 21 to 33 months.",
    ],
    whyChooseReasons: [
      {
        title: "Zero to Low Tuition Fees",
        desc: "Most public universities charge €0 tuition for international students, saving ₹25–40 Lakhs compared to US or UK counterparts.",
      },
      {
        title: "18-Month Jobseeker Visa",
        desc: "Graduates receive a generous 1.5-year post-study residence permit to find full-time employment matching their qualifications.",
      },
      {
        title: "Industrial Innovation & Co-ops",
        desc: "Direct partnerships with automotive and tech giants (BMW, Siemens, Bosch, SAP) offer paid student-worker (Werkstudent) contracts.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "German Language Barrier",
        desc: "While master's degrees are taught in English, conversational German (B1/B2 level) is vital for local corporate hiring and daily integration.",
      },
      {
        title: "Strict APS Verification",
        desc: "Indian students must clear the mandatory APS Certificate verification process before applying for their German student visa.",
      },
      {
        title: "Mandatory Blocked Account",
        desc: "You must deposit €11,904 (approx. ₹11 Lakhs) in a designated blocked bank account (Coracle, Expatrio, or Fintiba) prior to visa approval.",
      },
    ],
    programsOfferedNotes:
      "Germany is renowned globally for Engineering (Mechanical, Automotive, Mechatronics), Data Science & AI, Renewable Energy, and its unique zero-tuition Ausbildung dual vocational programs.",
    costBreakdown: [
      {
        programType: "Master's (MS/MSc - Public)",
        tuitionRangeINR: "₹0 - ₹60,000 / yr (Semester fee only)",
        livingCostINR: "₹9 - 11 Lakhs / yr",
        totalAnnualINR: "₹9 - 11.5 Lakhs",
        notes: "TU9 and state public universities charge no tuition.",
      },
      {
        programType: "MBA / Private Business",
        tuitionRangeINR: "₹14 - 24 Lakhs / yr",
        livingCostINR: "₹9 - 11 Lakhs / yr",
        totalAnnualINR: "₹23 - 35 Lakhs",
        notes: "Private universities like ESMT Berlin, Frankfurt School.",
      },
      {
        programType: "Bachelor's Degrees",
        tuitionRangeINR: "₹0 - ₹80,000 / yr",
        livingCostINR: "₹9 - 11 Lakhs / yr",
        totalAnnualINR: "₹9 - 12 Lakhs",
        notes:
          "Requires Studienkolleg foundation year for 12-year Indian schooling.",
      },
      {
        programType: "Ausbildung (Vocational)",
        tuitionRangeINR: "₹0 (Zero Tuition + Paid Stipend)",
        livingCostINR: "Covered by monthly €1,000 - €1,400 stipend",
        totalAnnualINR: "₹0 Net Cost",
        notes: "Dual vocational training with healthcare, IT, and mechanics.",
      },
    ],
    hiddenCosts: [
      {
        item: "APS Certificate Processing Fee",
        costINR: "₹18,000",
        frequency: "One-time",
      },
      {
        item: "Blocked Account Setup & Fee",
        costINR: "₹12,000",
        frequency: "One-time",
      },
      {
        item: "Public Health Insurance (TK / Barmer)",
        costINR: "₹11,500 / month",
        frequency: "Monthly",
      },
      {
        item: "Semester Ticket (Free Regional Transit)",
        costINR: "Included in Semester Fee",
        frequency: "Per Semester",
      },
    ],
    scholarships: [
      {
        name: "DAAD Master Studies Scholarships",
        type: "Government",
        amount: "€934/month + Travel allowance",
        eligibility:
          "Top academic performers in Bachelor's applying for German master's",
        deadline: "October - November annually",
      },
      {
        name: "Deutschlandstipendium",
        type: "Government",
        amount: "€300/month",
        eligibility:
          "Enrolled students with outstanding high-school/college grades & social commitment",
        deadline: "Rolling per university",
      },
      {
        name: "Konrad-Adenauer-Stiftung Fellowship",
        type: "Private",
        amount: "€861/month + insurance coverage",
        eligibility:
          "Students with proven leadership and interest in public policy/academics",
        deadline: "July 15 annually",
      },
    ],
    visaDetails: {
      visaType: "German National Student Visa (Subtype D)",
      processingTime: "4 to 8 weeks (Requires prior APS Certificate)",
      workHoursDuringTerm:
        "140 full days or 280 half days per calendar year (approx. 20 hours/week)",
      postStudyWorkDuration: "18 Months (1.5 Years) Jobseeker Residence Permit",
      financialProofRequired:
        "€11,904 in a government-recognized Blocked Account (Sperrkonto)",
      prPathwaySummary:
        "Fast-track German Permanent Residence (Niederlassungserlaubnis) eligible after 21 months of employment with B1 German (or 27 months with A1 German).",
    },
    faqs: [
      {
        question:
          "Is studying in Germany truly tuition-free for Indian students?",
        answer:
          "Yes. At public universities in 15 out of 16 German federal states (except Baden-Württemberg which charges €1,500/sem), both EU and non-EU international students pay zero tuition fees, only a semester admin fee of €250–€350.",
      },
      {
        question: "What is an APS Certificate and why is it mandatory?",
        answer:
          "The Akademische Prüfstelle (APS) certificate verifies the authenticity of Indian academic marksheets. Issued by the German Embassy in New Delhi, it is a mandatory prerequisite before applying for a student visa.",
      },
      {
        question: "Can I study a Master's degree in Germany in English?",
        answer:
          "Yes, over 1,800 master's degree programs in Germany are conducted 100% in English, specifically in STEM, Business, Computer Science, and Data Analytics.",
      },
      {
        question:
          "How much money do I need in my blocked account for 2026-2027?",
        answer:
          "The official requirement is €11,904 per year (€992 per month) deposited into an approved blocked account provider like Expatrio, Coracle, or Fintiba before your visa appointment.",
      },
      {
        question: "What is Germany Ausbildung for Indian students?",
        answer:
          "Ausbildung is a government-regulated 3-year dual apprenticeship where you work for a company 3–4 days a week while attending vocational school 1–2 days. You pay zero tuition and receive a monthly stipend of €1,000 to €1,400.",
      },
    ],
  },

  usa: {
    slug: "usa",
    name: "United States",
    heroSubtitle:
      "World-Leading STEM Research • Ivy League Prestige • 3-Year STEM OPT Work Authorization",
    overviewHeading:
      "The Epicenter of Global Technology, Research, and Corporate Leadership",
    overviewParagraphs: [
      "The United States remains the premier destination for Indian graduate students, hosting over 260,000 Indian scholars across tech, engineering, and MBA programs.",
      "With premier institutions like MIT, Stanford, Georgia Tech, and Carnegie Mellon, the US offers unmatched research infrastructure, Silicon Valley venture networks, and high starting compensation.",
      "Under the F-1 visa STEM OPT extension, graduates in STEM disciplines receive up to 36 months (3 years) of post-study employment authorization without needing an immediate H-1B visa lottery sponsor.",
    ],
    whyChooseReasons: [
      {
        title: "3-Year STEM OPT Work Rights",
        desc: "Work for up to 36 months post-graduation in the US tech and engineering ecosystem on an F-1 student visa.",
      },
      {
        title: "Top Starting Compensation",
        desc: "US STEM master's and MBA graduates command median starting salaries of $85,000 to $130,000 (₹75 Lakhs to ₹1.1 Crore).",
      },
      {
        title: "Research & Teaching Assistantships",
        desc: "Graduate Assistantships (GRA/GTA) often waive 50%–100% of tuition while providing a living monthly stipend.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Higher Cost of Attendance",
        desc: "Average annual tuition ranges between ₹25 and ₹45 Lakhs, making education loans and financial planning critical.",
      },
      {
        title: "Competitive Visa Interview",
        desc: "F-1 student visa approval relies heavily on a 2-minute consular interview proving strong non-immigrant intent and funding.",
      },
      {
        title: "H-1B Lottery Cap",
        desc: "Transition from F-1 STEM OPT to long-term work authorization is subject to the annual US H-1B lottery cap.",
      },
    ],
    programsOfferedNotes:
      "The US excels in Computer Science, AI/ML, Electrical Engineering, Mechanical Engineering, Healthcare Management, and Full-time / STEM MBA programs.",
    costBreakdown: [
      {
        programType: "Master's (STEM MS)",
        tuitionRangeINR: "₹25 - 42 Lakhs / yr",
        livingCostINR: "₹10 - 15 Lakhs / yr",
        totalAnnualINR: "₹35 - 57 Lakhs",
        notes:
          "Public state universities (e.g. GaTech, Purdue) offer high ROI.",
      },
      {
        programType: "MBA (Top 50 Schools)",
        tuitionRangeINR: "₹38 - 65 Lakhs / yr",
        livingCostINR: "₹14 - 20 Lakhs / yr",
        totalAnnualINR: "₹52 - 85 Lakhs",
        notes: "Top MBA programs yield six-figure dollar starting packages.",
      },
      {
        programType: "Undergraduate (BS/BA)",
        tuitionRangeINR: "₹28 - 48 Lakhs / yr",
        livingCostINR: "₹12 - 16 Lakhs / yr",
        totalAnnualINR: "₹40 - 64 Lakhs",
        notes: "4-year degrees with rich campus life and Co-op options.",
      },
    ],
    hiddenCosts: [
      {
        item: "SEVIS I-901 Fee",
        costINR: "₹30,500 ($350)",
        frequency: "One-time",
      },
      {
        item: "DS-160 Visa Application Fee",
        costINR: "₹16,100 ($185)",
        frequency: "One-time",
      },
      {
        item: "University Mandatory Health Insurance",
        costINR: "₹1.5 - 2.5 Lakhs / yr",
        frequency: "Annual",
      },
      {
        item: "Standardized Tests (GRE/TOEFL/IELTS)",
        costINR: "₹40,000 total",
        frequency: "One-time",
      },
    ],
    scholarships: [
      {
        name: "Fullbright-Nehru Master’s Fellowships",
        type: "Government",
        amount: "Full tuition + Airfare + Living Stipend",
        eligibility:
          "Indian graduates with 3+ years professional work experience",
        deadline: "Mid-May annually",
      },
      {
        name: "University Graduate Assistantships (GRA/GTA)",
        type: "University",
        amount: "50% - 100% Tuition waiver + $1,500 - $2,500/mo",
        eligibility:
          "Strong undergraduate research, coding skills, and GRE scores",
        deadline: "Departmental intake deadlines",
      },
      {
        name: "Inlaks Shivdasani Foundation Scholarships",
        type: "Private",
        amount: "Up to $100,000 for elite institutions",
        eligibility:
          "Top-tier Indian admits to Harvard, Stanford, MIT, Columbia, etc.",
        deadline: "March 30 annually",
      },
    ],
    visaDetails: {
      visaType: "F-1 Academic Student Visa",
      processingTime: "2 to 6 weeks (Requires I-20 form from university)",
      workHoursDuringTerm:
        "Up to 20 hours/week strictly on-campus during academic terms",
      postStudyWorkDuration:
        "12 Months Initial OPT + 24 Months STEM Extension = 36 Months Total",
      financialProofRequired:
        "Liquid funds covering 1 full year's estimated Cost of Attendance (approx. ₹35 - 55 Lakhs on I-20)",
      prPathwaySummary:
        "F-1 → 3-Year STEM OPT → Employer-sponsored H-1B Visa → EB-2 / EB-3 Employment-based Green Card.",
    },
    faqs: [
      {
        question: "What is STEM OPT and how does it help Indian students?",
        answer:
          "STEM OPT allows graduates of science, technology, engineering, and mathematics programs to work in the US for up to 3 years post-graduation on their student visa, giving them multiple chances in the H-1B visa lottery.",
      },
      {
        question: "Is the GRE mandatory for MS in the USA in 2026-2027?",
        answer:
          "Many top US universities (such as GaTech, UIUC, Columbia) have made GRE optional or waived it for select master's programs, though submitting a 315+ GRE score significantly strengthens scholarship chances.",
      },
      {
        question:
          "How much total budget should an Indian family plan for a 2-year MS in USA?",
        answer:
          "A typical 2-year MS in the US requires ₹45 to ₹75 Lakhs all-inclusive. However, students who secure Graduate Assistantships or internships can recover 40%–60% of this cost during their degree.",
      },
    ],
  },

  uk: {
    slug: "uk",
    name: "United Kingdom",
    heroSubtitle:
      "1-Year Fast-Track Master’s • 2-Year Graduate Route Visa • Prestigious Russell Group Heritage",
    overviewHeading:
      "World-Class Academic Rigor with Accelerated 1-Year Master's Degrees",
    overviewParagraphs: [
      "The United Kingdom is famous for its intensive 1-year master's degrees that enable Indian students to enter the global workforce a full year earlier than in other countries, dramatically lowering total living costs.",
      "With 160+ universities—including historic Russell Group institutions like Oxford, Cambridge, Imperial, and Manchester—the UK maintains exceptional global brand prestige.",
      "Graduates benefit from the 2-year Graduate Route Post-Study Work Visa, allowing international scholars to work in any sector without requiring employer sponsorship.",
    ],
    whyChooseReasons: [
      {
        title: "1-Year Master's Programs",
        desc: "Complete your MSc or MA in just 12 months, saving a full year of overseas living expenses.",
      },
      {
        title: "2-Year Unrestricted Graduate Visa",
        desc: "Work for up to 2 years after graduation with no minimum salary or sponsorship requirements.",
      },
      {
        title: "Russell Group Global Recognition",
        desc: "Degrees from historic research powerhouses carry immense weight with Indian MNCs and global recruiters.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Competitive Skilled Worker Threshold",
        desc: "Transitioning to a Skilled Worker Visa after the 2-year Graduate Route requires meeting current Home Office salary thresholds.",
      },
      {
        title: "Higher London Living Costs",
        desc: "Living expenses in Central London (approx. ₹13–15 Lakhs/yr) are considerably higher than in Northern England or Scotland.",
      },
    ],
    programsOfferedNotes:
      "Strongest in Data Science, Finance, International Business, Public Health, Nursing, and Law (LLM).",
    costBreakdown: [
      {
        programType: "Master's (1-Year MSc)",
        tuitionRangeINR: "₹18 - 32 Lakhs total",
        livingCostINR: "₹10 - 13 Lakhs total",
        totalAnnualINR: "₹28 - 45 Lakhs total",
        notes: "Entire degree is completed in 1 year, minimizing total spend.",
      },
      {
        programType: "MBA (1-Year)",
        tuitionRangeINR: "₹25 - 45 Lakhs total",
        livingCostINR: "₹11 - 15 Lakhs total",
        totalAnnualINR: "₹36 - 60 Lakhs total",
        notes: "Fast-track executive and management training.",
      },
      {
        programType: "Bachelor's (3-Year)",
        tuitionRangeINR: "₹16 - 28 Lakhs / yr",
        livingCostINR: "₹10 - 13 Lakhs / yr",
        totalAnnualINR: "₹26 - 41 Lakhs / yr",
        notes: "Standard UK undergraduate honours degree.",
      },
    ],
    hiddenCosts: [
      {
        item: "Immigration Health Surcharge (IHS)",
        costINR: "₹85,000 (£776) / yr",
        frequency: "Annual",
      },
      {
        item: "Student Visa Application Fee",
        costINR: "₹54,000 (£490)",
        frequency: "One-time",
      },
      {
        item: "CAS Deposit to University",
        costINR: "₹2 - 4 Lakhs",
        frequency: "Adjusted against tuition",
      },
    ],
    scholarships: [
      {
        name: "Chevening Scholarships",
        type: "Government",
        amount: "Full tuition + flights + monthly living allowance",
        eligibility:
          "Indian graduates with 2+ years work experience & leadership acumen",
        deadline: "Early November annually",
      },
      {
        name: "Commonwealth Scholarships",
        type: "Government",
        amount: "Full funding for master's & PhD",
        eligibility:
          "Talented Indian students unable to afford overseas education",
        deadline: "December annually",
      },
      {
        name: "GREAT Scholarships (India)",
        type: "Government",
        amount: "£10,000 tuition fee discount",
        eligibility:
          "Open to Indian passport holders applying to participating UK institutions",
        deadline: "March - May annually",
      },
    ],
    visaDetails: {
      visaType: "UK Student Visa (formerly Tier 4)",
      processingTime: "3 weeks (Priority visa available in 5 days)",
      workHoursDuringTerm:
        "Up to 20 hours/week during term time; 40 hours/week during vacations",
      postStudyWorkDuration:
        "2 Years Graduate Route (3 Years for PhD graduates)",
      financialProofRequired:
        "Remaining tuition + 9 months living costs (approx. £1,023/mo outside London, £1,334/mo in London)",
      prPathwaySummary:
        "Student Visa → 2-Year Graduate Route → Skilled Worker Visa (5 years continuous employment) → Indefinite Leave to Remain (ILR).",
    },
    faqs: [
      {
        question:
          "Is the UK Graduate Route (Post-Study Work Visa) still active for Indian students?",
        answer:
          "Yes, the UK Government has officially confirmed the continuation of the 2-Year Graduate Route visa for international students completing eligible degrees.",
      },
      {
        question: "Can Indian students study in the UK without IELTS?",
        answer:
          "Many UK universities waive the IELTS requirement if you scored 70%+ in 12th Standard English from CBSE, ICSE, or selected State Boards.",
      },
      {
        question: "Are 1-year UK master’s degrees recognized in India by AIU?",
        answer:
          "Yes, the Association of Indian Universities (AIU) and the Ministry of Education have signed an MoU on mutual recognition of educational qualifications with the UK.",
      },
    ],
  },

  russia: {
    slug: "russia",
    name: "Russia",
    heroSubtitle:
      "30+ Years of Medical Trust • NMC & WHO Compliant MBBS • ₹18 - 25 Lakhs All-Inclusive",
    overviewHeading:
      "The Most Affordable, High-Exposure Destination for Global MBBS Aspirants",
    overviewParagraphs: [
      "Russia has been the trusted destination for Indian medical aspirants for over three decades, currently educating more than 20,000 Indian students across government medical universities.",
      "Russian medical degrees are recognized by the National Medical Commission (NMC), World Health Organization (WHO), and ECFMG (USA), providing a direct pathway to FMGE/NExT licensure in India.",
      "With total 6-year MBBS budgets starting at just ₹18 to ₹25 Lakhs (inclusive of tuition, hostel, and Indian food), it offers an accessible alternative to expensive private medical colleges in India.",
    ],
    whyChooseReasons: [
      {
        title: "100% NMC & WHO Compliant",
        desc: "5+1 year curriculum adhering strictly to NMC 2021 Gazette regulations with English instruction.",
      },
      {
        title: "Low Tuition & Cost of Living",
        desc: "Complete your entire 6-year medical degree for the cost of a single year in an Indian private medical college.",
      },
      {
        title: "Indian Food & Dedicated Hostels",
        desc: "Major universities feature dedicated Indian mess facilities, hostel wardens, and established senior alumni networks.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Russian Language for Clinicals",
        desc: "While classes are in English, conversational Russian is taught from Year 1 to interact with local hospital patients during clinical rotations.",
      },
      {
        title: "Cold Winter Climate",
        desc: "Temperatures can drop below freezing during winter months, requiring appropriate thermal winterwear.",
      },
    ],
    programsOfferedNotes:
      "Exclusively focused on General Medicine (MBBS / MD) with high clinical bed-to-student ratios.",
    costBreakdown: [
      {
        programType: "MBBS (6 Years Total)",
        tuitionRangeINR: "₹3 - 5 Lakhs / yr",
        livingCostINR: "₹1.5 - 2.5 Lakhs / yr (incl. hostel & food)",
        totalAnnualINR: "₹4.5 - 7.5 Lakhs / yr",
        notes: "Total 6-year package ranges between ₹20 and ₹32 Lakhs.",
      },
    ],
    hiddenCosts: [
      {
        item: "Medical Insurance & Registration",
        costINR: "₹15,000 / yr",
        frequency: "Annual",
      },
      {
        item: "Hostel Fee",
        costINR: "₹40,000 - 80,000 / yr",
        frequency: "Annual",
      },
      {
        item: "Indian Food Mess",
        costINR: "₹10,000 - 12,000 / month",
        frequency: "Monthly",
      },
    ],
    scholarships: [
      {
        name: "Russian Government State Scholarships (Quota)",
        type: "Government",
        amount: "100% Tuition waiver for selected applicants",
        eligibility: "High marks in 12th PCB and Russian embassy entrance exam",
        deadline: "February - March annually",
      },
    ],
    visaDetails: {
      visaType: "Russian Student Visa",
      processingTime: "2 to 4 weeks",
      workHoursDuringTerm:
        "Part-time student employment allowed with university permission",
      postStudyWorkDuration: "Clinical Residency / Internship pathways",
      financialProofRequired:
        "Affidavit of parental support and basic bank balance (₹3 - 5 Lakhs)",
      prPathwaySummary:
        "Students typically return to India to clear the NExT/FMGE licensing examination or pursue USMLE/PLAB.",
    },
    faqs: [
      {
        question:
          "Is NEET qualification mandatory for Indian students studying MBBS in Russia?",
        answer:
          "Yes, per National Medical Commission (NMC) regulations, NEET qualification is mandatory to study MBBS abroad if you wish to practice medicine in India.",
      },
      {
        question: "Are Russian medical degrees taught in English?",
        answer:
          "Yes, universities like Bashkir State Medical University and Kazan Federal University offer complete 6-year MBBS instruction in English.",
      },
      {
        question:
          "Can I practice as a doctor in India after completing MBBS in Russia?",
        answer:
          "Yes. Once you complete the 5.4 years coursework + 1-year clinical internship in Russia, you are eligible to appear for the NExT / FMGE licensing exam to practice medicine across India.",
      },
    ],
  },

  canada: {
    slug: "canada",
    name: "Canada",
    heroSubtitle:
      "3-Year Post-Graduation Work Permit (PGWP) • Direct Express Entry PR Pathways • World-Class Public Universities",
    overviewHeading:
      "High-Quality Public Education with Predictable Permanent Residency Pathways",
    overviewParagraphs: [
      "Canada is home to top-tier research institutions like the University of Toronto, UBC, McGill, and Waterloo, delivering global degree prestige with lower cost barriers than the US.",
      "Graduates from eligible Designated Learning Institutions (DLIs) can obtain a 3-year Post-Graduation Work Permit (PGWP), enabling them to gain skilled Canadian work experience.",
      "Through Express Entry (Canadian Experience Class) and Provincial Nominee Programs (PNP), international graduates benefit from world-leading permanent residency transitions.",
    ],
    whyChooseReasons: [
      {
        title: "Up to 3-Year PGWP",
        desc: "Gain 3 years of open work authorization without needing an employer sponsorship upon graduating from an eligible university program.",
      },
      {
        title: "Express Entry & PNP Advantage",
        desc: "Canadian master's degrees award additional CRS points under Express Entry and unlock province-specific tech nominee streams.",
      },
      {
        title: "Diverse & Welcoming Culture",
        desc: "With extensive multicultural student associations, Indian students integrate quickly into Canadian academic and civic life.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Provincial PAL Attestation Caps",
        desc: "Under recent IRCC policies, study permit applications require a Provincial Attestation Letter (PAL), making early university acceptance essential.",
      },
      {
        title: "Cold Climate & Housing Costs",
        desc: "Winter temperatures in central and eastern Canada are severe, and housing in the Greater Toronto and Vancouver areas requires careful budgeting.",
      },
      {
        title: "GIC Living Proof Requirement",
        desc: "You must deposit CAD $20,635 (approx. ₹13 Lakhs) into a Canadian Guaranteed Investment Certificate (GIC) before visa submission.",
      },
    ],
    programsOfferedNotes:
      "Leading in Software Engineering, AI & Robotics, Business Analytics, Environmental Science, and Health Informatics.",
    costBreakdown: [
      {
        programType: "Master's (MS / Meng)",
        tuitionRangeINR: "₹15 - 28 Lakhs / yr",
        livingCostINR: "₹10 - 13 Lakhs / yr",
        totalAnnualINR: "₹25 - 41 Lakhs / yr",
        notes: "Top universities: U of T, UBC, McGill, Waterloo, Alberta.",
      },
      {
        programType: "MBA (Rotman, Schulich, Sauder)",
        tuitionRangeINR: "₹28 - 50 Lakhs / yr",
        livingCostINR: "₹12 - 16 Lakhs / yr",
        totalAnnualINR: "₹40 - 66 Lakhs / yr",
        notes:
          "Top MBA programs offering access to Toronto and Vancouver financial hubs.",
      },
      {
        programType: "Undergraduate Degrees",
        tuitionRangeINR: "₹18 - 35 Lakhs / yr",
        livingCostINR: "₹10 - 14 Lakhs / yr",
        totalAnnualINR: "₹28 - 49 Lakhs / yr",
        notes: "4-year bachelor's degrees with integrated Co-op terms.",
      },
    ],
    hiddenCosts: [
      {
        item: "GIC Living Deposit Account",
        costINR: "CAD $20,635 (₹13 Lakhs)",
        frequency: "One-time (Returned monthly)",
      },
      {
        item: "Study Permit Visa Application Fee",
        costINR: "CAD $150 (₹9,300)",
        frequency: "One-time",
      },
      {
        item: "Biometrics Fee",
        costINR: "CAD $85 (₹5,300)",
        frequency: "One-time",
      },
    ],
    scholarships: [
      {
        name: "Vanier Canada Graduate Scholarships",
        type: "Government",
        amount: "CAD $50,000 / year for 3 years",
        eligibility:
          "High-achieving doctoral students in STEM, health, and humanities",
        deadline: "Early November annually",
      },
      {
        name: "University International Entrance Scholarships",
        type: "University",
        amount: "CAD $5,000 - $25,000",
        eligibility: "Merit-based admission score above 85% in 12th/Undergrad",
        deadline: "Automated at admission",
      },
    ],
    visaDetails: {
      visaType: "Canadian Study Permit (with PAL)",
      processingTime: "4 to 8 weeks",
      workHoursDuringTerm:
        "Up to 24 hours/week off-campus during terms; 40 hours/week during breaks",
      postStudyWorkDuration: "Up to 3 Years Post-Graduation Work Permit (PGWP)",
      financialProofRequired:
        "1st year tuition receipt + CAD $20,635 GIC Certificate",
      prPathwaySummary:
        "Study Permit → 3-Year PGWP → 1 Year Canadian Skilled Work → Express Entry CEC / Provincial Nominee Program (PNP).",
    },
    faqs: [
      {
        question:
          "How does the recent Canada student visa cap affect Indian applicants in 2026-2027?",
        answer:
          "Master's and doctoral degree applicants are prioritized and remain eligible for 3-year PGWPs. University programs are allocated PALs directly by provinces.",
      },
      {
        question: "What is a GIC and why is it mandatory for Canada?",
        answer:
          "A Guaranteed Investment Certificate (GIC) is a special bank account holding CAD $20,635 that demonstrates proof of living funds. The bank dispenses a monthly living allowance back to the student once in Canada.",
      },
    ],
  },

  australia: {
    slug: "australia",
    name: "Australia",
    heroSubtitle:
      "Group of Eight (Go8) Excellence • Up to 3-Year Post-Study Work • High Minimum Wage & Career Growth",
    overviewHeading:
      "Premier Southern Hemisphere Education with High Quality of Life",
    overviewParagraphs: [
      "Australia combines world top-50 universities (University of Melbourne, Sydney, UNSW, ANU) with a high minimum wage ($24.10/hr) and favorable regional post-study work incentives.",
      "The Australian higher education framework is internationally acclaimed for engineering, biotechnology, mining tech, business analytics, and nursing.",
      "Graduates from eligible master's and bachelor's programs benefit from Temporary Graduate Visas (Subclass 485), with additional post-study work rights for studying in designated regional cities.",
    ],
    whyChooseReasons: [
      {
        title: "Group of Eight (Go8) Prestige",
        desc: "7 of the Go8 universities rank in the global top 50, delivering research quality and industry links.",
      },
      {
        title: "Highest Global Student Wage",
        desc: "With Australia's high minimum hourly wage ($24.10/hr), part-time student work covers a substantial portion of living expenses.",
      },
      {
        title: "Regional Study Bonus",
        desc: "Studying in cities like Adelaide, Perth, or Brisbane provides up to 1–2 additional years on your Post-Study Work visa.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Genuine Student (GS) Requirement",
        desc: "Australia enforces a strict Genuine Student (GS) assessment focusing on career progression and financial capability.",
      },
      {
        title: "High Living Costs in Sydney & Melbourne",
        desc: "Accommodation in Sydney and Melbourne requires planning (approx. ₹11–14 Lakhs/yr).",
      },
    ],
    programsOfferedNotes:
      "Outstanding for Computer Science, Mining & Petroleum Engineering, Data Analytics, Healthcare & Nursing, and MBA.",
    costBreakdown: [
      {
        programType: "Master's (MS/MSc)",
        tuitionRangeINR: "₹18 - 32 Lakhs / yr",
        livingCostINR: "₹11 - 14 Lakhs / yr",
        totalAnnualINR: "₹29 - 46 Lakhs / yr",
        notes: "2-year degrees with comprehensive industry capstones.",
      },
      {
        programType: "MBA (Melbourne, AGSM, Monash)",
        tuitionRangeINR: "₹26 - 45 Lakhs / yr",
        livingCostINR: "₹12 - 16 Lakhs / yr",
        totalAnnualINR: "₹38 - 61 Lakhs / yr",
        notes: "Top Asia-Pacific business school rankings.",
      },
      {
        programType: "Bachelor's Degrees (3-4 Years)",
        tuitionRangeINR: "₹16 - 30 Lakhs / yr",
        livingCostINR: "₹11 - 14 Lakhs / yr",
        totalAnnualINR: "₹27 - 44 Lakhs / yr",
        notes: "Direct entry for CBSE/ICSE students.",
      },
    ],
    hiddenCosts: [
      {
        item: "Overseas Student Health Cover (OSHC)",
        costINR: "AUD $600 - $800 / yr (₹35,000 - ₹45,000)",
        frequency: "Annual",
      },
      {
        item: "Student Visa Subclass 500 Fee",
        costINR: "AUD $1,600 (₹88,000)",
        frequency: "One-time",
      },
    ],
    scholarships: [
      {
        name: "Australia Awards Scholarships",
        type: "Government",
        amount: "Full tuition + Airfare + Living allowance",
        eligibility: "High-potential Indian leaders in development & science",
        deadline: "April 30 annually",
      },
      {
        name: "Go8 Global Excellence Scholarships",
        type: "University",
        amount: "20% - 50% Tuition fee reduction",
        eligibility: "Merit-based on undergraduate CGPA > 8.0/10",
        deadline: "Automated with offer",
      },
    ],
    visaDetails: {
      visaType: "Subclass 500 Student Visa",
      processingTime: "4 to 6 weeks",
      workHoursDuringTerm:
        "48 hours per fortnight during study terms; unrestricted during breaks",
      postStudyWorkDuration:
        "2 to 3 Years on Subclass 485 (plus extra 1-2 years in regional cities)",
      financialProofRequired:
        "1 year tuition + AUD $29,710 living expenses in savings/loan",
      prPathwaySummary:
        "Subclass 500 → Subclass 485 Graduate Visa → SkillSelect Points System (Subclass 189/190/491 PR Visas).",
    },
    faqs: [
      {
        question:
          "What is the work hour limit for international students in Australia?",
        answer:
          "Students on a Subclass 500 visa can work up to 48 hours per fortnight during university terms and unlimited hours during scheduled vacations.",
      },
      {
        question: "What are regional study benefits in Australia?",
        answer:
          "Studying in regional centers like Adelaide, Perth, Gold Coast, or Canberra gives students 1–2 additional years on their post-study work visa and 5 extra points for Permanent Residency.",
      },
    ],
  },

  ireland: {
    slug: "ireland",
    name: "Ireland",
    heroSubtitle:
      "European Silicon Valley • 2-Year Stay Back Visa • Global HQ for Google, Meta & Pfizer",
    overviewHeading: "The English-Speaking Tech & Pharma Gateway to Europe",
    overviewParagraphs: [
      "Ireland is the only native English-speaking country in the Eurozone and the European headquarters for 9 of the top 10 global ICT companies and 9 of the top 10 pharma multinationals.",
      "With institutions like Trinity College Dublin (TCD), University College Dublin (UCD), and University of Galway, students enjoy high academic prestige.",
      "The Irish Third Level Graduate Scheme provides a 2-year post-study work visa for master's graduates, facilitating direct conversion into Critical Skills Employment Permits.",
    ],
    whyChooseReasons: [
      {
        title: "2-Year Third Level Stay Back",
        desc: "Master's graduates receive a 24-month work authorization to work across European MNCs based in Dublin and Cork.",
      },
      {
        title: "Global Tech & Pharma Hub",
        desc: "Europe's largest concentration of software, medical device, and biotechnology employers actively hiring graduates.",
      },
      {
        title: "Fast PR via Critical Skills Permit",
        desc: "Convert to a Critical Skills Employment Permit and apply for Stamp 4 permanent residence in just 2 years.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Dublin Accommodation Market",
        desc: "Dublin has high rental demand; early booking in student residences like Yugo, Aparto, or university halls is critical.",
      },
      {
        title: "Strict Visa Financial Proof",
        desc: "You must demonstrate access to €10,000 living funds in addition to first-year tuition fees.",
      },
    ],
    programsOfferedNotes:
      "World-class in Data Science, Cloud Computing, Pharmaceutical Chemistry, Finance & FinTech, and MedTech.",
    costBreakdown: [
      {
        programType: "Master's (1-Year MSc)",
        tuitionRangeINR: "₹14 - 24 Lakhs total",
        livingCostINR: "₹9 - 12 Lakhs total",
        totalAnnualINR: "₹23 - 36 Lakhs total",
        notes: "1-year intensive curriculum saves living expenses.",
      },
      {
        programType: "MBA (TCD / UCD Smurfit)",
        tuitionRangeINR: "₹25 - 40 Lakhs total",
        livingCostINR: "₹10 - 13 Lakhs total",
        totalAnnualINR: "₹35 - 53 Lakhs total",
        notes: "Top 100 global MBA rankings with direct corporate access.",
      },
    ],
    hiddenCosts: [
      {
        item: "Irish Residence Permit (IRP Card)",
        costINR: "€300 (₹27,000)",
        frequency: "Annual",
      },
      {
        item: "Private Medical Insurance",
        costINR: "€160 - €300 / yr (₹15,000 - ₹27,000)",
        frequency: "Annual",
      },
    ],
    scholarships: [
      {
        name: "Government of Ireland International Education Scholarships (GOI-IES)",
        type: "Government",
        amount: "€10,000 stipend + Full tuition fee waiver",
        eligibility: "Outstanding non-EU students for 1 year of study",
        deadline: "March annually",
      },
      {
        name: "Global Excellence Scholarships (TCD & UCD)",
        type: "University",
        amount: "€2,000 - €5,000 tuition waiver",
        eligibility: "Based on academic merit at offer stage",
        deadline: "March - April annually",
      },
    ],
    visaDetails: {
      visaType: "Irish Long Stay Study Visa (Stamp 2)",
      processingTime: "4 to 6 weeks",
      workHoursDuringTerm:
        "20 hours/week during term; 40 hours/week during June–September & Christmas",
      postStudyWorkDuration:
        "24 Months (2 Years) Third Level Graduate Scheme for Master's graduates",
      financialProofRequired:
        "Full 1st year tuition paid + €10,000 in student/sponsor bank account",
      prPathwaySummary:
        "Stamp 2 (Student) → 2-Year Third Level Scheme → Critical Skills Employment Permit (2 Years) → Stamp 4 (Permanent Residency).",
    },
    faqs: [
      {
        question: "Is Ireland completely English-speaking?",
        answer:
          "Yes, Ireland is an English-speaking country with English as the primary language of instruction, commerce, and daily life.",
      },
      {
        question: "How easily can I get a tech job in Dublin after MS?",
        answer:
          "Dublin is home to European headquarters of Google, Meta, Microsoft, Amazon, Stripe, and LinkedIn, creating consistent hiring demand for data, software, and cloud engineers.",
      },
    ],
  },

  france: {
    slug: "france",
    name: "France",
    heroSubtitle:
      "Triple-Accredited Business Schools • 2-Year Post-Study Visa • French Tech Visa & Schengen Mobility",
    overviewHeading:
      "World-Class Management Education and Engineering Innovation in Europe",
    overviewParagraphs: [
      "France is celebrated for its elite Grande École business schools (HEC Paris, INSEAD, ESSEC, EDHEC, emlyon) and top public universities with state-subsidized tuition.",
      "Indian students can choose from more than 1,700 English-taught master's degrees in management, luxury marketing, artificial intelligence, aerospace, and culinary arts.",
      "Under the bilateral agreement between India and France, Indian master's graduates receive a 2-year post-study work visa (APS / Recherche d'emploi) and a 5-year short-stay Schengen visa upon graduation.",
    ],
    whyChooseReasons: [
      {
        title: "Top-Ranked Global Business Schools",
        desc: "HEC, ESSEC, INSEAD and ESCP consistently dominate Financial Times European Business School rankings.",
      },
      {
        title: "2-Year Post-Study Visa for Indians",
        desc: "Special bilateral India-France agreement granting a 2-year jobseeker residence permit.",
      },
      {
        title: "CAF Housing Subsidy",
        desc: "All international students are eligible for French government housing assistance (CAF), reducing monthly rent by 20%–40%.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "French Language for Local Work",
        desc: "While degrees are 100% in English, conversational French (B1/B2) is key for local French corporate employment outside multinational tech teams.",
      },
      {
        title: "Campus France NOC & Interview",
        desc: "Indian students must complete the mandatory Campus France interview and verification before visa appointment.",
      },
    ],
    programsOfferedNotes:
      "Elite for Master in Management (MiM), Luxury Brand Management, Aerospace Engineering, AI/Data Science, and Hospitality.",
    costBreakdown: [
      {
        programType: "Master in Management / Business",
        tuitionRangeINR: "₹12 - 24 Lakhs / yr",
        livingCostINR: "₹8 - 11 Lakhs / yr",
        totalAnnualINR: "₹20 - 35 Lakhs / yr",
        notes: "Grande École master's programs offering global internships.",
      },
      {
        programType: "Public Universities (Engineering)",
        tuitionRangeINR: "₹3.5 - 4 Lakhs / yr",
        livingCostINR: "₹7 - 10 Lakhs / yr",
        totalAnnualINR: "₹10.5 - 14 Lakhs / yr",
        notes: "Heavily subsidized by the French government.",
      },
    ],
    hiddenCosts: [
      {
        item: "Campus France Registration Fee",
        costINR: "₹17,000",
        frequency: "One-time",
      },
      {
        item: "CVEC Student Life Contribution",
        costINR: "€103 (₹9,300)",
        frequency: "Annual",
      },
    ],
    scholarships: [
      {
        name: "Charpak Master's Scholarship",
        type: "Government",
        amount:
          "€860/month stipend + Full tuition fee waiver + Visa fee waiver",
        eligibility:
          "High-achieving Indian students applying to French master's",
        deadline: "Late March annually",
      },
      {
        name: "Eiffel Excellence Scholarship",
        type: "Government",
        amount: "€1,181/month allowance + Airfare + Insurance",
        eligibility:
          "Top international admits nominated by French institutions",
        deadline: "December annually",
      },
    ],
    visaDetails: {
      visaType: "Long-Stay Student Visa (VLS-TS)",
      processingTime: "2 to 4 weeks (Requires prior Campus France interview)",
      workHoursDuringTerm: "Up to 20 hours/week (60% of annual working time)",
      postStudyWorkDuration:
        "2 Years (APS / Recherche d'Emploi) for Indian Master's graduates",
      financialProofRequired:
        "Minimum €615/month (€7,380 per year) in liquid savings or loan",
      prPathwaySummary:
        "VLS-TS → 2-Year APS → Passeport Talent (Tech/Executive) → Permanent Residence (Carte de Résident).",
    },
    faqs: [
      {
        question: "Can Indian students get housing subsidy in France?",
        answer:
          "Yes! Every international student in France is eligible for the CAF (Caisse d'Allocations Familiales) housing grant, which reimburses €100 to €250 directly toward your monthly rent.",
      },
      {
        question:
          "Is French language required for admission to French master's degrees?",
        answer:
          "No. Over 1,700 master's degree programs in France are taught 100% in English, and admissions do not require French proficiency tests.",
      },
    ],
  },

  uzbekistan: {
    slug: "uzbekistan",
    name: "Uzbekistan",
    heroSubtitle:
      "Govt Medical Universities • 100% NMC 2021 Compliant • ₹14 - 18 Lakhs Complete 6-Year MBBS",
    overviewHeading:
      "The Most Cost-Effective, High-Quality NMC Compliant MBBS Destination",
    overviewParagraphs: [
      "Uzbekistan has rapidly become a premier medical education hub for Indian students, offering government-recognized medical academies like Tashkent Medical Academy and Samarkand State Medical University.",
      "The MBBS curriculum in Uzbekistan strictly complies with the National Medical Commission (NMC) 2021 Gazette regulations, offering 5.4 years of English-medium academic instruction followed by a 1-year clinical internship in affiliated tertiary hospitals.",
      "With total 6-year budgets of just ₹14 to ₹18 Lakhs (including tuition, air-conditioned hostel, and Indian mess facilities), it provides the highest affordability in medical education.",
    ],
    whyChooseReasons: [
      {
        title: "Strict NMC 2021 Gazette Compliance",
        desc: "5+1 year curriculum with full English medium and hands-on clinical rotation at large teaching hospitals.",
      },
      {
        title: "Highest MBBS Affordability",
        desc: "Total 6-year MBBS cost from ₹14 to ₹18 Lakhs, making medical education accessible to middle-class Indian families.",
      },
      {
        title: "Short Flight Distance & Safety",
        desc: "Just 3 hours direct flight from Delhi to Tashkent, with safe university campuses and Indian food mess on campus.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Local Uzbek Language for Patients",
        desc: "Basic conversational Uzbek or Russian is taught during the first two years to speak with patients during hospital rounds.",
      },
    ],
    programsOfferedNotes:
      "Exclusively focused on NMC-Compliant General Medicine (MBBS / MD) with high bed-to-student clinical exposure.",
    costBreakdown: [
      {
        programType: "MBBS (6-Year Package)",
        tuitionRangeINR: "₹2.8 - 3.5 Lakhs / yr",
        livingCostINR: "₹1.2 - 1.5 Lakhs / yr (incl. hostel & food)",
        totalAnnualINR: "₹4 - 5 Lakhs / yr",
        notes:
          "Entire 6-year package comes out to ₹14 - 18 Lakhs all-inclusive.",
      },
    ],
    hiddenCosts: [
      {
        item: "Hostel & Registration",
        costINR: "₹35,000 / yr",
        frequency: "Annual",
      },
      {
        item: "Indian Mess Fee",
        costINR: "₹10,000 / month",
        frequency: "Monthly",
      },
    ],
    scholarships: [
      {
        name: "University Merit Performance Grants",
        type: "University",
        amount: "Up to 20% tuition concession",
        eligibility:
          "Scoring high marks in annual university medical examinations",
        deadline: "End of Year 1",
      },
    ],
    visaDetails: {
      visaType: "Uzbek Student Visa",
      processingTime: "2 to 3 weeks",
      workHoursDuringTerm: "Clinical ward rounds and assistantships",
      postStudyWorkDuration:
        "1-Year Clinical Internship in-country (NMC compliant)",
      financialProofRequired:
        "Parental bank account showing ₹3–5 Lakhs balance",
      prPathwaySummary:
        "Graduates return to India to write NExT / FMGE or appear for USMLE / PLAB licensing exams.",
    },
    faqs: [
      {
        question: "Is NEET exam required for MBBS in Uzbekistan?",
        answer:
          "Yes, qualifying NEET is mandatory for all Indian students going to study MBBS in Uzbekistan to practice medicine in India later.",
      },
      {
        question:
          "Are Uzbekistan medical universities recognized by WHO and NMC?",
        answer:
          "Yes, all major universities like Tashkent Medical Academy and Samarkand State Medical University are listed in the WHO World Directory of Medical Schools and fully recognized by the NMC.",
      },
    ],
  },

  kazakhstan: {
    slug: "kazakhstan",
    name: "Kazakhstan",
    heroSubtitle:
      "Leading Central Asian Medical Hub • WHO & NMC Recognized • ₹16 - 22 Lakhs Complete MBBS",
    overviewHeading:
      "High-Volume Clinical Exposure at Historic National Medical Universities",
    overviewParagraphs: [
      "Kazakhstan has educated over 10,000 Indian doctors through premier institutions such as Kazakh National Medical University and Astana Medical University.",
      "All medical programs adhere strictly to the NMC 2021 guidelines, featuring a 5.4-year English-taught MD/MBBS curriculum followed by a mandatory 1-year hospital internship.",
      "With modern university simulation labs, high patient footfall, and dedicated Indian mess facilities, Kazakhstan provides world-standard clinical training at a fraction of private college costs.",
    ],
    whyChooseReasons: [
      {
        title: "NMC & WHO Recognized",
        desc: "Valid worldwide for FMGE/NExT (India), USMLE (USA), and PLAB (UK) medical licensing pathways.",
      },
      {
        title: "Modern Clinical Simulation Labs",
        desc: "Hands-on medical simulation centers and direct access to multi-specialty government teaching hospitals.",
      },
      {
        title: "Affordable Living & Indian Mess",
        desc: "Campuses feature Indian chefs, on-campus security, and low cost of living (₹10,000–₹12,000/month).",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Kazakh/Russian for Wards",
        desc: "Basic Russian or Kazakh language is taught in early semesters to converse with patients in clinical wards.",
      },
    ],
    programsOfferedNotes:
      "General Medicine (MBBS / MD), Dentistry, and Pharmacy.",
    costBreakdown: [
      {
        programType: "MBBS (6 Years Total)",
        tuitionRangeINR: "₹3.2 - 4.2 Lakhs / yr",
        livingCostINR: "₹1.4 - 1.8 Lakhs / yr",
        totalAnnualINR: "₹4.6 - 6 Lakhs / yr",
        notes: "Total 6-year package is approximately ₹16 - 22 Lakhs.",
      },
    ],
    hiddenCosts: [
      {
        item: "Visa Extension & Registration",
        costINR: "₹18,000 / yr",
        frequency: "Annual",
      },
      {
        item: "Medical Insurance",
        costINR: "₹12,000 / yr",
        frequency: "Annual",
      },
    ],
    scholarships: [
      {
        name: "Academic Excellence Concessions",
        type: "University",
        amount: "5% - 15% tuition waiver",
        eligibility:
          "Class top-ranking students with A grades in all medical modules",
        deadline: "Annual assessment",
      },
    ],
    visaDetails: {
      visaType: "Kazakhstan Student Visa (C9)",
      processingTime: "3 to 4 weeks",
      workHoursDuringTerm: "Clinical hospital rotation focus",
      postStudyWorkDuration: "1-Year Clinical Internship",
      financialProofRequired: "Basic bank balance proof (₹3 - 5 Lakhs)",
      prPathwaySummary:
        "Graduates clear NExT/FMGE in India or pursue international residency in the UK/USA.",
    },
    faqs: [
      {
        question: "What is the medium of instruction for MBBS in Kazakhstan?",
        answer:
          "Top universities provide 100% English-medium instruction for all 6 years of the MBBS curriculum for international students.",
      },
      {
        question: "How safe is Kazakhstan for Indian girl students?",
        answer:
          "Kazakhstan is very peaceful and safe, with secure university hostels, 24/7 CCTV surveillance, and a large Indian student community.",
      },
    ],
  },

  georgia: {
    slug: "georgia",
    name: "Georgia",
    heroSubtitle:
      "European Standard Medical Education • ECFMG & NMC Approved • Safe & Scenic Country",
    overviewHeading:
      "European Standards of Clinical Medicine at Accessible Annual Tuition",
    overviewParagraphs: [
      "Located at the intersection of Eastern Europe and Western Asia, Georgia has become a top medical education destination with over 15,000 Indian students in cities like Tbilisi and Batumi.",
      "Medical universities like Tbilisi State Medical University and David Tvildiani Medical University follow US and European medical curricula with high USMLE passing rates.",
      "Georgia provides a clean, safe European lifestyle, 100% English medium instruction, and full NMC 2021 compliance.",
    ],
    whyChooseReasons: [
      {
        title: "European Curriculum Standards",
        desc: "Curriculum aligned with European Bologna process and USMLE step-1 preparation.",
      },
      {
        title: "High USMLE & PLAB Success",
        desc: "Graduates achieve impressive success rates on USMLE (USA) and PLAB (UK) exams.",
      },
      {
        title: "Safe European Environment",
        desc: "Ranked among the safest countries globally with excellent infrastructure and living quality.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Moderate Tuition Compared to Central Asia",
        desc: "Tuition is slightly higher (₹4.5–6 Lakhs/yr) compared to Russia or Uzbekistan, but reflects European clinical facilities.",
      },
    ],
    programsOfferedNotes:
      "MBBS / MD in General Medicine, Dentistry, and Healthcare Management.",
    costBreakdown: [
      {
        programType: "MBBS (6 Years)",
        tuitionRangeINR: "₹4.5 - 6 Lakhs / yr",
        livingCostINR: "₹2 - 2.5 Lakhs / yr",
        totalAnnualINR: "₹6.5 - 8.5 Lakhs / yr",
        notes: "Total 6-year package is approximately ₹26 - 35 Lakhs.",
      },
    ],
    hiddenCosts: [
      {
        item: "TRC Residence Card",
        costINR: "₹18,000 / yr",
        frequency: "Annual",
      },
      {
        item: "Medical Insurance",
        costINR: "₹10,000 / yr",
        frequency: "Annual",
      },
    ],
    scholarships: [
      {
        name: "Institutional Merit Awards",
        type: "University",
        amount: "Up to $1,000 annual fee deduction",
        eligibility: "Top 5% students in university semester exams",
        deadline: "Semester end",
      },
    ],
    visaDetails: {
      visaType: "Georgian Immigration Visa (D3)",
      processingTime: "4 to 6 weeks",
      workHoursDuringTerm: "Student study focus",
      postStudyWorkDuration: "Clinical internship & licensing",
      financialProofRequired:
        "Sponsor bank statement showing ₹5 - 7 Lakhs liquid funds",
      prPathwaySummary:
        "Graduates write NExT (India), USMLE (USA) or PLAB (UK) for hospital residency.",
    },
    faqs: [
      {
        question:
          "Is the MBBS degree from Georgia valid in Europe and the USA?",
        answer:
          "Yes, Georgian medical degrees are recognized by ECFMG, WHO, WFME, and the National Medical Commission of India.",
      },
      {
        question: "Is the Georgian language difficult?",
        answer:
          "All medical lectures and textbooks are in English. Basic Georgian phrases are learned in Year 1 for day-to-day communication.",
      },
    ],
  },

  philippines: {
    slug: "philippines",
    name: "Philippines",
    heroSubtitle:
      "American Pattern MD Curriculum • 100% English Speaking Nation • High USMLE Pass Rate",
    overviewHeading:
      "US-Patterned Medical Training in an English-Speaking Tropical Country",
    overviewParagraphs: [
      "The Philippines follows the US education model, offering the Doctor of Medicine (MD) degree with strong clinical disease exposure similar to Indian epidemiology.",
      "As the world's third-largest English-speaking nation, language is never a barrier in classrooms, hospitals, or local communities.",
      "Leading institutions like Davao Medical School Foundation and University of Perpetual Help educate thousands of Indian medical doctors every year.",
    ],
    whyChooseReasons: [
      {
        title: "US-Patterned Curriculum",
        desc: "Problem-based medical training matching USMLE standards and high clinical diagnostic exposure.",
      },
      {
        title: "Complete English Immersion",
        desc: "No foreign language to learn; English is an official language spoken by hospital patients and locals.",
      },
      {
        title: "Tropical Disease Profile",
        desc: "Disease pathology closely mirrors tropical conditions in India, giving practical clinical advantages for NExT/FMGE.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "NMC Dual Registration Clause",
        desc: "Ensure your program includes the full dual-degree track and in-country medical registration matching current NMC Gazette requirements.",
      },
    ],
    programsOfferedNotes: "BS-MD (Bachelor of Science + Doctor of Medicine).",
    costBreakdown: [
      {
        programType: "MD / MBBS (Total Course)",
        tuitionRangeINR: "₹3.5 - 4.5 Lakhs / yr",
        livingCostINR: "₹1.5 - 2 Lakhs / yr",
        totalAnnualINR: "₹5 - 6.5 Lakhs / yr",
        notes: "Total degree budget ranges between ₹20 and ₹26 Lakhs.",
      },
    ],
    hiddenCosts: [
      {
        item: "ACR I-Card & Visa Renewal",
        costINR: "₹20,000 / yr",
        frequency: "Annual",
      },
      {
        item: "Medical Checkup & Quarantine Clearance",
        costINR: "₹12,000",
        frequency: "One-time",
      },
    ],
    scholarships: [
      {
        name: "Academic Merit Concessions",
        type: "University",
        amount: "10% - 20% tuition concession",
        eligibility: "High scores in National Medical Admission Test (NMAT)",
        deadline: "Annual",
      },
    ],
    visaDetails: {
      visaType: "9(f) Student Visa",
      processingTime: "4 to 6 weeks",
      workHoursDuringTerm: "Dedicated clinical training",
      postStudyWorkDuration: "Clinical internship & licensing",
      financialProofRequired: "Parent bank balance showing ₹4 - 6 Lakhs",
      prPathwaySummary:
        "Graduates return to India for NExT / FMGE licensing or apply for USMLE clinical residencies.",
    },
    faqs: [
      {
        question: "Why is the Philippines popular for Indian medical students?",
        answer:
          "The Philippines uses American medical textbooks, 100% English communication with hospital patients, and a disease pattern nearly identical to India.",
      },
    ],
  },

  netherlands: {
    slug: "netherlands",
    name: "Netherlands",
    heroSubtitle:
      "Continental Europe's #1 Tech Hub • 1-Year Orientation Year Visa (Zoekjaar) • 2,100+ English Programs",
    overviewHeading:
      "Progressive, English-Taught European Higher Education and Tech Ecosystem",
    overviewParagraphs: [
      "The Netherlands is celebrated for world-class research universities like TU Delft, University of Amsterdam, and Eindhoven University of Technology, offering over 2,100 programs taught 100% in English.",
      "With 95% of the population speaking fluent English, it is the most internationally accessible country in continental Europe.",
      "Graduates receive a 1-year Orientation Year (Zoekjaar) visa to work freely across European tech giants (ASML, Philips, Booking.com, Uber European HQ) and innovative startups.",
    ],
    whyChooseReasons: [
      {
        title: "Global Top 100 Universities",
        desc: "TU Delft, Amsterdam, and Utrecht consistently rank among the world's most innovative technical institutes.",
      },
      {
        title: "Zoekjaar Orientation Visa",
        desc: "1-year post-study open work visa with low salary threshold requirement for Highly Skilled Migrant status.",
      },
      {
        title: "Silicon Valley of Europe",
        desc: "Home to semiconductor giant ASML and European tech hubs in Amsterdam and Eindhoven.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Dutch Housing Shortage",
        desc: "Student accommodation in Amsterdam, Delft, and Utrecht is in high demand; applying 6 months in advance is essential.",
      },
    ],
    programsOfferedNotes:
      "World-leading in Computer Science & AI, Semiconductor Tech, Mechanical Engineering, Civil & Water Management, and Business.",
    costBreakdown: [
      {
        programType: "Master's (MS / MSc)",
        tuitionRangeINR: "₹14 - 22 Lakhs / yr",
        livingCostINR: "₹10 - 13 Lakhs / yr",
        totalAnnualINR: "₹24 - 35 Lakhs / yr",
        notes: "2-year degrees with high graduate starting packages.",
      },
      {
        programType: "Bachelor's (BSc / BA)",
        tuitionRangeINR: "₹10 - 16 Lakhs / yr",
        livingCostINR: "₹10 - 13 Lakhs / yr",
        totalAnnualINR: "₹20 - 29 Lakhs / yr",
        notes: "3-year bachelor's degrees taught in English.",
      },
    ],
    hiddenCosts: [
      {
        item: "IND Residence Permit Fee",
        costINR: "€228 (₹20,500)",
        frequency: "One-time",
      },
      {
        item: "Health Insurance",
        costINR: "€50 - €120 / month",
        frequency: "Monthly",
      },
    ],
    scholarships: [
      {
        name: "NL Scholarship (formerly Holland Scholarship)",
        type: "Government",
        amount: "€5,000 in the first year of study",
        eligibility:
          "High-achieving non-EEA students accepted into participating Dutch universities",
        deadline: "February - May annually",
      },
      {
        name: "TU Delft Justus & Louise van Effen Excellence",
        type: "University",
        amount: "Full tuition + Living expenses",
        eligibility: "Top international master's applicants with GPA > 80%",
        deadline: "December 1 annually",
      },
    ],
    visaDetails: {
      visaType: "Dutch MVV Entry Visa & VVR Residence Permit",
      processingTime: "2 to 4 weeks (Handled directly by the university)",
      workHoursDuringTerm:
        "Up to 16 hours/week (Requires employer work permit)",
      postStudyWorkDuration: "1 Year Orientation Year (Zoekjaar) permit",
      financialProofRequired:
        "€12,500 proof of living funds + tuition fee to university",
      prPathwaySummary:
        "Student Permit → 1-Year Zoekjaar → Highly Skilled Migrant (Kennismigrant) Permit → Permanent Residence after 5 years.",
    },
    faqs: [
      {
        question: "Is English widely spoken in the Netherlands?",
        answer:
          "Yes, over 95% of Dutch citizens speak fluent English, making daily life, internships, and corporate jobs completely comfortable without fluent Dutch.",
      },
    ],
  },

  singapore: {
    slug: "singapore",
    name: "Singapore",
    heroSubtitle:
      "Asia's Top Universities (NUS & NTU) • Global Financial Hub • 1-Year Post-Study Visa",
    overviewHeading:
      "The Epicenter of Asian Innovation, Banking, and Technology Leadership",
    overviewParagraphs: [
      "Singapore hosts two of the world's top 15 universities—National University of Singapore (NUS) and Nanyang Technological University (NTU)—offering elite global academic credentials just a 4-hour flight from India.",
      "As Asia's premier financial and tech capital, Singapore provides unparalleled access to multinational headquarters, venture capital, and cutting-edge research.",
      "International graduates can obtain a 1-year Long Term Visit Pass (LTVP) to seek employment and transition into an Employment Pass (EP).",
    ],
    whyChooseReasons: [
      {
        title: "World Top 15 Universities",
        desc: "NUS and NTU consistently outrank almost all European and Australian universities on global league tables.",
      },
      {
        title: "Service Obligation Tuition Subsidy",
        desc: "The Singapore MOE offers significant tuition fee reductions in exchange for a 3-year post-graduation work commitment in Singapore.",
      },
      {
        title: "Close Proximity to India",
        desc: "Direct flights from over 15 Indian cities with zero time difference lag (GMT+2.5).",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "High Living Costs",
        desc: "Rental and living expenses in Singapore are comparable to London and New York.",
      },
    ],
    programsOfferedNotes:
      "Elite in AI, Computer Science, Financial Engineering, Supply Chain, and MBA.",
    costBreakdown: [
      {
        programType: "Master's (MS/MSc with MOE Subsidy)",
        tuitionRangeINR: "₹14 - 22 Lakhs / yr",
        livingCostINR: "₹10 - 14 Lakhs / yr",
        totalAnnualINR: "₹24 - 36 Lakhs / yr",
        notes:
          "Tuition is reduced by 30%–50% under the MOE Service Obligation.",
      },
      {
        programType: "MBA (NUS / NTU / SMU)",
        tuitionRangeINR: "₹38 - 55 Lakhs total",
        livingCostINR: "₹12 - 16 Lakhs total",
        totalAnnualINR: "₹50 - 71 Lakhs total",
        notes: "Ranked among Asia's #1 business programs.",
      },
    ],
    hiddenCosts: [
      {
        item: "Student Pass Issuance & Entry Visa",
        costINR: "SGD $120 (₹7,500)",
        frequency: "One-time",
      },
    ],
    scholarships: [
      {
        name: "Singapore International Graduate Award (SINGA)",
        type: "Government",
        amount: "Full tuition + SGD $2,700/month stipend + Airfare",
        eligibility: "Top PhD and research master's applicants in STEM",
        deadline: "December 1 and June 1",
      },
      {
        name: "NUS / NTU Master’s Merit Scholarships",
        type: "University",
        amount: "SGD $5,000 - $15,000 tuition grant",
        eligibility: "Outstanding academic track record at undergraduate level",
        deadline: "Admissions cycle",
      },
    ],
    visaDetails: {
      visaType: "Singapore Student’s Pass (STP)",
      processingTime: "2 to 4 weeks",
      workHoursDuringTerm:
        "Up to 16 hours/week for eligible government university students",
      postStudyWorkDuration:
        "1 Year Long Term Visit Pass (LTVP) for university graduates",
      financialProofRequired:
        "Proof of financial capability for 1 year (approx. SGD $30,000)",
      prPathwaySummary:
        "Student Pass → 1-Year LTVP → Employment Pass (EP) / S Pass → Singapore Permanent Residence (PR).",
    },
    faqs: [
      {
        question: "What is the Singapore MOE Service Obligation?",
        answer:
          "The Service Obligation scheme provides substantial tuition subsidies to international master's students who agree to work for a Singapore-registered company for 3 years after graduation.",
      },
    ],
  },

  italy: {
    slug: "italy",
    name: "Italy",
    heroSubtitle:
      "Low Tuition at Historic Universities • DSU Regional Scholarships • 1-Year Post-Study Visa",
    overviewHeading:
      "Prestigious Architecture, Engineering, and Design with Generous Regional Scholarships",
    overviewParagraphs: [
      "Italy is home to Europe's oldest and most prestigious institutions, including Politecnico di Milano, University of Bologna, and Sapienza University of Rome.",
      "Tuition fees at public universities are calculated based on family income (ISEE-U), making top European education available from just €1,000 to €3,500 per year (₹90,000 to ₹3 Lakhs).",
      "Through the DSU (Diritto allo Studio Universitario) regional scholarships, thousands of eligible Indian students receive full tuition waivers and free hostel accommodation.",
    ],
    whyChooseReasons: [
      {
        title: "Income-Based Low Tuition",
        desc: "Public universities charge €1,000–€3,500/yr based on family income evaluation (ISEE-U Parificato).",
      },
      {
        title: "DSU Regional Scholarships",
        desc: "Covers 100% of tuition and provides up to €7,000/year living stipend plus meal vouchers.",
      },
      {
        title: "World #1 in Design & Architecture",
        desc: "Politecnico di Milano ranks in the global top 10 for Architecture, Design, and Civil Engineering.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Embassy CIMEA Verification",
        desc: "Indian marksheets require CIMEA Statement of Comparability or Declaration of Value (DOV) before visa filing.",
      },
    ],
    programsOfferedNotes:
      "Leader in Mechanical & Automotive Engineering, Architecture, Industrial Design, Luxury Management, and Physics.",
    costBreakdown: [
      {
        programType: "Master's (MSc / Laurea Magistrale)",
        tuitionRangeINR: "₹1 - 3.5 Lakhs / yr (Without Scholarship)",
        livingCostINR: "₹6 - 9 Lakhs / yr",
        totalAnnualINR: "₹7 - 12.5 Lakhs / yr",
        notes:
          "With DSU Scholarship, net tuition is €0 and living is heavily subsidized.",
      },
    ],
    hiddenCosts: [
      {
        item: "CIMEA Verification Fee",
        costINR: "€150 - €300 (₹13,500 - ₹27,000)",
        frequency: "One-time",
      },
      {
        item: "Permesso di Soggiorno (Residence Permit)",
        costINR: "€120 (₹11,000)",
        frequency: "Annual",
      },
    ],
    scholarships: [
      {
        name: "DSU Regional Scholarship (Lombardy, Lazio, Emilia)",
        type: "Government",
        amount: "Full tuition waiver + €6,000 - €7,000/yr stipend + Free meals",
        eligibility: "Family income (ISEE) under €25,000 per annum",
        deadline: "July - September annually",
      },
      {
        name: "Invest Your Talent in Italy (IYT)",
        type: "Government",
        amount: "€900/month + Full tuition waiver + Mandatory internship",
        eligibility: "Top engineering and economics graduates from India",
        deadline: "February - March annually",
      },
    ],
    visaDetails: {
      visaType: "Italian National Visa (Type D - Study)",
      processingTime: "3 to 6 weeks",
      workHoursDuringTerm: "Up to 20 hours/week (max 1,040 hours per year)",
      postStudyWorkDuration:
        "12 Months (1 Year) Permesso di Soggiorno per Ricerca Lavoro",
      financialProofRequired:
        "€6,000 in student bank account + accommodation proof",
      prPathwaySummary:
        "Permesso di Soggiorno Studio → 1-Year Job Search Permit → Work Permit (Lavoro Subordinato) → EU Long-Term Residence.",
    },
    faqs: [
      {
        question:
          "How does the DSU scholarship work in Italy for Indian students?",
        answer:
          "The DSU scholarship evaluates your family's annual income. If your family income is under €25,000 (approx. ₹22 Lakhs), you qualify for a full tuition waiver, free hostel accommodation, and a living allowance.",
      },
    ],
  },

  "new-zealand": {
    slug: "new-zealand",
    name: "New Zealand",
    heroSubtitle:
      "All 8 Universities in Global Top 3% • 3-Year Post-Study Work Visa • Green List PR Pathways",
    overviewHeading:
      "World-Ranked Public Universities with High Safety and Green List Residency Tracks",
    overviewParagraphs: [
      "All 8 state universities in New Zealand—including University of Auckland and University of Otago—rank in the top 3% worldwide, offering recognized qualifications in a safe, pristine environment.",
      "Graduates from master's and bachelor's degrees receive up to a 3-year Post-Study Work Visa with open employment rights.",
      "Under Immigration New Zealand's 'Green List', occupations in IT, engineering, healthcare, and environmental sciences have fast-track Straight to Residence PR pathways.",
    ],
    whyChooseReasons: [
      {
        title: "3-Year Post-Study Work Visa",
        desc: "Generous 36-month open work rights for master's degree graduates across all sectors.",
      },
      {
        title: "Green List Fast-Track PR",
        desc: "Direct pathways to permanent residency for engineers, software developers, and medical professionals.",
      },
      {
        title: "Unbeatable Quality of Life",
        desc: "Ranked among the top 5 safest and most peaceful countries globally with high student satisfaction.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Tuition and Living Costs",
        desc: "Tuition and living costs are comparable to Australia; careful financial planning is recommended.",
      },
    ],
    programsOfferedNotes:
      "Excellence in Environmental Engineering, Data Analytics, Agriculture Tech, Cybersecurity, and Tourism Management.",
    costBreakdown: [
      {
        programType: "Master's (1.5 - 2 Years)",
        tuitionRangeINR: "₹16 - 25 Lakhs / yr",
        livingCostINR: "₹10 - 13 Lakhs / yr",
        totalAnnualINR: "₹26 - 38 Lakhs / yr",
        notes: "Comprehensive practical and research degrees.",
      },
    ],
    hiddenCosts: [
      {
        item: "Student Visa Fee",
        costINR: "NZD $430 (₹22,000)",
        frequency: "One-time",
      },
      {
        item: "Mandatory Student Health Insurance",
        costINR: "NZD $700 / yr (₹35,000)",
        frequency: "Annual",
      },
    ],
    scholarships: [
      {
        name: "Manaaki New Zealand Scholarships",
        type: "Government",
        amount: "Full tuition + Living allowance + Airfare",
        eligibility:
          "High-potential international students committed to sustainable development",
        deadline: "February annually",
      },
      {
        name: "University of Auckland International Excellence",
        type: "University",
        amount: "Up to NZD $10,000 tuition reduction",
        eligibility: "Merit-based on high undergraduate CGPA",
        deadline: "Admissions cycle",
      },
    ],
    visaDetails: {
      visaType: "Fee Paying Student Visa",
      processingTime: "4 to 8 weeks",
      workHoursDuringTerm:
        "Up to 20 hours/week during term; 40 hours/week during breaks",
      postStudyWorkDuration: "Up to 3 Years Post-Study Work Visa (Open)",
      financialProofRequired:
        "Tuition fee paid + NZD $20,000 proof of living funds per year",
      prPathwaySummary:
        "Student Visa → 3-Year Post Study Work Visa → Green List Straight to Residence / Skilled Migrant Category (SMC) PR.",
    },
    faqs: [
      {
        question: "What is the Green List in New Zealand?",
        answer:
          "The Green List includes in-demand roles in tech, engineering, healthcare, and education that offer direct or fast-track permanent residence pathways for skilled graduates.",
      },
    ],
  },

  uae: {
    slug: "uae",
    name: "United Arab Emirates",
    heroSubtitle:
      "Global Branch Campuses (NYU, Wollongong, BITS Pilani) • 10-Year Golden Visa • Zero Tax Economy",
    overviewHeading:
      "World-Class Branch Campuses in a Global Tax-Free Business Hub",
    overviewParagraphs: [
      "Dubai and Abu Dhabi host leading international branch campuses—including NYU Abu Dhabi, University of Wollongong Dubai, BITS Pilani Dubai, and Heriot-Watt—offering globally identical degrees.",
      "Indian students study in a tax-free economy with a massive multinational corporate presence, international internship opportunities, and luxury student housing.",
      "High-performing graduates can qualify for the UAE 10-Year Golden Visa, establishing long-term residency in the Middle East's commercial center.",
    ],
    whyChooseReasons: [
      {
        title: "Identical Global Degrees",
        desc: "Graduate with the exact same degree certificate as home campuses in the US, UK, Australia, or India.",
      },
      {
        title: "10-Year Golden Visa Opportunities",
        desc: "Top university graduates with high GPAs qualify for the UAE Golden Visa for self-sponsored residency.",
      },
      {
        title: "3 Hours from India with Zero Tax",
        desc: "Short flight time with tax-free graduate starting salaries in Dubai's thriving tech and finance sectors.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Campus Housing Costs",
        desc: "Accommodation in Dubai can be expensive; choosing university-managed residences provides better cost predictability.",
      },
    ],
    programsOfferedNotes:
      "Leading in International Business & MBA, Civil Engineering, AI & Fintech, Hospitality Management, and Media.",
    costBreakdown: [
      {
        programType: "Master's Degrees (MS / MSc / MBA)",
        tuitionRangeINR: "₹12 - 22 Lakhs / yr",
        livingCostINR: "₹7 - 10 Lakhs / yr",
        totalAnnualINR: "₹19 - 32 Lakhs / yr",
        notes:
          "2-year or 1-year programs with evening/weekend schedules for working professionals.",
      },
    ],
    hiddenCosts: [
      {
        item: "Student Visa & Emirates ID Processing",
        costINR: "AED 3,000 - 4,500 (₹68,000 - ₹1,00,000)",
        frequency: "Annual",
      },
      {
        item: "Health Insurance",
        costINR: "Included in visa package or AED 1,500 / yr",
        frequency: "Annual",
      },
    ],
    scholarships: [
      {
        name: "Academic Merit Scholarships",
        type: "University",
        amount: "20% - 50% Tuition fee reduction",
        eligibility: "Students with 85%+ in previous qualification",
        deadline: "Rolling with admission",
      },
    ],
    visaDetails: {
      visaType: "UAE Student Residence Visa",
      processingTime: "2 to 3 weeks",
      workHoursDuringTerm:
        "Part-time student work permitted with university NOC",
      postStudyWorkDuration:
        "2-Year Green Visa or 10-Year Golden Visa for high achievers",
      financialProofRequired: "Tuition payment and basic financial affidavit",
      prPathwaySummary:
        "Student Visa → UAE Green Visa / Golden Visa → Corporate Employment.",
    },
    faqs: [
      {
        question: "Can Indian students work part-time in Dubai while studying?",
        answer:
          "Yes, students on university-sponsored visas can take up internships and part-time jobs with a No Objection Certificate (NOC) from their institution.",
      },
    ],
  },

  malaysia: {
    slug: "malaysia",
    name: "Malaysia",
    heroSubtitle:
      "UK & Australian Twinning Campuses (Monash, Nottingham) • ₹6 - 10 Lakhs / yr All-Inclusive",
    overviewHeading:
      "Affordable Global Degrees with Direct Twinning & Transfer to UK/Australia",
    overviewParagraphs: [
      "Malaysia offers foreign branch campuses of top universities—such as Monash University Malaysia, University of Nottingham, and Curtin University—at one-third the tuition cost of studying in Australia or the UK.",
      "Through unique '2+1' and '1+2' twinning programs, students can complete the initial years in Malaysia and transfer seamlessly to the home campus in Melbourne or Nottingham.",
      "With modern infrastructure in Kuala Lumpur, halal food, and a very low cost of living, Malaysia is a top value-for-money study hub.",
    ],
    whyChooseReasons: [
      {
        title: "Foreign Branch Campuses",
        desc: "Obtain a Monash or Nottingham degree with identical curriculum at 60% lower total expense.",
      },
      {
        title: "2+1 Twinning & Transfer",
        desc: "Option to transfer to Australian or UK home campuses after 1 or 2 years in Malaysia.",
      },
      {
        title: "Low Living Cost",
        desc: "Quality apartment living, food, and transit for under ₹30,000 to ₹40,000 per month.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Limited In-Country Work Rights",
        desc: "Post-study work visa options in Malaysia are limited; most students utilize the degree for global recruitment or campus transfer.",
      },
    ],
    programsOfferedNotes:
      "Computer Science, Chemical Engineering, Business & Finance, and Biotechnology.",
    costBreakdown: [
      {
        programType: "Master's Degrees (Monash / Nottingham)",
        tuitionRangeINR: "₹7 - 12 Lakhs / yr",
        livingCostINR: "₹3.5 - 5 Lakhs / yr",
        totalAnnualINR: "₹10.5 - 17 Lakhs / yr",
        notes:
          "Identical Australian/UK degree certificate awarded upon graduation.",
      },
    ],
    hiddenCosts: [
      {
        item: "EMGS Student Visa Approval Letter (VAL)",
        costINR: "RM 2,000 (₹38,000)",
        frequency: "One-time",
      },
    ],
    scholarships: [
      {
        name: "Monash High Achiever Award",
        type: "University",
        amount: "RM 5,000 - 10,000 / semester",
        eligibility: "High academic marks in previous degree",
        deadline: "Semester start",
      },
    ],
    visaDetails: {
      visaType: "Malaysian Student Pass (via EMGS)",
      processingTime: "3 to 5 weeks",
      workHoursDuringTerm: "Up to 20 hours/week during semester breaks only",
      postStudyWorkDuration:
        "Direct transition into Employment Pass (EP) upon job offer",
      financialProofRequired: "Bank balance showing ₹4 - 6 Lakhs",
      prPathwaySummary:
        "Student Pass → Malaysian Employment Pass or transfer to UK/Australia.",
    },
    faqs: [
      {
        question:
          "Do graduates from Monash Malaysia receive the same degree as Monash Australia?",
        answer:
          "Yes, the degree certificate is issued directly by Monash University Australia and is identical to degrees awarded on the Melbourne campus.",
      },
    ],
  },

  mauritius: {
    slug: "mauritius",
    name: "Mauritius",
    heroSubtitle:
      "Tropical Island Hub • NMC-Compliant Medical & Tech Degrees • Visa-Friendly for Indians",
    overviewHeading:
      "Safe, English-Medium Tropical Education with Direct Ties to India",
    overviewParagraphs: [
      "Mauritius offers a safe, multicultural, and English-speaking academic environment with strong historical and diplomatic connections to India.",
      "Renowned medical institutions such as SSR Medical College provide NMC-compliant MBBS degrees, and technology campuses deliver accredited UK/French curriculum degrees.",
      "With visa-on-arrival facilitation, low living expenses, and shared cultural ties, Mauritius is an attractive education destination.",
    ],
    whyChooseReasons: [
      {
        title: "100% English Medium & NMC Compliant",
        desc: "SSR Medical College is established and recognized by NMC and WHO for medical practice.",
      },
      {
        title: "Safe & Friendly Community",
        desc: "Over 60% of the population is of Indian origin; Indian festivals, food, and culture are universal.",
      },
      {
        title: "Affordable Island Living",
        desc: "Low tuition and budget-friendly student housing with pleasant tropical climate year-round.",
      },
    ],
    tradeoffsToKnow: [
      {
        title: "Smaller Job Market",
        desc: "Due to island economy size, most students return to India or pursue international careers upon graduation.",
      },
    ],
    programsOfferedNotes:
      "MBBS (General Medicine), Hospitality & Tourism, and Information Technology.",
    costBreakdown: [
      {
        programType: "MBBS (5-Year Program)",
        tuitionRangeINR: "₹6 - 8 Lakhs / yr",
        livingCostINR: "₹2.5 - 3.5 Lakhs / yr",
        totalAnnualINR: "₹8.5 - 11.5 Lakhs / yr",
        notes: "Total 5-year MBBS package approximately ₹38 - 45 Lakhs.",
      },
    ],
    hiddenCosts: [
      {
        item: "Student Visa Processing Fee",
        costINR: "₹15,000",
        frequency: "One-time",
      },
    ],
    scholarships: [
      {
        name: "Mauritius-Africa Scholarship Scheme",
        type: "Government",
        amount: "Full tuition coverage",
        eligibility:
          "Merit-based admission in participating higher education institutions",
        deadline: "April annually",
      },
    ],
    visaDetails: {
      visaType: "Mauritius Student Visa",
      processingTime: "2 to 4 weeks",
      workHoursDuringTerm: "Up to 20 hours/week part-time work permitted",
      postStudyWorkDuration:
        "YEP (Young Enterprise Scheme) work permits available",
      financialProofRequired: "Bank statement showing ₹4 - 6 Lakhs",
      prPathwaySummary:
        "Graduates clear NExT/FMGE in India or pursue international clinical licensure.",
    },
    faqs: [
      {
        question: "Is the MBBS from Mauritius recognized in India?",
        answer:
          "Yes, SSR Medical College in Mauritius is listed in the WHO directory and recognized by the National Medical Commission (NMC) for NExT/FMGE eligibility.",
      },
    ],
  },
};

export function getCountryEditorial(slug: string): CountryContent | null {
  return COUNTRY_EDITORIAL_CONTENT[slug] || null;
}
