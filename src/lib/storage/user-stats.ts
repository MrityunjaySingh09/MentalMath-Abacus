import { OperationType, DifficultyLevel } from '../math/question-generator';
import { CREATOR_BENCHMARK_PROFILE } from '../math/creator-benchmark';

export interface UserAttemptRecord {
  id: string;
  operation: OperationType;
  difficulty: DifficultyLevel;
  question: string;
  correctAnswer: number;
  userAnswer: number;
  isCorrect: boolean;
  responseTimeMs: number;
  timestamp: number;
  selectedTechnique?: string;
  // ML feature values & label for model retraining (optional for backwards compatibility)
  historical_accuracy?: number; // 0 - 1
  avg_response_time_sec?: number;
  numberOfDigits?: number;
  carryCount?: number;
  borrowCount?: number;
  operandCount?: number;
  label?: number; // 1 or 0
}

export interface OperationSkillSummary {
  operation: OperationType;
  label: string;
  techniqueName: string;
  accuracy: number; // 0-100
  avgResponseTimeMs: number;
  totalAttempts: number;
  totalCorrect: number;
  skillLevel: number; // 1 to 10
}

export interface OverallUserStats {
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;
  avgResponseTimeMs: number;
  currentStreak: number;
  bestStreak: number;
  qpm: number; // Questions per minute
  skills: Record<OperationType, OperationSkillSummary>;
  recommendedOperation: OperationType;
  recommendedTechnique: string;
  recommendationReason: string;
  recentDailyProgress: { day: string; accuracy: number; avgSpeedSec: number }[];
}

const STORAGE_KEY = 'mentalmath_user_attempts_v1';

/**
 * Load raw attempts from localStorage.
 */
export function getSavedAttempts(): UserAttemptRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_e) {
    return [];
  }
}

/**
 * Save a new attempt record to localStorage.
 */
export function recordAttempt(attempt: Omit<UserAttemptRecord, 'id' | 'timestamp'>): UserAttemptRecord {
  const attempts = getSavedAttempts();
  const newRecord: UserAttemptRecord = {
    ...attempt,
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
  };

  attempts.push(newRecord);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts.slice(-500))); // keep last 500 attempts
    } catch (_e) {}
  }
  return newRecord;
}

/**
 * Calculate user stats and adaptive recommendations from real stored attempts.
 */
export function calculateUserStats(): OverallUserStats | null {
  const attempts = getSavedAttempts();
  if (attempts.length === 0) return null;

  const totalAttempts = attempts.length;
  const totalCorrect = attempts.filter((a) => a.isCorrect).length;
  const overallAccuracy = Math.round((totalCorrect / totalAttempts) * 100);
  const avgResponseTimeMs = Math.round(
    attempts.reduce((sum, a) => sum + a.responseTimeMs, 0) / totalAttempts
  );

  // Streak calculation
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  for (let i = 0; i < attempts.length; i++) {
    if (attempts[i].isCorrect) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  currentStreak = tempStreak;

  // QPM calculation
  const qpm = avgResponseTimeMs > 0 ? parseFloat((60000 / avgResponseTimeMs).toFixed(1)) : 0;

  // Operation Breakdown
  const ops: OperationType[] = [
    'ADDITION',
    'SUBTRACTION',
    'MULTIPLICATION',
    'DIVISION',
    'TABLE_MASTERY',
    'VISUALIZATION',
  ];

  const opLabels: Record<OperationType, { label: string; technique: string }> = {
    ADDITION: { label: 'Addition', technique: 'Chunked Addition (Running Total)' },
    SUBTRACTION: { label: 'Subtraction', technique: 'Chunked Subtraction' },
    MULTIPLICATION: { label: 'Multiplication', technique: 'Place-Value Decomposition' },
    DIVISION: { label: 'Division', technique: 'Inverse Reconstruction' },
    TABLE_MASTERY: { label: 'Table Mastery', technique: 'Fast Table Reconstruction' },
    VISUALIZATION: { label: 'Mental Abacus', technique: 'Internalized Bead Feeling' },
  };

  const skills = {} as Record<OperationType, OperationSkillSummary>;

  ops.forEach((op) => {
    const opAttempts = attempts.filter((a) => a.operation === op);
    const opTotal = opAttempts.length;
    const opCorrect = opAttempts.filter((a) => a.isCorrect).length;
    const opAcc = opTotal > 0 ? Math.round((opCorrect / opTotal) * 100) : 0;
    const opAvgMs =
      opTotal > 0 ? Math.round(opAttempts.reduce((sum, a) => sum + a.responseTimeMs, 0) / opTotal) : 0;

    // Skill level formula: scaled by accuracy and speed
    let skillLevel = 1;
    if (opTotal > 0) {
      skillLevel = Math.min(10, Math.max(1, Math.round((opAcc / 10) * (opAvgMs < 3000 ? 1.2 : 0.8))));
    }

    skills[op] = {
      operation: op,
      label: opLabels[op].label,
      techniqueName: opLabels[op].technique,
      accuracy: opAcc,
      avgResponseTimeMs: opAvgMs,
      totalAttempts: opTotal,
      totalCorrect: opCorrect,
      skillLevel,
    };
  });

  // Determine real recommended operation (weakest accuracy or lowest attempts among core ops)
  let lowestAcc = 101;
  let recommendedOperation: OperationType = 'ADDITION';

  ops.forEach((op) => {
    const skill = skills[op];
    if (skill.totalAttempts === 0) {
      if (lowestAcc > 0) {
        lowestAcc = 0;
        recommendedOperation = op;
      }
    } else if (skill.accuracy < lowestAcc) {
      lowestAcc = skill.accuracy;
      recommendedOperation = op;
    }
  });

  const recSkill = skills[recommendedOperation];
  let recommendationReason = '';

  if (recSkill.totalAttempts === 0) {
    recommendationReason = `You haven't practiced ${recSkill.label} yet. Complete a set to establish your skill baseline.`;
  } else if (recSkill.accuracy < 80) {
    recommendationReason = `Your ${recSkill.label} accuracy is currently ${recSkill.accuracy}%. Targeted place-value practice will build confidence.`;
  } else {
    recommendationReason = `Your ${recSkill.label} response time average is ${(recSkill.avgResponseTimeMs / 1000).toFixed(1)}s. Practice to increase calculation velocity.`;
  }

  // Daily progress grouped by day
  const dailyMap: Record<string, { attempts: number; correct: number; totalMs: number }> = {};
  attempts.forEach((a) => {
    const day = new Date(a.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
    if (!dailyMap[day]) {
      dailyMap[day] = { attempts: 0, correct: 0, totalMs: 0 };
    }
    dailyMap[day].attempts++;
    if (a.isCorrect) dailyMap[day].correct++;
    dailyMap[day].totalMs += a.responseTimeMs;
  });

  const recentDailyProgress = Object.keys(dailyMap).map((day) => {
    const d = dailyMap[day];
    return {
      day,
      accuracy: Math.round((d.correct / d.attempts) * 100),
      avgSpeedSec: parseFloat((d.totalMs / d.attempts / 1000).toFixed(1)),
    };
  });

  return {
    totalAttempts,
    totalCorrect,
    overallAccuracy,
    avgResponseTimeMs,
    currentStreak,
    bestStreak,
    qpm,
    skills,
    recommendedOperation,
    recommendedTechnique: opLabels[recommendedOperation].technique,
    recommendationReason,
    recentDailyProgress,
  };
}
