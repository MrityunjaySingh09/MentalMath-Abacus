export interface PredictRequestData {
  historical_accuracy: float;
  avg_response_time_sec: float;
  number_of_digits: number;
  carry_count: number;
  borrow_count: number;
  operand_count: number;
}

export interface PredictResponseData {
  p_correct: number;
  recommended_challenge_level: 'INCREASE_DIFFICULTY' | 'DECREASE_DIFFICULTY' | 'OPTIMAL_ZONE';
}

type float = number;

const ML_SERVICE_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Predict success probability using Python FastAPI ML microservice with automated fallback.
 */
export async function predictUserSuccess(
  data: PredictRequestData
): Promise<PredictResponseData> {
  try {
    const res = await fetch(`${ML_SERVICE_URL}/predict_success`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      return json as PredictResponseData;
    }
  } catch (_err) {
    // Graceful fallback to heuristic probability estimation if Python ML service is unreachable
  }

  // Fallback heuristic modeling P(correct)
  let baseP = data.historical_accuracy / 100;
  if (baseP === 0) baseP = 0.7;

  const penaltyDigits = Math.max(0, data.number_of_digits - 2) * 0.08;
  const penaltyCarries = data.carry_count * 0.05;
  const penaltyBorrows = data.borrow_count * 0.05;

  const p_correct = Math.min(0.99, Math.max(0.1, baseP - penaltyDigits - penaltyCarries - penaltyBorrows));

  let challenge: 'INCREASE_DIFFICULTY' | 'DECREASE_DIFFICULTY' | 'OPTIMAL_ZONE' = 'OPTIMAL_ZONE';
  if (p_correct > 0.85) challenge = 'INCREASE_DIFFICULTY';
  if (p_correct < 0.55) challenge = 'DECREASE_DIFFICULTY';

  return { p_correct, recommended_challenge_level: challenge };
}
