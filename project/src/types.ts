export interface Quiz {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
}

export interface StudySession {
  id: string;
  originalText: string;
  summary: string;
  quizzes: Quiz[];
  createdAt: Date;
}
