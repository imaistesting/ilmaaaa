import { useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';

interface LessonFormProps {
  onAnalyze: (lessonText: string) => void;
  loading: boolean;
  error: string | null;
}

function LessonForm({ onAnalyze, loading, error }: LessonFormProps) {
  const [lessonText, setLessonText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lessonText.trim()) {
      onAnalyze(lessonText);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="lesson" className="block text-sm font-semibold text-gray-700 mb-3">
            Enter Your Lesson Content
          </label>
          <textarea
            id="lesson"
            value={lessonText}
            onChange={(e) => setLessonText(e.target.value)}
            placeholder="Paste or type your lesson text here... (e.g., a chapter from a textbook, lecture notes, article content, etc.)"
            className="w-full h-64 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-gray-700"
            disabled={loading}
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            {lessonText.length} characters
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !lessonText.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Lesson...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Lesson</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default LessonForm;
