import { NextRequest, NextResponse } from 'next/server';
import { generateQuestion, OperationType, DifficultyLevel } from '@/lib/math/question-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const operation: OperationType = body.operation || 'ADDITION';
    const difficulty: DifficultyLevel = body.difficulty || 'EASY';

    const question = generateQuestion(operation, difficulty);
    return NextResponse.json({ success: true, data: question });
  } catch (_err) {
    return NextResponse.json({ success: false, error: 'Invalid question parameters' }, { status: 400 });
  }
}
