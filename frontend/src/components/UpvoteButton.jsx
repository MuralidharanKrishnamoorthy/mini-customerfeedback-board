// src/components/UpvoteButton.jsx
import React from 'react';

const UpvoteButton = ({ upvotes, onUpvote, onDownvote, hasUpvoted }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (hasUpvoted) {
      onDownvote();
    } else {
      onUpvote();
    }
  };
  
  const buttonText = hasUpvoted ? (isHovered ? 'Undo Upvote' : 'Upvoted') : 'Upvote';
  const buttonIcon = hasUpvoted ? (isHovered ? '‹' : '✓') : '↑';

  const styles = {
    button: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      border: '2px solid',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease-in-out',
      width: 'auto',
      gap: '8px',
      fontWeight: '600',
      fontSize: '14px',
      borderColor: hasUpvoted ? (isHovered ? '#f87171' : '#10b981') : '#e5e7eb',
      backgroundColor: hasUpvoted ? (isHovered ? '#fef2f2' : '#10b981') : '#ffffff',
      color: hasUpvoted ? (isHovered ? '#b91c1c' : '#ffffff') : '#374151',
      boxShadow: hasUpvoted 
        ? (isHovered ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(16, 185, 129, 0.3)')
        : '0 2px 4px rgba(0,0,0,0.05)',
      transform: (hasUpvoted || isHovered) ? 'scale(1.05)' : 'scale(1)',
    },
    buttonHover: {
      borderColor: '#10b981',
      backgroundColor: '#f0fdf4',
      color: '#10b981',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
    },
    arrow: {
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'transform 0.2s ease-in-out',
      transform: (hasUpvoted || isHovered) ? 'scale(1.2)' : 'scale(1)',
    },
    text: {
      fontSize: '14px',
      fontWeight: '600',
    },
    upvoteCount: {
      fontSize: '14px',
      fontWeight: '700',
    },
  };

  return (
    <div
      onClick={handleClick}
      style={{ 
        ...styles.button, 
        ...(!hasUpvoted && isHovered ? styles.buttonHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.arrow}>
        {buttonIcon}
      </div>
      <div style={styles.text}>
        {buttonText}
      </div>
      <div style={{ ...styles.upvoteCount, color: hasUpvoted ? styles.button.color : '#374151' }}>
        {upvotes}
      </div>
    </div>
  );
};

export default UpvoteButton;