/**
 * TYPE DEFINITIONS
 * ================
 *
 * These TypeScript interfaces define the data structures used throughout the app
 */

// Represents a single quiz question with multiple choice answers
export interface QuizQuestion {
  question: string;        // The question text
  options: string[];       // Array of 4 possible answers
  correctAnswer: number;   // Index (0-3) of the correct answer in the options array
}

// Represents the complete processed content returned by the AI service
export interface ProcessedContent {
  summary: string;           // Brief summary of the lesson
  quiz: QuizQuestion[];      // Array of quiz questions
  keyPoints: string[];       // Array of key learning points
}
