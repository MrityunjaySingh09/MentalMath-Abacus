'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  OperationType,
  DifficultyLevel,
  QuestionData,
  generateQuestion,
} from '@/lib/math/question-generator';
import { calculateNextDifficulty, DIFFICULTY_RANKS } from '@/lib/adaptive/rule-adaptive';
import { predictUserSuccess, trackAttemptAndTrainIfNeeded } from '@/lib/adaptive/ml-client';
import { recordAttempt } from '@/lib/storage/user-stats';
import { Timer, CheckCircle2, XCircle, ArrowRight, TrendingUp } from 'lucide-react';

interface PracticeSuiteProps {
  initialOperation?: OperationType;
}

export const PracticeSuite: React.FC<PracticeSuiteProps> = ({
  initialOperation = 'ADDITION',
}) => {
  const [operation, setOperation] = useState<OperationType>(initialOperation);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('EASY');
  const [question, setQuestion] = useState<QuestionData>(() =>
    generateQuestion(initialOperation, 'EASY')
  );
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedTechnique, setSelectedTechnique] = useState<string>('');
  const [showBreakdown, setShowBreakdown] = useState(true);

  // Performance tracking state
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [adaptiveNote, setAdaptiveNote] = useState<string>('Difficulty: EASY · Building Baseline');
  const [recentTimes, setRecentTimes] = useState<number[]>([]);
  const [attemptsAtCurrentDifficulty, setAttemptsAtCurrentDifficulty] = useState<number>(0);
  const [lastPredictedSuccess, setLastPredictedSuccess] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    timeMs: number;
    correctAnswer: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setQuestion(generateQuestion(operation, difficulty));
    setUserAnswer('');
    setShowBreakdown(true);
    setFeedback(null);
    setStartTime(Date.now());
    setElapsedMs(0);

    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);

    if (inputRef.current) inputRef.current.focus();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [operation, difficulty]);

  // Handle Enter key navigation for next question
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && feedback) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [feedback]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim()) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const responseTimeMs = Date.now() - startTime;
    const numericAns = parseInt(userAnswer, 10);
    const isCorrect = numericAns === question.correctAnswer;

    setTotalAttempts((prev) => prev + 1);
    if (isCorrect) {
      setTotalCorrect((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    const updatedTimes = [...recentTimes, responseTimeMs].slice(-5);
    setRecentTimes(updatedTimes);

    // Show feedback immediately without waiting for background network requests
    setFeedback({
      isCorrect,
      timeMs: responseTimeMs,
      correctAnswer: question.correctAnswer,
    });

    // Performance calculations
    const updatedTotalAttempts = totalAttempts + 1;
    const updatedTotalCorrect = totalCorrect + (isCorrect ? 1 : 0);
    const newAccPercent = (updatedTotalCorrect / updatedTotalAttempts) * 100; // 0 - 100 for rule engine
    const histAcc01 = updatedTotalCorrect / updatedTotalAttempts; // 0.0 - 1.0 normalized for ML service
    const avgTimeMs = updatedTimes.reduce((a, b) => a + b, 0) / updatedTimes.length;
    const avgTimeSec = avgTimeMs / 1000;

    // Record attempt to localStorage with 6 prediction features + label for model retraining
    recordAttempt({
      operation,
      difficulty,
      question: question.questionText,
      correctAnswer: question.correctAnswer,
      userAnswer: numericAns,
      isCorrect,
      responseTimeMs,
      selectedTechnique: selectedTechnique || question.recommendedTechnique,
      historical_accuracy: histAcc01,
      avg_response_time_sec: avgTimeSec,
      numberOfDigits: question.numberOfDigits,
      carryCount: question.carryCount,
      borrowCount: question.borrowCount,
      operandCount: question.operandCount,
      label: isCorrect ? 1 : 0,
    });

    // Auto-train model after every 20 recorded attempts
    trackAttemptAndTrainIfNeeded();

    // 1. Compute rule-based recommendation
    const ruleNext = calculateNextDifficulty({
      operation,
      recentAccuracy: newAccPercent,
      avgResponseTimeMs: avgTimeMs,
      totalAttempts: updatedTotalAttempts,
      currentDifficulty: difficulty,
    });

    // 2. Fetch ML success prediction (normalized 0-1 historical accuracy, 1500ms timeout fallback)
    const ml = await predictUserSuccess({
      historical_accuracy: histAcc01,
      avg_response_time_sec: avgTimeSec,
      number_of_digits: question.numberOfDigits,
      carry_count: question.carryCount,
      borrow_count: question.borrowCount,
      operand_count: question.operandCount,
    });

    setLastPredictedSuccess(ml.p_correct);

    // 3. Combined Rules + ML Adaptive Logic:
    // - Rule UP + ML not DECREASE -> go UP (agree = "rules + ML", otherwise "rules")
    // - Rule DOWN + ML not INCREASE -> go DOWN (agree = "rules + ML", otherwise "rules")
    // - Rule STAY + ML INCREASE + >= 5 attempts at this level -> go UP one level ("ML")
    // - Rule STAY + ML DECREASE + >= 5 attempts at this level -> go DOWN one level ("ML")
    // - Otherwise keep current difficulty
    const currentRank = DIFFICULTY_RANKS.indexOf(difficulty);
    const ruleRank = DIFFICULTY_RANKS.indexOf(ruleNext);
    const ruleDirection = ruleRank > currentRank ? 'UP' : ruleRank < currentRank ? 'DOWN' : 'STAY';
    const attemptsThisDiff = attemptsAtCurrentDifficulty + 1;

    let finalRank = currentRank;
    let decisionSource: 'rules' | 'ML' | 'rules + ML' | null = null;

    if (ruleDirection === 'UP' && ml.recommended_challenge_level !== 'DECREASE_DIFFICULTY') {
      finalRank = Math.min(DIFFICULTY_RANKS.length - 1, currentRank + 1);
      if (finalRank > currentRank) {
        decisionSource = ml.recommended_challenge_level === 'INCREASE_DIFFICULTY' ? 'rules + ML' : 'rules';
      }
    } else if (ruleDirection === 'DOWN' && ml.recommended_challenge_level !== 'INCREASE_DIFFICULTY') {
      finalRank = Math.max(0, currentRank - 1);
      if (finalRank < currentRank) {
        decisionSource = ml.recommended_challenge_level === 'DECREASE_DIFFICULTY' ? 'rules + ML' : 'rules';
      }
    } else if (ruleDirection === 'STAY') {
      if (ml.recommended_challenge_level === 'INCREASE_DIFFICULTY' && attemptsThisDiff >= 5) {
        finalRank = Math.min(DIFFICULTY_RANKS.length - 1, currentRank + 1);
        if (finalRank > currentRank) {
          decisionSource = 'ML';
        }
      } else if (ml.recommended_challenge_level === 'DECREASE_DIFFICULTY' && attemptsThisDiff >= 5) {
        finalRank = Math.max(0, currentRank - 1);
        if (finalRank < currentRank) {
          decisionSource = 'ML';
        }
      }
    }

    const nextDiff = DIFFICULTY_RANKS[finalRank];

    if (nextDiff !== difficulty && decisionSource) {
      const actionText = finalRank > currentRank ? 'Difficulty increased to' : 'Difficulty adjusted to';
      const sourceText = decisionSource === 'rules + ML' ? 'rules + ML agree' : decisionSource;
      setAdaptiveNote(
        `${actionText} ${nextDiff} · ${sourceText} (p=${ml.p_correct.toFixed(2)})`
      );
      setAttemptsAtCurrentDifficulty(0);
      setDifficulty(nextDiff);
    } else {
      setAttemptsAtCurrentDifficulty(attemptsThisDiff);
    }
  };

  const handleNext = () => {
    setQuestion(generateQuestion(operation, difficulty));
    setUserAnswer('');
    setSelectedTechnique('');
    setShowBreakdown(true);
    setFeedback(null);
    setStartTime(Date.now());
    setElapsedMs(0);

    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);

    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 select-none py-4">
      {/* Operation Selection Strip */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-1.5 font-mono">
          {(['ADDITION', 'SUBTRACTION', 'MULTIPLICATION', 'DIVISION', 'TABLE_MASTERY'] as OperationType[]).map(
            (op) => (
              <button
                key={op}
                type="button"
                onClick={() => {
                  setOperation(op);
                  setAttemptsAtCurrentDifficulty(0);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  op === operation
                    ? 'bg-[#173F35] text-[#FFFDF8] font-bold shadow-sm'
                    : 'bg-[#F7F3EA] hover:bg-[#EBE5D8] text-[#68736D]'
                }`}
              >
                {op}
              </button>
            )
          )}
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1 bg-[#E5EEE9] text-[#173F35] border border-[#C9D8D0] rounded-lg font-bold">
            {difficulty}
          </span>
        </div>
      </div>

      {/* Secondary Performance Header Strip */}
      <div className="flex justify-between items-center text-xs font-mono text-[#68736D] px-2">
        <div className="flex items-center space-x-2">
          <Timer className="w-4 h-4 text-[#173F35]" />
          <span>Timer: </span>
          <strong className="text-[#18211E] text-sm font-bold">
            {(elapsedMs / 1000).toFixed(1)}s
          </strong>
        </div>

        <div className="flex items-center space-x-4">
          {lastPredictedSuccess !== null && (
            <span>
              Predicted success:{' '}
              <strong className="text-[#173F35]">{Math.round(lastPredictedSuccess * 100)}%</strong>
            </span>
          )}
          <span>
            Accuracy: <strong className="text-[#173F35]">{accuracy}%</strong>
          </span>
          <span>
            Streak: <strong className="text-[#C96F4A]">{streak}</strong>
          </span>
        </div>
      </div>

      {/* Main Focused Training Centerpiece */}
      <div className="bg-[#FFFDF8] border border-[#D9D5CA] rounded-2xl p-8 sm:p-12 shadow-sm space-y-10 text-center relative overflow-hidden">
        {/* Adaptive Context Note */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#E5EEE9] border border-[#C9D8D0] rounded-full text-xs font-mono font-bold text-[#173F35]">
          <TrendingUp className="w-3.5 h-3.5 text-[#173F35]" />
          <span>{adaptiveNote}</span>
        </div>

        {/* Core Problem Centerpiece */}
        <div className="space-y-2 py-4">
          <span className="text-xs uppercase tracking-widest text-[#68736D] font-mono font-semibold block">
            Mental Calculation Task
          </span>
          <div className="text-5xl sm:text-6xl md:text-7xl font-black font-mono tracking-wider text-[#173F35]">
            {question.questionText} = ?
          </div>
        </div>

        {/* Satisfying Answer Entry Form */}
        {!feedback ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="flex space-x-3">
              <input
                ref={inputRef}
                type="number"
                autoFocus
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Result..."
                className="flex-1 bg-[#F7F3EA] border-2 border-[#D9D5CA] focus:border-[#173F35] rounded-xl px-5 py-4 text-3xl font-mono font-bold text-[#18211E] placeholder-[#68736D] focus:outline-none focus:ring-2 focus:ring-[#173F35]/20 text-center transition"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#C96F4A] hover:bg-[#B85B38] text-[#FFFDF8] font-bold rounded-xl shadow-sm transition text-base font-sans shrink-0"
              >
                Submit
              </button>
            </div>
            <span className="text-[11px] text-[#68736D] font-mono block">
              Press <kbd className="px-1.5 py-0.5 bg-[#F7F3EA] border border-[#D9D5CA] rounded text-[#18211E]">Enter</kbd> to submit
            </span>
          </form>
        ) : (
          /* Feedback & Method Decomposer Card */
          <div className="max-w-2xl mx-auto space-y-6 text-left">
            <div
              className={`p-6 rounded-xl border flex items-center justify-between text-base ${
                feedback.isCorrect
                  ? 'bg-[#E5EEE9] border-[#3E8066] text-[#173F35]'
                  : 'bg-[#F3E2D9] border-[#C96F4A] text-[#944426]'
              }`}
            >
              <div className="flex items-center space-x-3 font-mono">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-[#3E8066]" />
                ) : (
                  <XCircle className="w-6 h-6 text-[#B85C5C]" />
                )}
                <div>
                  <span className="font-bold text-lg block">
                    {feedback.isCorrect ? 'Correct!' : `Incorrect (Correct: ${feedback.correctAnswer})`}
                  </span>
                  <span className="text-xs opacity-90 block">
                    Response delay: {(feedback.timeMs / 1000).toFixed(2)} seconds
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-[#173F35] hover:bg-[#0F2C25] text-[#FFFDF8] font-bold rounded-xl shadow-sm transition flex items-center space-x-2 text-xs font-sans shrink-0"
              >
                <span>Next Problem</span>
                <ArrowRight className="w-4 h-4 text-[#FFFDF8]" />
              </button>
            </div>

            {/* Technique Self-Report Selector */}
            <div className="bg-[#F7F3EA] border border-[#D9D5CA] rounded-xl p-4 space-y-2.5">
              <span className="text-xs uppercase tracking-wider font-bold text-[#68736D] font-mono block">
                Which technique did you use for this problem?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-sans">
                {[
                  'Place-Value Decomposition',
                  'Chunk Decomposition',
                  'Easy-Number Recognition',
                  'Mental Abacus',
                  'Direct Memorization',
                  'Other / Standard',
                ].map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => setSelectedTechnique(tech)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition text-center ${
                      selectedTechnique === tech
                        ? 'bg-[#173F35] text-[#FFFDF8] border-[#173F35] font-bold'
                        : 'bg-[#FFFDF8] border-[#D9D5CA] text-[#68736D] hover:border-[#173F35]'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Creator Method Decomposer Breakdown */}
            {showBreakdown && (
              <div className="bg-[#F7F3EA] border border-[#D9D5CA] rounded-xl p-5 space-y-3 font-mono">
                <div className="flex justify-between items-center border-b border-[#D9D5CA] pb-2">
                  <span className="text-xs font-bold text-[#173F35] uppercase tracking-widest">
                    Creator Method Breakdown ({question.recommendedTechnique})
                  </span>
                  <span className="text-[11px] text-[#68736D]">Left-to-Right Deconstruct</span>
                </div>

                <div className="space-y-2">
                  {question.stepBreakdown.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-xs bg-[#FFFDF8] px-4 py-2.5 rounded-lg border border-[#E5E0D5]"
                    >
                      <span className="text-[#68736D]">{s.description}</span>
                      <span className="text-[#173F35] font-bold">{s.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
