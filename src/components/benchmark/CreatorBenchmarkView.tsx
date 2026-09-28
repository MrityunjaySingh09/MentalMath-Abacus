'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CREATOR_BENCHMARK_PROFILE } from '@/lib/math/creator-benchmark';
import { Trophy, Zap, ShieldCheck, BarChart2, ArrowRight, Target, Clock, TrendingUp } from 'lucide-react';
import { generateQuestion, QuestionData, OperationType } from '@/lib/math/question-generator';
import { recordAttempt } from '@/lib/storage/user-stats';

export const CreatorBenchmarkView: React.FC = () => {
  const [testActive, setTestActive] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [userTimes, setUserTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);

  // 10 standardized benchmark test questions
  const [testQuestions, setTestQuestions] = useState<QuestionData[]>([]);

  const handleStartBenchmark = () => {
    const ops: OperationType[] = [
      'ADDITION',
      'SUBTRACTION',
      'MULTIPLICATION',
      'DIVISION',
      'TABLE_MASTERY',
      'VISUALIZATION',
      'ADDITION',
      'MULTIPLICATION',
      'SUBTRACTION',
      'DIVISION',
    ];
    const qs = ops.map((op) => generateQuestion(op, 'MEDIUM'));
    setTestQuestions(qs);
    setCurrentQIndex(0);
    setUserAnswers([]);
    setUserTimes([]);
    setTestActive(true);
    setTestCompleted(false);
    setStartTime(Date.now());
  };

  const handleAnswerSubmit = (answer: string) => {
    const num = parseInt(answer, 10);
    const elapsed = Date.now() - startTime;

    const newAns = [...userAnswers, num];
    const newTimes = [...userTimes, elapsed];

    setUserAnswers(newAns);
    setUserTimes(newTimes);

    const currentQ = testQuestions[currentQIndex];
    const isCorrect = num === currentQ?.correctAnswer;

    // Log attempt to user stats
    if (currentQ) {
      recordAttempt({
        operation: currentQ.operation,
        difficulty: currentQ.difficulty,
        question: currentQ.questionText,
        correctAnswer: currentQ.correctAnswer,
        userAnswer: num,
        isCorrect,
        responseTimeMs: elapsed,
        selectedTechnique: 'Standard Benchmark Test',
      });
    }

    if (currentQIndex + 1 < testQuestions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setStartTime(Date.now());
    } else {
      setTestActive(false);
      setTestCompleted(true);
    }
  };

  // User benchmark statistics calculation
  const totalCorrect = userAnswers.filter(
    (ans, idx) => ans === testQuestions[idx]?.correctAnswer
  ).length;
  const userAccuracy = testQuestions.length > 0 ? (totalCorrect / testQuestions.length) * 100 : 0;
  const userAvgTime =
    userTimes.length > 0 ? userTimes.reduce((a, b) => a + b, 0) / userTimes.length : 0;
  const userQpm = userAvgTime > 0 ? Math.round(60000 / userAvgTime) : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 select-none py-2">
      {/* Benchmark Masterclass Header */}
      <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 shadow-sm space-y-3">
        <div className="flex items-center space-x-2 text-[#173F35]">
          <Trophy className="w-5 h-5 text-[#C96F4A]" />
          <span className="text-xs uppercase tracking-widest font-mono font-bold">
            Standardized Creator Benchmark Suite
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18211E] font-serif tracking-tight">
          Mental Calculation Target Evaluation
        </h1>
        <p className="text-[#68736D] max-w-3xl text-sm md:text-base leading-relaxed font-sans">
          Compare your calculation velocity (QPM), response delay, and accuracy against the standardized Creator Reference Profile across all 6 core categories.
        </p>
      </div>

      {/* Start Test Prompt Card */}
      {!testActive && !testCompleted && (
        <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 text-center space-y-6 shadow-sm">
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-[#18211E] font-serif">Standardized 10-Question Test Run</h2>
            <p className="text-xs text-[#68736D] font-sans leading-relaxed">
              The evaluation suite tests Addition, Subtraction, Place-Value Multiplication, Division, and Mental Visualization under timed conditions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartBenchmark}
            className="px-8 py-3.5 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold rounded-xl shadow-sm transition text-base inline-flex items-center space-x-2 font-sans"
          >
            <Zap className="w-4 h-4 text-[#FFFDF8]" />
            <span>Start Standardized Benchmark Test</span>
          </button>
        </div>
      )}

      {/* Active Test Screen */}
      {testActive && (
        <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center text-xs font-mono text-[#68736D]">
            <span>
              Question <strong className="text-[#173F35]">{currentQIndex + 1}</strong> / {testQuestions.length}
            </span>
            <span className="px-3 py-1 bg-[#E5EEE9] text-[#173F35] rounded-md border border-[#C9D8D0] font-bold">
              {testQuestions[currentQIndex]?.operation}
            </span>
          </div>

          <div className="text-center py-6">
            <div className="text-4xl sm:text-5xl font-bold font-mono tracking-wider text-[#173F35]">
              {testQuestions[currentQIndex]?.questionText} = ?
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem('answer') as HTMLInputElement).value;
              if (input) {
                handleAnswerSubmit(input);
                e.currentTarget.reset();
              }
            }}
            className="flex space-x-3"
          >
            <input
              type="number"
              name="answer"
              autoFocus
              placeholder="Mental result..."
              className="flex-1 bg-[#F7F3EA] border border-[#D9D5CA] rounded-xl px-4 py-3 text-xl font-mono text-[#18211E] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold rounded-xl text-sm font-sans"
            >
              Next
            </button>
          </form>
        </div>
      )}

      {/* Benchmark Comparison Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono">
        {/* Creator Reference Card */}
        <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-[#D9D5CA] pb-4">
            <ShieldCheck className="w-5 h-5 text-[#173F35]" />
            <div>
              <h3 className="font-bold text-base text-[#18211E] font-serif">Creator Reference Profile</h3>
              <span className="text-xs text-[#173F35] font-mono font-bold">Standard Target Reference</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-[#F7F3EA] p-4 rounded-xl border border-[#D9D5CA] space-y-1">
              <span className="text-[#68736D]">Target Accuracy</span>
              <div className="text-2xl font-bold text-[#173F35]">
                {CREATOR_BENCHMARK_PROFILE.accuracy}%
              </div>
            </div>
            <div className="bg-[#F7F3EA] p-4 rounded-xl border border-[#D9D5CA] space-y-1">
              <span className="text-[#68736D]">Avg Response Speed</span>
              <div className="text-2xl font-bold text-[#C96F4A]">
                {(CREATOR_BENCHMARK_PROFILE.avgResponseTimeMs / 1000).toFixed(2)}s
              </div>
            </div>
            <div className="bg-[#F7F3EA] p-4 rounded-xl border border-[#D9D5CA] space-y-1">
              <span className="text-[#68736D]">Fastest Speed</span>
              <div className="text-2xl font-bold text-[#537063]">
                {(CREATOR_BENCHMARK_PROFILE.fastestResponseMs / 1000).toFixed(2)}s
              </div>
            </div>
            <div className="bg-[#F7F3EA] p-4 rounded-xl border border-[#D9D5CA] space-y-1">
              <span className="text-[#68736D]">Target Velocity</span>
              <div className="text-2xl font-bold text-[#173F35]">
                {CREATOR_BENCHMARK_PROFILE.qpm} QPM
              </div>
            </div>
          </div>
        </div>

        {/* User Benchmark Score Card */}
        <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3 border-b border-[#D9D5CA] pb-4">
            <BarChart2 className="w-5 h-5 text-[#C96F4A]" />
            <div>
              <h3 className="font-bold text-base text-[#18211E] font-serif">Your Benchmark Score</h3>
              <span className="text-xs text-[#68736D] font-mono">
                {testCompleted ? 'Latest Test Run Results' : 'Take test to generate profile'}
              </span>
            </div>
          </div>

          {testCompleted ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-[#F7F3EA] p-4 rounded-xl border border-[#D9D5CA] space-y-1">
                  <span className="text-[#68736D]">Your Accuracy</span>
                  <div className="text-2xl font-bold text-[#173F35]">{userAccuracy.toFixed(1)}%</div>
                </div>
                <div className="bg-[#F7F3EA] p-4 rounded-xl border border-[#D9D5CA] space-y-1">
                  <span className="text-[#68736D]">Your Avg Speed</span>
                  <div className="text-2xl font-bold text-[#C96F4A]">
                    {(userAvgTime / 1000).toFixed(2)}s
                  </div>
                </div>
                <div className="bg-[#F7F3EA] p-4 rounded-xl border border-[#D9D5CA] space-y-1">
                  <span className="text-[#68736D]">Questions Solved</span>
                  <div className="text-2xl font-bold text-[#537063]">
                    {totalCorrect} / {testQuestions.length}
                  </div>
                </div>
                <div className="bg-[#F7F3EA] p-4 rounded-xl border border-[#D9D5CA] space-y-1">
                  <span className="text-[#68736D]">Your Velocity</span>
                  <div className="text-2xl font-bold text-[#173F35]">{userQpm} QPM</div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/practice/multiplication"
                  className="w-full py-3 bg-[#173F35] hover:bg-[#0F2C25] text-[#FFFDF8] font-bold text-xs rounded-xl shadow-sm transition inline-flex items-center justify-center space-x-2 font-sans"
                >
                  <span>Start Recommended Practice Session</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-[#68736D] text-xs font-mono text-center space-y-2">
              <span>Complete a 10-question benchmark run to generate your performance comparison.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
