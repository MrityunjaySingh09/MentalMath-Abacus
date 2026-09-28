'use client';

import React, { useState, useEffect } from 'react';
import { SorobanAbacus } from './SorobanAbacus';
import { generateQuestion, QuestionData } from '@/lib/math/question-generator';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Eye, EyeOff, Lightbulb, Zap } from 'lucide-react';
import { recordAttempt } from '@/lib/storage/user-stats';

export interface LevelConfig {
  level: number;
  stageName: string;
  name: string;
  description: string;
  pedagogicalRationale: string;
  opacity: number;
  flashMs: number | null;
  hidden: boolean;
  interactive: boolean;
}

export const ABACUS_STAGES: LevelConfig[] = [
  {
    level: 1,
    stageName: 'STAGE 1: VISIBLE MANIPULATION',
    name: 'Level 1: Interactive Exploration',
    description: 'Manipulate beads freely to understand how decimal place-values map to upper (5) and lower (1) beads.',
    pedagogicalRationale: 'Establishes direct tactile familiarity with Soroban place-value columns.',
    opacity: 1,
    flashMs: null,
    hidden: false,
    interactive: true,
  },
  {
    level: 2,
    stageName: 'STAGE 2: GUIDED BEAD MOVEMENT',
    name: 'Level 2: Step-by-Step Guided Steps',
    description: 'Follow step-by-step bead instructions to execute mental place-value additions and subtractions.',
    pedagogicalRationale: 'Builds muscle memory and standard left-to-right calculation movements.',
    opacity: 1,
    flashMs: null,
    hidden: false,
    interactive: true,
  },
  {
    level: 3,
    stageName: 'STAGE 1: VISIBLE MANIPULATION',
    name: 'Level 3: Full Visible Practice',
    description: 'Solve arithmetic problems with the complete visible Soroban board.',
    pedagogicalRationale: 'Strengthens calculation speed with full visual feedback.',
    opacity: 1,
    flashMs: null,
    hidden: false,
    interactive: true,
  },
  {
    level: 4,
    stageName: 'STAGE 3: FADED SILHOUETTE',
    name: 'Level 4: Partial Spatial Visualization',
    description: 'The abacus becomes semi-transparent. Rely on internal spatial reconstruction.',
    pedagogicalRationale: 'Forces the brain to reconstruct bead positions from memory rather than relying purely on sight.',
    opacity: 0.35,
    flashMs: null,
    hidden: false,
    interactive: true,
  },
  {
    level: 5,
    stageName: 'STAGE 4: FLASH EXPOSURE (1.5s)',
    name: 'Level 5: Flash Bead Exposure',
    description: 'The abacus appears for 1.5 seconds and then hides. Hold the image in your mind.',
    pedagogicalRationale: 'Trains rapid image capture and after-image retention.',
    opacity: 1,
    flashMs: 1500,
    hidden: false,
    interactive: false,
  },
  {
    level: 6,
    stageName: 'STAGE 4: FLASH EXPOSURE (1.0s)',
    name: 'Level 6: Rapid Flash Exposure',
    description: 'The abacus appears for 1 second and disappears. Complete the calculation mentally.',
    pedagogicalRationale: 'Accelerates mental image decay resistance.',
    opacity: 1,
    flashMs: 1000,
    hidden: false,
    interactive: false,
  },
  {
    level: 7,
    stageName: 'STAGE 5: MENTAL INTERNALIZATION',
    name: 'Level 7: Numbers Only',
    description: 'No physical abacus is shown. Calculate purely with your internalized mental abacus.',
    pedagogicalRationale: 'Achieves pure mental representation without external visual aids.',
    opacity: 0,
    flashMs: null,
    hidden: true,
    interactive: false,
  },
  {
    level: 8,
    stageName: 'STAGE 5: MENTAL INTERNALIZATION',
    name: 'Level 8: Rapid Mental Arithmetic',
    description: 'High-speed mental calculation using your internalized bead representation.',
    pedagogicalRationale: 'Achieves peak calculation velocity and fluency.',
    opacity: 0,
    flashMs: null,
    hidden: true,
    interactive: false,
  },
];

