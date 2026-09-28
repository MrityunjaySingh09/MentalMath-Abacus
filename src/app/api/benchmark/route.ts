import { NextResponse } from 'next/server';
import { CREATOR_BENCHMARK_PROFILE } from '@/lib/math/creator-benchmark';

export async function GET() {
  return NextResponse.json({ success: true, creatorProfile: CREATOR_BENCHMARK_PROFILE });
}
