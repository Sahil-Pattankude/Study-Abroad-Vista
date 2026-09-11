"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, Lock, ArrowRight, ShieldCheck, CheckCircle2, Loader2, AlertCircle, Eye, EyeOff, Mail } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please provide your account email.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Failed to update password. Please check your email.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "Failed to update password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
      {!success ? (
        <>
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              Set New Password
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              Create a new secure password for your account.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleReset} className="mt-5 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Account Email
              </label>
              <div className="relative rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10 flex items-center">
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
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                New Password (min. 8 characters)
              </label>
              <div className="relative rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10 flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#102C57] py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#0c2242] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating password...</span>
                </>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </>
      ) : (
        /* Success View */
        <div className="text-center py-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h2 className="mt-4 text-xl font-black text-slate-900">
            Password Updated!
          </h2>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Your password has been successfully reset. You can now log in to your account with your new password.
          </p>

          <div className="mt-6">
            <Link
              href="/login"
              className="w-full inline-block rounded-xl bg-[#102C57] py-2.5 text-xs font-bold text-white hover:bg-[#0c2242] transition shadow-md"
            >
              Sign In Now →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
          <Link href="/login" className="text-xs font-semibold text-slate-500 hover:text-[#102C57]">
            ← Back to Sign In
          </Link>
        </div>
      </header>

      {/* Main Card wrapped in Suspense for useSearchParams */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <Suspense fallback={
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#102C57]" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Secured via Supabase Auth & DPDP Act 2023 End-to-End Encryption</span>
      </footer>
    </div>
  );
}
