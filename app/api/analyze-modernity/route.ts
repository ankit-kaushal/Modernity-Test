import { NextRequest, NextResponse } from 'next/server';
import { analyzeModernity } from '@/lib/llm';

export async function POST(request: NextRequest) {
  try {
    const { question, answer } = await request.json();
    
    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeModernity(question, answer);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze-modernity API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze modernity' },
      { status: 500 }
    );
  }
}

