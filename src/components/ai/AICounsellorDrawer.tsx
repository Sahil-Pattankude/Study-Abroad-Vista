"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  X,
  Send,
  Sparkles,
  User,
  RefreshCw,
  PhoneCall,
  Lock,
  ArrowRight,
} from "lucide-react";
import { AIChatMessage } from "@/types";
import { useAuth } from "@/lib/auth/AuthContext";

interface AICounsellorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLeadModal?: () => void;
  onOpenAuthModal?: () => void;
  initialQuery?: string;
}

export function AICounsellorDrawer({
  isOpen,
  onClose,
  onOpenLeadModal,
  onOpenAuthModal,
  initialQuery,
}: AICounsellorDrawerProps) {
  const { user, isLoggedIn } = useAuth();
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "initial",
      role: "model",
      text: "Namaste! I am your StudyAbroad Vista AI Counsellor. Ask me anything about universities, free tuition in Germany, NMC-compliant MBBS, visa rules, or post-study work rights across 19 destinations.",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState(initialQuery || "");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
    }
  }, [initialQuery]);

  const suggestedQuestions = [
    "Which European countries have free tuition?",
    "Best NMC-compliant MBBS universities?",
    "How does Germany Ausbildung dual training work?",
    "Top MS in Computer Science under ₹25 Lakhs?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (userText: string) => {
    if (!isLoggedIn) {
      onOpenAuthModal?.();
      return;
    }
    if (!userText.trim() || loading) return;

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/counselor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();

      const modelMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text:
          data.reply ||
          data.fallback ||
          "I am processing your query. Please ask again or book a consultation.",
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: "I experienced a connection glitch. Please check your internet or connect with our human counsellor.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
      <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-all sm:rounded-l-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#102C57] px-6 py-4 text-white sm:rounded-tl-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white shadow-xs">
              <Bot className="h-6 w-6 text-[#EA5C2B]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm">Vista AI Counsellor</h3>
                {isLoggedIn ? (
                  <span
                    className="flex h-2 w-2 rounded-full bg-emerald-400"
                    title="Active & Authenticated"
                  />
                ) : (
                  <span
                    className="flex h-2 w-2 rounded-full bg-amber-400"
                    title="Login Required"
                  />
                )}
              </div>
              <p className="text-[10px] text-slate-300">
                {isLoggedIn
                  ? `Active Session: ${user?.name || user?.email}`
                  : "Vista AI Engine • Member Access"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* If user is NOT logged in: Show prominent Lock banner at the top of chat */}
        {!isLoggedIn && (
          <div className="bg-amber-50 border-b border-amber-200 p-4 text-amber-950">
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-200/70 text-amber-900">
                <Lock className="h-4 w-4 text-[#EA5C2B]" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-amber-900">
                  Login Required to Chat
                </h4>
                <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800">
                  AI Counsellor is exclusively available to logged-in students &
                  parents. Sign in or register to unlock unlimited personalized
                  admissions counselling.
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="rounded-lg bg-[#102C57] px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-[#0c2242]"
                  >
                    Sign In →
                  </Link>
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-[11px] font-bold text-[#EA5C2B] hover:bg-amber-100/50"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "model" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#102C57]">
                  <Sparkles className="h-3.5 w-3.5 text-[#EA5C2B]" />
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-2xl p-3.5 leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#102C57] text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span
                  className={`mt-1 block text-[9px] ${
                    m.role === "user" ? "text-slate-300" : "text-slate-500"
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
              {m.role === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs pl-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#EA5C2B]" />
              <span>Analyzing university database...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Suggested Queries:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => {
                  if (!isLoggedIn) {
                    if (onOpenAuthModal) onOpenAuthModal();
                  } else {
                    handleSendMessage(q);
                  }
                }}
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 hover:border-[#102C57] hover:text-[#102C57]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200 p-3 bg-white sm:rounded-bl-3xl">
          {isLoggedIn ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about universities, fees, scholarships..."
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#102C57] focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102C57] text-white transition hover:bg-[#0c2242] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs">
              <div className="flex items-center gap-2 text-slate-500 pl-1">
                <Lock className="h-4 w-4 text-[#EA5C2B]" />
                <span className="text-[11px]">
                  Sign in required to ask questions
                </span>
              </div>
              <Link
                href="/login"
                onClick={onClose}
                className="inline-flex items-center gap-1 rounded-lg bg-[#EA5C2B] px-3 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-[#ff7240]"
              >
                Sign In
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* Quick Lead Capture Trigger */}
          <div className="mt-2 text-center">
            <button
              onClick={() => {
                onClose();
                onOpenLeadModal?.();
              }}
              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#EA5C2B] hover:underline"
            >
              <PhoneCall className="h-3 w-3" />
              Need human guidance? Book a 1-on-1 advisor call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
