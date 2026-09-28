'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  calculateUserStats,
  OverallUserStats,
} from '@/lib/storage/user-stats';
import { SorobanAbacus } from '../abacus/SorobanAbacus';
import { CREATOR_BENCHMARK_PROFILE } from '@/lib/math/creator-benchmark';
import {
  ArrowRight,
  Brain,
  Zap,
  Target,
  Clock,
  TrendingUp,
  BookOpen,
  Bot,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { OperationType } from '@/lib/math/question-generator';

export const RedesignedDashboard: React.FC = () => {
  const [stats, setStats] = useState<OverallUserStats | null>(null);
  const [activeAbacusValue, setActiveAbacusValue] = useState<number>(23724);

  useEffect(() => {
    const loaded = calculateUserStats();
    setStats(loaded);
  }, []);

  const hasData = stats && stats.totalAttempts > 0;

  // Active technique step decomposition for methodology showcase
  const sampleDecomposition = [
    { step: 'Decompose Multiplier 24', expr: '24 = 20 + 4', note: 'Place-value split' },
    { step: 'Partial Product 1 (Tens)', expr: '237 × 20 = 4740', note: 'Hold 4740 mentally' },
    { step: 'Partial Product 2 (Ones)', expr: '237 × 4 = 948', note: 'Calculate 948' },
    { step: 'Sum Running Total', expr: '4740 + 948 = 5688', note: 'Final Result: 5688' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12 py-4 select-none">
      {/* ============================================================ */}
      {/* 1. HERO SECTION: EDITORIAL HEADER & ADAPTIVE FOCUS DIRECTIVE  */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Human Editorial Status Statement */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6 bg-[#F7F3EA] border-b lg:border-b-0 lg:border-r border-[#D9D5CA] pb-8 lg:pb-0 lg:pr-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-wider text-[#173F35]">
              <span className="w-2 h-2 rounded-full bg-[#C96F4A]" />
              <span>MENTAL CALCULATION TRAINING COMMAND</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#173F35] tracking-tight leading-none font-serif">
              Internalized Mental Arithmetic Instrument
            </h1>

            <p className="text-[#6B746F] text-sm md:text-base leading-relaxed max-w-2xl font-sans">
              {hasData
                ? `You have completed ${stats.totalAttempts} calculation attempts with an overall accuracy of ${stats.overallAccuracy}%. ${stats.recommendationReason}`
                : 'Develop an internalized abacus number representation and master left-to-right place-value decomposition to calculate rapidly without external tools.'}
            </p>
          </div>

          {/* Quick Real Performance Strip */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#D9D5CA] font-mono">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6B746F] font-semibold block">
                Overall Accuracy
              </span>
              <span className="text-2xl font-bold text-[#173F35]">
                {hasData ? `${stats.overallAccuracy}%` : '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6B746F] font-semibold block">
                Avg Response Delay
              </span>
              <span className="text-2xl font-bold text-[#C96F4A]">
                {hasData ? `${(stats.avgResponseTimeMs / 1000).toFixed(1)}s` : '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#6B746F] font-semibold block">
                Calculation Velocity
              </span>
              <span className="text-2xl font-bold text-[#537063]">
                {hasData ? `${stats.qpm} QPM` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Prominent Adaptive Practice Recommendation Box */}
        <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-7 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#173F35] bg-[#E8EFEB] px-3 py-1 rounded-md border border-[#D3E0D8]">
                Adaptive Directive
              </span>
              <span className="text-xs font-mono text-[#6B746F]">Recommended Practice</span>
            </div>

            <h2 className="text-2xl font-bold text-[#18211E] font-serif">
              {hasData ? stats.skills[stats.recommendedOperation].label : 'Addition & Abacus Baseline'}
            </h2>

            <p className="text-xs text-[#6B746F] leading-relaxed font-sans">
              {hasData
                ? stats.recommendationReason
                : 'Start with 2-digit addition chunking to establish your initial speed and accuracy baseline.'}
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="bg-[#F7F3EA] border border-[#D9D5CA] rounded-xl p-4 font-mono text-xs space-y-1">
              <span className="text-[#6B746F] block font-sans">Target Technique:</span>
              <span className="text-[#173F35] font-bold text-sm block">
                {hasData
                  ? stats.recommendedTechnique
                  : 'Chunked Addition (Running Total)'}
              </span>
            </div>

            <Link
              href={`/practice/${(stats?.recommendedOperation || 'addition').toLowerCase()}`}
              className="w-full py-3.5 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold rounded-xl shadow-sm transition duration-200 flex items-center justify-center space-x-2 text-sm font-sans"
            >
              <span>Start Recommended Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. CORE METHODOLOGY SHOWCASE: ABACUS & PLACE-VALUE MODEL     */}
      {/* ============================================================ */}
      <section className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 space-y-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D9D5CA] pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#173F35] font-bold uppercase tracking-widest">
              <Brain className="w-4 h-4 text-[#C96F4A]" />
              <span>Core Methodology Representation</span>
            </div>
            <h2 className="text-2xl font-bold text-[#18211E] font-serif">
              Internalized Abacus & Place-Value Model
            </h2>
          </div>
          <p className="text-xs text-[#6B746F] max-w-md font-sans leading-relaxed">
            MentalMath connects visible bead states with mental place-value decomposition so you can visualize and feel number positions mentally.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Embedded Tactile Soroban Abacus Visualizer */}
          <div className="lg:col-span-7 flex flex-col items-center space-y-3">
            <span className="text-xs font-mono text-[#6B746F] font-semibold self-start">
              Internalized Soroban Bead Model (Value: {activeAbacusValue})
            </span>
            <SorobanAbacus
              numRods={7}
              initialValue={activeAbacusValue}
              onChangeValue={(val) => setActiveAbacusValue(val)}
              interactive={true}
            />
          </div>

          {/* Editorial Place-Value Decomposition Card */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-mono text-[#6B746F] font-semibold block">
              Place-Value Decomposition (237 × 24)
            </span>

            <div className="bg-[#F7F3EA] border border-[#D9D5CA] rounded-xl p-5 space-y-3 font-mono">
              <div className="flex justify-between items-center text-xs text-[#173F35] font-bold border-b border-[#D9D5CA] pb-2 font-serif">
                <span>Methodology: Multiplier Chunking</span>
                <span>237 × 24</span>
              </div>

              <div className="space-y-2">
                {sampleDecomposition.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-[#FFFDF8] border border-[#E5E0D5]"
                  >
                    <span className="text-[#6B746F]">{step.step}</span>
                    <span className="text-[#173F35] font-bold">{step.expr}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-[#6B746F] leading-relaxed font-sans">
              *Decompose multipliers left-to-right to preserve running mental capacity instead of relying on paper vertical alignment.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SKILL MATRIX & REAL PERFORMANCE BREAKDOWN                  */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: 6-Operation Skill Mastery List */}
        <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-[#D9D5CA] pb-4">
            <div className="space-y-0.5">
              <h3 className="font-bold text-lg text-[#18211E] font-serif">Skill Mastery Progression</h3>
              <span className="text-xs text-[#6B746F]">Operation performance & accuracy breakdown</span>
            </div>
            <span className="text-xs font-mono text-[#173F35] bg-[#E8EFEB] px-3 py-1 rounded-md border border-[#D3E0D8] font-bold">
              6 Core Skills
            </span>
          </div>

          <div className="space-y-3">
            {(
              [
                'ADDITION',
                'SUBTRACTION',
                'MULTIPLICATION',
                'DIVISION',
                'TABLE_MASTERY',
                'VISUALIZATION',
              ] as OperationType[]
            ).map((op) => {
              const opSkill = stats?.skills[op];
              const acc = opSkill ? opSkill.accuracy : 0;
              const attempts = opSkill ? opSkill.totalAttempts : 0;
              const avgSpeed = opSkill && opSkill.avgResponseTimeMs > 0 ? (opSkill.avgResponseTimeMs / 1000).toFixed(1) : '—';

              return (
                <Link
                  key={op}
                  href={`/practice/${op.toLowerCase()}`}
                  className="group block bg-[#F7F3EA] hover:bg-[#FAF6F0] border border-[#D9D5CA] rounded-xl p-4 transition-all duration-150"
                >
                  <div className="flex justify-between items-center font-mono text-xs mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#18211E] group-hover:text-[#173F35] transition">
                        {opSkill ? opSkill.label : op}
                      </span>
                      <span className="text-[10px] text-[#6B746F] font-sans">
                        ({opSkill ? opSkill.techniqueName : ''})
                      </span>
                    </div>

                    <div className="flex space-x-3 text-[#6B746F]">
                      <span>{attempts > 0 ? `${acc}% acc` : 'No practice'}</span>
                      <span>{attempts > 0 ? `${avgSpeed}s` : ''}</span>
                    </div>
                  </div>

                  <div className="w-full bg-[#E5E0D5] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        acc >= 85 ? 'bg-[#173F35]' : acc >= 60 ? 'bg-[#537063]' : 'bg-[#C96F4A]'
                      }`}
                      style={{ width: `${attempts > 0 ? acc : 5}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Coach Guidance & Creator Benchmark Alignment */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
          {/* Supporting AI Coach Guidance Note */}
          <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-7 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-[#173F35] border-b border-[#D9D5CA] pb-3">
              <Bot className="w-5 h-5 text-[#173F35]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#173F35]">
                Coach Note
              </span>
            </div>

            <p className="text-xs text-[#18211E] leading-relaxed font-sans">
              {hasData
                ? `Coach Note: Your overall accuracy is ${stats.overallAccuracy}%. For ${stats.skills[stats.recommendedOperation].label}, focus on left-to-right place-value decomposition to lower calculation delay.`
                : 'Coach Note: Welcome to MentalMath! Complete 10 questions in Addition or Subtraction to allow the adaptive engine to measure your speed and accuracy.'}
            </p>

            <Link
              href="/ai-coach"
              className="text-xs font-mono font-bold text-[#173F35] hover:underline inline-flex items-center space-x-1 pt-1"
            >
              <span>Ask AI Coach a question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Benchmark Target Comparison Strip */}
          <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-7 space-y-4 shadow-sm font-mono">
            <div className="flex justify-between items-center border-b border-[#D9D5CA] pb-3">
              <span className="text-xs font-bold text-[#18211E] uppercase tracking-wider font-sans">
                Reference Benchmark
              </span>
              <span className="text-xs text-[#173F35] font-bold">Standard Target</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B746F]">Target Velocity (QPM)</span>
                <span className="text-[#173F35] font-bold">{CREATOR_BENCHMARK_PROFILE.qpm} QPM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B746F]">Target Accuracy</span>
                <span className="text-[#173F35] font-bold">{CREATOR_BENCHMARK_PROFILE.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B746F]">Target Response Speed</span>
                <span className="text-[#C96F4A] font-bold">
                  {(CREATOR_BENCHMARK_PROFILE.avgResponseTimeMs / 1000).toFixed(2)}s
                </span>
              </div>
            </div>

            <Link
              href="/benchmark"
              className="w-full py-2.5 bg-[#F7F3EA] hover:bg-[#EBE5D8] text-[#173F35] border border-[#D9D5CA] rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition font-sans"
            >
              <span>Compare Full Benchmark</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. PROGRESS VISUALIZATION & EMPTY STATE HANDLING            */}
      {/* ============================================================ */}
      <section className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 space-y-6 shadow-sm">
        <div className="flex justify-between items-center border-b border-[#D9D5CA] pb-4">
          <div>
            <h3 className="font-bold text-lg text-[#18211E] font-serif">Learning Trajectory</h3>
            <p className="text-xs text-[#6B746F]">Daily accuracy (%) and average response speed (sec)</p>
          </div>
          <span className="text-xs font-mono text-[#6B746F]">Session Log Data</span>
        </div>

        {hasData && stats.recentDailyProgress.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.recentDailyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0D5" />
                <XAxis dataKey="day" stroke="#6B746F" fontSize={12} />
                <YAxis stroke="#6B746F" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFDF8', borderColor: '#D9D5CA', color: '#18211E' }}
                />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#173F35"
                  strokeWidth={2.5}
                  dot={{ fill: '#173F35' }}
                  name="Accuracy (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* Warm Educational Baseline Empty State */
          <div className="py-10 px-6 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-[#E8EFEB] border border-[#D3E0D8] flex items-center justify-center text-[#173F35] mx-auto">
              <BookOpen className="w-6 h-6 text-[#173F35]" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-[#18211E] text-base font-serif">No Practice Data Recorded Yet</h4>
              <p className="text-xs text-[#6B746F] font-sans leading-relaxed">
                Complete your first practice session to build your personalized skill map, accuracy trends, and adaptive recommendations.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/practice/addition"
                className="px-5 py-2.5 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold rounded-xl text-xs transition font-sans"
              >
                Start Addition Practice
              </Link>
              <Link
                href="/learn/abacus"
                className="px-5 py-2.5 bg-[#F7F3EA] hover:bg-[#EBE5D8] text-[#173F35] border border-[#D9D5CA] rounded-xl text-xs font-bold transition font-sans"
              >
                Try Abacus Trainer
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
