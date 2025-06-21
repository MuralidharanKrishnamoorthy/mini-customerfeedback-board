// src/components/UpvoteButton.jsx
import React, { useState } from 'react';

const UpvoteButton = ({ id, count, onUpvote }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleUpvote = async () => {
    setIsAnimating(true);
    await onUpvote(id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleUpvote}
      className={`
        flex flex-col items-center justify-center
        min-w-[48px] px-3 py-2
        bg-gray-50 hover:bg-blue-50 
        border border-gray-200 hover:border-blue-300
        rounded-lg transition-all duration-200
        hover:shadow-sm active:scale-95
        ${isAnimating ? 'scale-110' : ''}
        group
      `}
    >
      <svg 
        className={`
          w-4 h-4 mb-1 transition-all duration-200
          text-gray-500 group-hover:text-blue-600
          ${isAnimating ? 'animate-bounce' : ''}
        `} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" 
          clipRule="evenodd" 
        />
      </svg>
      <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
        {count}
      </span>
    </button>
  );
};

export default UpvoteButton;