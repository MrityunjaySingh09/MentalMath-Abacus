import { OperationType, DifficultyLevel } from '../math/question-generator';

export interface UserPerformanceSnapshot {
  operation: OperationType;
  recentAccuracy: number; // 0 - 100
  avgResponseTimeMs: number;
  totalAttempts: number;
  currentDifficulty: DifficultyLevel;
}

const DIFFICULTY_RANKS: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD', 'VERY_HARD'];

export const TARGET_RESPONSE_TIMES_MS: Record<OperationType, Record<DifficultyLevel, number>> = {
  ADDITION: { EASY: 2000, MEDIUM: 3500, HARD: 5000, VERY_HARD: 8000 },
  SUBTRACTION: { EASY: 2500, MEDIUM: 4000, HARD: 6000, VERY_HARD: 9000 },
  MULTIPLICATION: { EASY: 3000, MEDIUM: 5000, HARD: 8000, VERY_HARD: 12000 },
  DIVISION: { EASY: 3500, MEDIUM: 6000, HARD: 9000, VERY_HARD: 14000 },
  TABLE_MASTERY: { EASY: 1800, MEDIUM: 2800, HARD: 4500, VERY_HARD: 7000 },
  VISUALIZATION: { EASY: 2200, MEDIUM: 3800, HARD: 5500, VERY_HARD: 8500 },
};

/**
 * Determine next difficulty level based on performance rules.
 */
export function calculateNextDifficulty(snapshot: UserPerformanceSnapshot): DifficultyLevel {
  const currentIndex = DIFFICULTY_RANKS.indexOf(snapshot.currentDifficulty);
  const targetMs = TARGET_RESPONSE_TIMES_MS[snapshot.operation][snapshot.currentDifficulty];

  if (snapshot.recentAccuracy >= 90 && snapshot.avgResponseTimeMs <= targetMs) {
    if (currentIndex < DIFFICULTY_RANKS.length - 1) {
      return DIFFICULTY_RANKS[currentIndex + 1];
    }
  } else if (snapshot.recentAccuracy < 60) {
    if (currentIndex > 0) {
      return DIFFICULTY_RANKS[currentIndex - 1];
    }
  }

  return snapshot.currentDifficulty;
}
