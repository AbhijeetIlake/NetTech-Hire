import React from 'react';

/**
 * A modern, animated loading spinner component.
 * @param {string} message - Optional message to display below the spinner.
 * @param {boolean} fullScreen - If true, the spinner will cover the viewport.
 */
function LoadingSpinner({ message = "Loading...", fullScreen = false }) {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>

        {/* Spinner */}
        <div className="relative">
          <svg className="w-16 h-16 animate-spin text-blue-600" viewBox="0 0 24 24">
            <circle
              className="opacity-10"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>

      {message && (
        <p className="mt-6 text-sm font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;