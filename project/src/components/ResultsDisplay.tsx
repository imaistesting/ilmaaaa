import { FileText, Lightbulb, HelpCircle, RotateCcw } from 'lucide-react';
import QuizSection from './QuizSection';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  quiz: QuizQuestion[];
}

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Summary</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">{result.summary}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-800">Key Points</h2>
        </div>
        <ul className="space-y-3">
          {result.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Quiz</h2>
        </div>
        <QuizSection questions={result.quiz} />
      </div>

      <button
        onClick={onReset}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow hover:shadow-md"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Analyze Another Lesson</span>
      </button>
    </div>
  );
}

export default ResultsDisplay;
