"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Bot,
  ArrowLeft,
  MessageSquare,
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink,
  Search,
  User,
  LogOut,
  RefreshCw,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { AIChatMessage } from "@/types";
import { BrandLogo } from "@/components/ui/BrandSignatures";

interface SavedConversation {
  id: string;
  session_id: string;
  title: string;
  user_email: string;
  page_context?: Record<string, any>;
  messages: AIChatMessage[];
  created_at: string;
  updated_at: string;
  lead_level?: number;
}

export default function CounsellorChatsDashboardPage() {
  const { user, logout, isLoggedIn } = useAuth();
  const [conversations, setConversations] = useState<SavedConversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<SavedConversation | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchChats = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `/api/ai/chats?email=${encodeURIComponent(user.email)}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.conversations)) {
          setConversations(data.conversations);
          if (data.conversations.length > 0 && !selectedChat) {
            setSelectedChat(data.conversations[0]);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch counsellor chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user?.email]);

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat history?")) return;

    try {
      await fetch(`/api/ai/chats?sessionId=${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
      });
      setConversations((prev) =>
        prev.filter((c) => c.session_id !== sessionId),
      );
      if (selectedChat?.session_id === sessionId) {
        setSelectedChat(null);
      }
    } catch (err) {
      console.error("Delete chat error:", err);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = c.title?.toLowerCase().includes(q);
    const msgMatch = c.messages?.some((m) => m.text?.toLowerCase().includes(q));
    return titleMatch || msgMatch;
  });

  return (
    <div className="min-h-screen bg-[#FDFCF7] flex flex-col">
      {/* Top Navbar */}
      <nav className="border-b border-[#D9CFB8]/60 bg-white/95 backdrop-blur-md px-4 py-3.5 sm:px-6 lg:px-8 sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo variant="wordmark" theme="light" size="md" />
            <span className="rounded-full bg-[#7C6BAE]/10 px-3 py-1 text-[11px] font-bold text-[#7C6BAE]">
              ✦ Route AI Chats
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/dashboard/student"
              className="font-bold text-slate-700 hover:text-[#1D5A6C] transition"
            >
              ← Student Dashboard
            </Link>
            <Link
              href="/ai-counsellor"
              className="rounded-lg bg-[#D89A3E] px-3.5 py-1.5 font-bold text-[#103B47] shadow-xs hover:bg-[#EBC783] transition"
            >
              Start New Chat +
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/dashboard/student" className="hover:underline">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-medium">
                Counsellor Chats
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#102C57]">
              Saved AI Counsellor Transcripts
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Review and continue your personalized study abroad guidance
              sessions powered by Route AI.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-[#102C57] focus:outline-none"
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center p-12">
            <RefreshCw className="h-6 w-6 animate-spin text-[#EA5C2B]" />
            <span className="ml-2 text-xs text-slate-600">
              Loading your conversation history...
            </span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-[#102C57] mb-4">
              <Bot className="h-8 w-8 text-[#EA5C2B]" />
            </div>
            <h3 className="text-base font-bold text-[#102C57]">
              No Saved Conversations Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-md mt-1 mb-6">
              Ask our AI Counsellor about universities, €0 tuition in Germany,
              NMC-compliant MBBS, or work visas. All your conversations will be
              auto-saved here.
            </p>
            <Link
              href="/ai-counsellor"
              className="rounded-xl bg-[#102C57] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0c2242] transition"
            >
              Start Your First Conversation →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
            {/* Conversation List (Left Column) */}
            <div className="lg:col-span-5 space-y-3">
              {filteredConversations.map((c) => {
                const isSelected = selectedChat?.session_id === c.session_id;
                const formattedDate = new Date(
                  c.updated_at || c.created_at,
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const userTurns = c.messages.filter(
                  (m) => m.role === "user",
                ).length;

                return (
                  <div
                    key={c.id || c.session_id}
                    onClick={() => setSelectedChat(c)}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-[#102C57] bg-white shadow-md ring-1 ring-[#102C57]"
                        : "border-slate-200 bg-white hover:border-slate-300 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[#102C57]">
                          <MessageSquare className="h-4 w-4 text-[#EA5C2B]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {c.title || "Study Abroad Session"}
                          </h4>
                          <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="h-3 w-3" />
                            {formattedDate} • {userTurns} questions asked
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(c.session_id, e)}
                        title="Delete chat"
                        className="text-slate-400 hover:text-red-600 transition p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Preview of last message */}
                    {c.messages && c.messages.length > 0 && (
                      <p className="mt-2.5 text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg">
                        {c.messages[c.messages.length - 1].text.substring(
                          0,
                          140,
                        )}
                        ...
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Conversation Detail / Transcript (Right Column) */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col max-h-[750px]">
              {selectedChat ? (
                <>
                  {/* Detail Header */}
                  <div className="border-b border-slate-100 bg-[#102C57] p-4 text-white flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm">
                        {selectedChat.title}
                      </h3>
                      <p className="text-[10px] text-slate-300 mt-0.5">
                        Session: {selectedChat.session_id} •{" "}
                        {selectedChat.messages.length} messages
                      </p>
                    </div>
                    <Link
                      href="/ai-counsellor"
                      className="inline-flex items-center gap-1 rounded-lg bg-[#EA5C2B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#d44d1f] transition"
                    >
                      Continue in AI Counsellor
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* Transcript Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                    {selectedChat.messages.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className={`flex gap-3 ${
                          m.role === "user" ? "justify-end" : "justify-start"
                        }`}
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
                          <div className="whitespace-pre-line text-xs leading-relaxed">
                            {m.text}
                          </div>
                          <span
                            className={`mt-1.5 block text-[9px] ${
                              m.role === "user"
                                ? "text-slate-300"
                                : "text-slate-500"
                            }`}
                          >
                            {m.timestamp || "Transcript"}
                          </span>
                        </div>
                        {m.role === "user" && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-700">
                            <User className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center p-12 text-slate-400 text-xs">
                  Select a conversation from the left to view the full
                  transcript.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
