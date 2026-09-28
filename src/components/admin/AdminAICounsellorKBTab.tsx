"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  Search,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Bot,
  Zap,
  ArrowRight,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";

export interface KBEntry {
  id: number | string;
  title: string;
  content: string;
  comment?: string | null;
  created_date?: string;
  updated_date?: string;
}

const PRESET_TOPICS = [
  {
    title: "Germany Public University Free Tuition & Blocked Account",
    content:
      "Public universities in Germany offer €0 tuition fees for both Bachelor's and Master's degrees. International students must open a Blocked Account (Sperrkonto) deposited with approx. €11,904/year (~₹10.5 Lakhs) for living expenses. Graduates receive an 18-month post-study work / jobseeker visa.",
    comment:
      "Verified from DAAD & German Federal Foreign Office 2026 regulations.",
  },
  {
    title: "NMC FMGL Regulations 2021 for MBBS Abroad",
    content:
      "Under National Medical Commission (NMC) Foreign Medical Graduate Licentiate (FMGL) Regulations 2021, Indian students pursuing MBBS abroad must complete: (1) Minimum 54 months theoretical & clinical course duration; (2) 12 months mandatory internship in the same foreign institution; (3) 100% English medium of instruction; (4) Valid license to practice in host nation; (5) Mandatory NEXT / FMGE licensing examination in India.",
    comment:
      "Crucial compliance rule for Russia, Georgia, Kazakhstan, Kyrgyzstan & Uzbekistan applicants.",
  },
  {
    title: "Germany Ausbildung Dual Vocational Training Stipends",
    content:
      "Ausbildung is a 3-year government-recognized dual vocational training program in Germany. Key benefits: (1) Zero tuition fees; (2) Monthly stipend of €1,000 to €1,400 (~₹90,000 to ₹1,25,000/month); (3) High demand fields include Nursing, IT, Mechatronics, and Hospitality; (4) Eligibility: Class 12th pass + German language B1/B2 level.",
    comment:
      "High ROI vocational program for Indian school leavers and diploma holders.",
  },
  {
    title: "USA 3-Year STEM OPT Work Authorization",
    content:
      "Graduates from US universities with STEM-designated degree programs (Science, Technology, Engineering, Math, Data Science, AI) are eligible for a 24-month STEM OPT extension in addition to the standard 12-month OPT period, providing a total of 3 years (36 months) of legal work authorization in the USA.",
    comment: "Applicable to MS CS, Data Science, AI, and STEM-MBA programs.",
  },
  {
    title: "UK 1-Year Master's and 2-Year Graduate Route Visa",
    content:
      "The UK offers intensive 1-year Master's programs (180 credits) that save one full year of living expenses. International graduates are eligible for the 2-year Graduate Route Post-Study Work (PSW) Visa (3 years for PhD graduates) without needing employer sponsorship during this period.",
    comment: "UK Home Office Graduate Route guidelines 2026.",
  },
];

