import { Sparkles, ArrowRight } from "lucide-react";
import { HeroSearchForm } from "./HeroSearchForm";
import { 
  LeadTriggerButton, 
  AICounsellorTriggerButton 
} from "@/components/home/HomeClientContext";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#102C57] via-[#0D2346] to-[#091A36] text-white py-16 sm:py-24">
      {/* Vista Horizon Line & Ambient Lights */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -z-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#EA5C2B]/20 via-[#D4AF37]/15 to-transparent hidden sm:block blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column (1.1fr) - Copy, Search, CTAs */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#152e55] sm:bg-white/10 px-4 py-1.5 sm:backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-[#EA5C2B] animate-pulse"></span>
              <span className="text-xs font-semibold tracking-wide text-slate-200">
                StudyAbroadVista · For Indian Students
              </span>
            </div>

            {/* Main H1 - Playfair Display per W10 */}
            <h1 className="mt-6 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              Find Your Path to <span className="text-[#EA5C2B]">Studying Abroad</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg max-w-xl">
              Personalized guidance for Indian students. 500+ verified universities, 19 launch countries, and 24/7 AI counsellor.
            </p>

            {/* Searchbar Client Component */}
            <HeroSearchForm />

            {/* Twin CTAs per W10 Spec */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <LeadTriggerButton
                className="inline-flex items-center gap-2 rounded-xl bg-[#EA5C2B] px-6 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#ff7240] hover:scale-102"
              >
                Get Free Counselling
                <ArrowRight className="h-3.5 w-3.5" />
              </LeadTriggerButton>

              <AICounsellorTriggerButton
                className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37] bg-[#D4AF37]/10 px-5 py-2.5 text-xs font-bold text-[#FDF6E2] backdrop-blur-sm transition hover:bg-[#D4AF37]/20"
              >
                <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                Talk to AI Counsellor
              </AICounsellorTriggerButton>
            </div>

            {/* Micro Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 max-w-lg">
              <div>
                <p className="text-2xl font-extrabold text-white">19</p>
                <p className="text-[11px] font-medium text-slate-300">Launch Destinations</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#D4AF37]">500+</p>
                <p className="text-[11px] font-medium text-slate-300">Partner Universities</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#EA5C2B]">24/7</p>
                <p className="text-[11px] font-medium text-slate-300">Instant AI Support</p>
              </div>
            </div>
          </div>

          {/* Right Column (0.9fr) - Live AI Chat Window per HTML Template */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/20 bg-[#132c52] sm:bg-white/10 p-6 shadow-2xl sm:backdrop-blur-xl">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EA5C2B] text-white shadow-sm">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">✦ Vista AI Counsellor</h3>
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online & Streaming
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  Gemini 3.8
                </span>
              </div>

              {/* Chat Dialogue Mockup */}
              <div className="mt-4 space-y-3 text-xs">
                {/* AI Bubble 1 */}
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-tl-none bg-white/15 border border-white/15 px-3.5 py-2.5 text-slate-100 backdrop-blur-md">
                    Hi! Tell me your program, preferred country, budget or career goal.
                  </div>
                </div>

                {/* User Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-[#EA5C2B] px-3.5 py-2 text-white shadow-sm">
                    I want an MS in Data Science. My budget is around ₹35L.
                  </div>
                </div>

                {/* AI Bubble 2 */}
                <div className="flex justify-start">
                  <div className="max-w-[92%] rounded-2xl rounded-tl-none bg-white/15 border border-white/15 px-3.5 py-2.5 text-slate-100 backdrop-blur-md">
                    Great. I can help you compare countries, tuition, universities and eligibility. Want to start with the <strong>USA, UK or Germany</strong>?
                  </div>
                </div>
              </div>

              {/* Trust Pills under chat */}
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-medium text-slate-300">
                <span className="rounded-full bg-white/10 px-2.5 py-1">24/7 guidance</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1">Context-aware</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1">Expert admissions data</span>
              </div>

              {/* Trigger Input Bar */}
              <AICounsellorTriggerButton
                className="mt-5 flex w-full items-center justify-between rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-left text-xs text-slate-200 hover:bg-white/15 transition group"
              >
                <span className="text-slate-300 group-hover:text-white flex items-center gap-1.5">
                  Ask your question to AI Counsellor...
                </span>
                <ArrowRight className="h-4 w-4 text-[#EA5C2B] group-hover:translate-x-0.5 transition" />
              </AICounsellorTriggerButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
