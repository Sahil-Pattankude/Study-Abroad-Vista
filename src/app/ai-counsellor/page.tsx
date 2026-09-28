"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Send,
  Sparkles,
  User,
  PhoneCall,
  Lock,
  ArrowRight,
  RotateCcw,
  Compass,
  Building2,
  Calculator,
  Bookmark,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  Mail,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { AIChatMessage } from "@/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { getSavedShortlist } from "@/lib/cookies/shortlist";
import { getContextAwareGreeting } from "@/lib/gemini/counsellorKnowledge";
import {
  AIChatActionCard,
  parseMessageActions,
} from "@/components/ai/AIChatActionCard";
import { LeadModal } from "@/components/lead/LeadModal";

const CATEGORIZED_QUESTIONS = [
  {
    category: "Tuition-Free & Low Budget",
    questions: [
      "Which European countries offer €0 or free tuition?",
      "How does Germany's €11,904 blocked account work?",
      "What is Italy's DSU 100% scholarship eligibility?",
      "How does Germany Ausbildung dual training with monthly stipend work?",
    ],
  },
  {
    category: "NMC-Compliant MBBS Abroad",
    questions: [
      "Which MBBS countries are 100% NMC FMGL compliant?",
      "What is the total 6-year MBBS cost in Russia vs Georgia?",
      "Is NEET qualification mandatory to study MBBS abroad?",
      "How does NEXT licensing exam work for foreign medical graduates?",
    ],
  },
  {
    category: "USA, UK & High-ROI STEM",
    questions: [
      "Which US master's degrees offer 3-year STEM OPT extensions?",
      "Top UK universities for MS Computer Science under ₹20 Lakhs?",
      "What are the Post-Study Work Visa rules in Ireland and Australia?",
      "What are the average GRE and IELTS score requirements?",
    ],
  },
];