export function AdminAICounsellorKBTab() {
  const [entries, setEntries] = useState<KBEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");

  // Feedback State
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Vector Search Test Simulator State
  const [testQuery, setTestQuery] = useState("");
  const [testResults, setTestResults] = useState<KBEntry[]>([]);
  const [isTestingSearch, setIsTestingSearch] = useState(false);

  // Fetch existing KB entries
  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/kb");
      const data = await res.json();
      if (data.success) {
        setEntries(data.items || []);
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to load knowledge base",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error loading knowledge base.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setComment("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please provide both Title and Content.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const endpoint = "/api/admin/kb";
      const method = editingId ? "PUT" : "POST";
      const payload = {
        id: editingId,
        title: title.trim(),
        content: content.trim(),
        comment: comment.trim() || null,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          type: "success",
          text: editingId
            ? `Knowledge entry #${editingId} updated & re-vectorized successfully!`
            : `New entry converted to 3072-dim vector & saved to Supabase (ai_counsellor_kb)!`,
        });
        resetForm();
        fetchEntries();
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to save entry.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred while communicating with the server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (entry: KBEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setComment(entry.comment || "");
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm(`Are you sure you want to delete Knowledge Entry #${id}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/kb?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: "success",
          text: `Entry #${id} removed from Supabase.`,
        });
        fetchEntries();
      } else {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to delete entry.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error deleting entry.",
      });
    }
  };

  const handleFillPreset = (preset: {
    title: string;
    content: string;
    comment: string;
  }) => {
    setTitle(preset.title);
    setContent(preset.content);
    setComment(preset.comment);
  };

  const filteredEntries = entries.filter((entry) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      entry.title.toLowerCase().includes(q) ||
      entry.content.toLowerCase().includes(q) ||
      (entry.comment && entry.comment.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-r from-slate-900 via-[#102C57] to-indigo-950 p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EA5C2B] text-white shadow-lg">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">
                  AI Counsellor Knowledge Base (KB)
                </h2>
                <span className="rounded-full bg-indigo-400/20 border border-indigo-300/30 px-2.5 py-0.5 text-[10px] font-bold text-indigo-200">
                  Supabase `ai_counsellor_kb`
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300 max-w-2xl leading-relaxed">
                Add and manage study abroad domain knowledge. Whenever you add
                or update an entry, Title and Content are automatically
                vectorized into <strong>3072-dimensional embeddings</strong>{" "}
                using Google Gemini (<code>gemini-embedding-001</code>) for
                semantic RAG search.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={fetchEntries}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20 transition cursor-pointer"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh KB</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {statusMessage && (
        <div
          className={`flex items-center justify-between rounded-2xl p-4 text-xs font-semibold shadow-xs ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-rose-50 text-rose-900 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Add/Edit Form & Presets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (7 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingId
                      ? `Edit Knowledge Entry #${editingId}`
                      : "Add New Knowledge Base Entry"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Input title, content & comments. Auto-vectorized on submit.
                  </p>
                </div>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Knowledge Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Germany Public University Free Tuition & Blocked Account 2026"
                  required
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#102C57] focus:outline-none focus:ring-1 focus:ring-[#102C57]"
                />
              </div>

              {/* Content Body */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>
                    Knowledge Content Body (To be Vectorized){" "}
                    <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {content.length} characters
                  </span>
                </label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter detailed facts, eligibility criteria, tuition in ₹ Lakhs, visa rules, NMC regulations, or post-study work rules. This text will be embedded into vector space and retrieved by the AI Counsellor."
                  required
                  className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#102C57] focus:outline-none focus:ring-1 focus:ring-[#102C57] font-mono leading-relaxed"
                />
              </div>

              {/* Admin Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin Comment / Internal Notes (Optional)
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g., Verified against DAAD circular; applicable for 2026/2027 intake."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#102C57] focus:outline-none focus:ring-1 focus:ring-[#102C57]"
                />
              </div>

              {/* Vectorization Info Badge */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3.5 text-indigo-950 flex items-start gap-2.5">
                <Zap className="h-4 w-4 text-[#EA5C2B] shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <p className="font-bold text-indigo-950">
                    Automatic Gemini Vector Embedding (3072 Dimensions)
                  </p>
                  <p className="text-indigo-800/80 mt-0.5">
                    Upon saving, the backend will call Google Generative AI to
                    transform <strong>Title + Content</strong> into a
                    mathematical vector representation and store it directly in
                    the <code>embedding</code> vector column in Supabase table{" "}
                    <code>ai_counsellor_kb</code>.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Discard Changes
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#102C57] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#0c2242] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-[#EA5C2B]" />
                      <span>Vectorizing with Gemini & Saving...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-[#EA5C2B]" />
                      <span>
                        {editingId
                          ? "Update & Re-Vectorize"
                          : "Convert to Vector & Save"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Templates & Schema Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Preset Templates */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
              <Layers className="h-4 w-4 text-[#EA5C2B]" />
              <h4 className="text-xs font-bold text-slate-900">
                1-Click Domain Fact Presets
              </h4>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Click any preset to auto-fill the form and index verified study
              abroad rules:
            </p>
            <div className="space-y-2">
              {PRESET_TOPICS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleFillPreset(p)}
                  className="w-full text-left rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-xs hover:border-[#102C57] hover:bg-slate-100 transition group cursor-pointer"
                >
                  <p className="font-bold text-slate-800 group-hover:text-[#102C57] flex items-center justify-between">
                    <span>{p.title}</span>
                    <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-[#EA5C2B] transition shrink-0 ml-1" />
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                    {p.content}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Database Details */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-700 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2">
              <Database className="h-3.5 w-3.5 text-indigo-600" />
              <span>Supabase Schema Info</span>
            </h4>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-600">
              <p>
                • <strong>Table:</strong> <code>ai_counsellor_kb</code>
              </p>
              <p>
                • <strong>Columns:</strong> <code>id</code>, <code>title</code>,{" "}
                <code>content</code>, <code>comment</code>,{" "}
                <code>embedding</code>, <code>created_date</code>,{" "}
                <code>updated_date</code>
              </p>
              <p>
                • <strong>Embedding:</strong> <code>vector(3072)</code>
              </p>
              <p>
                • <strong>Model:</strong> <code>gemini-embedding-001</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Knowledge Base Entries Table & Search */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Stored Knowledge Base Entries ({filteredEntries.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              Vectorized entries available in Supabase for the AI Counsellor
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, content, comment..."
              className="w-full rounded-xl border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#102C57] focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-[#EA5C2B]" />
            <span>Loading entries from Supabase `ai_counsellor_kb`...</span>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">
              No knowledge entries found
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {searchQuery
                ? "No entries match your search query."
                : "Fill out the form above or pick a 1-click preset to add your first vectorized knowledge entry."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-slate-50/60 p-3 rounded-2xl transition"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-600"
                      title={`Full ID: ${entry.id}`}
                    >
                      #
                      {String(entry.id).length > 8
                        ? `${String(entry.id).slice(0, 8)}...`
                        : entry.id}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">
                      {entry.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                      Vectorized (3072-dim)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {entry.content}
                  </p>

                  {entry.comment && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50/70 border border-amber-200/60 px-2.5 py-1 rounded-lg w-fit">
                      <MessageSquare className="h-3 w-3 text-amber-600 shrink-0" />
                      <span>
                        <strong>Admin Note:</strong> {entry.comment}
                      </span>
                    </div>
                  )}

                  {entry.created_date && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="h-2.5 w-2.5" />
                      <span>
                        Saved: {new Date(entry.created_date).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                    title="Edit entry and regenerate vector"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50/60 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 transition"
                    title="Delete from Supabase"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
