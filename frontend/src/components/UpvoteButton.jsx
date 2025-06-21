// src/components/UpvoteButton.jsx
import React from 'react';

const UpvoteButton = ({ id, count, onUpvote }) => (
  <button
    onClick={() => onUpvote(id)}
    className="bg-gray-100 hover:bg-blue-500 hover:text-white transition px-3 py-1 rounded text-sm"
  >
    🔼 {count}
  </button>
);

export default UpvoteButton;
