// src/components/UpvoteButton.jsx
import React from 'react';
import { ThumbsUp } from 'lucide-react';

const UpvoteButton = ({ feedback, user, onUpvote, onRemoveUpvote, isUpvoted: externalIsUpvoted }) => {
  const isUpvoted = externalIsUpvoted ?? (user && feedback.upvotedBy.includes(user.id));

  const styles = {
    button: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: isUpvoted ? '#4f46e5' : '#f3f4f6',
      color: isUpvoted ? 'white' : '#374151',
      padding: '8px 16px',
      borderRadius: '8px',
      border: isUpvoted ? '1px solid #4f46e5' : '1px solid #e5e7eb',
      cursor: user ? 'pointer' : 'not-allowed',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.2s',
      opacity: user ? 1 : 0.6
    },
    buttonHover: {
      backgroundColor: isUpvoted ? '#4338ca' : '#e5e7eb',
      borderColor: isUpvoted ? '#4338ca' : '#d1d5db'
    },
    icon: {
      width: '16px',
      height: '16px'
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (user) {
      if (isUpvoted) {
        onRemoveUpvote();
      } else {
        onUpvote();
      }
    } else {
      alert("You must be logged in to upvote.");
    }
  };

  return (
    <button
      style={styles.button}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (user) e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor;
      }}
      onMouseLeave={(e) => {
        if (user) e.currentTarget.style.backgroundColor = styles.button.backgroundColor;
      }}
      title={user ? (isUpvoted ? "Remove upvote" : "Upvote") : "Login to upvote"}
    >
      <ThumbsUp style={styles.icon} />
      <span>{isUpvoted ? 'Upvoted' : 'Upvote'}</span>
      <span>({feedback.upvotes})</span>
    </button>
  );
};

export default UpvoteButton;