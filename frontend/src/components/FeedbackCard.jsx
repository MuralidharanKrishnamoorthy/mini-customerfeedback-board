// src/components/FeedbackCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import UpvoteButton from './UpvoteButton';

const statusColors = {
  Open: "bg-orange-50 text-orange-700 border-orange-200",
  Planned: "bg-blue-50 text-blue-700 border-blue-200",
  'In Progress': "bg-purple-50 text-purple-700 border-purple-200",
  Done: "bg-green-50 text-green-700 border-green-200",
};

const categoryColors = {
  Bug: "bg-red-50 text-red-600 border-red-200",
  Feature: "bg-indigo-50 text-indigo-600 border-indigo-200",
  UI: "bg-pink-50 text-pink-600 border-pink-200",
};

const statusIcons = {
  Open: "🔵",
  Planned: "📋",
  'In Progress': "⚡",
  Done: "✅",
};

const categoryIcons = {
  Bug: "🐛",
  Feature: "✨",
  UI: "🎨",
};

const FeedbackCard = ({ feedback, onUpvote }) => {
  const statusClass = statusColors[feedback.status] || "bg-gray-50 text-gray-700 border-gray-200";
  const categoryClass = categoryColors[feedback.category] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 mb-4 group hover:border-gray-300">
      <div className="flex items-start justify-between">
        {/* Left side - Content */}
        <div className="flex-1 min-w-0">
          {/* Category and Status Tags */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${categoryClass}`}>
              <span className="text-sm">{categoryIcons[feedback.category]}</span>
              {feedback.category}
            </span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${statusClass}`}>
              <span className="text-sm">{statusIcons[feedback.status]}</span>
              {feedback.status}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/feedback/${feedback._id}`}
            className="block group-hover:text-blue-600 transition-colors duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600">
              {feedback.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            {feedback.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center text-xs text-gray-500 gap-4">
            <span>#{feedback._id.slice(-6)}</span>
            {feedback.comments && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                {feedback.comments.length}
              </span>
            )}
          </div>
        </div>

        {/* Right side - Upvote */}
        <div className="ml-4 flex-shrink-0">
          <UpvoteButton 
            id={feedback._id} 
            count={feedback.upvotes} 
            onUpvote={onUpvote}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;