export const AbacusTrainer: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [question, setQuestion] = useState<QuestionData>(() => generateQuestion('VISUALIZATION', 'EASY'));
  const [userAnswer, setUserAnswer] = useState('');
  const [abacusValue, setAbacusValue] = useState(0);
  const [isFlashVisible, setIsFlashVisible] = useState(true);
  const [startTime, setStartTime] = useState(Date.now());
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [streak, setStreak] = useState(0);

  const levelCfg = ABACUS_STAGES[currentLevelIdx];

  useEffect(() => {
    setFeedback(null);
    setUserAnswer('');
    setAbacusValue(0);
    setStartTime(Date.now());

    if (levelCfg.flashMs) {
      setIsFlashVisible(true);
      const timer = setTimeout(() => {
        setIsFlashVisible(false);
      }, levelCfg.flashMs);
      return () => clearTimeout(timer);
    } else {
      setIsFlashVisible(!levelCfg.hidden);
    }
  }, [currentLevelIdx, question, levelCfg]);

  const handleNextQuestion = () => {
    const diff = currentLevelIdx >= 6 ? 'MEDIUM' : 'EASY';
    setQuestion(generateQuestion('VISUALIZATION', diff));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const responseTimeMs = Date.now() - startTime;
    const numericAns = parseInt(userAnswer || abacusValue.toString(), 10);
    if (isNaN(numericAns)) return;

    const isCorrect = numericAns === question.correctAnswer;

    if (isCorrect) {
      setFeedback({ isCorrect: true, message: 'Correct! Excellent mental bead visualization.' });
      setStreak((prev) => prev + 1);
    } else {
      setFeedback({
        isCorrect: false,
        message: `Incorrect. Correct answer was ${question.correctAnswer}.`,
      });
      setStreak(0);
    }

    // Persist attempt to localStorage for User Stats & Dashboard
    recordAttempt({
      operation: 'VISUALIZATION',
      difficulty: question.difficulty,
      question: question.questionText,
      correctAnswer: question.correctAnswer,
      userAnswer: numericAns,
      isCorrect,
      responseTimeMs,
      selectedTechnique: 'Internalized Abacus',
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none py-2">
      {/* 5-Stage Progression Track Selector */}
      <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#D9D5CA] pb-3">
          <div className="flex items-center space-x-2 text-[#173F35]">
            <Sparkles className="w-4 h-4 text-[#C96F4A]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              Mental Progression Track (5 Stages)
            </span>
          </div>

          <span className="text-xs font-mono text-[#173F35] font-bold">
            Current Stage: {levelCfg.stageName}
          </span>
        </div>

        {/* Level Buttons Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 font-mono">
          {ABACUS_STAGES.map((lvl, idx) => (
            <button
              key={lvl.level}
              type="button"
              onClick={() => setCurrentLevelIdx(idx)}
              className={`p-2.5 rounded-xl text-center transition-all ${
                idx === currentLevelIdx
                  ? 'bg-[#173F35] text-[#FFFDF8] font-bold shadow-sm'
                  : 'bg-[#F7F3EA] hover:bg-[#EBE5D8] text-[#68736D]'
              }`}
            >
              <div className="text-xs font-bold">L{lvl.level}</div>
              <div className="text-[9px] opacity-80 truncate">{lvl.name.split(':')[0]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stage Rationale Explanation Banner */}
      <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-6 shadow-sm space-y-2">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-[#C96F4A] uppercase tracking-wider block">
              {levelCfg.stageName}
            </span>
            <h2 className="text-xl font-bold text-[#18211E] font-serif">{levelCfg.name}</h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-[#E5EEE9] text-[#173F35] rounded-md border border-[#C9D8D0]">
            Streak: <strong className="text-[#173F35]">{streak}</strong>
          </span>
        </div>
        <p className="text-xs text-[#68736D] font-sans leading-relaxed">{levelCfg.description}</p>

        <div className="flex items-center space-x-2 pt-2 text-[11px] font-mono text-[#173F35]">
          <Lightbulb className="w-3.5 h-3.5 text-[#C96F4A]" />
          <span>Rationale: {levelCfg.pedagogicalRationale}</span>
        </div>
      </div>

      {/* Main Abacus Training Instrument Card */}
      <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 shadow-sm space-y-8">
        {/* Question Display */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#68736D] font-mono font-semibold">
            Calculate Mentally
          </span>
          <div className="text-4xl md:text-5xl font-bold font-mono tracking-wider text-[#173F35]">
            {question.questionText} = ?
          </div>
        </div>

        {/* Centerpiece Soroban Abacus Visualizer */}
        <div className="flex justify-center">
          <SorobanAbacus
            numRods={7}
            initialValue={0}
            onChangeValue={(val) => setAbacusValue(val)}
            interactive={levelCfg.interactive}
            opacity={levelCfg.opacity}
            hidden={!isFlashVisible}
          />
        </div>

        {/* Answer Submission Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div className="flex space-x-3">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter mental answer..."
              className="flex-1 bg-[#F7F3EA] border border-[#D9D5CA] rounded-xl px-4 py-3 text-lg font-mono text-[#18211E] placeholder-[#68736D] focus:outline-none focus:ring-2 focus:ring-[#173F35]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold rounded-xl shadow-sm transition flex items-center space-x-2 text-sm font-sans"
            >
              <span>Submit</span>
            </button>
          </div>
        </form>

        {/* Feedback Display */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
              feedback.isCorrect
                ? 'bg-[#E5EEE9] border-[#3E8066] text-[#173F35]'
                : 'bg-[#F3E2D9] border-[#C96F4A] text-[#944426]'
            }`}
          >
            <div className="flex items-center space-x-3">
              {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-[#3E8066]" /> : <XCircle className="w-5 h-5 text-[#B85C5C]" />}
              <span className="font-semibold">{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-[#173F35] hover:bg-[#0F2C25] text-[#FFFDF8] text-xs font-bold rounded-lg transition flex items-center space-x-1 font-sans"
            >
              <span>Next Problem</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
