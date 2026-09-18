"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  GraduationCap,
  Briefcase,
  Building2,
  Mail,
  Lock,
  Phone,
  User,
  ArrowRight,
} from "lucide-react";
import { useAuth, UserRole } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { COUNTRIES, UNIVERSITIES } from "@/lib/data/masterData";
import { CountryFlag } from "@/components/ui/CountryFlag";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<"student" | "buyer" | "university">(
    "student",
  );
  const [selectedCountrySlug, setSelectedCountrySlug] = useState("germany");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [password, setPassword] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (role === "university") {
      const lower = val.toLowerCase();
      if (
        lower.includes("holland") ||
        lower.includes("netherland") ||
        lower.endsWith(".nl")
      ) {
        setSelectedCountrySlug("netherlands");
      } else if (
        lower.includes("toronto") ||
        lower.includes("canada") ||
        lower.endsWith(".ca")
      ) {
        setSelectedCountrySlug("canada");
      } else if (
        lower.includes("oxford") ||
        lower.includes("cambridge") ||
        lower.endsWith(".ac.uk") ||
        lower.includes("uk.")
      ) {
        setSelectedCountrySlug("uk");
      } else if (
        lower.includes("melbourne") ||
        lower.includes("sydney") ||
        lower.endsWith(".edu.au")
      ) {
        setSelectedCountrySlug("australia");
      } else if (
        lower.includes("auckland") ||
        lower.includes("otago") ||
        lower.endsWith(".ac.nz")
      ) {
        setSelectedCountrySlug("new-zealand");
      } else if (
        lower.includes("stanford") ||
        lower.includes("harvard") ||
        lower.includes("mit.edu")
      ) {
        setSelectedCountrySlug("usa");
      } else if (lower.includes("tum.de") || lower.includes("germany")) {
        setSelectedCountrySlug("germany");
      } else if (lower.includes("ireland") || lower.endsWith(".ie")) {
        setSelectedCountrySlug("ireland");
      } else if (lower.includes("singapore") || lower.endsWith(".edu.sg")) {
        setSelectedCountrySlug("singapore");
      }
    }
  };

  const handleOrgChange = (val: string) => {
    setOrganization(val);
    if (role === "university") {
      const matched = UNIVERSITIES.find(
        (u) =>
          u.name.toLowerCase() === val.toLowerCase() ||
          u.slug === val.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      );
      if (matched) {
        setSelectedCountrySlug(matched.countrySlug);
      } else {
        const lower = val.toLowerCase();
        if (
          lower.includes("holland") ||
          lower.includes("netherlands") ||
          lower.includes("amsterdam")
        ) {
          setSelectedCountrySlug("netherlands");
        } else if (
          lower.includes("toronto") ||
          lower.includes("canada") ||
          lower.includes("mcgill")
        ) {
          setSelectedCountrySlug("canada");
        } else if (
          lower.includes("oxford") ||
          lower.includes("cambridge") ||
          lower.includes("london")
        ) {
          setSelectedCountrySlug("uk");
        } else if (
          lower.includes("melbourne") ||
          lower.includes("sydney") ||
          lower.includes("monash")
        ) {
          setSelectedCountrySlug("australia");
        } else if (
          lower.includes("auckland") ||
          lower.includes("otago") ||
          lower.includes("zealand")
        ) {
          setSelectedCountrySlug("new-zealand");
        } else if (
          lower.includes("munich") ||
          lower.includes("tum") ||
          lower.includes("heidelberg")
        ) {
          setSelectedCountrySlug("germany");
        }
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!dpdpConsent) {
      setError("Consent under DPDP Act 2023 is required to continue.");
      return;
    }

    setLoading(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    try {
      // 1. Call server API to register user directly into Supabase (auto-confirmed, no verification email)
      const matchedCountryObj = COUNTRIES.find(
        (c) => c.slug === selectedCountrySlug,
      );

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: fullName,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          role,
          phone,
          organization: organization.trim(),
          countrySlug: selectedCountrySlug,
          countryName: matchedCountryObj?.name || "Germany",
          marketingOptIn,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Establish user session
      login(
        email.trim(),
        role as UserRole,
        fullName,
        data.user?.id,
        organization.trim(),
        matchedCountryObj?.name || "Germany",
        {
          organization: organization.trim(),
          country_name: matchedCountryObj?.name || "Germany",
          country_slug: selectedCountrySlug,
        },
      );

      // 3. Immediately sign in on the client side for persistent token
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      // 4. Redirect to respective dashboard per W10
      if (role === "buyer") {
        router.push("/buyer/dashboard");
      } else if (role === "university") {
        router.push("/portal/university");
      } else {
        router.push("/account/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "linkedin") => {
    const fullName = "Student";
    login(`student.${provider}@gmail.com`, role as UserRole, fullName);
    if (role === "buyer") {
      router.push("/buyer/dashboard");
    } else if (role === "university") {
      router.push("/portal/university");
    } else {
      router.push("/account/dashboard");
    }
  };

  const currentCountry = COUNTRIES.find((c) => c.slug === selectedCountrySlug);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-[#EA5C2B]/15">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition hover:opacity-95"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#102C57] text-white shadow-xs">
              <Compass className="h-4 w-4 text-[#EA5C2B]" />
            </div>
            <span className="text-lg font-black tracking-tight text-[#102C57]">
              StudyAbroad<span className="text-[#EA5C2B]">Vista</span>
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-[#102C57] transition hover:bg-slate-50 hover:border-slate-300"
            >
              Sign in
              <ArrowRight className="h-3 w-3 text-[#EA5C2B]" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Join 50,000+ Indian students, verified consultancies, and
              universities.
            </p>
          </div>

          {/* Role Pill Selector */}
          <div className="mt-5 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
                role === "student"
                  ? "bg-white text-[#102C57] font-bold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5 text-[#EA5C2B]" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
                role === "buyer"
                  ? "bg-white text-[#102C57] font-bold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5 text-[#EA5C2B]" />
              <span>Consultant</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("university")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
                role === "university"
                  ? "bg-white text-[#102C57] font-bold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-[#EA5C2B]" />
              <span>University</span>
            </button>
          </div>

          {/* Social OAuth Buttons */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("linkedin")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
            >
              <svg
                className="h-3.5 w-3.5 text-[#0A66C2]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold">
              <span className="bg-white px-2 text-slate-400">
                or continue with email
              </span>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  First Name
                </label>
                <div className="relative rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Last Name
                </label>
                <div className="relative rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10">
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Your surname"
                    className="w-full rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                {role === "university"
                  ? "Institutional Email"
                  : role === "buyer"
                    ? "Work Email"
                    : "Email Address"}
              </label>
              <div className="relative rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder={
                    role === "university"
                      ? "admissions@university.edu"
                      : role === "buyer"
                        ? "director@consultancy.com"
                        : "student@example.com"
                  }
                  className="w-full rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Conditional Org / University & Country Fields */}
            {role !== "student" && (
              <div className="space-y-3">
                {role === "university" && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Country of Institution{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10">
                      <CountryFlag
                        code={currentCountry?.code || "DE"}
                        name={currentCountry?.name}
                        size="sm"
                      />
                      <select
                        aria-label="Select country of institution"
                        value={selectedCountrySlug}
                        onChange={(e) => setSelectedCountrySlug(e.target.value)}
                        className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pl-2"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name} ({c.tier})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {role === "buyer"
                      ? "Consultancy / Agency Name"
                      : "University / College Name"}
                  </label>
                  <div className="relative rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10">
                    <input
                      type="text"
                      required
                      list={
                        role === "university" ? "university-options" : undefined
                      }
                      value={organization}
                      onChange={(e) => handleOrgChange(e.target.value)}
                      placeholder={
                        role === "buyer"
                          ? "Apex Global Admissions"
                          : "e.g. Holland University, University of Toronto..."
                      }
                      className="w-full rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                    {role === "university" && (
                      <datalist id="university-options">
                        {UNIVERSITIES.map((u) => (
                          <option key={u.id} value={u.name}>
                            {u.city}, {u.country}
                          </option>
                        ))}
                      </datalist>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Phone Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                WhatsApp / Mobile Number
              </label>
              <div className="relative flex rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10">
                <span className="flex items-center pl-3 pr-2 text-xs font-semibold text-slate-500 border-r border-slate-100">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  className="w-full rounded-r-lg py-2 px-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Password (Min. 8 characters)
              </label>
              <div className="relative rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            {/* DPDP Consent */}
            <div className="space-y-2 pt-1">
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={dpdpConsent}
                  onChange={(e) => setDpdpConsent(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#102C57] accent-[#102C57] cursor-pointer"
                />
                <span className="text-[11px] leading-tight text-slate-500">
                  I agree to the{" "}
                  <span className="text-slate-800 font-medium underline">
                    Terms
                  </span>{" "}
                  &{" "}
                  <span className="text-slate-800 font-medium underline">
                    Privacy Policy
                  </span>
                  , consenting to academic data processing under the{" "}
                  <strong className="text-slate-700 font-semibold">
                    DPDP Act 2023
                  </strong>
                  . <span className="text-rose-500 font-bold">*</span>
                </span>
              </label>

              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#102C57] accent-[#102C57] cursor-pointer"
                />
                <span className="text-[11px] leading-tight text-slate-500">
                  Send scholarship deadlines, intake alerts, and visa updates
                  via WhatsApp (Optional).
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#EA5C2B] py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#d94f20] active:scale-[0.99] disabled:opacity-50"
            >
              {loading
                ? "Creating account..."
                : `Create ${role === "student" ? "Student" : role === "buyer" ? "Consultant" : "University"} Account →`}
            </button>
          </form>

          {/* Micro Footer inside Card */}
          <div className="mt-5 text-center text-xs text-slate-500">
            <span>Already have an account? </span>
            <Link
              href="/login"
              className="font-bold text-[#102C57] hover:underline"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-3 text-center text-[11px] text-slate-400">
        © 2026 StudyAbroad Vista • Protected by 256-bit Encryption & Supabase
        Auth
      </footer>
    </div>
  );
}
