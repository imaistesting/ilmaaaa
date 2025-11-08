import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
}

function QuizSection({ questions }: QuizSectionProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (!showResults) {
      const newAnswers = [...answers];
      newAnswers[questionIndex] = optionIndex;
      setAnswers(newAnswers);
    }
  };

  const handleSubmit = () => {
    if (answers.every((answer) => answer !== null)) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
  };

  const score = showResults
    ? answers.filter(
        (answer, index) => answer === questions[index].correctAnswer
      ).length
    : 0;

  return (
    <div className="space-y-6">
      {questions.map((question, qIndex) => {
        const isAnswered = answers[qIndex] !== null;
        const isCorrect =
          showResults && answers[qIndex] === question.correctAnswer;

        return (
          <div
            key={qIndex}
            className={`p-6 rounded-xl border-2 transition-all ${
              showResults
                ? isCorrect
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-4">
              {showResults && (
                <div className="flex-shrink-0 mt-1">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              )}
              <h3 className="font-semibold text-gray-800 text-lg">
                {qIndex + 1}. {question.question}
              </h3>
            </div>

            <div className="space-y-2 ml-9">
              {question.options.map((option, oIndex) => {
                const isSelected = answers[qIndex] === oIndex;
                const isCorrectOption = oIndex === question.correctAnswer;

                return (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswerSelect(qIndex, oIndex)}
                    disabled={showResults}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      showResults
                        ? isCorrectOption
                          ? 'bg-green-100 border-2 border-green-400 font-semibold'
                          : isSelected
                          ? 'bg-red-100 border-2 border-red-400'
                          : 'bg-white border border-gray-200'
                        : isSelected
                        ? 'bg-blue-100 border-2 border-blue-400 font-semibold'
                        : 'bg-white border border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    } ${showResults ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          showResults
                            ? isCorrectOption
                              ? 'bg-green-500 text-white'
                              : isSelected
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                            : isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!showResults ? (
        <button
          onClick={handleSubmit}
          disabled={answers.some((answer) => answer === null)}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-6 bg-blue-50 border-2 border-blue-300 rounded-xl">
            <p className="text-center text-2xl font-bold text-blue-800">
              Your Score: {score} / {questions.length}
            </p>
            <p className="text-center text-gray-600 mt-2">
              {score === questions.length
                ? 'Perfect! You mastered this lesson!'
                : score >= questions.length * 0.7
                ? 'Great job! You have a solid understanding.'
                : score >= questions.length * 0.5
                ? 'Good effort! Review the material for better results.'
                : 'Keep studying! Review the key points above.'}
            </p>
          </div>

          <button
            onClick={handleReset}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow hover:shadow-md"
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizSection;
