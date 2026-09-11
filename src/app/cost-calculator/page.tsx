import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CostCalculatorWidget } from '@/components/home/CostCalculatorWidget';

export default function CostCalculatorPage() {
  return (
    <div className='min-h-screen bg-slate-50 flex flex-col justify-between'>
      <Header />
      <main className='flex-1 py-12'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8 text-center'>
          <h1 className='font-serif text-4xl font-extrabold text-[#102C57] sm:text-5xl'>
            Study Abroad Cost of Living & Tuition Calculator
          </h1>
          <p className='mt-3 text-sm text-slate-600 max-w-2xl mx-auto'>
            Calculate comprehensive financial requirements across 19 destinations converted directly into INR Lakhs, including blocked accounts, university fees, and part-time earnings.
          </p>
        </div>
        <CostCalculatorWidget />
      </main>
      <Footer />
    </div>
  );
}