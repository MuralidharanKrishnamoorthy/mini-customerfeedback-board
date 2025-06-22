import React, { useState } from 'react';
import LoadingAnimation from './LoadingAnimation';

const CommentInput = ({ onSubmit, loading = false }) => {
  const [comment, setComment] = useState('');

  console.log('CommentInput - Loading state:', loading);

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: '6px',
      padding: '2px 2px 2px 10px',
      border: '1px solid #e5e7eb',
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '13px',
      backgroundColor: 'transparent',
    },
    button: {
      padding: '4px',
      border: 'none',
      backgroundColor: 'transparent',
      color: '#9ca3af',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonActive: {
      color: '#2563eb',
    },
    buttonDisabled: {
      color: '#d1d5db',
      cursor: 'not-allowed',
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    console.log('CommentInput - Submit clicked, loading:', loading, 'comment:', comment);
    if (comment.trim() && !loading) {
      console.log('CommentInput - Calling onSubmit with comment:', comment);
      onSubmit(comment);
      setComment('');
    }
  };

  const handleContainerClick = (e) => {
    e.stopPropagation(); 
  }

  return (
    <form style={styles.container} onSubmit={handleSubmit} onClick={handleContainerClick}>
      <input
        type="text"
        placeholder={loading ? "Posting comment..." : "Add a comment..."}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={styles.input}
        disabled={loading}
      />
      <button 
        type="submit" 
        style={{
          ...styles.button, 
          ...(comment.trim() !== '' && !loading ? styles.buttonActive : {}),
          ...(loading ? styles.buttonDisabled : {})
        }} 
        disabled={comment.trim() === '' || loading}
      >
        {loading ? (
          <LoadingAnimation size="small" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
          </svg>
        )}
      </button>
    </form>
  );
};

export default CommentInput; 