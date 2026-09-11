export interface TestPrepExam {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  fullName: string;
  category: "English Proficiency" | "Graduate Admissions" | "Medical & Healthcare Licensing";
  heroTagline: string;
  targetPrograms: string[];
  targetCountries: string[];
  overview: string;
  feeINR: string;
  feeOriginal: string;
  duration: string;
  formatMode: string;
  validityYears: number;
  scoringScale: string;
  targetCutoffIndianStudents: string;
  conductingBody: string;
  frequency: string;
  sections: {
    name: string;
    duration: string;
    questionsCount: string;
    skillsTested: string;
    tips: string;
  }[];
  scoreRequirementsByCountry: {
    country: string;
    flag: string;
    minRequired: string;
    competitiveScore: string;
  }[];
  prepRoadmap: {
    week: string;
    title: string;
    milestone: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const TEST_PREP_EXAMS: TestPrepExam[] = [
  {
    id: "ielts",
    slug: "ielts",
    name: "IELTS Academic",
    shortName: "IELTS",
    fullName: "International English Language Testing System",
    category: "English Proficiency",
    heroTagline: "The world's most recognized English proficiency test for UK, Australia, Canada, Ireland & USA admissions.",
    targetPrograms: ["MS / STEM", "MBA", "Bachelors", "Nursing", "Postgrad Diplomas"],
    targetCountries: ["United Kingdom", "Canada", "Australia", "Ireland", "United States", "New Zealand", "Germany"],
    overview: "IELTS Academic measures whether your level of English language proficiency is suitable for an academic environment. Accepted by over 12,500 institutions globally, it evaluates four core language competencies: Listening, Reading, Writing, and Speaking.",
    feeINR: "₹17,000",
    feeOriginal: "₹17,000 (IDP India)",
    duration: "2 hours 45 minutes",
    formatMode: "Computer-delivered (CD-IELTS) or Pen-and-Paper",
    validityYears: 2,
    scoringScale: "Band 0 to 9.0 (0.5 increments)",
    targetCutoffIndianStudents: "6.5 Overall (no band below 6.0) for Top 200 Universities",
    conductingBody: "IDP Education / Cambridge English",
    frequency: "Available up to 3-4 times per week across 82+ Indian cities",
    sections: [
      {
        name: "Listening",
        duration: "30 minutes (+10 mins transfer time)",
        questionsCount: "40 questions (4 recorded sections)",
        skillsTested: "Monologues and conversations in native British, Australian, and American accents.",
        tips: "Practice multi-accent comprehension and keyword spotting without spelling errors."
      },
      {
        name: "Reading",
        duration: "60 minutes",
        questionsCount: "40 questions (3 long academic texts)",
        skillsTested: "Skimming, scanning, True/False/Not Given logic, and diagram labeling.",
        tips: "Spend strict 20 minutes per passage. Do not get stuck on unfamiliar scientific vocabulary."
      },
      {
        name: "Writing",
        duration: "60 minutes",
        questionsCount: "2 tasks (Task 1: 150 words report, Task 2: 250 words essay)",
        skillsTested: "Data visual synthesis, structured discursive argumentation, coherence, and grammar range.",
        tips: "Allocate 20 mins for Task 1 and 40 mins for Task 2. Write clearly structured 4-paragraph essays."
      },
      {
        name: "Speaking",
        duration: "11 to 14 minutes",
        questionsCount: "3 parts (Interview, 2-minute Cue Card Monologue, Discussion)",
        skillsTested: "Fluency, lexical resource, pronunciation, and grammatical accuracy with human examiner.",
        tips: "Avoid memorized answers; speak naturally with authentic connectors and explanations."
      }
    ],
    scoreRequirementsByCountry: [
      { country: "United Kingdom", flag: "🇬🇧", minRequired: "6.0 (Visa SEST: 5.5)", competitiveScore: "6.5 - 7.5 (Russell Group)" },
      { country: "Canada", flag: "🇨🇦", minRequired: "6.0 in each band (SDS stream)", competitiveScore: "7.0 Overall (U of T, UBC)" },
      { country: "Australia", flag: "🇦🇺", minRequired: "6.0 - 6.5", competitiveScore: "7.0 (Group of Eight)" },
      { country: "Germany", flag: "🇩🇪", minRequired: "6.5", competitiveScore: "7.0 (TU9 Public Universities)" },
      { country: "United States", flag: "🇺🇸", minRequired: "6.5", competitiveScore: "7.5 (Top 50 US News)" }
    ],
    prepRoadmap: [
      { week: "Weeks 1-2", title: "Diagnostic & Skill Benchmark", milestone: "Take full diagnostic test, identify weak areas in Reading vs Writing Task 2." },
      { week: "Weeks 3-4", title: "Listening & Reading Speed Drills", milestone: "Master skimming/scanning techniques and Cambridge IELTS Book 15-19 tests." },
      { week: "Weeks 5-6", title: "Writing Frameworks & Speaking Mocks", milestone: "Write 15 Task 2 essays with peer/trainer feedback; conduct 10 cue card mocks." },
      { week: "Weeks 7-8", title: "Timed Exam Simulation", milestone: "Complete 5 timed computer-delivered mocks; target 7.5+ in mock conditions." }
    ],
    faqs: [
      {
        question: "What is the difference between Computer-Delivered and Paper-based IELTS?",
        answer: "Both have the exact same difficulty, scoring, and question types. Computer-delivered IELTS delivers results in 3-5 days and is typed on a PC, whereas paper-based takes 13 days."
      },
      {
        question: "Can I study in Germany or USA with an IELTS score instead of TOEFL/GRE?",
        answer: "Yes! Over 3,400 US institutions and virtually 100% of English-taught public universities in Germany accept IELTS Academic."
      },
      {
        question: "What is IELTS One Skill Retake (OSR)?",
        answer: "If you did not achieve your desired score in one of the four components (Listening, Reading, Writing, or Speaking), you can retake just that single section within 60 days of your original test date."
      }
    ]
  },
  {
    id: "toefl",
    slug: "toefl",
    name: "TOEFL iBT",
    shortName: "TOEFL",
    fullName: "Test of English as a Foreign Language (Internet-Based Test)",
    category: "English Proficiency",
    heroTagline: "The premier English language test preferred by 100% of US universities and prestigious global Ivy League institutions.",
    targetPrograms: ["MS in USA", "MBA", "Doctoral / PhD", "Undergraduate Admissions"],
    targetCountries: ["United States", "Canada", "Germany", "United Kingdom", "France", "Singapore"],
    overview: "Administered by ETS, the TOEFL iBT test evaluates academic English skills in university classroom scenarios. Revamped to a streamlined 2-hour duration, it is trusted by 13,000+ universities in over 160 countries.",
    feeINR: "₹16,900",
    feeOriginal: "US $205 (~₹16,900)",
    duration: "1 hour 56 minutes",
    formatMode: "Computer-delivered at certified test centers or TOEFL Home Edition",
    validityYears: 2,
    scoringScale: "0 to 120 (0-30 per section)",
    targetCutoffIndianStudents: "90 - 105 / 120 for Top Tier Institutions",
    conductingBody: "Educational Testing Service (ETS)",
    frequency: "Offered over 60+ times a year across test centers throughout India",
    sections: [
      {
        name: "Reading",
        duration: "35 minutes",
        questionsCount: "20 questions (2 reading passages)",
        skillsTested: "Academic comprehension, vocabulary in context, and inferential synthesis.",
        tips: "Focus on academic science and humanities journal comprehension."
      },
      {
        name: "Listening",
        duration: "36 minutes",
        questionsCount: "28 questions (3 lectures + 2 conversations)",
        skillsTested: "Lecture main ideas, speaker stance, and pragmatic understanding.",
        tips: "Take structured notes during audio playback using standard abbreviation symbols."
      },
      {
        name: "Speaking",
        duration: "16 minutes",
        questionsCount: "4 tasks (1 independent + 3 integrated listening/reading)",
        skillsTested: "Coherent oral delivery and synthesis of campus/academic concepts into a microphone.",
        tips: "Use a strict 45-60 second pacing framework with immediate topic topic sentences."
      },
      {
        name: "Writing",
        duration: "29 minutes",
        questionsCount: "2 tasks (1 Integrated task + 1 Writing for Academic Discussion)",
        skillsTested: "Concise academic discussion contribution (100+ words) and lecture vs reading synthesis.",
        tips: "Master the new 10-minute 'Academic Discussion' format with high-impact arguments."
      }
    ],
    scoreRequirementsByCountry: [
      { country: "United States", flag: "🇺🇸", minRequired: "80 / 120", competitiveScore: "100 - 108 (Top 30 US)" },
      { country: "Canada", flag: "🇨🇦", minRequired: "83 / 120", competitiveScore: "95 - 102 (McGill, U of T)" },
      { country: "Germany", flag: "🇩🇪", minRequired: "88 / 120", competitiveScore: "95+ (TU Munich, RWTH)" },
      { country: "United Kingdom", flag: "🇬🇧", minRequired: "88 / 120", competitiveScore: "100+ (Oxford, LSE, Imperial)" }
    ],
    prepRoadmap: [
      { week: "Weeks 1-2", title: "Diagnostic & ETS Format Orientation", milestone: "Understand 2024 revised 2-hour structure and take Official ETS Practice Test." },
      { week: "Weeks 3-4", title: "Integrated Speaking & Audio Synthesis", milestone: "Record 30 integrated speaking responses and evaluate speech rhythm and pronunciation." },
      { week: "Weeks 5-6", title: "Academic Discussion Writing Mastery", milestone: "Practice 25 new 10-minute discussion topics; hone touch typing speed." },
      { week: "Weeks 7-8", title: "Full Mock Simulations & Score Lock", milestone: "Simulate 4 full-length mocks under test center ambient noise conditions." }
    ],
    faqs: [
      {
        question: "How long is the TOEFL iBT test?",
        answer: "Following the recent ETS enhancements, TOEFL iBT takes less than 2 hours to complete, making it the shortest major English test."
      },
      {
        question: "What is 'MyBest Scores' in TOEFL?",
        answer: "MyBest Scores (superscoring) combines your highest section scores from all valid TOEFL iBT test dates within the last 2 years into an official best score."
      },
      {
        question: "Is TOEFL accepted for Canada SDS Visa?",
        answer: "Yes, IRCC Canada officially accepts TOEFL iBT for the Student Direct Stream (SDS) visa processing with a minimum score of 83."
      }
    ]
  },
  {
    id: "pte",
    slug: "pte",
    name: "PTE Academic",
    shortName: "PTE",
    fullName: "Pearson Test of English Academic",
    category: "English Proficiency",
    heroTagline: "100% computer-scored AI English test with lightning-fast results in 48 hours, widely accepted across Australia, UK & New Zealand.",
    targetPrograms: ["Study in Australia", "UK Universities", "Canada SDS", "Nursing Migration"],
    targetCountries: ["Australia", "New Zealand", "United Kingdom", "Canada", "Ireland", "United States"],
    overview: "PTE Academic is an AI-powered English language test that delivers unbiased, automated machine scoring. It is accepted for 100% of Australian and New Zealand visa applications, 99% of UK universities, and thousands of global programs.",
    feeINR: "₹17,000",
    feeOriginal: "₹17,000",
    duration: "2 hours",
    formatMode: "Fully computer-based at Pearson VUE centers",
    validityYears: 2,
    scoringScale: "10 to 90 Global Scale of English",
    targetCutoffIndianStudents: "65 - 79+ / 90 (equivalent to 7.0 - 8.0 IELTS)",
    conductingBody: "Pearson PLC",
    frequency: "Available 365 days a year with slots bookable up to 24 hours in advance",
    sections: [
      {
        name: "Speaking & Writing (Combined)",
        duration: "54 to 67 minutes",
        questionsCount: "Read Aloud, Repeat Sentence, Describe Image, Retell Lecture, Essay (20 mins)",
        skillsTested: "Oral fluency, pronunciation, automatic sentence parsing, written discourse.",
        tips: "Maintain steady pitch and clear microphone distance; avoid hesitations or filler pauses."
      },
      {
        name: "Reading",
        duration: "29 to 30 minutes",
        questionsCount: "Fill in the Blanks, Multiple Choice, Re-order Paragraphs",
        skillsTested: "Collocations, grammar concordance, sentence sequencing, contextual vocabulary.",
        tips: "Master academic collocation lists (over 2,500 core Pearson word combinations)."
      },
      {
        name: "Listening",
        duration: "30 to 43 minutes",
        questionsCount: "Summarize Spoken Text, Write from Dictation, Highlight Incorrect Words",
        skillsTested: "Real-time acoustic comprehension, spellings, short-term working memory.",
        tips: "'Write from Dictation' carries massive scoring weight—practice exact spelling accuracy."
      }
    ],
    scoreRequirementsByCountry: [
      { country: "Australia", flag: "🇦🇺", minRequired: "58 (Equivalent IELTS 6.5)", competitiveScore: "65 - 79 (PR & Group of Eight)" },
      { country: "United Kingdom", flag: "🇬🇧", minRequired: "59 / 90", competitiveScore: "68 - 76 (Top UK Unis)" },
      { country: "Canada", flag: "🇨🇦", minRequired: "60 (SDS stream minimum)", competitiveScore: "68+ (Leading Ontario Unis)" },
      { country: "New Zealand", flag: "🇳🇿", minRequired: "58 / 90", competitiveScore: "65+ (Auckland, Otago)" }
    ],
    prepRoadmap: [
      { week: "Weeks 1-2", title: "AI Scoring Algorithm Mastery", milestone: "Understand how speech recognition evaluates pronunciation vs oral fluency." },
      { week: "Weeks 3-4", title: "High-Weight Task Drills", milestone: "Daily drill: 50 'Repeat Sentence', 30 'Write from Dictation', 20 'Read Aloud'." },
      { week: "Weeks 5-6", title: "Templates & Collocation Prep", milestone: "Master Describe Image & Retell Lecture frameworks and academic vocabulary sets." },
      { week: "Weeks 7-8", title: "Official Scored Mock Tests", milestone: "Take Official Pearson Scored Mocks A, B, and C; target 75+ in mock reports." }
    ],
    faqs: [
      {
        question: "Why is PTE considered faster and more objective than human-scored tests?",
        answer: "PTE uses advanced AI algorithms trained on millions of speech samples. There is zero examiner bias, and 85% of test-takers receive scores within 48 hours."
      },
      {
        question: "Is PTE accepted for Canada SDS Student Visa?",
        answer: "Yes! Immigration, Refugees and Citizenship Canada (IRCC) approved PTE Academic for Student Direct Stream (SDS) visa applicants in 2023."
      },
      {
        question: "What is the most critical section in PTE Academic?",
        answer: "The 'Write from Dictation' and 'Repeat Sentence' tasks carry the highest shared scoring weights for both Listening and Writing/Speaking."
      }
    ]
  },
  {
    id: "gre",
    slug: "gre",
    name: "GRE General Test",
    shortName: "GRE",
    fullName: "Graduate Record Examinations",
    category: "Graduate Admissions",
    heroTagline: "The benchmark standardized test required for MS in STEM, Computer Science, Engineering & top Global MBA programs.",
    targetPrograms: ["MS in Computer Science / AI", "Data Science", "Mechanical & Electrical Eng", "Top US / German MBA"],
    targetCountries: ["United States", "Canada", "Germany", "Singapore", "Switzerland", "United Kingdom"],
    overview: "Administered by ETS, the GRE General Test measures verbal reasoning, quantitative reasoning, and analytical writing. It is the primary evaluation metric used by graduate admissions committees to compare candidates across global university grading scales.",
    feeINR: "₹22,550",
    feeOriginal: "US $220 (~₹22,550)",
    duration: "1 hour 58 minutes",
    formatMode: "Computer-delivered at certified ETS test centers or Home Edition",
    validityYears: 5,
    scoringScale: "260 to 340 (Quant 130-170, Verbal 130-170, AWA 0-6.0)",
    targetCutoffIndianStudents: "315 - 325+ (Quant 165+ for STEM programs)",
    conductingBody: "Educational Testing Service (ETS)",
    frequency: "Year-round testing across major Indian metropolitan test centers",
    sections: [
      {
        name: "Analytical Writing (AWA)",
        duration: "30 minutes",
        questionsCount: "1 'Analyze an Issue' task",
        skillsTested: "Critical thinking, structured logical argumentation, and evidence articulation.",
        tips: "Develop 3-4 structured body paragraphs with historical, scientific, or economic real-world examples."
      },
      {
        name: "Verbal Reasoning (2 Sections)",
        duration: "41 minutes total (18 mins + 23 mins)",
        questionsCount: "27 questions total (Text Completion, Sentence Equivalence, Reading Comprehension)",
        skillsTested: "High-level vocabulary nuance, logical argument analysis, and passage inference.",
        tips: "Master 800-1000 high-frequency GRE words (e.g., GregMat or Magoosh flashcards)."
      },
      {
        name: "Quantitative Reasoning (2 Sections)",
        duration: "47 minutes total (21 mins + 26 mins)",
        questionsCount: "27 questions total (Arithmetic, Algebra, Geometry, Data Analysis)",
        skillsTested: "Problem solving, quantitative comparison, data interpretation under strict time pressure.",
        tips: "Aim for 168-170 in Quant for STEM. Focus heavily on Probability, Combinatorics & Normal Distributions."
      }
    ],
    scoreRequirementsByCountry: [
      { country: "United States (Top 30 STEM)", flag: "🇺🇸", minRequired: "310 (Quant 162+)", competitiveScore: "322 - 330 (Quant 167 - 170)" },
      { country: "Germany (TU9 Masters)", flag: "🇩🇪", minRequired: "Quant 160+", competitiveScore: "315+ (Quant 164+ for RWTH/TUM)" },
      { country: "Canada (U of T, McGill, UBC)", flag: "🇨🇦", minRequired: "312", competitiveScore: "320+ (Quant 165+)" },
      { country: "Singapore (NUS / NTU)", flag: "🇸🇬", minRequired: "320", competitiveScore: "325+ (Quant 168+)" }
    ],
    prepRoadmap: [
      { week: "Weeks 1-3", title: "Math Foundations & 500 Core Vocab", milestone: "Refresh algebra, geometry, and number theory; master first 500 GRE vocabulary words." },
      { week: "Weeks 4-6", title: "Sectional Speed Drills & Question Types", milestone: "Complete 500+ Quant and Verbal problems from ETS Official Guides and Manhattan 5lb." },
      { week: "Weeks 7-9", title: "Adaptive Testing & Time Management", milestone: "Practice adaptive section strategies—learn when to skip questions to maximize score." },
      { week: "Weeks 10-12", title: "ETS PowerPrep Mocks & Target Calibration", milestone: "Take official PowerPrep I & II tests; achieve 320+ consistently under timed conditions." }
    ],
    faqs: [
      {
        question: "How did the GRE change in the new shorter format?",
        answer: "The GRE was cut from 3 hours 45 minutes to just 1 hour 58 minutes. The 'Analyze an Argument' essay and unscored experimental section were eliminated."
      },
      {
        question: "Do German universities require GRE for English-taught master's degrees?",
        answer: "Top German TU9 universities (such as RWTH Aachen, TU Munich, and University of Stuttgart) require or strongly recommend GRE Quant 164+ for Indian engineering degrees."
      },
      {
        question: "How long is a GRE score valid?",
        answer: "Your official GRE score is valid for 5 full years from the date of your test."
      }
    ]
  },
  {
    id: "gmat",
    slug: "gmat",
    name: "GMAT Focus Edition",
    shortName: "GMAT",
    fullName: "Graduate Management Admission Test (Focus Edition)",
    category: "Graduate Admissions",
    heroTagline: "The premier global business school entrance exam for MBA, Executive MBA & Masters in Management (MiM) admissions.",
    targetPrograms: ["Global MBA", "Executive MBA", "Masters in Management (MiM)", "MS in Finance"],
    targetCountries: ["United States", "United Kingdom", "France", "Singapore", "Canada", "Germany"],
    overview: "Redesigned as the GMAT Focus Edition, this 2-hour 15-minute exam tests relevant higher-order reasoning and data literacy skills required in modern business leadership.",
    feeINR: "₹24,500",
    feeOriginal: "US $275 (~₹24,500)",
    duration: "2 hours 15 minutes",
    formatMode: "Computer-adaptive at test centers or Online",
    validityYears: 5,
    scoringScale: "205 to 805 (with unique Focus scale)",
    targetCutoffIndianStudents: "645 - 695+ (Equivalent to old 700 - 750 scale)",
    conductingBody: "Graduate Management Admission Council (GMAC)",
    frequency: "Year-round testing across certified Pearson VUE test centers",
    sections: [
      {
        name: "Quantitative Reasoning",
        duration: "45 minutes",
        questionsCount: "21 questions (Problem Solving)",
        skillsTested: "Algebra, Arithmetic, and applied logic (Geometry is no longer tested).",
        tips: "Pure problem-solving focus. No calculator is allowed in this section."
      },
      {
        name: "Verbal Reasoning",
        duration: "45 minutes",
        questionsCount: "23 questions (Reading Comprehension & Critical Reasoning)",
        skillsTested: "Logical argument deconstruction and reading inference (Sentence Correction removed).",
        tips: "Focus on premise-assumption-conclusion logic chains for Critical Reasoning."
      },
      {
        name: "Data Insights",
        duration: "45 minutes",
        questionsCount: "20 questions (Data Sufficiency, Multi-Source, Graphics, Two-Part)",
        skillsTested: "Data literacy, statistical inference, spreadsheets, and decision modeling.",
        tips: "On-screen calculator IS permitted. Practice multi-tab data integration cases."
      }
    ],
    scoreRequirementsByCountry: [
      { country: "United States (Harvard, Stanford, Wharton)", flag: "🇺🇸", minRequired: "645", competitiveScore: "695 - 735 (98th+ percentile)" },
      { country: "France / Europe (INSEAD, HEC Paris)", flag: "🇫🇷", minRequired: "635", competitiveScore: "675 - 715" },
      { country: "United Kingdom (LBS, Oxford, Cambridge)", flag: "🇬🇧", minRequired: "645", competitiveScore: "685 - 725" },
      { country: "Singapore (NUS / NTU MBA)", flag: "🇸🇬", minRequired: "625", competitiveScore: "665 - 695" }
    ],
    prepRoadmap: [
      { week: "Weeks 1-4", title: "Core Quant & Critical Reasoning Concepts", milestone: "Master number properties, rates, and assumptions in argument structure." },
      { week: "Weeks 5-8", title: "Data Insights Mastery", milestone: "Practice 150+ Multi-Source Reasoning and Data Sufficiency questions." },
      { week: "Weeks 9-12", title: "Official GMAT Focus Mocks", milestone: "Take GMAC Official Practice Exams 1-6; review question review & edit strategy." }
    ],
    faqs: [
      {
        question: "What is new in the GMAT Focus Edition?",
        answer: "The exam is 1 hour shorter, the Analytical Writing Assessment (essay) and Sentence Correction were removed, and a new Data Insights section was added."
      },
      {
        question: "Can I review and edit answers during the GMAT Focus test?",
        answer: "Yes! You can bookmark questions and change up to 3 answers per section before time expires."
      },
      {
        question: "How does GMAT Focus 645 compare to old GMAT scores?",
        answer: "A score of 645 on the GMAT Focus Edition corresponds to approximately a 700 on the legacy GMAT scale (around the 89th percentile)."
      }
    ]
  },
  {
    id: "nclex",
    slug: "nclex",
    name: "NCLEX-RN",
    shortName: "NCLEX",
    fullName: "National Council Licensure Examination for Registered Nurses",
    category: "Medical & Healthcare Licensing",
    heroTagline: "The essential clinical licensing exam for Indian BSc & GNM nurses migrating to practice in the USA, Canada & Australia.",
    targetPrograms: ["Nursing in USA", "Canadian RN Licensing", "Australian AHPRA Registration"],
    targetCountries: ["United States", "Canada", "Australia", "New Zealand"],
    overview: "Administered by the NCSBN using Next Generation NCLEX (NGN) clinical judgment measurement models, the NCLEX-RN tests safe entry-level nursing practice for direct licensing in US States (e.g. Texas, New York) and Canadian provinces.",
    feeINR: "₹18,500",
    feeOriginal: "US $200 + $150 Intl scheduling fee",
    duration: "Up to 5 hours",
    formatMode: "Computerized Adaptive Testing (CAT) with 85 to 150 questions",
    validityYears: 99,
    scoringScale: "Pass / Fail (Logit ability above passing standard)",
    targetCutoffIndianStudents: "Pass standard achieved in 85 questions",
    conductingBody: "National Council of State Boards of Nursing (NCSBN)",
    frequency: "Offered year-round at Pearson Professional Centers in India (Mumbai, Delhi, Bangalore, Hyderabad, Chennai)",
    sections: [
      {
        name: "Safe and Effective Care Environment",
        duration: "Adaptive CAT",
        questionsCount: "Management of Care & Safety Infection Control (approx 26-38%)",
        skillsTested: "Delegation, patient advocacy, informed consent, sterile techniques, legalities.",
        tips: "Memorize RN vs LPN vs UAP delegation rules for US hospital protocols."
      },
      {
        name: "Health Promotion and Maintenance",
        duration: "Adaptive CAT",
        questionsCount: "Approx 6-12% of exam",
        skillsTested: "Ante/intra/postpartum care, newborn care, developmental stages, immunizations.",
        tips: "Review developmental pediatric milestones and maternal hemorrhage protocols."
      },
      {
        name: "Psychosocial Integrity",
        duration: "Adaptive CAT",
        questionsCount: "Approx 6-12% of exam",
        skillsTested: "Therapeutic communication, coping mechanisms, mental health crisis intervention.",
        tips: "Never choose answers with 'Why' questions or false reassurances in therapeutic communication."
      },
      {
        name: "Physiological Integrity",
        duration: "Adaptive CAT",
        questionsCount: "Pharmacology, Reduction of Risk, Physiological Adaptation (approx 38-62%)",
        skillsTested: "High-alert medication calculations, cardiac dysrhythmias, post-op complications, ICU care.",
        tips: "Master priority mnemonics (ABC, Maslow) and top 200 NCLEX pharmacology drugs."
      }
    ],
    scoreRequirementsByCountry: [
      { country: "United States (US RN License)", flag: "🇺🇸", minRequired: "Pass NCLEX + CGFNS CES credential", competitiveScore: "Direct green card sponsorship (EB-3)" },
      { country: "Canada (NNAS Provincial RN)", flag: "🇨🇦", minRequired: "Pass NCLEX-RN", competitiveScore: "Eligible for provincial nominee healthcare streams" },
      { country: "Australia (AHPRA Stream B)", flag: "🇦🇺", minRequired: "Pass NCLEX-RN + OSCE", competitiveScore: "Direct Australian Registered Nurse Registration" }
    ],
    prepRoadmap: [
      { week: "Weeks 1-4", title: "CGFNS Document Filing & Nursing Content Review", milestone: "Submit credentials to CGFNS/State Board; complete Saunders Comprehensive Review chapters." },
      { week: "Weeks 5-8", title: "NGN Case Studies & Clinical Judgment", milestone: "Solve 50+ Next Generation unfolding case studies using the NCSBN 6-step clinical judgment model." },
      { week: "Weeks 9-12", title: "UWorld / Archer Question Bank Drills", milestone: "Complete 2,500+ practice questions; maintain 65%+ on UWorld test banks." },
      { week: "Weeks 13-16", title: "Full CAT Simulations & Readiness Assessment", milestone: "Pass 3 consecutive High/Very High predictability CAT assessments before booking exam date." }
    ],
    faqs: [
      {
        question: "Can Indian BSc Nursing graduates directly write the NCLEX exam in India?",
        answer: "Yes! Indian nurses can complete credential evaluation (CGFNS), obtain an Authorization to Test (ATT) from a US state board (like Texas or New York), and take the exam at test centers in India."
      },
      {
        question: "What is Next Generation NCLEX (NGN)?",
        answer: "Launched in 2023, NGN includes real-world case studies testing clinical decision making, multi-response matrix tables, drop-down rationales, and trend questions."
      },
      {
        question: "What is the starting salary for an Indian RN in the US after passing NCLEX?",
        answer: "Registered Nurses in the US earn an average starting salary of $75,000 to $105,000 per year (₹65 - ₹90 Lakhs/yr) plus healthcare benefits and EB-3 permanent residency sponsorship."
      }
    ]
  },
  {
    id: "plab",
    slug: "plab",
    name: "PLAB / UKMLA",
    shortName: "PLAB",
    fullName: "Professional and Linguistic Assessments Board / UK Medical Licensing Assessment",
    category: "Medical & Healthcare Licensing",
    heroTagline: "The official General Medical Council (GMC) pathway for Indian MBBS graduates to obtain full UK GMC registration and practice in the NHS.",
    targetPrograms: ["MBBS to UK NHS", "UK Foundation Year 2 / Core Training", "NHS Doctor Jobs"],
    targetCountries: ["United Kingdom"],
    overview: "PLAB (transitioning into the UKMLA framework) ensures that International Medical Graduates (IMGs) possess the clinical knowledge and patient-centered communication skills equivalent to a UK doctor completing Foundation Year 1.",
    feeINR: "Part 1: ~₹27,000 | Part 2: ~₹1,05,000",
    feeOriginal: "PLAB 1: £268 | PLAB 2: £1,040",
    duration: "PLAB 1: 3 hours | PLAB 2: 18-station OSCE",
    formatMode: "PLAB 1 is MCQ (available in India); PLAB 2 is practical OSCE in Manchester, UK",
    validityYears: 2,
    scoringScale: "Pass / Fail based on Angoff benchmark score",
    targetCutoffIndianStudents: "Pass standard (typically 120-125 / 180 in PLAB 1)",
    conductingBody: "General Medical Council (GMC, UK)",
    frequency: "PLAB 1 runs 4 times a year in major Indian hubs; PLAB 2 runs continuously in Manchester",
    sections: [
      {
        name: "PLAB 1 (Applied Knowledge Test - AKT)",
        duration: "3 hours",
        questionsCount: "180 single best answer (SBA) questions",
        skillsTested: "Clinical diagnosis, emergency management, pharmacology, NICE clinical guidelines.",
        tips: "Focus on UK NICE guidelines, PassMedicine question bank, and Plabable mock questions."
      },
      {
        name: "PLAB 2 (Clinical & Communication Skills - CPSA)",
        duration: "Approx 3.5 hours",
        questionsCount: "18 simulated OSCE stations (8 minutes per station)",
        skillsTested: "Patient history taking, examination, breaking bad news, medical ethics, patient safety.",
        tips: "Practice UK communication etiquette: empathy, active listening, and addressing patient ideas, concerns & expectations (ICE)."
      }
    ],
    scoreRequirementsByCountry: [
      { country: "United Kingdom (NHS Doctor Registration)", flag: "🇬🇧", minRequired: "Pass PLAB 1 & 2 + IELTS 7.5 (min 7.0 per band) or OET Grade B", competitiveScore: "Full GMC registration with License to Practice" }
    ],
    prepRoadmap: [
      { week: "Months 1-3", title: "Language Pre-requisite & Plabable Drills", milestone: "Clear IELTS Academic (7.5 overall) or OET (Grade B). Complete 2,000+ Plabable MCQs for PLAB 1." },
      { week: "Month 4", title: "PLAB 1 Exam in India", milestone: "Sit for PLAB 1 at test centers in Delhi, Mumbai, Kolkata, Chennai, Hyderabad, or Bangalore." },
      { week: "Months 5-7", title: "UK Visitor Visa & PLAB 2 Academy", milestone: "Travel to UK for 4-week clinical simulation academy in Manchester/London." },
      { week: "Month 8+", title: "GMC Registration & NHS Job Applications", milestone: "Obtain GMC registration; apply for NHS Trust Doctor / FY2 junior doctor vacancies via Trac.jobs." }
    ],
    faqs: [
      {
        question: "Is PLAB 1 held in India?",
        answer: "Yes! PLAB 1 is conducted four times a year in major Indian cities including New Delhi, Mumbai, Kolkata, Chennai, Hyderabad, and Bangalore."
      },
      {
        question: "What is the transition from PLAB to UKMLA?",
        answer: "From 2024-2025 onwards, PLAB is aligned with the UK Medical Licensing Assessment (UKMLA), testing the same medical knowledge curriculum (MLA content map)."
      },
      {
        question: "What is the salary for an Indian doctor in the UK NHS after PLAB?",
        answer: "An NHS Junior Doctor (FY2 / ST1 level) earns between £37,000 to £55,000 per year (₹40 - ₹60 Lakhs/yr) with high NHS pension benefits."
      }
    ]
  },
  {
    id: "oet",
    slug: "oet",
    name: "OET (Healthcare)",
    shortName: "OET",
    fullName: "Occupational English Test",
    category: "Medical & Healthcare Licensing",
    heroTagline: "The specialized healthcare English test designed specifically for doctors and nurses for UK, Australia & Ireland licensing.",
    targetPrograms: ["Doctors (PLAB/GMC)", "Nurses (NMC UK & AHPRA Australia)", "Dentists & Pharmacists"],
    targetCountries: ["United Kingdom", "Australia", "Ireland", "New Zealand", "United States", "Canada"],
    overview: "OET assesses the language communication skills of healthcare professionals who seek to register and practice in an English-speaking environment. Test scenarios mirror real hospital consultations, clinical handovers, and patient case notes.",
    feeINR: "₹34,500",
    feeOriginal: "AUD $587 (~₹34,500)",
    duration: "Approx 2 hours 45 minutes",
    formatMode: "OET on Computer at test centers or Paper-based",
    validityYears: 2,
    scoringScale: "Grade A (450-500), B (350-440), C+ (300-340), C (200-290)",
    targetCutoffIndianStudents: "Grade B (350+) in all 4 sub-tests for NMC UK & GMC registration",
    conductingBody: "Cambridge Boxhill Language Assessment (CBLA)",
    frequency: "Offered twice every month in 15+ Indian cities",
    sections: [
      {
        name: "Listening (All Professions)",
        duration: "40 minutes",
        questionsCount: "Part A (Consultations), Part B (Short workplace dialogs), Part C (Lectures)",
        skillsTested: "Clinical dialogue note completion and medical conference comprehension.",
        tips: "Focus on patient symptoms, medication dosages, and medical terminology spelling."
      },
      {
        name: "Reading (All Professions)",
        duration: "60 minutes",
        questionsCount: "Part A (Expeditious reading), Part B (Policy notices), Part C (Articles)",
        skillsTested: "Dosage charts, treatment guidelines, infection control protocols.",
        tips: "In Part A (15 mins), do not read in detail—scan rapidly for numerical and drug data."
      },
      {
        name: "Writing (Profession-Specific)",
        duration: "45 minutes",
        questionsCount: "1 Referral, Transfer, or Discharge letter based on clinical case notes",
        skillsTested: "Selecting relevant medical facts, professional tone, conciseness, and organization.",
        tips: "Select ONLY relevant case notes tailored to the recipient's specialty (e.g. Community Nurse vs Surgeon)."
      },
      {
        name: "Speaking (Profession-Specific)",
        duration: "20 minutes",
        questionsCount: "2 Clinical Role-plays with an interlocutor (Patient or Relative)",
        skillsTested: "Clinical communication criteria: empathy, reassurance, structuring, and information gathering.",
        tips: "Treat the interlocutor as a real patient in distress. Demonstrate professional warmth and clarity."
      }
    ],
    scoreRequirementsByCountry: [
      { country: "United Kingdom (NMC Nursing / GMC Doctors)", flag: "🇬🇧", minRequired: "Grade B in Listening, Reading, Speaking (min C+ in Writing)", competitiveScore: "Grade B across all 4 sub-tests" },
      { country: "Australia (AHPRA Nursing / Medical Board)", flag: "🇦🇺", minRequired: "Grade B in all 4 sub-tests", competitiveScore: "Grade B (Clubbing allowed within 6 months)" },
      { country: "Ireland (NMBI / Medical Council)", flag: "🇮🇪", minRequired: "Grade B in all 4 sub-tests", competitiveScore: "Grade B" }
    ],
    prepRoadmap: [
      { week: "Weeks 1-2", title: "Medical Referral Letter Frameworks", milestone: "Learn standard UK/Australian hospital referral letter formats and case note selection." },
      { week: "Weeks 3-4", title: "Role-Play Scenarios & Patient Empathy", milestone: "Conduct 20 recorded clinical role-plays tackling anxious or non-compliant patients." },
      { week: "Weeks 5-6", title: "Medical Speed Reading & Listening", milestone: "Complete 15 official CBLA mock tests with strict 15-minute Part A timing." }
    ],
    faqs: [
      {
        question: "Why do Indian doctors and nurses prefer OET over IELTS?",
        answer: "OET uses familiar medical and nursing vocabulary rather than general academic topics, making it significantly more intuitive for healthcare professionals to achieve a Grade B."
      },
      {
        question: "What is OET score clubbing for UK NMC registration?",
        answer: "If you score Grade B in 3 sub-tests on your first attempt, you can retake OET within 6 months and combine scores to achieve the required Grade B across all sections."
      },
      {
        question: "Is OET accepted by the US CGFNS for visa credentials?",
        answer: "Yes! The US CGFNS and many US state boards of nursing now accept OET with a minimum score of 350 for VisaScreen certification."
      }
    ]
  },
  {
    id: "duolingo",
    slug: "duolingo",
    name: "Duolingo English Test (DET)",
    shortName: "DET",
    fullName: "Duolingo English Test",
    category: "English Proficiency",
    heroTagline: "The modern, fast, and highly affordable online English test you can take from home anytime, with results delivered in 48 hours.",
    targetPrograms: ["Undergraduate", "Masters in USA & Europe", "Pathway Programs"],
    targetCountries: ["United States", "United Kingdom", "Ireland", "France", "Germany", "Canada"],
    overview: "The Duolingo English Test is an innovative, computer-adaptive language proficiency exam accepted by 5,000+ universities worldwide. Taking only 1 hour from your own computer with a webcam, it provides a cost-effective alternative to traditional tests.",
    feeINR: "₹5,200",
    feeOriginal: "US $65 (~₹5,200)",
    duration: "1 hour",
    formatMode: "Online from home (AI proctored with human verification)",
    validityYears: 2,
    scoringScale: "10 to 160 (5-point increments, with 4 subscores)",
    targetCutoffIndianStudents: "115 - 130 / 160 for Top Tier Admissions",
    conductingBody: "Duolingo, Inc.",
    frequency: "On-demand 24/7/365 from home without prior appointment booking",
    sections: [
      {
        name: "Adaptive Test (Integrated Skills)",
        duration: "45 minutes",
        questionsCount: "Read and Select, Fill in the Blanks, Listen and Type, Read Aloud, Interactive Reading",
        skillsTested: "Literacy, Comprehension, Conversation, and Production subscores.",
        tips: "Keep your eyes on the screen at all times to prevent proctoring flag cancellations."
      },
      {
        name: "Writing & Speaking Sample",
        duration: "10 minutes",
        questionsCount: "3-5 minute video interview response + 3-5 minute writing sample",
        skillsTested: "Spontaneous oral and written discourse sent directly to university admissions officers.",
        tips: "Speak with natural cadence and elaborate with specific real-world examples."
      }
    ],
    scoreRequirementsByCountry: [
      { country: "United States (5,000+ Universities)", flag: "🇺🇸", minRequired: "105 / 160", competitiveScore: "120 - 135 (Ivy League & Top 50)" },
      { country: "Ireland (All Public Universities)", flag: "🇮🇪", minRequired: "110 / 160", competitiveScore: "120+ (Trinity College, UCD)" },
      { country: "United Kingdom", flag: "🇬🇧", minRequired: "105 / 160", competitiveScore: "115 - 125 (Top UK Unis)" }
    ],
    prepRoadmap: [
      { week: "Week 1", title: "Practice Free Mocks & System Setup", milestone: "Test webcam, microphone, and take 5 official free 45-minute sample tests on duolingo.com." },
      { week: "Week 2", title: "Interactive Reading & Vocabulary Drills", milestone: "Master real vs pseudo-word identification and passage sentence completion." },
      { week: "Week 3", title: "Speaking Sample Timed Drills", milestone: "Practice 60-90 second photo descriptions and argumentative speaking topics." }
    ],
    faqs: [
      {
        question: "Can I take the Duolingo English Test from home in India?",
        answer: "Yes! You only need a computer with a webcam, microphone, and a quiet, well-lit private room with stable internet."
      },
      {
        question: "How does a 120 Duolingo score compare to IELTS?",
        answer: "A score of 120-125 on the Duolingo English Test corresponds approximately to a 7.0 band score on IELTS Academic."
      },
      {
        question: "How quickly are DET scores delivered?",
        answer: "Official certified results are delivered online within 48 hours and can be shared with unlimited universities for free."
      }
    ]
  }
];
