import React, { useState, useEffect } from 'react';

const Offline: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleReload = () => {
    if (isChecking) return;

    setIsChecking(true);

    // Simulate checking connection
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.reload();
      } else {
        setIsChecking(false);
      }
    }, 1500);
  };

  // Determine button text and style based on state
  const getButtonContent = () => {
    if (isChecking) {
      return (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Checking connection...
        </>
      );
    } else if (isOnline) {
      return (
        <>
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          Connection restored! Click to reload
        </>
      );
    } else {
      return (
        <>
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reload Page
        </>
      );
    }
  };

  const buttonClasses = `w-full flex items-center justify-center px-6 py-3 text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5 active:translate-y-px ${
    isOnline
      ? 'bg-green-500 hover:bg-green-600'
      : 'bg-blue-500 hover:bg-blue-600'
  } ${isChecking ? 'opacity-70 cursor-not-allowed' : ''}`;

  return (
    <div className="offline-page min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-md w-full mx-4 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
        {/* Offline Icon */}
        <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-500 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
            />
          </svg>
        </div>

        {/* Offline Message */}
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          You're Offline
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          It seems you've lost your internet connection. Please check your
          network settings and try again.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-lg mb-8 text-left">
          <div className="flex items-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-1 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-blue-800 dark:text-blue-200">
              While offline, you can still access previously visited pages. Try
              reloading when your connection is restored.
            </p>
          </div>
        </div>

        {/* Connection Tips */}
        <div className="mb-8 text-left">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Troubleshooting tips:
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Check your Wi-Fi connection or mobile data</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Restart your router or modem</span>
            </li>
            <li className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Disable airplane mode if enabled</span>
            </li>
          </ul>
        </div>

        {/* Reload Button */}
        <button
          onClick={handleReload}
          disabled={isChecking}
          className={buttonClasses}
        >
          {getButtonContent()}
        </button>

        {/* Try Again Message */}
        <p className="mt-8 text-gray-500 dark:text-gray-400 text-sm">
          Connection status will be automatically checked when you try to reload
        </p>
      </div>
    </div>
  );
};

export default Offline;