export default function AICounsellorFullPage() {
  const { user, isLoggedIn, logout } = useAuth();
  const [sessionId, setSessionId] = useState<string>("");
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Germany");

  // Initialize session ID
  useEffect(() => {
    const existing = sessionStorage.getItem("vista_counsellor_session_id");
    if (existing) {
      setSessionId(existing);
    } else {
      const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("vista_counsellor_session_id", newId);
      setSessionId(newId);
    }
  }, []);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "initial",
      role: "model",
      text: getContextAwareGreeting("/ai-counsellor"),
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Progressive Lead Capture State (FR-AI-005)
  const [showLevel2LeadCapture, setShowLevel2LeadCapture] = useState(false);
  const [level2Captured, setLevel2Captured] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadName, setLeadName] = useState("");
  const [showLevel3Consultation, setShowLevel3Consultation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // [FR-AI-004] Auto-save conversation to database
  const persistConversation = async (
    currentMessages: AIChatMessage[],
    leadLevel = 1,
  ) => {
    if (!sessionId || currentMessages.length <= 1) return;
    try {
      await fetch("/api/ai/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userEmail: user?.email || (leadEmail ? leadEmail : null),
          userName: user?.name || (leadName ? leadName : null),
          userId: user?.id,
          pageContext: { url: "/ai-counsellor" },
          messages: currentMessages,
          leadLevel,
        }),
      });
    } catch (e) {
      console.warn("Auto-save conversation error:", e);
    }
  };

  const handleClearChat = () => {
    const freshId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("vista_counsellor_session_id", freshId);
    setSessionId(freshId);

    setMessages([
      {
        id: "initial-" + Date.now(),
        role: "model",
        text: getContextAwareGreeting("/ai-counsellor"),
        timestamp: "Just now",
      },
    ]);
    setShowLevel2LeadCapture(false);
    setShowLevel3Consultation(false);
  };

  const handleSaveLevel2Lead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    setLevel2Captured(true);
    await persistConversation(messages, 2);
  };

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
      timestamp: "Just now",
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const userMessageCount = updatedMessages.filter(
      (m) => m.role === "user",
    ).length;
    if (userMessageCount >= 5 && !level2Captured && !user?.email) {
      setShowLevel2LeadCapture(true);
    }
    if (userMessageCount >= 10) {
      setShowLevel3Consultation(true);
    }

    const savedShortlist = getSavedShortlist();

    const placeholderModelMsg: AIChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "model",
      text: "",
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, placeholderModelMsg]);

    try {
      // [FR-AI-007] Streaming fetch
      const response = await fetch("/api/ai/counselor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: updatedMessages.slice(-8).map((m) => ({
            role: m.role,
            text: m.text,
          })),
          pageContext: {
            url: "/ai-counsellor",
          },
          userProfile: {
            name: user?.name || leadName,
            email: user?.email || leadEmail,
          },
          shortlist: savedShortlist,
          stream: true,
        }),
      });

      const leadCaptureHeader = response.headers.get("X-Lead-Capture");
      if (leadCaptureHeader === "true") {
        setShowLevel3Consultation(true);
      }

      if (!response.body) {
        throw new Error("No stream body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        setMessages((prev) => {
          const newArr = [...prev];
          const last = newArr[newArr.length - 1];
          if (last && last.role === "model") {
            last.text = accumulatedText;
          }
          return newArr;
        });
      }

      const finalMessages = [
        ...updatedMessages,
        {
          id: (Date.now() + 1).toString(),
          role: "model" as const,
          text:
            accumulatedText ||
            "How else can I assist your study abroad roadmap?",
          timestamp: "Just now",
        },
      ];

      persistConversation(
        finalMessages,
        showLevel3Consultation ? 3 : showLevel2LeadCapture ? 2 : 1,
      );
    } catch {
      setMessages((prev) => {
        const newArr = [...prev];
        const last = newArr[newArr.length - 1];
        if (last && last.role === "model" && !last.text) {
          last.text =
            "I experienced a brief connection glitch. Please try asking your question again or connect with our human counsellor.";
        }
        return newArr;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102C57] text-white">
                <Compass className="h-5 w-5 text-[#EA5C2B]" />
              </div>
              <span className="text-lg font-black text-[#102C57]">
                StudyAbroad<span className="text-[#EA5C2B]">Vista</span>
              </span>
            </Link>
            <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-800">
                <Bot className="h-3.5 w-3.5 text-[#EA5C2B]" /> AI Counsellor
              </span>
              <span className="text-xs text-slate-500">
                Gemini 3.8-Flash • 19 Destinations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/counsellor-chats"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#EA5C2B]" />
                  Saved Chats
                </Link>
                <Link
                  href="/dashboard/student"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#102C57] px-3 py-1.5 font-bold text-white hover:bg-[#0c2242] transition"
                >
                  <User className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-[#EA5C2B] px-3.5 py-1.5 font-bold text-white shadow-xs hover:bg-[#d44d1f] transition"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main 2-Column Full Screen Workspace */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 overflow-hidden p-2 sm:p-4 gap-4">
        {/* Main Chat Stream (Left / Center) */}
        <div className="flex flex-1 flex-col rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Subheader */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-[#102C57] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                <Bot className="h-4 w-4 text-[#EA5C2B]" />
              </div>
              <div>
                <h2 className="text-xs font-extrabold sm:text-sm">
                  Personalized Admissions & Visa Assistant
                </h2>
                <p className="text-[10px] text-slate-300">
                  Live vector RAG knowledge from Supabase & verified regulations
                </p>
              </div>
            </div>
            {messages.length > 1 && (
              <button
                onClick={handleClearChat}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
            {messages.map((m) => {
              const { cleanText, actions } = parseMessageActions(m.text);

              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "model" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#102C57] shadow-xs">
                      <Sparkles className="h-4 w-4 text-[#EA5C2B]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                      m.role === "user"
                        ? "bg-[#102C57] text-white"
                        : "border border-slate-200 bg-slate-50/80 text-slate-800"
                    }`}
                  >
                    <div className="whitespace-pre-line text-xs sm:text-sm leading-relaxed space-y-2">
                      {cleanText}
                    </div>

                    {/* Action Cards (FR-AI-006) */}
                    {actions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {actions.map((act, aIdx) => (
                          <AIChatActionCard
                            key={aIdx}
                            action={act}
                            onOpenLeadModal={(cntry) => {
                              setSelectedCountry(cntry || "Germany");
                              setLeadModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <span
                      className={`mt-2 block text-[10px] ${
                        m.role === "user" ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>

                  {m.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 shadow-xs">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs pl-2">
                <span className="flex h-2.5 w-2.5 animate-ping rounded-full bg-[#EA5C2B]"></span>
                <span>Thinking & querying verified university catalog...</span>
              </div>
            )}

            {/* Level 2 Lead Capture (FR-AI-005) */}
            {showLevel2LeadCapture && !level2Captured && !user?.email && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 p-4 text-indigo-950 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#102C57] text-white">
                    <Mail className="h-4 w-4 text-[#EA5C2B]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-[#102C57]">
                      Save this Consultation & University Shortlist
                    </h4>
                    <p className="text-xs text-indigo-800 mt-0.5">
                      Enter your details to receive this entire transcript,
                      admission checklist, and scholarship links in your inbox.
                    </p>
                    <form
                      onSubmit={handleSaveLevel2Lead}
                      className="mt-3 flex flex-col sm:flex-row gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Your Full Name"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs text-slate-800"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Your Email Address"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="flex-1 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs text-slate-800"
                        required
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-[#102C57] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c2242] transition"
                      >
                        Save Transcript →
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {level2Captured && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Transcript and tailored recommendations will be emailed to{" "}
                  {leadEmail || user?.email}
                </span>
              </div>
            )}

            {/* Level 3 Lead Capture (FR-AI-005) */}
            {showLevel3Consultation && (
              <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4 text-slate-800 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EA5C2B] text-white">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                      Need 1-on-1 Profile Review & Visa Filing Support?
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Schedule a dedicated video/phone consultation with an
                      authorized senior counsellor.
                    </p>
                    <button
                      onClick={() => setLeadModalOpen(true)}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#EA5C2B] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#d44d1f] transition"
                    >
                      Book 1-on-1 Counsellor Session
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="border-t border-slate-200 p-3 sm:p-4 bg-white">
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
                  placeholder="Ask about universities, scholarships, tuition fees in ₹ Lakhs, visa rules..."
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#102C57] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#102C57] text-white transition hover:bg-[#0c2242] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Lock className="h-4 w-4 text-[#EA5C2B]" />
                  <span>
                    Free account required to chat with Gemini 3.8-Flash AI
                    Counsellor
                  </span>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 rounded-lg bg-[#EA5C2B] px-4 py-2 font-bold text-white shadow-xs hover:bg-[#d44d1f]"
                >
                  Sign In to Chat
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar with Categorized Questions & Tools (Right Column) */}
        <div className="hidden w-80 lg:flex flex-col gap-4 overflow-y-auto">
          {/* Quick Action Tools */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#102C57] flex items-center gap-1.5 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-[#EA5C2B]" /> Quick Tools
            </h3>
            <div className="space-y-2">
              <Link
                href="/cost-calculator"
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 hover:border-emerald-200 hover:bg-emerald-50/50 transition group"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-800">
                    Cost Calculator
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-700 transition" />
              </Link>
              <Link
                href="/universities"
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 hover:border-indigo-200 hover:bg-indigo-50/50 transition group"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#102C57]" />
                  <span className="text-xs font-semibold text-slate-800">
                    University Finder
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#102C57] transition" />
              </Link>
              <Link
                href="/compare/universities"
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 hover:border-amber-200 hover:bg-amber-50/50 transition group"
              >
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-[#EA5C2B]" />
                  <span className="text-xs font-semibold text-slate-800">
                    Compare Programs
                  </span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#EA5C2B] transition" />
              </Link>
            </div>
          </div>

          {/* Categorized Suggested Questions */}
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#102C57] flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-[#EA5C2B]" /> Suggested
              Questions
            </h3>

            {CATEGORIZED_QUESTIONS.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-700">
                  {cat.category}
                </h4>
                <div className="space-y-1">
                  {cat.questions.map((q, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left rounded-lg border border-slate-100 bg-slate-50/70 p-2 text-[11px] text-slate-700 hover:border-[#102C57] hover:bg-indigo-50/40 hover:text-[#102C57] transition leading-snug"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Human Advisor Booking Card */}
          <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4 text-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-[#EA5C2B] font-bold text-xs">
              <ShieldCheck className="h-4 w-4" />
              Verified Counsellors
            </div>
            <p className="text-[11px] text-slate-600 mt-1">
              Prefer speaking with a human study abroad mentor? Book a 100% free
              consultation session.
            </p>
            <button
              onClick={() => setLeadModalOpen(true)}
              className="mt-3 w-full rounded-xl bg-[#EA5C2B] py-2 text-center text-xs font-bold text-white shadow-xs hover:bg-[#d44d1f] transition"
            >
              Book 1-on-1 Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Lead Modal */}
      {leadModalOpen && (
        <LeadModal
          isOpen={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
          defaultCountry={selectedCountry}
        />
      )}
    </div>
  );
}
