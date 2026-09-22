"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Users,
  Target,
  FileText,
  Lock,
  Phone,
  Mail,
  Award,
  Sparkles,
  Clock,
  ChevronRight,
  Check,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/auth/AuthContext";
import { CountryFlag } from "@/components/ui/CountryFlag";

export default function PartnerWithUsPage() {
  const router = useRouter();
  const { login } = useAuth();

  // Wizard state: 1: Identity & GST, 2: Agency Scope, 3: Agreement, 4: Wallet & Targeting
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Business Identity
  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [city, setCity] = useState("Mumbai");
  const [stateName, setStateName] = useState("Maharashtra");

  // Step 2: Agency Scope
  const [yearsInBusiness, setYearsInBusiness] = useState("5-10 Years");
  const [annualStudentVolume, setAnnualStudentVolume] =
    useState("100-300 Students");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    "germany",
    "usa",
    "uk",
    "canada",
  ]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([
    "ms",
    "mba",
    "bachelors",
  ]);

  // Step 3: Agreement
  const [acceptedMsa, setAcceptedMsa] = useState(false);
  const [acceptedSla, setAcceptedSla] = useState(false);

  // Step 4: Wallet Deposit & Targeting
  const [initialDeposit, setInitialDeposit] = useState<number>(25000);
  const [dailyLeadCap, setDailyLeadCap] = useState<number>(10);
  const [minLeadScore, setMinLeadScore] = useState<number>(75);
  const [autoUnlock, setAutoUnlock] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleCountry = (slug: string) => {
    setSelectedCountries((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    );
  };

  const toggleProgram = (prog: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(prog) ? prev.filter((p) => p !== prog) : [...prev, prog],
    );
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactEmail.trim() || !contactPhone.trim()) {
      setErrorMsg("Please fill all required business and contact details.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCountries.length === 0) {
      setErrorMsg("Please select at least one target country destination.");
      return;
    }
    setErrorMsg("");
    setStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedMsa || !acceptedSla) {
      setErrorMsg(
        "You must accept the Master Service Agreement and Data SLA to proceed.",
      );
      return;
    }
    setErrorMsg("");
    setStep(4);
  };

  const handleFinalOnboarding = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Save targeting rules to localStorage for persistence
      const targetingRules = {
        countries: selectedCountries,
        programs: selectedPrograms,
        minLeadScore,
        dailyLeadCap,
        autoUnlock,
        operatingHours: "09:00 - 19:00 IST",
        companyName,
        gstin: gstin || "27AABCU9603R1ZM",
        pan: panNumber || "AABCU9603R",
      };
      localStorage.setItem(
        "vista_buyer_targeting",
        JSON.stringify(targetingRules),
      );

      // 2. Save initial wallet state
      const initialWallet = {
        balance: initialDeposit,
        transactions: [
          {
            id: `tx-init-${Date.now()}`,
            type: "credit",
            description: "Initial Onboarding Wallet Deposit (Online Transfer)",
            amount: initialDeposit,
            date: new Date().toISOString(),
            status: "Completed",
            invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          },
        ],
      };
      localStorage.setItem("vista_buyer_wallet", JSON.stringify(initialWallet));

      // 3. Log in as B2B Buyer
      login(
        contactEmail,
        "buyer",
        contactName || `${companyName} Representative`,
        undefined,
        companyName,
        "India",
        {
          gstin,
          pan: panNumber,
          city,
          state: stateName,
          deposit: initialDeposit,
        },
      );

      // 4. Redirect to B2B portal
      router.push("/portal/buyer");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to complete onboarding.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-[#EA5C2B]/15">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3.5 py-1 text-xs font-bold text-[#102C57]">
              <Building2 className="h-3.5 w-3.5 text-[#EA5C2B]" />
              <span>B2B Admission Consultant Onboarding [FR-BUY-001]</span>
            </div>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102C57] tracking-tight">
              Partner with StudyAbroad Vista
            </h1>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Access 100% OTP-verified Indian student leads with high study
              intent, clear academic budgets, and comprehensive profile
              parameters.
            </p>

            {/* 4-Step Progress Indicator */}
            <div className="mt-8 grid grid-cols-4 gap-2 text-left">
              {[
                { num: 1, title: "Business Identity", desc: "GST & KYC" },
                { num: 2, title: "Agency Scope", desc: "Countries & Tracks" },
                { num: 3, title: "Service SLA", desc: "Agreement" },
                { num: 4, title: "Wallet & Rules", desc: "Launch" },
              ].map((s) => (
                <div
                  key={s.num}
                  className={`rounded-xl border p-3 transition ${
                    step === s.num
                      ? "border-[#102C57] bg-white shadow-sm ring-1 ring-[#102C57]"
                      : step > s.num
                        ? "border-emerald-200 bg-emerald-50/60 text-emerald-900"
                        : "border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider">
                      Step {s.num}
                    </span>
                    {step > s.num ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <span className="text-xs font-bold">{s.num}/4</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-900 truncate">
                    {s.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step Form Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm">
            {/* STEP 1: Business Identity & KYC */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#102C57]">
                    1. Business Identity & Verification
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your consultancy registration, GSTIN, and primary
                    contact officer details.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Registered Company / Agency Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Overseas Educational Consultants Pvt Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      GSTIN Identification Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 27AABCU9603R1ZM"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none uppercase"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Required for GST tax invoicing & input credit claims.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Company PAN Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AABCU9603R"
                      value={panNumber}
                      onChange={(e) =>
                        setPanNumber(e.target.value.toUpperCase())
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Authorized Contact Person *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Singhal (Lead Director)"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Official Work Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="consultant@apexoverseas.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Contact Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Headquarters City & State
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="City (e.g. Pune)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 text-slate-900 font-semibold focus:border-[#102C57] focus:bg-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="State (e.g. Maharashtra)"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3 text-slate-900 font-semibold focus:border-[#102C57] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-[#102C57] py-3 px-6 text-xs font-bold text-white hover:bg-[#0c2242] transition shadow-md"
                  >
                    <span>Proceed to Agency Scope</span>
                    <ArrowRight className="h-4 w-4 text-[#EA5C2B]" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Agency Scope & Target Markets */}
            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#102C57]">
                    2. Agency Operational Scope
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select your core destination focus and degree streams to
                    match with incoming student leads.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Years in Study Abroad Consulting
                    </label>
                    <select
                      value={yearsInBusiness}
                      onChange={(e) => setYearsInBusiness(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                    >
                      <option value="1-3 Years">1 - 3 Years</option>
                      <option value="3-5 Years">3 - 5 Years</option>
                      <option value="5-10 Years">5 - 10 Years</option>
                      <option value="10+ Years">
                        10+ Years (Established Agency)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Annual Student Enrolment Volume
                    </label>
                    <select
                      value={annualStudentVolume}
                      onChange={(e) => setAnnualStudentVolume(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                    >
                      <option value="50-100 Students">
                        50 - 100 Students / year
                      </option>
                      <option value="100-300 Students">
                        100 - 300 Students / year
                      </option>
                      <option value="300-1000 Students">
                        300 - 1,000 Students / year
                      </option>
                      <option value="1000+ Students">
                        1,000+ Students / year (National Chain)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Target Countries */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">
                    Primary Target Countries (Select all that apply) *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {[
                      { slug: "germany", name: "Germany" },
                      { slug: "usa", name: "United States" },
                      { slug: "uk", name: "United Kingdom" },
                      { slug: "canada", name: "Canada" },
                      { slug: "australia", name: "Australia" },
                      { slug: "ireland", name: "Ireland" },
                      { slug: "france", name: "France" },
                      { slug: "italy", name: "Italy" },
                      { slug: "netherlands", name: "Netherlands" },
                      { slug: "new-zealand", name: "New Zealand" },
                      { slug: "uzbekistan", name: "Uzbekistan (MBBS)" },
                      { slug: "georgia", name: "Georgia (MBBS)" },
                    ].map((c) => {
                      const isSelected = selectedCountries.includes(c.slug);
                      return (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => toggleCountry(c.slug)}
                          className={`flex items-center gap-2 rounded-xl p-2.5 text-left text-xs font-bold transition border ${
                            isSelected
                              ? "border-[#102C57] bg-[#102C57] text-white shadow-xs"
                              : "border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <CountryFlag code={c.slug} size="sm" />
                          <span className="truncate">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Program Streams */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">
                    Degree Disciplines Offered
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { key: "ms", label: "Master's (MS/MSc)" },
                      { key: "mba", label: "MBA & Executive MBA" },
                      { key: "bachelors", label: "Bachelor's Degrees" },
                      { key: "mbbs", label: "Medical (MBBS / MD)" },
                      {
                        key: "ausbildung",
                        label: "Ausbildung (Vocational DE)",
                      },
                      { key: "nursing", label: "Nursing & Healthcare" },
                    ].map((p) => {
                      const isSelected = selectedPrograms.includes(p.key);
                      return (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => toggleProgram(p.key)}
                          className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-bold transition border ${
                            isSelected
                              ? "border-[#EA5C2B] bg-[#EA5C2B] text-white shadow-xs"
                              : "border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <span>{p.label}</span>
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-[#102C57] py-3 px-6 text-xs font-bold text-white hover:bg-[#0c2242] transition shadow-md"
                  >
                    <span>Proceed to Agreement</span>
                    <ArrowRight className="h-4 w-4 text-[#EA5C2B]" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Master Service Agreement & SLA */}
            {step === 3 && (
              <form onSubmit={handleStep3Submit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#102C57]">
                    3. B2B Partner Master Service Agreement (MSA)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Review and electronically sign our B2B lead generation &
                    consumer protection standards.
                  </p>
                </div>

                {/* Agreement Terms Box */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-xs text-slate-700 space-y-3 max-h-64 overflow-y-auto leading-relaxed">
                  <h4 className="font-bold text-slate-900">
                    Terms of B2B Lead Delivery & Data Protection:
                  </h4>
                  <p>
                    <strong>1. 100% OTP Verification Guarantee:</strong>{" "}
                    StudyAbroad Vista guarantees that all leads dispatched to
                    the Buyer have completed mandatory SMS/WhatsApp OTP mobile
                    verification at the point of inquiry submission.
                  </p>
                  <p>
                    <strong>2. 24-Hour Dispute Resolution:</strong> If a student
                    provided an unreachable phone number or is fundamentally
                    mismatched with the buyer&apos;s targeting criteria, the
                    Buyer may file a 1-click dispute within 72 hours. Approved
                    disputes are 100% credited back to the Buyer&apos;s wallet
                    within 24 hours.
                  </p>
                  <p>
                    <strong>3. Data Privacy & DPDP Compliance:</strong> In
                    accordance with India&apos;s Digital Personal Data
                    Protection (DPDP) Act, Buyer agrees to contact the student
                    exclusively for international admissions advisory and shall
                    not resell or distribute student data to unauthorized third
                    parties.
                  </p>
                  <p>
                    <strong>4. Exclusivity & Fair Practice:</strong> Shared
                    leads are distributed to a maximum of 3 verified
                    consultants; Semi-Exclusive leads to a maximum of 2;
                    Exclusive leads are dispatched exclusively to 1 buyer.
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedMsa}
                      onChange={(e) => setAcceptedMsa(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-[#102C57] cursor-pointer"
                    />
                    <span>
                      I have read and accept the{" "}
                      <strong>
                        StudyAbroad Vista B2B Master Service Agreement
                      </strong>{" "}
                      and commercial terms.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedSla}
                      onChange={(e) => setAcceptedSla(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-[#102C57] cursor-pointer"
                    />
                    <span>
                      I agree to the <strong>24-Hour Lead Response SLA</strong>{" "}
                      and DPDP compliant student data handling guidelines.
                    </span>
                  </label>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-[#102C57] py-3 px-6 text-xs font-bold text-white hover:bg-[#0c2242] transition shadow-md"
                  >
                    <span>Proceed to Wallet Setup</span>
                    <ArrowRight className="h-4 w-4 text-[#EA5C2B]" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Initial Wallet Setup & Targeting Launch */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#102C57]">
                    4. Initial Wallet Setup & Targeting Rules
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select your initial balance deposit and set your daily
                    delivery guardrails.
                  </p>
                </div>

                {/* Wallet Deposit Presets */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-2">
                    Choose Initial Wallet Deposit
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        amount: 10000,
                        label: "Starter Pack",
                        bonus: "Standard CPL (₹1,500/lead)",
                      },
                      {
                        amount: 25000,
                        label: "Growth Pack (Popular)",
                        bonus: "Includes 15% Bonus Credits",
                      },
                      {
                        amount: 50000,
                        label: "Enterprise Scale",
                        bonus: "Dedicated Account Manager + Priority Leads",
                      },
                    ].map((w) => (
                      <button
                        key={w.amount}
                        type="button"
                        onClick={() => setInitialDeposit(w.amount)}
                        className={`rounded-2xl p-4 text-left transition border ${
                          initialDeposit === w.amount
                            ? "border-[#102C57] bg-[#102C57] text-white shadow-md ring-2 ring-[#EA5C2B]"
                            : "border-slate-200 bg-slate-50/70 text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <div className="text-lg font-black tracking-tight">
                          ₹{w.amount.toLocaleString("en-IN")}
                        </div>
                        <p
                          className={`text-xs font-bold mt-1 ${initialDeposit === w.amount ? "text-orange-300" : "text-[#102C57]"}`}
                        >
                          {w.label}
                        </p>
                        <p
                          className={`text-[10px] mt-1 ${initialDeposit === w.amount ? "text-slate-300" : "text-slate-500"}`}
                        >
                          {w.bonus}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Guardrails */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Daily Lead Delivery Cap
                    </label>
                    <select
                      value={dailyLeadCap}
                      onChange={(e) => setDailyLeadCap(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                    >
                      <option value={5}>5 Leads / Day (~₹7,500/day)</option>
                      <option value={10}>10 Leads / Day (~₹15,000/day)</option>
                      <option value={20}>20 Leads / Day (~₹30,000/day)</option>
                      <option value={50}>50 Leads / Day (High Volume)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Minimum Lead Quality Score Threshold
                    </label>
                    <select
                      value={minLeadScore}
                      onChange={(e) => setMinLeadScore(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                    >
                      <option value={60}>Score ≥ 60 (Broader Pool)</option>
                      <option value={75}>
                        Score ≥ 75 (Recommended - High Intent)
                      </option>
                      <option value={85}>
                        Score ≥ 85 (Top-Tier Academic Profiles)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Auto Unlock Toggle */}
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <div>
                    <p className="text-xs font-bold text-[#102C57]">
                      Instant Auto-Unlock Matching Leads
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Automatically debit wallet and dispatch contact details to
                      your team immediately upon verification.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoUnlock}
                    onChange={(e) => setAutoUnlock(e.target.checked)}
                    className="h-5 w-5 rounded accent-[#102C57] cursor-pointer"
                  />
                </div>

                {/* Summary & Launch Button */}
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-xl border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalOnboarding}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-xl bg-[#EA5C2B] py-3.5 px-8 text-xs font-bold text-white hover:bg-[#d94f20] transition shadow-lg active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Launching Workspace...</span>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Complete Onboarding & Enter Portal →</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
