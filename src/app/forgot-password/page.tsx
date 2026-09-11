"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Mail, ArrowRight, ShieldCheck, CheckCircle2, ArrowLeft, Loader2, AlertCircle, KeyRound, ExternalLink } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [actionLink, setActionLink] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [directResetUrl, setDirectResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "No account found with this email. Please check spelling or create an account.");
        setLoading(false);
        return;
      }

      setActionLink(data.actionLink || "");
      setEmailOtp(data.emailOtp || "");
      setDirectResetUrl(data.directResetUrl || `/reset-password?email=${encodeURIComponent(email.trim())}`);
      setSubmitted(true);
      setLoading(false);
      setResendCooldown(60);

      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Failed to generate password reset request. Please try again.");
      setLoading(false);
    }
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
          <Link href="/login" className="text-xs font-semibold text-slate-500 hover:text-[#102C57] flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          {!submitted ? (
            <>
              {/* Header */}
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 border border-orange-200/60 text-[#EA5C2B]">
                  <Mail className="h-6 w-6" />
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  Forgot Password?
                </h1>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  Enter your registered account email and we&apos;ll send you instructions to reset your password.
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
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative rounded-lg border border-slate-200 bg-white transition focus-within:border-[#102C57] focus-within:ring-2 focus-within:ring-[#102C57]/10">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@studyabroadvista.com or student@example.com"
                      className="w-full rounded-lg py-2.5 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
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
                      <span>Verifying account...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Password Reset Link</span>
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
                Reset Link Verified!
              </h2>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                A secure password reset link was generated for:
              </p>
              <p className="mt-1 text-xs font-bold text-[#102C57] bg-slate-100 py-1.5 px-3 rounded-lg font-mono">
                {email}
              </p>

              {/* Instant Reset Action Button */}
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <KeyRound className="h-4 w-4 text-emerald-700" />
                  <span>Direct Password Reset Available</span>
                </div>
                <p className="mt-1 text-[11px] text-emerald-800">
                  Click below to set your new password immediately.
                </p>
                <Link
                  href={directResetUrl}
                  className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#EA5C2B] py-2 text-xs font-bold text-white shadow-sm hover:bg-[#d94f20] transition"
                >
                  <span>Set New Password Now →</span>
                </Link>
              </div>

              {emailOtp && (
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Verification OTP Code</span>
                  <span className="font-mono font-bold text-slate-800 text-sm tracking-widest">{emailOtp}</span>
                </div>
              )}

              <div className="mt-5 flex flex-col gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading || resendCooldown > 0}
                  className="w-full rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition cursor-pointer"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Link"}
                </button>

                <Link
                  href="/login"
                  className="w-full rounded-xl bg-slate-100 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* Footer Back Link */}
          {!submitted && (
            <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
              <span>Remembered your password? </span>
              <Link href="/login" className="font-bold text-[#EA5C2B] hover:underline">
                Sign in →
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-3 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Secured via Supabase Auth & DPDP Act 2023 End-to-End Encryption</span>
      </footer>
    </div>
  );
}
