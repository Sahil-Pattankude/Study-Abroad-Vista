import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: "Terms of Service | Platform Usage Guidelines | StudyAbroad Vista",
  description:
    "Official terms of service for StudyAbroad Vista. Review platform usage rules, student portal guidelines, B2B marketplace terms, and compliance standards.",
};

export default function TermsOfServicePage() {
  return (
    <div className='min-h-screen bg-slate-50 flex flex-col justify-between'>
      <Header />
      <main className='flex-1 py-16 sm:py-20'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
          <div className='rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs space-y-6 text-slate-700 text-sm leading-relaxed'>
            <div className='border-b border-slate-100 pb-6'>
              <h1 className='font-serif text-3xl font-extrabold text-[#102C57] sm:text-4xl'>
                Terms of Service
              </h1>
              <p className='mt-1 text-xs text-slate-400'>Effective Date: September 2026 | StudyAbroad Vista</p>
            </div>

            <h2 className='font-serif text-lg font-bold text-[#102C57] pt-2'>1. Acceptance of Terms</h2>
            <p>
              By accessing or using StudyAbroad Vista, a service provided by Dnyanal Educon Pvt. Ltd., you agree to be bound by these Terms of Service.
            </p>

            <h2 className='font-serif text-lg font-bold text-[#102C57] pt-2'>2. Educational Discovery & Advice Disclaimer</h2>
            <p>
              StudyAbroad Vista provides discovery tools, rankings, tuition calculators, and AI counseling assistance for informational purposes. Admission cutoffs, currency exchange rates, and visa regulations are subject to change by respective universities and foreign governments.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}