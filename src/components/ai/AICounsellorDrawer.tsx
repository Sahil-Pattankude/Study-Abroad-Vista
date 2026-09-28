"use client";

import { useState, useRef, useEffect, useId } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  X,
  Send,
  Sparkles,
  User,
  PhoneCall,
  Lock,
  ArrowRight,
  RotateCcw,
  Maximize2,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { AIChatMessage } from "@/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { getSavedShortlist } from "@/lib/cookies/shortlist";
import { getContextAwareGreeting } from "@/lib/gemini/counsellorKnowledge";
import {
  AIChatActionCard,
  parseMessageActions,
} from "@/components/ai/AIChatActionCard";

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
  const pathname = usePathname();
  const instanceId = useId();
  const [sessionId, setSessionId] = useState<string>("");

  // Initialize session ID once on mount
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

  // [FR-AI-002] Context-aware initial prompt
  const initialGreetingText = getContextAwareGreeting(pathname);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "initial",
      role: "model",
      text: initialGreetingText,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState(initialQuery || "");
  const [loading, setLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "Which European countries have free tuition?",
    "Best NMC-compliant MBBS universities?",
    "How does Germany Ausbildung dual training work?",
    "Top MS in Computer Science under ₹25 Lakhs?",
  ]);

  // Progressive Lead Capture State (FR-AI-005)
  const [showLevel2LeadCapture, setShowLevel2LeadCapture] = useState(false);
  const [level2Captured, setLevel2Captured] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadName, setLeadName] = useState("");
  const [showLevel3Consultation, setShowLevel3Consultation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial greeting when pathname changes if chat hasn't started yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "initial") {
      setMessages([
        {
          id: "initial",
          role: "model",
          text: getContextAwareGreeting(pathname),
          timestamp: "Just now",
        },
      ]);
    }
  }, [pathname]);

  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery);
    }
  }, [initialQuery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  // [FR-AI-004] Auto-save conversation to database / API
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
          pageContext: { url: pathname },
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
        text: getContextAwareGreeting(pathname),
        timestamp: "Just now",
      },
    ]);
    setShowLevel2LeadCapture(false);
    setShowLevel3Consultation(false);
  };

  // Level 2 Lead Capture handler (FR-AI-005)
  const handleSaveLevel2Lead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    setLevel2Captured(true);
    await persistConversation(messages, 2);
  };

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

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    // Progressive Lead Capture Evaluation (FR-AI-005)
    const userMessageCount = updatedMessages.filter(
      (m) => m.role === "user",
    ).length;
    if (userMessageCount >= 5 && !level2Captured && !user?.email) {
      setShowLevel2LeadCapture(true);
    }
    if (userMessageCount >= 10) {
      setShowLevel3Consultation(true);
    }

    // Extract basic page context from current URL
    let countryContext = "";
    let programContext = "";
    if (pathname?.includes("/study-in-")) {
      const parts = pathname.split("/").filter(Boolean);
      if (parts[0])
        countryContext = parts[0].replace("study-in-", "").toUpperCase();
      if (parts[1]) programContext = parts[1].toUpperCase();
    } else if (pathname?.includes("/destinations/")) {
      const parts = pathname.split("/").filter(Boolean);
      if (parts[1]) countryContext = parts[1].toUpperCase();
      if (parts[2]) programContext = parts[2].toUpperCase();
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
      // [FR-AI-007] Streaming fetch for sub-2-second first token latency
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
            url: pathname,
            country: countryContext,
            program: programContext,
          },
          userProfile: {
            name: user?.name || leadName,
            email: user?.email || leadEmail,
          },
          shortlist: savedShortlist,
          stream: true,
        }),
      });

      // Extract metadata headers
      const suggestedNextHeader = response.headers.get("X-Suggested-Next");
      if (suggestedNextHeader) {
        try {
          const parsed = JSON.parse(decodeURIComponent(suggestedNextHeader));
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSuggestedQuestions(parsed);
          }
        } catch {}
      }

      const leadCaptureHeader = response.headers.get("X-Lead-Capture");
      if (leadCaptureHeader === "true") {
        setShowLevel3Consultation(true);
      }

      if (!response.body) {
        throw new Error("No response stream body");
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
            "I have analyzed your query. How else may I assist your study abroad plans?",
          timestamp: "Just now",
        },
      ];

      // Auto-save conversation to database (FR-AI-004)
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
            "I experienced a temporary connection glitch. Please check your internet connection or connect with our human study abroad counsellor.";
        }
        return newArr;
      });
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
                  ? `Active: ${user?.name || user?.email}`
                  : "Gemini 3.8-Flash • Member Access"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* [FR-AI-003] Link to Standalone Full-Page Destination */}
            <Link
              href="/ai-counsellor"
              onClick={onClose}
              title="Open full page counsellor"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Link>
            {messages.length > 1 && (
              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* If user is NOT logged in: Show prominent Lock banner at top */}
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
                  parents. Sign in or register to unlock personalized admissions
                  and visa guidance.
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

        {/* Chat History Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => {
            const { cleanText, actions } = parseMessageActions(m.text);

            return (
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
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#102C57] text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className="whitespace-pre-line text-xs leading-relaxed space-y-1">
                    {cleanText}
                  </div>

                  {/* [FR-AI-006] Interactive Function Action Cards */}
                  {actions.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {actions.map((act, aIdx) => (
                        <AIChatActionCard
                          key={aIdx}
                          action={act}
                          onOpenLeadModal={() => {
                            onClose();
                            onOpenLeadModal?.();
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <span
                    className={`mt-1.5 block text-[9px] ${
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
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs pl-2">
              <span className="flex h-2 w-2 animate-ping rounded-full bg-[#EA5C2B]"></span>
              <span>Thinking & analyzing global admissions database...</span>
            </div>
          )}

          {/* [FR-AI-005 Level 2] Progressive Lead Capture: Save Chat Prompt after 5 messages */}
          {showLevel2LeadCapture && !level2Captured && !user?.email && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/90 p-3.5 text-indigo-950 shadow-xs">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#102C57] text-white shadow-xs">
                  <Mail className="h-4 w-4 text-[#EA5C2B]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-[#102C57]">
                    Save this Conversation & University Shortlist
                  </h4>
                  <p className="text-[11px] text-indigo-800 mt-0.5">
                    Enter your email to receive a saved transcript and tailored
                    admission notes.
                  </p>
                  <form
                    onSubmit={handleSaveLevel2Lead}
                    className="mt-2.5 space-y-2"
                  >
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-1/2 rounded-lg border border-indigo-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-1/2 rounded-lg border border-indigo-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[#102C57] py-1.5 text-xs font-bold text-white hover:bg-[#0c2242] transition"
                    >
                      Save My Transcript →
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {level2Captured && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-medium text-emerald-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Transcript & shortlists will be saved to{" "}
                {leadEmail || user?.email}
              </span>
            </div>
          )}

          {/* [FR-AI-005 Level 3] Progressive Lead Capture: 1-on-1 Consultation Callout */}
          {showLevel3Consultation && (
            <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-3.5 text-slate-800 shadow-xs">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EA5C2B] text-white shadow-xs">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-slate-900">
                    Ready for 1-on-1 Human Profile Review?
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Connect with an authorized StudyAbroad Vista counsellor for
                    application filing, visa checks, and scholarship guidance.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLeadModal?.();
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#EA5C2B] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#d44d1f] transition"
                  >
                    Book Free 1-on-1 Session
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
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
                className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 hover:border-[#102C57] hover:text-[#102C57] transition"
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
                placeholder="Ask about universities, fees in ₹ Lakhs, visas..."
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

          {/* Quick Lead & Full Screen Actions */}
          <div className="mt-2 flex items-center justify-between px-1 text-[10px]">
            <button
              onClick={() => {
                onClose();
                onOpenLeadModal?.();
              }}
              className="inline-flex items-center gap-1 font-bold text-[#EA5C2B] hover:underline"
            >
              <PhoneCall className="h-3 w-3" />
              Need human guidance? Book 1-on-1 advisor call
            </button>
            <Link
              href="/ai-counsellor"
              onClick={onClose}
              className="text-slate-500 hover:text-[#102C57] hover:underline"
            >
              Full Screen Mode ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
