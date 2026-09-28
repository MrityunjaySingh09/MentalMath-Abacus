import Link from 'next/link';
import { Brain, Sparkles, ArrowRight, Layers, Trophy } from 'lucide-react';
import { SorobanAbacus } from '@/components/abacus/SorobanAbacus';

export default function LandingPage() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-16 py-6 select-none">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4 py-6">
        {/* Subtle Light Sage Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-[#E5EEE9] border border-[#C9D8D0] rounded-full text-xs font-mono font-bold text-[#173F35]">
          <Sparkles className="w-3.5 h-3.5 text-[#173F35]" />
          <span>Internalized Abacus & Place-Value Method</span>
        </div>

        {/* Clean Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#18211E] tracking-tight leading-tight font-serif">
          Train your brain to calculate, <br />
          <span className="text-[#173F35]">
            don't just calculate with a calculator.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#68736D] max-w-2xl mx-auto leading-relaxed font-sans">
          MENTALMATH transforms visible bead manipulation into an internalized spatial mental model. Master running-total chunking, place-value decomposition, and rapid multiplication reconstruction.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/learn/abacus"
            className="px-7 py-3.5 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold rounded-xl shadow-sm transition text-base flex items-center space-x-2 font-sans"
          >
            <Brain className="w-5 h-5 text-[#FFFDF8]" />
            <span>Explore 8-Level Abacus Trainer</span>
          </Link>

          <Link
            href="/dashboard"
            className="px-7 py-3.5 bg-[#FFFDF8] hover:bg-[#FAF6F0] text-[#173F35] font-bold rounded-xl border border-[#173F35] transition text-base flex items-center space-x-2 font-sans"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4 text-[#173F35]" />
          </Link>
        </div>
      </section>

      {/* Interactive Hero Abacus Demo */}
      <section className="space-y-3 text-center">
        <span className="text-xs uppercase tracking-widest font-mono text-[#68736D] font-semibold">
          Interactive Soroban Visualization Model
        </span>
        <div className="flex justify-center">
          <SorobanAbacus numRods={9} initialValue={23724} interactive={true} />
        </div>
      </section>

      {/* Core Methodology Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-7 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#E5EEE9] border border-[#C9D8D0] flex items-center justify-center text-[#173F35] mb-2">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#18211E] font-serif">Mental Abacus Internalization</h3>
          <p className="text-xs text-[#68736D] leading-relaxed font-sans">
            Move step-by-step from visible digital abacus manipulation to partial exposure, flash exposure, and pure number visualization.
          </p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-7 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#F3E2D9] border border-[#E8D0C4] flex items-center justify-center text-[#C96F4A] mb-2">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#18211E] font-serif">Place-Value Decomposition</h3>
          <p className="text-xs text-[#68736D] leading-relaxed font-sans">
            Decompose multipliers directly by place value ($237 \times 24 \rightarrow 237 \times 20 + 237 \times 4$) rather than relying on forced paper shortcuts.
          </p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-7 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#E5EEE9] border border-[#C9D8D0] flex items-center justify-center text-[#173F35] mb-2">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#18211E] font-serif">Creator Benchmark Suite</h3>
          <p className="text-xs text-[#68736D] leading-relaxed font-sans">
            Compare your accuracy, response time, streak, and QPM directly against the standardized Creator Reference Profile.
          </p>
        </div>
      </section>
    </div>
  );
}
