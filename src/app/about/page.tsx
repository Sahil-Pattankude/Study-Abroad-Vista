import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Compass, ShieldCheck, Award, Globe2, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className='min-h-screen bg-slate-50 flex flex-col justify-between'>
      <Header />
      <main className='flex-1'>
        <section className='bg-gradient-to-b from-[#102C57] to-[#091A36] text-white py-16 sm:py-24'>
          <div className='mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8'>
            <div className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold'>
              <Compass className='h-4 w-4 text-[#EA5C2B]' />
              About StudyAbroadVista
            </div>
            <h1 className='mt-6 font-serif text-4xl font-extrabold sm:text-5xl lg:text-6xl'>
              Democratizing High-Impact Global Education
            </h1>
            <p className='mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg'>
              Parent Entity: Dnyanal Educon Pvt. Ltd. | Building India authoritative, zero-bias international education discovery portal and qualified lead engine.
            </p>
          </div>
        </section>

        <section className='py-16 sm:py-20'>
          <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12'>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-3'>
              <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-xs'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#EA5C2B]'>
                  <Globe2 className='h-5 w-5' />
                </div>
                <h3 className='mt-4 font-serif text-lg font-bold text-[#102C57]'>19 Launch Destinations</h3>
                <p className='mt-2 text-xs text-slate-600 leading-relaxed'>
                  Comprehensive, verified admissions intelligence spanning the Anchor Six through accredited low-cost medical hubs.
                </p>
              </div>

              <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-xs'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
                  <ShieldCheck className='h-5 w-5' />
                </div>
                <h3 className='mt-4 font-serif text-lg font-bold text-[#102C57]'>Zero Sales Distortion</h3>
                <p className='mt-2 text-xs text-slate-600 leading-relaxed'>
                  Our algorithms rank universities based on QS/THE scores, actual INR living expenses, and verified post-study work visa rights.
                </p>
              </div>

              <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-xs'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600'>
                  <Award className='h-5 w-5' />
                </div>
                <h3 className='mt-4 font-serif text-lg font-bold text-[#102C57]'>AI-First Counseling</h3>
                <p className='mt-2 text-xs text-slate-600 leading-relaxed'>
                  Powered by Google Gemini and trained on thousands of official visa circulars and NMC guidelines.
                </p>
              </div>
            </div>

            <div className='rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10'>
              <h2 className='font-serif text-2xl font-bold text-[#102C57]'>Our Corporate Mandate & Parent Entity</h2>
              <p className='mt-4 text-sm leading-relaxed text-slate-600'>
                StudyAbroad Vista is wholly owned and operated by <strong>Dnyanal Educon Pvt. Ltd.</strong>, headquartered in Maharashtra, India. Our mission is to protect Indian students and their families from misleading claims, unauthorized colleges, and undisclosed middleman fees.
              </p>
              <div className='mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs font-semibold text-slate-700'>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-emerald-600' />
                  <span>NMC & WHO Accredited Medical Catalog</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-emerald-600' />
                  <span>Indian DPDP Act 2023 Compliant</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-emerald-600' />
                  <span>Multi-currency Tuition to INR Converters</span>
                </div>
                <div className='flex items-center gap-2'>
                  <CheckCircle2 className='h-4 w-4 text-emerald-600' />
                  <span>Verified B2B Lead Marketplace with Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}