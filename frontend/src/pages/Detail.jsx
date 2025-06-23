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
  const [hoveredDelete, setHoveredDelete] = useState(null);
  const [deletingInfo, setDeletingInfo] = useState(null);

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
      padding: '4px',
      lineHeight: '1',
      transition: 'color 0.2s ease-in-out',
    },
    deleteConfirmContainer: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    confirmButton: {
      padding: '4px 8px',
      borderRadius: '6px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '12px'
    }
  };

  const statusColors = {
    Open: { backgroundColor: '#e0e7ff', color: '#4f46e5' },
    'In Progress': { backgroundColor: '#fef9c3', color: '#ca8a04' },
    Planned: { backgroundColor: '#e0e7ff', color: '#4338ca' },
    Done: { backgroundColor: '#d1fae5', color: '#059669' },
  };

  const categoryColors = {
    Bug: { backgroundColor: '#fee2e2', color: '#b91c1c' },
    Feature: { backgroundColor: '#dbeafe', color: '#1d4ed8' },
    UI: { backgroundColor: '#ede9fe', color: '#5b21b6' },
    Other: { backgroundColor: '#fef3c7', color: '#b45309' },
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
    Other: '🤔',
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
    
    
    const startTime = Date.now();
    const minLoadingTime = 1500; 
    
    try {
      console.log('handleCommentSubmit - Sending comment:', { text: commentText });
      const res = await addComment(id, { text: commentText });
      
      
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
    
    
    const startTime = Date.now();
    const minLoadingTime = 1500; 
    
    try {
      console.log('handleReplySubmit - Sending reply:', { text: replyText });
      const res = await addReplyToComment(id, commentId, { text: replyText });
      
      
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
    try {
      await deleteComment(id, commentId);
      
      setFeedback(prev => ({
        ...prev,
        comments: prev.comments.filter(c => c._id !== commentId)
      }));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Could not delete comment. Please try again.');
    } finally {
      setDeletingInfo(null);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await deleteReply(id, commentId, replyId);
      
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
    } finally {
      setDeletingInfo(null);
    }
  };

  const requestDelete = (type, id, commentId = null) => {
    setDeletingInfo({ type, id, commentId });
  };

  const cancelDelete = () => {
    setDeletingInfo(null);
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
            <div style={{ ...styles.statusTag, ...categoryColors[feedback.category] }}>{feedback.category}</div>
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
                  deletingInfo?.type === 'comment' && deletingInfo?.id === comment._id ? (
                    <div style={styles.deleteConfirmContainer}>
                      <span style={{fontSize: '14px', fontWeight: 500, color: '#4b5563'}}>Delete?</span>
                      <button onClick={() => handleDeleteComment(comment._id)} style={{...styles.confirmButton, backgroundColor: '#fee2e2', color: '#dc2626'}}>Yes</button>
                      <button onClick={cancelDelete} style={{...styles.confirmButton, backgroundColor: '#f3f4f6', color: '#4b5563'}}>No</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => requestDelete('comment', comment._id)} 
                      style={{...styles.deleteButton, color: hoveredDelete === comment._id ? '#ef4444' : '#9ca3af'}} 
                      title="Delete comment"
                      onMouseEnter={() => setHoveredDelete(comment._id)}
                      onMouseLeave={() => setHoveredDelete(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                    </button>
                  )
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
                          deletingInfo?.type === 'reply' && deletingInfo?.id === reply._id ? (
                            <div style={styles.deleteConfirmContainer}>
                              <span style={{fontSize: '14px', fontWeight: 500, color: '#4b5563'}}>Delete?</span>
                              <button onClick={() => handleDeleteReply(deletingInfo.commentId, reply._id)} style={{...styles.confirmButton, backgroundColor: '#fee2e2', color: '#dc2626'}}>Yes</button>
                              <button onClick={cancelDelete} style={{...styles.confirmButton, backgroundColor: '#f3f4f6', color: '#4b5563'}}>No</button>
                            </div>
                           ) : (
                            <button 
                              onClick={() => requestDelete('reply', reply._id, comment._id)} 
                              style={{...styles.deleteButton, color: hoveredDelete === reply._id ? '#ef4444' : '#9ca3af'}} 
                              title="Delete reply"
                              onMouseEnter={() => setHoveredDelete(reply._id)}
                              onMouseLeave={() => setHoveredDelete(null)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                              </svg>
                            </button>
                           )
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