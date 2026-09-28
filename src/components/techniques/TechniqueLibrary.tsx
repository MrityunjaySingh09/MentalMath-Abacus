'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Layers, Lightbulb, CheckCircle2 } from 'lucide-react';

export interface CreatorTechnique {
  id: string;
  title: string;
  category: string;
  practiceRoute: string;
  tagline: string;
  explanation: string;
  whyItWorks: string;
  exampleProblem: string;
  stepByStep: { step: string; expression: string; note: string }[];
  importantClarification?: string;
}

export const CREATOR_TECHNIQUES: CreatorTechnique[] = [
  {
    id: 'chunked_addition',
    title: 'Chunked Addition (Running Total)',
    category: 'Addition Strategy',
    practiceRoute: '/practice/addition',
    tagline: 'Maintain a running mental total and process the next number in place-value chunks.',
    explanation:
      'Rather than carrying digits right-to-left on paper, hold the first number mentally and add hundreds, tens, and ones sequentially from left to right.',
    whyItWorks:
      'Eliminates paper column alignment strain by maintaining a single continuous mental number that increases naturally.',
    exampleProblem: '587 + 296 + 413',
    stepByStep: [
      { step: 'Start with running total', expression: '587', note: 'Hold initial number mentally' },
      { step: 'Add +200 (Hundreds of 296)', expression: '587 + 200 = 787', note: 'Update running total to 787' },
      { step: 'Add +90 (Tens of 296)', expression: '787 + 90 = 877', note: 'Update running total to 877' },
      { step: 'Add +6 (Ones of 296)', expression: '877 + 6 = 883', note: 'Update running total to 883' },
      { step: 'Add +400 (Hundreds of 413)', expression: '883 + 400 = 1283', note: 'Update running total to 1283' },
      { step: 'Add +10 (Tens of 413)', expression: '1283 + 10 = 1293', note: 'Update running total to 1293' },
      { step: 'Add +3 (Ones of 413)', expression: '1293 + 3 = 1296', note: 'Final Answer = 1296' },
    ],
  },
  {
    id: 'chunked_subtraction',
    title: 'Chunked Subtraction (Running Total)',
    category: 'Subtraction Strategy',
    practiceRoute: '/practice/subtraction',
    tagline: 'Maintain a running mental total and subtract place-value chunks sequentially.',
    explanation:
      'Avoid paper borrowing steps by subtracting the largest place values first from your mental total.',
    whyItWorks:
      'Prevents cognitive confusion during complex borrowing by operating directly on place-value magnitudes.',
    exampleProblem: '748 - 567',
    stepByStep: [
      { step: 'Start with running minuend', expression: '748', note: 'Hold minuend mentally' },
      { step: 'Subtract -500 (Hundreds)', expression: '748 - 500 = 248', note: 'Update running total to 248' },
      { step: 'Subtract -60 (Tens)', expression: '248 - 60 = 188', note: 'Update running total to 188' },
      { step: 'Subtract -7 (Ones)', expression: '188 - 7 = 181', note: 'Final Answer = 181' },
    ],
  },
  {
    id: 'place_value_multiplication',
    title: 'Place-Value Decomposition',
    category: 'Multiplication Strategy',
    practiceRoute: '/practice/multiplication',
    tagline: 'Decompose multipliers into exact place-value components.',
    explanation:
      'Break multi-digit multipliers into hundreds, tens, and ones, multiply each component, and sum the partial products.',
    whyItWorks:
      'Preserves exact mathematical magnitude without risking rounding errors or forced paper approximations.',
    exampleProblem: '237 × 24',
    importantClarification:
      'The creator explicitly does NOT use rounding shortcuts like 237 × (40 - 3). Instead, they use exact place-value decomposition.',
    stepByStep: [
      { step: 'Decompose multiplier 24', expression: '24 = 20 + 4', note: 'Split into tens and ones' },
      { step: 'Multiply by Tens (20)', expression: '237 × 20 = 4740', note: 'Partial product 1 = 4740' },
      { step: 'Multiply by Ones (4)', expression: '237 × 4 = 948', note: 'Partial product 2 = 948' },
      { step: 'Sum partial products', expression: '4740 + 948 = 5688', note: 'Final Answer = 5688' },
    ],
  },
  {
    id: 'easy_number_recognition',
    title: 'Easy-Number Recognition',
    category: 'Multiplication Strategy',
    practiceRoute: '/practice/multiplication',
    tagline: 'Spot easy factors like 25, 50, 100, 125, 200, 250, 500, 1000.',
    explanation:
      'Recognize key mathematical milestones that simplify multi-digit multiplication.',
    whyItWorks:
      'Converts complex multi-digit calculations into simple single-digit factors multiplied by base-10 milestones.',
    exampleProblem: '64 × 125',
    stepByStep: [
      { step: 'Identify easy factor target', expression: '125', note: 'Recognize 125 as easy factor target' },
      { step: 'Chunk 64 into 60 and 4', expression: '125 × 60 + 125 × 4', note: 'Split multiplicand' },
      { step: 'Calculate 125 × 60', expression: '7500', note: 'Partial product 1 = 7500' },
      { step: 'Calculate 125 × 4', expression: '500', note: 'Partial product 2 = 500' },
      { step: 'Combine results', expression: '7500 + 500 = 8000', note: 'Final Answer = 8000' },
    ],
  },
  {
    id: 'table_reconstruction',
    title: 'Table Mastery via Fast Reconstruction',
    category: 'Memory & Speed',
    practiceRoute: '/practice/table_mastery',
    tagline: 'Learn to reconstruct products rapidly rather than purely memorizing thousands of facts.',
    explanation:
      'Reconstruct large table products instantly using base-10 anchors and additive relationships.',
    whyItWorks:
      'Reconstruction provides bulletproof accuracy even under high pressure when memory recall hesitates.',
    exampleProblem: '17 × 16',
    stepByStep: [
      { step: 'Anchor at 17 × 10', expression: '170', note: 'Base 10 anchor' },
      { step: 'Calculate 17 × 6', expression: '102', note: 'Additive chunk' },
      { step: 'Sum 170 + 102', expression: '272', note: 'Final Answer = 272' },
    ],
  },
];

