// src/components/UpvoteButton.jsx
import React from 'react';

const UpvoteButton = ({ upvotes, onUpvote, hasUpvoted }) => {
  const styles = {
    button: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px 16px',
      border: '2px solid',
      borderColor: hasUpvoted ? '#10b981' : '#e5e7eb',
      borderRadius: '12px',
      backgroundColor: hasUpvoted ? '#10b981' : '#ffffff',
      color: hasUpvoted ? '#ffffff' : '#374151',
      cursor: hasUpvoted ? 'default' : 'pointer',
      transition: 'all 0.3s ease-in-out',
      width: 'auto',
      gap: '8px',
      fontWeight: '600',
      fontSize: '14px',
      boxShadow: hasUpvoted ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
      transform: hasUpvoted ? 'scale(1.05)' : 'scale(1)',
    },
    buttonHover: {
      borderColor: hasUpvoted ? '#10b981' : '#10b981',
      backgroundColor: hasUpvoted ? '#10b981' : '#f0fdf4',
      color: hasUpvoted ? '#ffffff' : '#10b981',
      boxShadow: hasUpvoted ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(16, 185, 129, 0.2)',
      transform: 'scale(1.05)',
    },
    arrow: {
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'transform 0.2s ease-in-out',
    },
    text: {
      fontSize: '14px',
      fontWeight: '600',
    },
    upvoteCount: {
      fontSize: '14px',
      fontWeight: '700',
      color: hasUpvoted ? '#ffffff' : '#374151',
    },
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!hasUpvoted) {
      onUpvote();
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{ 
        ...styles.button, 
        ...(isHovered && !hasUpvoted ? styles.buttonHover : {}),
        ...(hasUpvoted ? { cursor: 'default' } : {})
      }}
      onMouseEnter={() => !hasUpvoted && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        ...styles.arrow,
        transform: hasUpvoted ? 'scale(1.2)' : (isHovered ? 'scale(1.1)' : 'scale(1)')
      }}>
        {hasUpvoted ? '✓' : '↑'}
      </div>
      <div style={styles.text}>
        {hasUpvoted ? 'Upvoted' : 'Upvote'}
      </div>
      <div style={styles.upvoteCount}>{upvotes}</div>
    </div>
  );
};

export default UpvoteButton;