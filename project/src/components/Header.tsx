/**
 * HEADER COMPONENT
 * ================
 *
 * Displays the site logo, title, and tagline at the top of every page
 */

import { Brain } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-center space-x-3">
          {/* Logo - Brain icon with gradient background */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
            <Brain className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>

          {/* Title and tagline */}
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Ima AI
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Transform Your Lessons into Knowledge
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
