// src/components/FeedbackCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import UpvoteButton from './UpvoteButton';

const FeedbackCard = ({ feedback, onUpvote }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-4">
    <div className="flex justify-between items-start">
      <div>
        <Link to={`/feedback/${feedback._id}`} className="text-lg font-semibold text-blue-600 hover:underline">
          {feedback.title}
        </Link>
        <p className="text-gray-600 mt-1">{feedback.description}</p>
        <div className="text-sm mt-2">
          <span className="bg-gray-200 px-2 py-1 rounded mr-2">{feedback.category}</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{feedback.status}</span>
        </div>
      </div>
      <UpvoteButton id={feedback._id} count={feedback.upvotes} onUpvote={onUpvote} />
    </div>
  </div>
);

export default FeedbackCard;
