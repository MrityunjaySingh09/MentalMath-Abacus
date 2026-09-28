import { OperationType, DifficultyLevel } from './question-generator';

export interface OperationBenchmarkStats {
  operation: OperationType;
  accuracy: number; // percentage e.g. 98.5
  avgResponseTimeMs: number;
  qpm: number;
  totalQuestions: number;
}

export interface CreatorBenchmarkData {
  id: string;
  name: string;
  isCreatorProfile: boolean;
  accuracy: number;
  avgResponseTimeMs: number;
  medianResponseTimeMs: number;
  fastestResponseMs: number;
  slowestResponseMs: number;
  bestStreak: number;
  qpm: number;
  maxDifficulty: DifficultyLevel;
  operationStats: Record<OperationType, OperationBenchmarkStats>;
}

export const CREATOR_BENCHMARK_PROFILE: CreatorBenchmarkData = {
  id: 'creator_reference_v1',
  name: 'Creator Reference Profile',
  isCreatorProfile: true,
  accuracy: 97.4,
  avgResponseTimeMs: 1420,
  medianResponseTimeMs: 1280,
  fastestResponseMs: 410,
  slowestResponseMs: 3100,
  bestStreak: 48,
  qpm: 42.3,
  maxDifficulty: 'VERY_HARD',
  operationStats: {
    ADDITION: {
      operation: 'ADDITION',
      accuracy: 98.8,
      avgResponseTimeMs: 1150,
      qpm: 52.1,
      totalQuestions: 150,
    },
    SUBTRACTION: {
      operation: 'SUBTRACTION',
      accuracy: 97.5,
      avgResponseTimeMs: 1380,
      qpm: 43.4,
      totalQuestions: 150,
    },
    MULTIPLICATION: {
      operation: 'MULTIPLICATION',
      accuracy: 96.2,
      avgResponseTimeMs: 1750,
      qpm: 34.2,
      totalQuestions: 150,
    },
    DIVISION: {
      operation: 'DIVISION',
      accuracy: 95.1,
      avgResponseTimeMs: 1980,
      qpm: 30.3,
      totalQuestions: 150,
    },
    TABLE_MASTERY: {
      operation: 'TABLE_MASTERY',
      accuracy: 99.2,
      avgResponseTimeMs: 950,
      qpm: 63.1,
      totalQuestions: 150,
    },
    VISUALIZATION: {
      operation: 'VISUALIZATION',
      accuracy: 98.0,
      avgResponseTimeMs: 1300,
      qpm: 46.1,
      totalQuestions: 150,
    },
  },
};
