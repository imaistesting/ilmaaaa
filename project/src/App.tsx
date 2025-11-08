import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import LessonForm from './components/LessonForm';
import ResultsDisplay from './components/ResultsDisplay';

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  quiz: QuizQuestion[];
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (lessonText: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/.netlify/functions/analyze-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze lesson');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              IMA AI
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Transform your lesson content into summaries, key points, and interactive quizzes
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Made by IMA and Oumha
          </p>
        </header>

        {!result ? (
          <LessonForm onAnalyze={handleAnalyze} loading={loading} error={error} />
        ) : (
          <ResultsDisplay result={result} onReset={handleReset} />
        )}

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Powered by OpenRouter AI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
