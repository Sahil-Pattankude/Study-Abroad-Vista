"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth, UserRole } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const detectRole = (userEmail: string): UserRole => {
    const lower = userEmail.toLowerCase();
    if (lower.includes("consult") || lower.includes("agency") || lower.includes("buyer")) return "buyer";
    if (lower.includes(".edu") || lower.includes(".ac.") || lower.includes("uni") || lower.includes("admissions")) return "university";
    if (lower.includes("admin@studyabroadvista")) return "admin";
    return "student";
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      const userRole = (data.user?.user_metadata?.role as UserRole) || detectRole(email);
      const userName = data.user?.user_metadata?.name || email.split("@")[0].replace(/[._]/g, " ");

      login(email.trim(), userRole, userName, data.user?.id);

      if (userRole === "buyer") {
        router.push("/buyer/dashboard");
      } else if (userRole === "university") {
        router.push("/university/dashboard");
      } else if (userRole === "admin") {
        router.push("/admin");
      } else {
        router.push("/account/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed. Please check credentials.");
      setLoading(false);
    }
  };

  const handleOAuth = (provider: "google" | "linkedin") => {
    login(`student.${provider}@gmail.com`, "student", "Student");
    router.push("/account/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between selection:bg-[#EA5C2B]/15">
      {/* Top Navbar */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-95">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#102C57] text-white shadow-xs">
              <Compass className="h-4 w-4 text-[#EA5C2B]" />
            </div>
            <span className="text-lg font-black tracking-tight text-[#102C57]">
              StudyAbroad<span className="text-[#EA5C2B]">Vista</span>
            </span>
          </Link>
          <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-[#102C57]">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Card - Template T-11 */}
      <main className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/60 text-[#102C57]">
              <Compass className="h-5 w-5 text-[#EA5C2B]" />
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Sign in to your StudyAbroad Vista account
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="mt-5 space-y-2.5">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth("linkedin")}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
            >
              <svg className="h-3.5 w-3.5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              <span>Continue with LinkedIn</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold">
              <span className="bg-white px-2 text-slate-400">or continue with email</span>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          {/* Email + Password Form */}
          <form onSubmit={handleSignIn} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-[11px] font-medium text-[#EA5C2B] hover:underline">
                  Forgot password?
                </Link>
              </div>
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

            <div className="flex items-center gap-2 pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-[#102C57] accent-[#102C57] cursor-pointer"
              />
              <label htmlFor="rememberMe" className="text-[11px] text-slate-500 cursor-pointer select-none">
                Remember this device
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl bg-[#102C57] py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#0c2242] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          {/* Micro Footer inside Card */}
          <div className="mt-5 text-center text-xs text-slate-500">
            <span>Don&apos;t have an account? </span>
            <Link href="/signup" className="font-bold text-[#EA5C2B] hover:underline">
              Sign up →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Protected under Role-Based Access Control (RBAC) & DPDP Act 2023</span>
      </footer>
    </div>
  );
}
