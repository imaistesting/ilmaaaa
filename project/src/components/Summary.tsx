import { BookOpen } from 'lucide-react';

interface SummaryProps {
  content: string;
}

export const Summary = ({ content }: SummaryProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
};
