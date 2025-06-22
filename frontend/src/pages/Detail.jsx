// src/pages/Detail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getFeedbackById,
  updateFeedbackStatus,
  addComment,
  addReplyToComment,
  deleteComment,
  deleteReply,
} from '../services/feedbackApi';
import CommentInput from '../components/CommentInput';
import LoadingAnimation from '../components/LoadingAnimation';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [user, setUser] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [submittingReply, setSubmittingReply] = useState(null);

  const styles = {
    container: {
      maxWidth: '768px',
      margin: '40px auto',
      padding: '0 24px',
      fontFamily: "'Poppins', sans-serif",
    },
    backLink: {
      display: 'inline-block',
      marginBottom: '24px',
      textDecoration: 'none',
      color: '#4f46e5',
      fontWeight: '600',
      fontSize: '14px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '32px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      marginBottom: '24px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '16px',
        lineHeight: '1.3',
    },
    description: {
        fontSize: '16px',
        color: '#4b5563',
        lineHeight: '1.7',
        marginBottom: '32px',
    },
    metaGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '24px',
        borderTop: '1px solid #f3f4f6',
        paddingTop: '24px',
    },
    metaItem: {},
    metaLabel: { fontSize: '12px', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' },
    metaValue: { fontSize: '14px', color: '#111827', fontWeight: '500' },
    statusTag: { padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '600', display: 'inline-block' },
    commentsTitle: { fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' },
    comment: {
      padding: '16px 0',
      borderBottom: '1px solid #f3f4f6',
    },
    commentAuthor: { fontWeight: '600', color: '#111827', marginBottom: '4px' },
    commentText: { fontSize: '15px', color: '#4b5563' },
    replyButton: {
      background: 'none',
      border: 'none',
      color: '#4f46e5',
      fontWeight: '600',
      cursor: 'pointer',
      padding: '4px 0',
      marginTop: '8px',
      fontSize: '13px'
    },
    repliesContainer: {
      marginLeft: '20px',
      paddingLeft: '20px',
      borderLeft: '2px solid #e5e7eb',
      marginTop: '16px',
    },
    reply: {
        backgroundColor: '#f9fafb',
        padding: '12px',
        borderRadius: '6px',
        marginTop: '12px'
    },
    replyInputSection: {
        marginTop: '12px',
    },
    commentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deleteButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#9ca3af',
      padding: '4px',
    }
  };

  const statusColors = {
    Open: { backgroundColor: '#e0e7ff', color: '#4f46e5' },
    'In Progress': { backgroundColor: '#fef9c3', color: '#ca8a04' },
    Planned: { backgroundColor: '#e0e7ff', color: '#4338ca' },
    Done: { backgroundColor: '#d1fae5', color: '#059669' },
  };

  const categoryColors = {
    Bug: styles.statusTag,
    Feature: styles.statusTag,
    UI: styles.statusTag,
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

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFeedbackById(id);
      setFeedback(res.data);
      setUser(JSON.parse(localStorage.getItem('user')));
    } catch (err) {
      setError('Failed to fetch feedback details.');
      console.error(err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleCommentSubmit = async (commentText) => {
    console.log('handleCommentSubmit - User state:', user);
    console.log('handleCommentSubmit - localStorage user:', localStorage.getItem('user'));
    
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    setSubmittingComment(true);
    
    // Add a minimum loading time to make animation visible
    const startTime = Date.now();
    const minLoadingTime = 1500; // 1.5 seconds minimum
    
    try {
      console.log('handleCommentSubmit - Sending comment:', { text: commentText });
      const res = await addComment(id, { text: commentText });
      
      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      setFeedback(res.data);
      setNewComment('');
    } catch (err) {
      console.error('handleCommentSubmit - Error details:', err);
      alert('Failed to add comment.');
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReplySubmit = async (commentId, replyText) => {
    console.log('handleReplySubmit - User state:', user);
    console.log('handleReplySubmit - CommentId:', commentId);
    console.log('handleReplySubmit - ReplyText:', replyText);
    
    if (!user) return alert("Please log in to reply.");
    setSubmittingReply(commentId);
    
    // Add a minimum loading time to make animation visible
    const startTime = Date.now();
    const minLoadingTime = 1500; // 1.5 seconds minimum
    
    try {
      console.log('handleReplySubmit - Sending reply:', { text: replyText });
      const res = await addReplyToComment(id, commentId, { text: replyText });
      
      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      setFeedback(res.data);
      setReplyingTo(null);
    } catch (error) {
      console.error("handleReplySubmit - Error details:", error);
      console.error("handleReplySubmit - Error response:", error.response?.data);
      alert("Failed to post reply.");
    } finally {
      setSubmittingReply(null);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(id, commentId);
        // Optimistic update
        setFeedback(prev => ({
          ...prev,
          comments: prev.comments.filter(c => c._id !== commentId)
        }));
      } catch (error) {
        console.error('Failed to delete comment:', error);
        alert('Could not delete comment. Please try again.');
      }
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        await deleteReply(id, commentId, replyId);
        // Optimistic update
        setFeedback(prev => ({
          ...prev,
          comments: prev.comments.map(c => {
            if (c._id === commentId) {
              return { ...c, replies: c.replies.filter(r => r._id !== replyId) };
            }
            return c;
          })
        }));
      } catch (error) {
        console.error('Failed to delete reply:', error);
        alert('Could not delete reply. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  if (loading) return (
    <div style={{...styles.loadingError, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
      <LoadingAnimation size="medium" />
      <span>Loading feedback details...</span>
    </div>
  );
  if (error) return <div style={styles.loadingError}>{error}</div>;
  if (!feedback) return <div style={styles.loadingError}>Feedback not found.</div>;

  const statusClass = statusColors[feedback.status] || styles.statusTag;
  const categoryClass = categoryColors[feedback.category] || styles.statusTag;

  const hasUpvoted = user && feedback.upvotedBy.includes(user.userId || user.id);

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>← Back to Board</Link>
      
      <div style={styles.card}>
        <h1 style={styles.title}>{feedback.title}</h1>
        <p style={styles.description}>{feedback.description}</p>
        <div style={styles.metaGrid}>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Upvotes</div>
            <div style={{ ...styles.metaValue, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px', color: '#6b7280' }}>↑</span>
              {feedback.upvotes}
            </div>
          </div>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Author</div>
            <div style={styles.metaValue}>{feedback.createdBy ? feedback.createdBy.username : 'Anonymous'}</div>
          </div>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Category</div>
            <div style={styles.metaValue}>{feedback.category}</div>
          </div>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Status</div>
            <div style={{ ...styles.statusTag, ...statusColors[feedback.status] }}>{feedback.status}</div>
          </div>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>Created</div>
            <div style={styles.metaValue}>{new Date(feedback.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.commentsTitle}>Comments ({feedback.comments.length})</h2>
        {feedback.comments.length > 0 ? (
          feedback.comments.map((comment) => (
            <div key={comment._id} style={styles.comment}>
              <div style={styles.commentHeader}>
                <div style={styles.commentAuthor}>{comment.user ? comment.user.username : 'Anonymous'}</div>
                {(user?.role === 'admin' || user?.userId === comment.user?._id) && (
                  <button onClick={() => handleDeleteComment(comment._id)} style={styles.deleteButton} title="Delete comment">
                    🗑️
                  </button>
                )}
              </div>
              <p style={styles.commentText}>{comment.text}</p>
              
              <button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)} style={styles.replyButton}>
                {replyingTo === comment._id ? 'Cancel' : 'Reply'}
              </button>

              {replyingTo === comment._id && (
                <div style={styles.replyInputSection}>
                  <CommentInput
                    onSubmit={(replyText) => handleReplySubmit(comment._id, replyText)}
                    loading={submittingReply === comment._id}
                    placeholder="Write a reply..."
                    buttonText="Post Reply"
                  />
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div style={styles.repliesContainer}>
                  {comment.replies.map((reply) => (
                    <div key={reply._id} style={styles.reply}>
                       <div style={styles.commentHeader}>
                        <div style={styles.commentAuthor}>{reply.createdBy ? reply.createdBy.username : 'Anonymous'}</div>
                        {(user?.role === 'admin' || user?.userId === reply.createdBy?._id) && (
                           <button onClick={() => handleDeleteReply(comment._id, reply._id)} style={styles.deleteButton} title="Delete reply">
                            🗑️
                          </button>
                        )}
                      </div>
                      <p style={styles.commentText}>{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to share your thoughts!</p>
        )}
        <div style={{marginTop: '24px', borderTop: '1px solid #f3f4f6', paddingTop: '24px'}}>
           <h3 style={{...styles.commentsTitle, fontSize: '18px'}}>Leave a Comment</h3>
           <CommentInput onSubmit={handleCommentSubmit} loading={submittingComment} />
        </div>
      </div>
    </div>
  );
};

export default Detail;