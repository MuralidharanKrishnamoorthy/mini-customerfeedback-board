// src/components/FeedbackCard.jsx
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

const FeedbackCard = ({ feedback, onUpvote, onViewDetail, user }) => {
  const { _id, title, description, category, status, upvotes, comments, upvotedBy } = feedback;
  const [currentComments, setCurrentComments] = useState(comments || []);
  
  // Check if user has upvoted using the user ID from JWT token
  const hasUpvoted = user && upvotedBy && upvotedBy.includes(user.userId || user.id);

  const handleCommentSubmit = async (commentText) => {
    if (!user) {
      alert("Please log in to comment.");
      return;
    }
    try {
      const res = await addComment(_id, { text: commentText });
      // Optimistically add the new comment to the UI
      const newComment = res.data.comments[res.data.comments.length - 1];
      setCurrentComments(prev => [...prev, newComment]);
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("There was an error posting your comment.");
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
      color: '#059669', // Green to match upvote
    },
    commentSection: {
        marginTop: '20px',
        borderTop: '1px solid #f3f4f6',
        paddingTop: '16px',
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.contentArea} onClick={onViewDetail}>
        <div style={styles.header}>
          <div style={{...styles.tag, ...statusColors[status]}}>{status}</div>
          <div style={{...styles.tag, ...categoryColors[category]}}>{category}</div>
          <UpvoteButton upvotes={upvotes} onUpvote={onUpvote} hasUpvoted={hasUpvoted} />
        </div>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
        <div style={styles.footer}>
          <div style={styles.commentsInfo}>💬 {currentComments.length} Comments</div>
          {hasUpvoted && <div style={styles.supportMessage}>✓ You have supported this</div>}
        </div>
      </div>
      <div style={styles.commentSection}>
        <CommentInput onSubmit={handleCommentSubmit} />
      </div>
    </div>
  );
};

export default FeedbackCard;