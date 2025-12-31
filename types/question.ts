export type QuestionType = 'single' | 'multiple' | 'word';

export type ModernityLevel = 'ultra_modern' | 'modern' | 'moderately_modern' | 'traditional' | 'very_traditional';

export interface OptionWithModernity {
  text: string;
  modernityLevel: ModernityLevel;
  score: number; // 0-100 score for this option
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: OptionWithModernity[]; // For single and multiple choice with modernity scores
  points?: number; // Weight of the question
}

export interface Answer {
  questionId: string;
  answer: string | string[];
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  percentage: number;
  level: string;
}

export interface ModernityAnalysis {
  level: ModernityLevel;
  score: number;
  reasoning?: string;
}


