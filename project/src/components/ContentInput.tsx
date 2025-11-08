/**
 * CONTENT INPUT COMPONENT
 * =======================
 *
 * Provides the text area where users paste their lesson content
 * and the submit button to process it
 */

import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';

// Component props interface
interface ContentInputProps {
  onSubmit: (content: string) => void; // Callback function when content is submitted
  loading: boolean; // Whether the AI is currently processing
}

const ContentInput = ({ onSubmit, loading }: ContentInputProps) => {
  // Local state to track the textarea content
  const [content, setContent] = useState('');

  /**
   * Handles form submission
   * Prevents default form behavior and calls the parent's onSubmit function
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    if (content.trim()) {
      onSubmit(content.trim()); // Send content to parent component
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      {/* Section header with icon */}
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Paste Your Lesson Content
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Large text area for pasting lesson content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your lesson text or PDF content here...

Example: 'Photosynthesis is the process by which plants use sunlight, water and carbon dioxide to create oxygen and energy in the form of sugar...'"
          className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400"
          disabled={loading} // Disable input while processing
        />

        {/* Submit button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading || !content.trim()} // Disable if loading or empty
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            <Sparkles className="w-5 h-5" />
            {/* Button text changes based on loading state */}
            <span>{loading ? 'Processing...' : 'Generate Summary & Quiz'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentInput;
