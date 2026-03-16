import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  const digit1Ref = useRef<HTMLSpanElement>(null);
  const digit2Ref = useRef<HTMLSpanElement>(null);
  const digit3Ref = useRef<HTMLSpanElement>(null);

  // Animation para sa 404 digits (fade + slide up)
  useEffect(() => {
    const digits = [digit1Ref.current, digit2Ref.current, digit3Ref.current];
    digits.forEach((digit, index) => {
      if (digit) {
        digit.style.opacity = '0';
        digit.style.transform = 'translateY(20px)';
        setTimeout(() => {
          digit.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          digit.style.opacity = '1';
          digit.style.transform = 'translateY(0)';
        }, 300 + index * 200);
      }
    });
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="error-page min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-3xl w-full mx-4 p-8 text-center">
        {/* Animated illustration */}
        <div className="relative mx-auto mb-10 w-64 h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-blue-200 dark:bg-blue-900/50 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-blue-300 dark:bg-blue-800/60 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-400 dark:bg-blue-700 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white opacity-90"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Floating colored balls */}
          <div
            className="absolute top-0 left-8 w-8 h-8 rounded-full bg-red-500 animate-bounce"
            style={{ animationDelay: '0.1s' }}
          />
          <div
            className="absolute top-4 right-6 w-6 h-6 rounded-full bg-yellow-500 animate-bounce"
            style={{ animationDelay: '0.3s' }}
          />
          <div
            className="absolute bottom-8 left-12 w-5 h-5 rounded-full bg-green-500 animate-bounce"
            style={{ animationDelay: '0.5s' }}
          />
          <div
            className="absolute bottom-4 right-10 w-7 h-7 rounded-full bg-purple-500 animate-bounce"
            style={{ animationDelay: '0.7s' }}
          />
        </div>

        {/* 404 digits with refs for animation */}
        <div className="text-9xl font-bold text-gray-800 dark:text-white mb-2">
          <span ref={digit1Ref} className="text-blue-500">
            4
          </span>
          <span ref={digit2Ref} className="text-red-500">
            0
          </span>
          <span ref={digit3Ref} className="text-green-500">
            4
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
          Page Not Found
        </h1>

        <div className="max-w-xl mx-auto">
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
            It might have been lost in the digital universe.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-lg mb-8">
            <p className="text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Tip:</span> Check the URL for
              typos, or try navigating from the homepage.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link
            to="/"
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Return to Homepage
          </Link>

          <button
            onClick={handleGoBack}
            className="px-8 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>

        {/* Search form (placeholder) */}
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Looking for something specific?
          </h3>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search the site..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        {/* Site links */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/projects"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/blog"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/about"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            About
          </Link>
          <Link
            to="/skills"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Skills
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;