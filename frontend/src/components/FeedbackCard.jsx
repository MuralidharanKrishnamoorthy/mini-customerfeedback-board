import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UpvoteButton from './UpvoteButton';
import CommentInput from './CommentInput';
import { addComment } from '../services/feedbackApi';

const statusColors = {
  Open: { backgroundColor: '#e0e7ff', color: '#4f46e5' },
  Planned: { backgroundColor: '#e0e7ff', color: '#4338ca' },
  'In Progress': { backgroundColor: '#fef9c3', color: '#ca8a04' },
  Done: { backgroundColor: '#d1fae5', color: '#059669' },
};

const categoryColors = {
  Feature: { backgroundColor: '#f3e8ff', color: '#7c3aed' },
  Bug: { backgroundColor: '#fee2e2', color: '#ef4444' },
  UI: { backgroundColor: '#fef3c7', color: '#f59e0b' },
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

const FeedbackCard = ({ 
  feedback, 
  onUpvote, 
  onDownvote, 
  onViewDetail, 
  user, 
  showDelete, 
  onDelete, 
  isUpvoting, 
  isDownvoting,
  isDeleting,
  onConfirmDelete,
  onCancelDelete,
  showEdit,
  onEdit
}) => {
  const { _id, title, description, category, status, upvotes, comments, upvotedBy } = feedback;
  const [currentComments, setCurrentComments] = useState(comments || []);
  const [submittingComment, setSubmittingComment] = useState(false);
  
  // Check if user has upvoted using the user ID from JWT token
  const hasUpvoted = user && upvotedBy && upvotedBy.includes(user.userId || user.id);

  const handleCommentSubmit = async (commentText) => {
    if (!user) {
      alert("Please log in to comment.");
      return;
    }
    console.log('FeedbackCard - Starting comment submission, setting loading to true');
    setSubmittingComment(true);
    
    
    const startTime = Date.now();
    const minLoadingTime = 1500; 
    
    try {
      console.log('FeedbackCard - Making API call to add comment');
      const res = await addComment(_id, { text: commentText });
      console.log('FeedbackCard - Comment added successfully:', res.data);
      
      
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      
      const newComment = res.data.comments[res.data.comments.length - 1];
      setCurrentComments(prev => [...prev, newComment]);
    } catch (error) {
      console.error("FeedbackCard - Failed to add comment:", error);
      alert("There was an error posting your comment.");
    } finally {
      console.log('FeedbackCard - Comment submission finished, setting loading to false');
      setSubmittingComment(false);
    }
  };

  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    contentArea: {
      cursor: 'pointer',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
    },
    tag: {
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '600',
      whiteSpace: 'nowrap',
    },
    title: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '8px',
    },
    description: {
      fontSize: '14px',
      color: '#4b5563',
      lineHeight: '1.5',
      marginBottom: '16px',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: '#6b7280',
    },
    commentsInfo: {
      fontSize: '14px',
    },
    supportMessage: {
      fontSize: '12px',
      fontWeight: '500',
      color: '#059669', 
    },
    commentSection: {
        marginTop: '20px',
        borderTop: '1px solid #f3f4f6',
        paddingTop: '16px',
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    actionButton: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: '1px solid transparent',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s, border-color 0.2s',
      fontSize: '14px',
    },
    deleteButton: {
      borderColor: '#fee2e2',
      backgroundColor: '#fef2f2',
      color: '#ef4444',
    },
    editButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '6px',
      lineHeight: 1,
      color: '#6b7280',
      transition: 'color 0.2s, background-color 0.2s',
    },
    deleteConfirmContainer: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    confirmButton: {
      padding: '8px 12px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.contentArea} onClick={!isDeleting ? onViewDetail : undefined}>
        <div style={styles.header}>
          <div style={{...styles.tag, ...statusColors[status]}}>{status}</div>
          <div style={{...styles.tag, ...categoryColors[category]}}>{category}</div>
          <div style={styles.buttonContainer}>
          {showEdit && !isDeleting && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                style={styles.editButton}
                title="Edit feedback"
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#111827'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zM14.46 3.69 9.21 8.94a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l5.25-5.25-2-2z"/>
                  <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
              </button>
            )}
            {showDelete ? (
              isDeleting ? (
                <div style={styles.deleteConfirmContainer}>
                  <span style={{fontSize: '14px', fontWeight: 500, color: '#4b5563'}}>Delete?</span>
                  <button onClick={(e) => { e.stopPropagation(); onConfirmDelete(); }} style={{...styles.confirmButton, backgroundColor: '#fee2e2', color: '#dc2626'}}>Yes</button>
                  <button onClick={(e) => { e.stopPropagation(); onCancelDelete(); }} style={{...styles.confirmButton, backgroundColor: '#f3f4f6', color: '#4b5563'}}>No</button>
                </div>
              ) : (
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onDelete();
                  }} 
                  style={{...styles.actionButton, ...styles.deleteButton}}
                >
                  Delete
                </button>
              )
            ) : (
              <UpvoteButton
                upvotes={upvotes}
                onUpvote={onUpvote}
                onDownvote={onDownvote}
                hasUpvoted={user && upvotedBy && upvotedBy.includes(user.userId || user.id)}
                isLoading={isUpvoting || isDownvoting}
              />
            )}
          </div>
        </div>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
        <div style={styles.footer}>
          <div style={styles.commentsInfo}>💬 {currentComments.length} Comments</div>
          {hasUpvoted && <div style={styles.supportMessage}>✓ You have supported this</div>}
        </div>
      </div>
      <div style={styles.commentSection}>
        <CommentInput onSubmit={handleCommentSubmit} loading={submittingComment} />
      </div>
    </div>
  );
};

export default FeedbackCard;