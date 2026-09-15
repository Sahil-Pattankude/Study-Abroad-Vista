import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getAllArticles } from "@/lib/sanity/fetchers";
import { Clock, Calendar, ArrowRight, BookOpen, Compass, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Study Abroad Blog & Admissions News | StudyAbroad Vista",
  description:
    "Official StudyAbroad Vista blog: authentic visa rule updates, country comparisons, scholarship alerts, and student success stories for international degrees.",
};

export default async function BlogDirectoryPage() {
  const articles = await getAllArticles();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Header />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#102C57] via-[#0D2346] to-[#091A36] text-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold text-slate-200">
                <BookOpen className="h-3.5 w-3.5 text-[#EA5C2B]" />
                Official StudyAbroad Vista Blog
              </div>
              <h1 className="mt-4 font-serif text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Admissions News, Insights & <span className="text-[#EA5C2B]">Visa Updates</span>
              </h1>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-2xl">
                Real-time regulatory analyses, blocked account cost changes in ₹ Lakhs, and strategy breakdowns compiled by Dnyanal Educon counsellors.
              </p>
            </div>
          </div>
        </section>

        {/* Directory Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
          {/* Section Heading & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h2 className="text-xl font-bold text-[#102C57]">
                Latest Blog Posts & Guides ({articles.length})
              </h2>
              <p className="text-xs text-slate-500">
                Published via Sanity Content Lake. Live updates for 2027 intake applicants.
              </p>
            </div>
            <Link
              href="/studio"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs self-start sm:self-auto"
            >
              Author Studio →
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-[#EA5C2B] bg-[#EA5C2B]/10 px-2.5 py-0.5 rounded-full text-[11px]">
                      {article.tag}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {article.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${article.slug}`}>
                    <h3 className="mt-4 text-base font-bold leading-snug text-[#102C57] group-hover:text-[#EA5C2B] transition">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600 line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                  <span className="text-[11px] flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {article.date}
                  </span>

                  <Link
                    href={`/blog/${article.slug}`}
                    className="font-bold text-[#102C57] group-hover:text-[#EA5C2B] inline-flex items-center gap-1 text-xs transition"
                  >
                    Read Article <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
