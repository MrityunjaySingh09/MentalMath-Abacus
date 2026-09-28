export type OperationType =
  | 'ADDITION'
  | 'SUBTRACTION'
  | 'MULTIPLICATION'
  | 'DIVISION'
  | 'TABLE_MASTERY'
  | 'VISUALIZATION';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'VERY_HARD';

export interface TechniqueStep {
  description: string;
  expression: string;
  subtotal: number;
}

export interface QuestionData {
  id: string;
  operation: OperationType;
  difficulty: DifficultyLevel;
  operands: number[];
  questionText: string;
  correctAnswer: number;
  numberOfDigits: number;
  carryCount: number;
  borrowCount: number;
  operandCount: number;
  recommendedTechnique: string;
  stepBreakdown: TechniqueStep[];
  easyNumberFactor?: number;
}

/**
  * Calculate digit-by-digit carry count for addition of multiple operands.
  */
function calculateCarryCount(operands: number[]): number {
  let carries = 0;
  let carry = 0;
  const maxDigits = Math.max(...operands.map((n) => n.toString().length));
  const opCopies = [...operands];

  for (let i = 0; i < maxDigits; i++) {
    let sum = carry;
    for (let j = 0; j < opCopies.length; j++) {
      sum += opCopies[j] % 10;
      opCopies[j] = Math.floor(opCopies[j] / 10);
    }
    carry = Math.floor(sum / 10);
    if (carry > 0) {
      carries += carry;
    }
  }
  return carries;
}

/**
  * Calculate digit-by-digit borrow count for subtraction (a - b).
  */
function calculateBorrowCount(a: number, b: number): number {
  let borrows = 0;
  let borrow = 0;
  let tempA = a;
  let tempB = b;

  while (tempA > 0 || tempB > 0) {
    let digitA = (tempA % 10) - borrow;
    const digitB = tempB % 10;

    if (digitA < digitB) {
      digitA += 10;
      borrow = 1;
      borrows++;
    } else {
      borrow = 0;
    }

    tempA = Math.floor(tempA / 10);
    tempB = Math.floor(tempB / 10);
  }
  return borrows;
}

/**
  * Deconstruct addition into creator's chunked addition steps.
  */
export function generateAdditionSteps(operands: number[]): TechniqueStep[] {
  const steps: TechniqueStep[] = [];
  let running = operands[0];

  for (let i = 1; i < operands.length; i++) {
    const nextOp = operands[i];
    const strOp = nextOp.toString();
    const len = strOp.length;

    for (let d = 0; d < len; d++) {
      const digit = parseInt(strOp[d], 10);
      if (digit === 0) continue;

      const placeValue = Math.pow(10, len - 1 - d);
      const chunk = digit * placeValue;
      const prev = running;
      running += chunk;

      steps.push({
        description: `Add ${chunk} (${prev} + ${chunk})`,
        expression: `${prev} + ${chunk}`,
        subtotal: running,
      });
    }
  }

  return steps;
}

/**
  * Deconstruct subtraction into creator's chunked subtraction steps.
  */
export function generateSubtractionSteps(a: number, b: number): TechniqueStep[] {
  const steps: TechniqueStep[] = [];
  let running = a;
  const strB = b.toString();
  const len = strB.length;

  for (let d = 0; d < len; d++) {
    const digit = parseInt(strB[d], 10);
    if (digit === 0) continue;

    const placeValue = Math.pow(10, len - 1 - d);
    const chunk = digit * placeValue;
    const prev = running;
    running -= chunk;

    steps.push({
      description: `Subtract ${chunk} (${prev} - ${chunk})`,
      expression: `${prev} - ${chunk}`,
      subtotal: running,
    });
  }

  return steps;
}

/**
  * Deconstruct multiplication into creator's place-value decomposition steps.
  * Preserves creator rule: 237 x 24 -> 237 x 20 + 237 x 4 (NOT 237 x (40-3)).
  */
