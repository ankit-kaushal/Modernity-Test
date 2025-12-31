import { NextRequest, NextResponse } from 'next/server';
import { getQuestions } from '@/lib/db';
import { analyzeModernity } from '@/lib/llm';
import { Answer, QuizResult } from '@/types/question';

export async function POST(request: NextRequest) {
  try {
    const { answers }: { answers: Answer[] } = await request.json();
    const questions = await getQuestions();
    
    let totalScore = 0;
    let totalMaxScore = 0;

    // Process each answer
    for (const answer of answers) {
      const question = questions.find(q => q.id === answer.questionId);
      if (!question) continue;

      const questionWeight = question.points || 1;
      totalMaxScore += questionWeight * 100; // Max score is 100 per point

      if (question.type === 'single') {
        // For single choice, find the selected option and get its modernity score
        const userAnswer = answer.answer as string;
        const selectedOption = question.options?.find(opt => opt.text === userAnswer);
        if (selectedOption) {
          totalScore += (selectedOption.score / 100) * questionWeight * 100;
        }
      } else if (question.type === 'multiple') {
        // For multiple choice, average the modernity scores of selected options
        const userAnswers = answer.answer as string[];
        const selectedOptions = question.options?.filter(opt => 
          userAnswers.includes(opt.text)
        ) || [];
        
        if (selectedOptions.length > 0) {
          const avgScore = selectedOptions.reduce((sum, opt) => sum + opt.score, 0) / selectedOptions.length;
          totalScore += (avgScore / 100) * questionWeight * 100;
        }
      } else if (question.type === 'word') {
        // For word answers, use LLM to analyze modernity
        const userAnswer = answer.answer as string;
        if (userAnswer && userAnswer.trim()) {
          try {
            const analysis = await analyzeModernity(question.text, userAnswer);
            totalScore += (analysis.score / 100) * questionWeight * 100;
          } catch (error) {
            console.error('Error analyzing word answer:', error);
            // Default to moderate modernity if LLM fails
            totalScore += (50 / 100) * questionWeight * 100;
          }
        }
      }
    }

    const percentage = totalMaxScore > 0 
      ? Math.round((totalScore / totalMaxScore) * 100) 
      : 0;
    
    let level = 'Traditional';
    if (percentage >= 80) level = 'Ultra Modern';
    else if (percentage >= 60) level = 'Modern';
    else if (percentage >= 40) level = 'Moderately Modern';
    else if (percentage >= 20) level = 'Somewhat Traditional';

    const result: QuizResult = {
      score: Math.round(totalScore * 100) / 100,
      totalPoints: totalMaxScore,
      percentage,
      level,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error calculating score:', error);
    return NextResponse.json(
      { error: 'Failed to calculate score' },
      { status: 500 }
    );
  }
}