export const TechniqueLibrary: React.FC = () => {
  const [activeTechnique, setActiveTechnique] = useState<CreatorTechnique>(CREATOR_TECHNIQUES[2]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 select-none py-2">
      {/* Editorial Masterclass Header */}
      <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-[#173F35]">
          <BookOpen className="w-5 h-5 text-[#C96F4A]" />
          <span className="text-xs uppercase tracking-widest font-mono font-bold">
            Mental Calculation Methodology Curriculum
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18211E] font-serif tracking-tight">
          How Top Mental Calculators Think
        </h1>
        <p className="text-[#68736D] max-w-3xl text-sm md:text-base leading-relaxed font-sans">
          MentalMath does not force calculator memorization or vertical paper shortcuts. We teach left-to-right place-value decomposition, running totals, and fast table reconstruction.
        </p>
      </div>

      {/* Main Curriculum Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Technique List Column */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs uppercase tracking-widest font-mono font-bold text-[#68736D] block mb-1">
            Curriculum Methods ({CREATOR_TECHNIQUES.length})
          </span>

          {CREATOR_TECHNIQUES.map((tech) => {
            const isSelected = tech.id === activeTechnique.id;
            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => setActiveTechnique(tech)}
                className={`w-full text-left p-5 rounded-xl border transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#E5EEE9] border-[#173F35] text-[#18211E] shadow-sm'
                    : 'bg-[#FFFDF8] border-[#D9D5CA] hover:border-[#173F35] text-[#68736D]'
                }`}
              >
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#173F35] font-mono block mb-1">
                  {tech.category}
                </span>
                <h3 className="font-bold text-base font-serif text-[#18211E]">{tech.title}</h3>
                <p className="text-xs text-[#68736D] line-clamp-2 mt-1 font-sans">{tech.tagline}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Technique Detailed Masterclass Card */}
        <div className="lg:col-span-8 bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 shadow-sm space-y-8">
          {/* Title & Concept Header */}
          <div className="space-y-3 border-b border-[#D9D5CA] pb-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono px-3 py-1 bg-[#E5EEE9] text-[#173F35] border border-[#C9D8D0] rounded-md font-bold">
                {activeTechnique.category}
              </span>

              <Link
                href={activeTechnique.practiceRoute}
                className="px-4 py-2 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold text-xs rounded-lg shadow-sm transition inline-flex items-center space-x-1.5 font-sans"
              >
                <span>Practice This Technique</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-[#18211E] font-serif">
              {activeTechnique.title}
            </h2>

            <p className="text-sm text-[#68736D] leading-relaxed font-sans">
              {activeTechnique.explanation}
            </p>

            {/* Why It Works Box */}
            <div className="bg-[#F7F3EA] border border-[#D9D5CA] rounded-xl p-4 space-y-1 font-sans">
              <span className="text-xs font-mono font-bold text-[#173F35] block uppercase tracking-wider">
                Why This Strategy Works:
              </span>
              <p className="text-xs text-[#18211E] leading-relaxed">
                {activeTechnique.whyItWorks}
              </p>
            </div>

            {activeTechnique.importantClarification && (
              <div className="p-4 bg-[#F3E2D9] border border-[#C96F4A] rounded-xl text-xs text-[#944426] leading-relaxed font-mono">
                <strong>IMPORTANT CLARIFICATION:</strong> {activeTechnique.importantClarification}
              </div>
            )}
          </div>

          {/* Worked Mental Example Decomposer */}
          <div className="space-y-4">
            <div className="flex justify-between items-center font-mono">
              <span className="text-xs uppercase tracking-widest text-[#68736D] font-bold">
                Worked Mental Step Decomposition
              </span>
              <span className="text-sm font-bold text-[#173F35] bg-[#F7F3EA] px-3.5 py-1 rounded-lg border border-[#D9D5CA]">
                Example: {activeTechnique.exampleProblem}
              </span>
            </div>

            <div className="space-y-3 font-mono">
              {activeTechnique.stepByStep.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-[#F7F3EA] border border-[#D9D5CA] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-xs text-[#68736D]">Step {idx + 1}: {s.step}</span>
                    <div className="text-lg font-bold text-[#173F35]">{s.expression}</div>
                  </div>
                  <span className="text-xs text-[#68736D] bg-[#FFFDF8] px-3 py-1.5 rounded-md border border-[#E5E0D5]">
                    {s.note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Practice Launcher Footer */}
          <div className="pt-4 border-t border-[#D9D5CA] flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-[#68736D] font-sans">
              Ready to build mental speed with {activeTechnique.title}?
            </span>
            <Link
              href={activeTechnique.practiceRoute}
              className="px-6 py-3 bg-[#173F35] hover:bg-[#0F2C25] text-[#FFFDF8] font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center space-x-2 font-sans"
            >
              <span>Launch {activeTechnique.category} Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
