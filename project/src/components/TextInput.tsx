import { FileText, Upload } from 'lucide-react';
import { useRef } from 'react';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isProcessing: boolean;
  onFileProcessing?: (processing: boolean) => void;
}

export const TextInput = ({ value, onChange, onSubmit, isProcessing, onFileProcessing }: TextInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onFileProcessing?.(true);

    try {
      if (file.type === 'application/pdf') {
        await handlePDF(file);
      } else if (file.type === 'text/plain') {
        await handleTextFile(file);
      }
    } finally {
      onFileProcessing?.(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTextFile = async (file: File) => {
    const text = await file.text();
    onChange(text);
  };

  const handlePDF = async (file: File) => {
    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');

    GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${await getPDFVersion()}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    onChange(fullText);
  };

  const getPDFVersion = async () => {
    try {
      const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/package.json');
      const data = await response.json();
      return data.version;
    } catch {
      return '4.3.136';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Add Your Study Material</h2>
        </div>

        <div className="space-y-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste any lesson, article, or text here and Ima AI will help you study it..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isProcessing}
          />

          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload PDF or Text
            </button>
            <button
              onClick={onSubmit}
              disabled={!value.trim() || isProcessing}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Generate Summary & Quiz'}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
