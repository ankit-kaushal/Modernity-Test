import { NextRequest, NextResponse } from 'next/server';
import { getQuestions, addQuestion } from '@/lib/db';
import { Question } from '@/types/question';

export async function GET() {
  try {
    const questions = getQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const question: Question = {
      id: Date.now().toString(),
      text: body.text,
      type: body.type,
      options: body.options || [],
      correctAnswers: body.correctAnswers || [],
      points: body.points || 1,
    };

    const newQuestion = addQuestion(question);
    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}


