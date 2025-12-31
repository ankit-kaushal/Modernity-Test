import { Question } from '@/types/question';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'questions.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read questions from file
export const getQuestions = (): Question[] => {
  ensureDataDirectory();
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading questions:', error);
    return [];
  }
};

// Write questions to file
export const saveQuestions = (questions: Question[]): void => {
  ensureDataDirectory();
  fs.writeFileSync(dataFilePath, JSON.stringify(questions, null, 2));
};

// Get question by ID
export const getQuestionById = (id: string): Question | undefined => {
  const questions = getQuestions();
  return questions.find(q => q.id === id);
};

// Add a new question
export const addQuestion = (question: Question): Question => {
  const questions = getQuestions();
  questions.push(question);
  saveQuestions(questions);
  return question;
};

// Update a question
export const updateQuestion = (id: string, question: Partial<Question>): Question | null => {
  const questions = getQuestions();
  const index = questions.findIndex(q => q.id === id);
  if (index === -1) return null;
  
  questions[index] = { ...questions[index], ...question };
  saveQuestions(questions);
  return questions[index];
};

// Delete a question
export const deleteQuestion = (id: string): boolean => {
  const questions = getQuestions();
  const filtered = questions.filter(q => q.id !== id);
  if (filtered.length === questions.length) return false;
  
  saveQuestions(filtered);
  return true;
};


