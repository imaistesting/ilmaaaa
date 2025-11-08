/**
 * RESULTS COMPONENT
 * =================
 *
 * Displays the AI-generated summary and key points
 * Provides a button to start the quiz
 */

import { useState } from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import type { ProcessedContent } from '../types';
import Quiz from './Quiz';

// Component props interface
interface ResultsProps {
  data: ProcessedContent; // The processed content from AI (summary, key points, quiz)
}

const Results = ({ data }: ResultsProps) => {
  // State to track whether the quiz should be displayed
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="mt-8 space-y-6">
      {/* Summary Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="w-6 h-6 text-cyan-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Summary</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">{data.summary}</p>
      </div>

      {/* Key Points Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Points</h3>
        <ul className="space-y-3">
          {/* Map through all key points and display them with checkmark icons */}
          {data.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quiz Section - Shows button or quiz based on state */}
      {!showQuiz ? (
        <div className="text-center">
          {/* Button to start the quiz */}
          <button
            onClick={() => setShowQuiz(true)}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            Take the Quiz
          </button>
        </div>
      ) : (
        // Display the quiz component when showQuiz is true
        <Quiz questions={data.quiz} />
      )}
    </div>
  );
};

export default Results;
