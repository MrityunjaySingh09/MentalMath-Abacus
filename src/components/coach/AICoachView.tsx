'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Brain,
  Send,
  Lightbulb,
  Zap,
  Target,
  ArrowRight,
  BookOpen,
  Award,
  BarChart2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  generateAdditionSteps,
  generateMultiplicationSteps,
  generateSubtractionSteps,
} from '@/lib/math/question-generator';
import { calculateUserStats, OverallUserStats } from '@/lib/storage/user-stats';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  steps?: { description: string; expression: string; subtotal: number }[];
  techniqueName?: string;
  rationale?: string;
}

export const AICoachView: React.FC = () => {
  const [stats, setStats] = useState<OverallUserStats | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_initial_1',
      sender: 'coach',
      text: 'Welcome to your personal Mental Math Coaching Studio! I am your arithmetic tutor. I break down multi-digit operations into place-value steps, diagnose accuracy bottlenecks, and guide your progression toward internalized calculation.',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');

  useEffect(() => {
    const loadedStats = calculateUserStats();
    setStats(loadedStats);

    if (loadedStats && loadedStats.totalAttempts > 0) {
      const recLabel = loadedStats.skills[loadedStats.recommendedOperation]?.label || 'Addition';
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_initial_diag',
          sender: 'coach',
          text: `Diagnostic Insight: You have completed ${loadedStats.totalAttempts} calculation questions with an overall accuracy of ${loadedStats.overallAccuracy}% (${loadedStats.qpm} QPM). Current focus area: ${recLabel} (${loadedStats.recommendationReason}).`,
        },
      ]);
    }
  }, []);

  const samplePrompts = stats && stats.totalAttempts > 0
    ? [
        `How to decompose 237 × 24 mentally?`,
        `How to improve my ${stats.skills[stats.recommendedOperation]?.label || 'Multiplication'} accuracy?`,
        `How to calculate 64 × 125 mentally?`,
        `How to solve 587 + 296?`,
        `How to reach 42.3 QPM benchmark?`,
        `Mental Abacus visualization guide`,
      ]
    : [
        'How to calculate 237 × 24 mentally?',
        'How to calculate 64 × 125 mentally?',
        'How to solve 587 + 296 mentally?',
        'How to calculate 1000 - 487?',
        'Explain place-value multiplication',
        'How to build calculation speed?',
      ];

  const parseAndDecomposeQuery = (query: string): ChatMessage => {
    const qLower = query.toLowerCase();

    // 1. Multiplication math expression e.g. 237 x 24, 48 * 25
    const multMatch = query.match(/(\d+)\s*[\*×x]\s*(\d+)/i);
    if (multMatch) {
      const a = parseInt(multMatch[1], 10);
      const b = parseInt(multMatch[2], 10);
      const steps = generateMultiplicationSteps(a, b);

      if (b === 25 || b === 50 || b === 125 || b === 200 || b === 250 || b === 500 || b === 1000) {
        return {
          id: `coach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          sender: 'coach',
          text: `To solve ${a} × ${b} mentally, recognize ${b} as a key factor milestone!`,
          techniqueName: 'Easy-Number Recognition',
          rationale: `Instead of long multiplication, multiply ${a} by the easy milestone benchmark (${b}), or chunk ${a} into place-values.`,
          steps,
        };
      }

      return {
        id: `coach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'coach',
        text: `To solve ${a} × ${b} mentally, use Place-Value Decomposition. Decompose ${b} into exact place-value chunks (${b} = ${steps
          .map((s) => s.expression.split('×')[1]?.trim())
          .filter(Boolean)
          .join(' + ')}):`,
        techniqueName: 'Place-Value Decomposition',
        rationale: `Place-value decomposition eliminates paper vertical carrying. Decompose the multiplier and sum the partial products sequentially in mental memory.`,
        steps,
      };
    }

    // 2. Addition math expression e.g. 587 + 296
    const addMatch = query.match(/(\d+)\s*[\+]\s*(\d+)/);
    if (addMatch) {
      const a = parseInt(addMatch[1], 10);
      const b = parseInt(addMatch[2], 10);
      const steps = generateAdditionSteps([a, b]);
      return {
        id: `coach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'coach',
        text: `To solve ${a} + ${b} mentally, hold ${a} as your running mental total and add ${b} in place-value chunks from left to right:`,
        techniqueName: 'Chunked Addition (Running Total)',
        rationale: `Left-to-right chunking maintains a single active total in memory, preventing cognitive overload from right-to-left carrying.`,
        steps,
      };
    }

    // 3. Subtraction math expression e.g. 748 - 567 or 1000 - 487
    const subMatch = query.match(/(\d+)\s*[\-]\s*(\d+)/);
    if (subMatch) {
      const a = parseInt(subMatch[1], 10);
      const b = parseInt(subMatch[2], 10);
      const steps = generateSubtractionSteps(a, b);
      return {
        id: `coach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'coach',
        text: `To solve ${a} - ${b} mentally, hold ${a} as a running total and subtract ${b} in place-value chunks:`,
        techniqueName: 'Chunked Subtraction',
        rationale: `Subtract hundreds first, then tens, then units. This ensures your mental minuend stays coherent at every intermediate step.`,
        steps,
      };
    }

    // 4. Specific Diagnostic & Strategy Intents
    if (qLower.includes('accuracy') || qLower.includes('mistake') || qLower.includes('improve')) {
      if (stats && stats.totalAttempts > 0) {
        const recLabel = stats.skills[stats.recommendedOperation]?.label || 'Addition';
        const recAcc = stats.skills[stats.recommendedOperation]?.accuracy || 0;
        return {
          id: `coach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          sender: 'coach',
          text: `Based on your ${stats.totalAttempts} recorded attempts: Your lowest accuracy area is currently ${recLabel} (${recAcc}% accuracy). Focus on accuracy before speed. Use 5–10 untimed place-value practice questions to anchor the mental decomposition steps.`,
          techniqueName: 'Targeted Skill Focus',
        };
      }
      return {
        id: `coach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'coach',
        text: 'Accuracy improves when you speak the intermediate partial sums internally before writing or typing the final answer. Start with untimed 2-digit by 2-digit multiplication in Practice mode.',
        techniqueName: 'Verbalization Anchor',
      };
    }

    if (qLower.includes('benchmark') || qLower.includes('qpm') || qLower.includes('target')) {
      return {
        id: `coach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'coach',
        text: 'The Creator Benchmark target is 42.3 QPM (Questions Per Minute) with 98% accuracy. To reach this velocity: 1. Master place-value chunking. 2. Transition from mental text to tactile Soroban bead visualization in Level 4–6 Abacus mode.',
        techniqueName: 'Creator Benchmark Goal',
      };
    }

    if (qLower.includes('abacus') || qLower.includes('bead') || qLower.includes('visualiz')) {
      return {
        id: `coach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'coach',
        text: 'The Mental Abacus progression has 5 visual stages: 1. Full Visible Soroban → 2. Guided Step Hints → 3. Faded Silhouette → 4. Flash Exposure (1.5s/1.0s) → 5. Pure Internalized Visualization. Train daily in Mental Abacus mode to build spatial bead memory.',
        techniqueName: 'Internalized Soroban Visualization',
      };
    }

    if (qLower.includes('multipli') || qLower.includes('place value') || qLower.includes('product')) {
      return {
        id: `coach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender: 'coach',
        text: 'Place-Value Decomposition is the foundation of mental multiplication: 237 × 24 = 237 × 20 + 237 × 4 = 4740 + 948 = 5688. The creator explicitly avoids forced rounding shortcuts like (40 - 3) because place-value decomposition scales uniformly across all numbers.',
        techniqueName: 'Place-Value Decomposition',
      };
    }

    return {
      id: `coach_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: 'coach',
      text: 'I can break down any mental calculation for you! Try entering a problem like "237 x 24", "587 + 296", "1000 - 487", or ask "How to reach the benchmark target?".',
    };
  };

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      text: queryText,
    };

    const coachResp = parseAndDecomposeQuery(queryText);

    setMessages((prev) => [...prev, userMsg, coachResp]);
    setInputQuery('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery(inputQuery);
  };

  const recommendedOp = stats?.recommendedOperation || 'MULTIPLICATION';
  const recLabel = stats?.skills[recommendedOp]?.label || 'Multiplication';

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 select-none py-2 font-sans">
      {/* Page Header */}
      <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[#173F35]">
            <Brain className="w-5 h-5 text-[#C96F4A]" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Personalized Calculation Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18211E] font-serif tracking-tight">
            Mental Arithmetic Tutor
          </h1>
          <p className="text-[#68736D] max-w-xl text-sm leading-relaxed font-sans">
            Data-backed coaching, mistake diagnosis, and place-value calculation breakdowns derived from verified creator strategies.
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <Link
            href={`/practice/${recommendedOp.toLowerCase()}`}
            className="px-4 py-2.5 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold rounded-xl text-xs shadow-sm transition flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Practice {recLabel}</span>
          </Link>
          <Link
            href="/learn/abacus"
            className="px-4 py-2.5 bg-[#173F35] hover:bg-[#0F2C25] text-[#FFFDF8] font-bold rounded-xl text-xs shadow-sm transition flex items-center space-x-2"
          >
            <Target className="w-4 h-4" />
            <span>Soroban Abacus</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Diagnostic Insights + Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top Panel: Learner Diagnostic Insights */}
        <div className="lg:col-span-4 space-y-5">
          {/* Diagnostic Card */}
          <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3">
              <div className="flex items-center space-x-2 text-[#173F35]">
                <BarChart2 className="w-4 h-4 text-[#173F35]" />
                <h3 className="font-serif font-bold text-base text-[#18211E]">Learner Diagnostic</h3>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#E5EEE9] text-[#173F35] rounded-md">
                Live Analysis
              </span>
            </div>

            {stats && stats.totalAttempts > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F7F3EA] p-3 rounded-xl border border-[#E5E0D5]">
                    <span className="text-[10px] font-mono text-[#68736D] uppercase font-bold block">Accuracy</span>
                    <span className="text-xl font-bold font-serif text-[#173F35]">{stats.overallAccuracy}%</span>
                  </div>
                  <div className="bg-[#F7F3EA] p-3 rounded-xl border border-[#E5E0D5]">
                    <span className="text-[10px] font-mono text-[#68736D] uppercase font-bold block">Speed (QPM)</span>
                    <span className="text-xl font-bold font-serif text-[#C96F4A]">{stats.qpm}</span>
                  </div>
                </div>

                <div className="bg-[#F7F3EA] p-4 rounded-xl border border-[#E5E0D5] space-y-1.5">
                  <span className="text-xs font-mono font-bold text-[#173F35] block uppercase tracking-wider">
                    Tutor Recommendation
                  </span>
                  <p className="text-xs text-[#18211E] leading-relaxed font-sans">{stats.recommendationReason}</p>
                </div>

                <div className="pt-1 flex justify-between items-center text-xs text-[#68736D] font-mono">
                  <span>Target Benchmark:</span>
                  <span className="font-bold text-[#173F35]">42.3 QPM</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-2">
                <p className="text-xs text-[#68736D] leading-relaxed font-sans">
                  No practice data recorded yet. Complete a practice set or benchmark assessment to receive personalized performance diagnostics.
                </p>
                <Link
                  href="/benchmark"
                  className="inline-flex items-center space-x-1.5 text-xs text-[#C96F4A] font-bold font-mono hover:underline"
                >
                  <span>Take Benchmark Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Actionable Practice Shortcuts */}
          <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-6 shadow-sm space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#18211E]">Curriculum Shortcuts</h4>
            <div className="space-y-2">
              <Link
                href="/techniques"
                className="p-3 bg-[#F7F3EA] hover:bg-[#E5EEE9] border border-[#D9D5CA] rounded-xl flex items-center justify-between text-xs transition group"
              >
                <div className="flex items-center space-x-2 text-[#18211E] font-medium">
                  <BookOpen className="w-4 h-4 text-[#173F35]" />
                  <span>Technique Library</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#68736D] group-hover:text-[#173F35] transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/benchmark"
                className="p-3 bg-[#F7F3EA] hover:bg-[#E5EEE9] border border-[#D9D5CA] rounded-xl flex items-center justify-between text-xs transition group"
              >
                <div className="flex items-center space-x-2 text-[#18211E] font-medium">
                  <Award className="w-4 h-4 text-[#C96F4A]" />
                  <span>Creator Benchmark Profile</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#68736D] group-hover:text-[#173F35] transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive Tutor Dialogue Workspace */}
        <div className="lg:col-span-8 space-y-4">
          {/* Contextual Suggested Prompt Chips */}
          <div className="flex flex-wrap items-center gap-2 bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-4 shadow-sm">
            <span className="text-xs text-[#68736D] font-mono font-bold mr-1 flex items-center space-x-1 shrink-0">
              <Lightbulb className="w-3.5 h-3.5 text-[#C96F4A]" />
              <span>Suggested Questions:</span>
            </span>
            {samplePrompts.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuery(promptText)}
                className="px-3 py-1.5 bg-[#E5EEE9] hover:bg-[#D3E0D8] text-[#173F35] border border-[#C9D8D0] rounded-lg text-xs transition font-mono text-left"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Dialogue Container */}
          <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-6 shadow-sm flex flex-col h-[520px]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xl p-5 rounded-2xl space-y-3 ${
                      m.sender === 'user'
                        ? 'bg-[#C96F4A] text-[#FFFDF8] font-medium shadow-sm'
                        : 'bg-[#F7F3EA] border border-[#D9D5CA] text-[#18211E]'
                    }`}
                  >
                    <div className="text-sm leading-relaxed font-sans">{m.text}</div>

                    {m.techniqueName && (
                      <div className="flex items-center space-x-2 pt-1">
                        <span className="inline-flex items-center space-x-1 text-xs font-mono font-bold px-3 py-1 bg-[#E5EEE9] text-[#173F35] border border-[#C9D8D0] rounded-md">
                          <Sparkles className="w-3 h-3 text-[#173F35]" />
                          <span>Technique: {m.techniqueName}</span>
                        </span>
                      </div>
                    )}

                    {m.rationale && (
                      <p className="text-xs text-[#68736D] italic font-sans leading-relaxed border-l-2 border-[#173F35] pl-3 py-0.5">
                        {m.rationale}
                      </p>
                    )}

                    {m.steps && (
                      <div className="space-y-2 pt-2 border-t border-[#D9D5CA]">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#173F35] font-bold block">
                          Step-by-Step Place-Value Decomposition
                        </span>
                        {m.steps.map((s, idx) => (
                          <div
                            key={idx}
                            className="bg-[#FFFDF8] border border-[#E5E0D5] rounded-lg p-3 flex justify-between items-center text-xs font-mono"
                          >
                            <span className="text-[#68736D]">{s.description}</span>
                            <span className="text-[#173F35] font-bold px-2 py-0.5 bg-[#E5EEE9] rounded">
                              {s.subtotal}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="mt-4 flex space-x-3 pt-4 border-t border-[#D9D5CA]">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask e.g. How to calculate 237 x 24 mentally?"
                className="flex-1 bg-[#F7F3EA] border border-[#D9D5CA] rounded-xl px-4 py-3 text-sm text-[#18211E] placeholder-[#68736D] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#173F35] hover:bg-[#0F2C25] text-[#FFFDF8] font-bold rounded-xl shadow-sm transition flex items-center space-x-2 shrink-0 text-sm font-sans"
              >
                <Send className="w-4 h-4 fill-[#FFFDF8]" />
                <span>Ask Tutor</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
