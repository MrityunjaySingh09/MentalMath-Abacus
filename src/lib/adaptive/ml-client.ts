import { getSavedAttempts } from '../storage/user-stats';

export interface PredictRequestData {
  historical_accuracy: number; // Normalized 0.0 - 1.0
  avg_response_time_sec: number;
  number_of_digits: number;
  carry_count: number;
  borrow_count: number;
  operand_count: number;
}

export interface PredictResponseData {
  p_correct: number;
  recommended_challenge_level: 'INCREASE_DIFFICULTY' | 'DECREASE_DIFFICULTY' | 'OPTIMAL_ZONE';
}

export interface TrainResponseData {
  status: 'trained' | 'skipped';
  samples_received: number;
  reason?: string;
}

const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL || 'https://mentalmath-ml.onrender.com';
const ATTEMPTS_SINCE_TRAIN_KEY = 'mentalmath_attempts_since_train_v1';

// Circuit-breaker state to prevent 1500ms fetch delay on every answer when ML service is offline
let isServiceOffline = false;
let lastOfflineCheckTime = 0;
const OFFLINE_RETRY_INTERVAL_MS = 15000; // Retry server check every 15s

/**
 * Fallback heuristic modeling P(correct), expecting historical_accuracy as 0.0 - 1.0.
 * Executes instantaneously with 0ms network latency.
 */
function getFallbackPrediction(data: PredictRequestData): PredictResponseData {
  let baseP = data.historical_accuracy;
  if (!baseP) baseP = 0.7;

  const penaltyDigits = Math.max(0, data.number_of_digits - 2) * 0.08;
  const penaltyCarries = data.carry_count * 0.05;
  const penaltyBorrows = data.borrow_count * 0.05;

  const p_correct = Math.min(0.99, Math.max(0.1, baseP - penaltyDigits - penaltyCarries - penaltyBorrows));

  let challenge: 'INCREASE_DIFFICULTY' | 'DECREASE_DIFFICULTY' | 'OPTIMAL_ZONE' = 'OPTIMAL_ZONE';
  if (p_correct > 0.85) challenge = 'INCREASE_DIFFICULTY';
  if (p_correct < 0.55) challenge = 'DECREASE_DIFFICULTY';

  return { p_correct, recommended_challenge_level: challenge };
}

/**
 * Predict success probability using Python FastAPI ML microservice with automated fallback.
 * Includes a 1500 ms timeout via AbortController and a circuit breaker so the UI never lags when offline.
 */
export async function predictUserSuccess(
  data: PredictRequestData
): Promise<PredictResponseData> {
  const now = Date.now();

  // If service was recently detected offline, instantly return heuristic without blocking UI
  if (isServiceOffline && now - lastOfflineCheckTime < OFFLINE_RETRY_INTERVAL_MS) {
    return getFallbackPrediction(data);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const res = await fetch(`${ML_SERVICE_URL}/predict_success`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
      signal: controller.signal,
    });

    if (res.ok) {
      isServiceOffline = false; // Service is alive
      const json = await res.json();
      return json as PredictResponseData;
    } else {
      isServiceOffline = true;
      lastOfflineCheckTime = now;
    }
  } catch (_err) {
    // Mark offline so subsequent questions return instantly via fallback
    isServiceOffline = true;
    lastOfflineCheckTime = now;
  } finally {
    clearTimeout(timeoutId);
  }

  return getFallbackPrediction(data);
}

/**
 * Retrain the ML model using saved attempts from localStorage with feature values.
 * Only sends when at least 20 valid attempts are available. Fails silently on network error.
 */
export async function trainModelFromAttempts(): Promise<TrainResponseData | null> {
  const now = Date.now();
  if (isServiceOffline && now - lastOfflineCheckTime < OFFLINE_RETRY_INTERVAL_MS) {
    return null;
  }

  const attempts = getSavedAttempts();

  // Filter attempts that have all 6 features recorded
  const validAttempts = attempts.filter(
    (a) =>
      typeof a.historical_accuracy === 'number' &&
      typeof a.avg_response_time_sec === 'number' &&
      typeof a.numberOfDigits === 'number' &&
      typeof a.carryCount === 'number' &&
      typeof a.borrowCount === 'number' &&
      typeof a.operandCount === 'number'
  );

  if (validAttempts.length < 20) {
    return null;
  }

  const features: number[][] = validAttempts.map((a) => [
    a.historical_accuracy!,
    a.avg_response_time_sec!,
    a.numberOfDigits!,
    a.carryCount!,
    a.borrowCount!,
    a.operandCount!,
  ]);

  const labels: number[] = validAttempts.map((a) =>
    typeof a.label === 'number' ? a.label : a.isCorrect ? 1 : 0
  );

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const res = await fetch(`${ML_SERVICE_URL}/train_model`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features, labels }),
      cache: 'no-store',
      signal: controller.signal,
    });

    if (res.ok) {
      isServiceOffline = false;
      const json = await res.json();
      return json as TrainResponseData;
    } else {
      isServiceOffline = true;
      lastOfflineCheckTime = now;
      console.warn(`[ML-Client] /train_model returned HTTP ${res.status}`);
    }
  } catch (err) {
    isServiceOffline = true;
    lastOfflineCheckTime = now;
    console.warn('[ML-Client] trainModelFromAttempts failed or timed out (service may be offline):', err);
  } finally {
    clearTimeout(timeoutId);
  }

  return null;
}

/**
 * Tracks attempt counter in localStorage and triggers model training after every 20 attempts.
 */
export function trackAttemptAndTrainIfNeeded(): void {
  if (typeof window === 'undefined') return;
  try {
    const prevCount = parseInt(localStorage.getItem(ATTEMPTS_SINCE_TRAIN_KEY) || '0', 10);
    const newCount = prevCount + 1;
    if (newCount >= 20) {
      localStorage.setItem(ATTEMPTS_SINCE_TRAIN_KEY, '0');
      trainModelFromAttempts().catch((err) =>
        console.warn('[ML-Client] Background model training failed:', err)
      );
    } else {
      localStorage.setItem(ATTEMPTS_SINCE_TRAIN_KEY, newCount.toString());
    }
  } catch (_e) {
    // Gracefully handle any localStorage access restrictions
  }
}
