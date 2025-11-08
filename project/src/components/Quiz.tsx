/**
 * QUIZ COMPONENT
 * ==============
 *
 * Interactive quiz interface that:
 * - Shows questions one at a time
 * - Tracks user answers
 * - Displays final score and correct/incorrect answers
 * - Allows retaking the quiz
 */

import { useState } from 'react';
import { CheckCircle2, XCircle, Award } from 'lucide-react';
import type { QuizQuestion } from '../types';

// Component props interface
interface QuizProps {
  questions: QuizQuestion[]; // Array of quiz questions to display
}

const Quiz = ({ questions }: QuizProps) => {
  // Track which question is currently being displayed (0-indexed)
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Track user's selected answers for all questions (null = not answered yet)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );

  // Track whether to show the results screen
  const [showResults, setShowResults] = useState(false);

  /**
   * Handles when user selects an answer for the current question
   */
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  /**
   * Moves to next question or shows results if on last question
   */
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  /**
   * Moves to previous question
   */
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  /**
   * Calculates total number of correct answers
   */
  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return answer === questions[index].correctAnswer ? score + 1 : score;
    }, 0);
  };

  // RESULTS SCREEN - Shows after completing all questions
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-8 border border-blue-200">
        <div className="text-center">
          {/* Award icon */}
          <div className="inline-block bg-white p-4 rounded-full shadow-md mb-4">
            <Award className="w-16 h-16 text-yellow-500" />
          </div>

          {/* Score display */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600 mb-6">
            You scored {score} out of {questions.length} ({percentage}%)
          </p>

          {/* Detailed results for each question */}
          <div className="space-y-6 mt-8 text-left">
            {/* Loop through all questions to show detailed results */}
            {questions.map((question, qIndex) => {
              const userAnswer = selectedAnswers[qIndex];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <div key={qIndex} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start space-x-3 mb-4">
                    {/* Show checkmark or X based on correctness */}
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 mb-3">
                        Question {qIndex + 1}: {question.question}
                      </p>
                      {/* Display all answer options with color coding */}
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => {
                          const isUserAnswer = userAnswer === oIndex;
                          const isCorrectAnswer = oIndex === question.correctAnswer;

                          // Determine background color based on answer status
                          let bgColor = 'bg-gray-50';
                          if (isCorrectAnswer) {
                            bgColor = 'bg-green-50 border-green-300'; // Correct answer = green
                          } else if (isUserAnswer && !isCorrect) {
                            bgColor = 'bg-red-50 border-red-300'; // Wrong answer = red
                          }

                          return (
                            <div
                              key={oIndex}
                              className={`p-3 rounded border ${bgColor}`}
                            >
                              <span className="text-gray-700">{option}</span>
                              {isCorrectAnswer && (
                                <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span className="ml-2 text-red-600 font-semibold">✗ Your answer</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Button to reset and retake the quiz */}
          <button
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswers(new Array(questions.length).fill(null));
              setShowResults(false);
            }}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // QUESTION SCREEN - Shows one question at a time
  const question = questions[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="mb-6">
        {/* Question header with progress */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Quiz Time!</h2>
          <span className="text-gray-500 font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question text */}
        <p className="text-lg text-gray-700 mb-6">{question.question}</p>

        {/* Answer options */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50' // Highlight selected answer
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <span className="text-gray-700">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0} // Disable on first question
          className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {/* Next/Finish button */}
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null} // Disable until an answer is selected
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {/* Change text on last question */}
          {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