export function generateMultiplicationSteps(a: number, b: number): TechniqueStep[] {
  const steps: TechniqueStep[] = [];
  const strB = b.toString();
  const lenB = strB.length;
  let runningTotal = 0;

  for (let d = 0; d < lenB; d++) {
    const digit = parseInt(strB[d], 10);
    if (digit === 0) continue;

    const placeValue = Math.pow(10, lenB - 1 - d);
    const chunkVal = digit * placeValue;
    const partialProduct = a * chunkVal;
    runningTotal += partialProduct;

    steps.push({
      description: `Multiply by ${chunkVal} (${a} × ${chunkVal} = ${partialProduct})`,
      expression: `${a} × ${chunkVal}`,
      subtotal: runningTotal,
    });
  }

  return steps;
}

/**
  * Generate a single random integer between min and max inclusive.
  */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
  * Main deterministic Question Generator.
  */
export function generateQuestion(
  operation: OperationType,
  difficulty: DifficultyLevel
): QuestionData {
  const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (operation === 'ADDITION' || operation === 'VISUALIZATION') {
    let count = 2;
    let minDigits = 2;
    let maxDigits = 2;

    if (difficulty === 'EASY') {
      count = 2;
      minDigits = 2;
      maxDigits = 2;
    } else if (difficulty === 'MEDIUM') {
      count = 2;
      minDigits = 2;
      maxDigits = 3;
    } else if (difficulty === 'HARD') {
      count = 3;
      minDigits = 3;
      maxDigits = 3;
    } else {
      count = 4;
      minDigits = 3;
      maxDigits = 4;
    }

    const operands: number[] = [];
    for (let i = 0; i < count; i++) {
      const digits = randomInt(minDigits, maxDigits);
      const minVal = Math.pow(10, digits - 1);
      const maxVal = Math.pow(10, digits) - 1;
      operands.push(randomInt(minVal, maxVal));
    }

    const correctAnswer = operands.reduce((sum, val) => sum + val, 0);
    const questionText = operands.join(' + ');
    const carryCount = calculateCarryCount(operands);
    const maxDig = Math.max(...operands.map((n) => n.toString().length));

    return {
      id,
      operation,
      difficulty,
      operands,
      questionText,
      correctAnswer,
      numberOfDigits: maxDig,
      carryCount,
      borrowCount: 0,
      operandCount: count,
      recommendedTechnique:
        operation === 'VISUALIZATION'
          ? 'Internalized Mental Abacus Bead Movement'
          : 'Chunked Addition (Running Total)',
      stepBreakdown: generateAdditionSteps(operands),
    };
  }

  if (operation === 'SUBTRACTION') {
    let minDigitsA = 2;
    let maxDigitsA = 2;
    let minDigitsB = 2;
    let maxDigitsB = 2;

    if (difficulty === 'EASY') {
      minDigitsA = 2;
      maxDigitsA = 2;
      minDigitsB = 2;
      maxDigitsB = 2;
    } else if (difficulty === 'MEDIUM') {
      minDigitsA = 3;
      maxDigitsA = 3;
      minDigitsB = 2;
      maxDigitsB = 3;
    } else if (difficulty === 'HARD') {
      minDigitsA = 3;
      maxDigitsA = 4;
      minDigitsB = 3;
      maxDigitsB = 3;
    } else {
      minDigitsA = 4;
      maxDigitsA = 4;
      minDigitsB = 3;
      maxDigitsB = 4;
    }

    let a = randomInt(Math.pow(10, minDigitsA - 1), Math.pow(10, maxDigitsA) - 1);
    let b = randomInt(Math.pow(10, minDigitsB - 1), Math.pow(10, maxDigitsB) - 1);

    if (a < b) {
      const temp = a;
      a = b;
      b = temp;
    }

    const correctAnswer = a - b;
    const questionText = `${a} - ${b}`;
    const borrowCount = calculateBorrowCount(a, b);

    return {
      id,
      operation: 'SUBTRACTION',
      difficulty,
      operands: [a, b],
      questionText,
      correctAnswer,
      numberOfDigits: Math.max(a.toString().length, b.toString().length),
      carryCount: 0,
      borrowCount,
      operandCount: 2,
      recommendedTechnique: 'Chunked Subtraction (Running Total)',
      stepBreakdown: generateSubtractionSteps(a, b),
    };
  }

  if (operation === 'MULTIPLICATION' || operation === 'TABLE_MASTERY') {
    let minDigitsA = 2;
    let maxDigitsA = 2;
    let minDigitsB = 1;
    let maxDigitsB = 1;

    if (difficulty === 'EASY') {
      minDigitsA = 2;
      maxDigitsA = 2;
      minDigitsB = 1;
      maxDigitsB = 1;
    } else if (difficulty === 'MEDIUM') {
      minDigitsA = 2;
      maxDigitsA = 3;
      minDigitsB = 2;
      maxDigitsB = 2;
    } else if (difficulty === 'HARD') {
      minDigitsA = 3;
      maxDigitsA = 3;
      minDigitsB = 2;
      maxDigitsB = 2;
    } else {
      minDigitsA = 3;
      maxDigitsA = 3;
      minDigitsB = 3;
      maxDigitsB = 3;
    }

    const easyFactors = [25, 50, 100, 125, 200, 250, 500, 1000];
    const useEasyFactor = Math.random() < 0.25 && difficulty !== 'EASY';

    let a: number;
    let b: number;
    let easyFactor: number | undefined;

    if (useEasyFactor) {
      easyFactor = easyFactors[randomInt(0, easyFactors.length - 1)];
      b = easyFactor;
      a = randomInt(12, 98);
    } else {
      a = randomInt(Math.pow(10, minDigitsA - 1), Math.pow(10, maxDigitsA) - 1);
      b = randomInt(Math.pow(10, minDigitsB - 1), Math.pow(10, maxDigitsB) - 1);
    }

    const correctAnswer = a * b;
    const questionText = `${a} × ${b}`;

    return {
      id,
      operation,
      difficulty,
      operands: [a, b],
      questionText,
      correctAnswer,
      numberOfDigits: Math.max(a.toString().length, b.toString().length),
      carryCount: 0,
      borrowCount: 0,
      operandCount: 2,
      recommendedTechnique: easyFactor
        ? `Easy Number Recognition (${easyFactor})`
        : 'Place-Value Decomposition',
      stepBreakdown: generateMultiplicationSteps(a, b),
      easyNumberFactor: easyFactor,
    };
  }

  // DIVISION
  let quotientDigits = 2;
  let divisorDigits = 1;

  if (difficulty === 'EASY') {
    quotientDigits = 2;
    divisorDigits = 1;
  } else if (difficulty === 'MEDIUM') {
    quotientDigits = 2;
    divisorDigits = 2;
  } else if (difficulty === 'HARD') {
    quotientDigits = 3;
    divisorDigits = 2;
  } else {
    quotientDigits = 3;
    divisorDigits = 3;
  }

  const quotient = randomInt(
    Math.pow(10, quotientDigits - 1),
    Math.pow(10, quotientDigits) - 1
  );
  const divisor = randomInt(
    Math.pow(10, divisorDigits - 1),
    Math.pow(10, divisorDigits) - 1
  );
  const dividend = quotient * divisor;

  const questionText = `${dividend} ÷ ${divisor}`;

  return {
    id,
    operation: 'DIVISION',
    difficulty,
    operands: [dividend, divisor],
    questionText,
    correctAnswer: quotient,
    numberOfDigits: Math.max(dividend.toString().length, divisor.toString().length),
    carryCount: 0,
    borrowCount: 0,
    operandCount: 2,
    recommendedTechnique: 'Inverse Place-Value Reconstruction',
    stepBreakdown: [
      {
        description: `Reconstruct dividend: ${divisor} × ? = ${dividend}`,
        expression: `${dividend} ÷ ${divisor}`,
        subtotal: quotient,
      },
    ],
  };
}
