import React, { useState, useEffect } from 'react';
import { getFeedbacks, updateFeedbackStatus, deleteFeedback, addReplyToComment } from '../services/feedbackApi';
import { Link } from 'react-router-dom';
import LoadingAnimation from '../components/LoadingAnimation';

const Admin = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedbackList, setFilteredFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // { feedbackId, commentId }
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  const allComments = feedbackList.flatMap(fb =>
    fb.comments.map(comment => ({
      ...comment,
      feedbackId: fb._id,
      feedbackTitle: fb.title
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filter feedback based on search term and category
  useEffect(() => {
    let filtered = [...feedbackList];
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(feedback => 
        feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredFeedbackList(filtered);
  }, [feedbackList, searchTerm]);

  const handleReplySubmit = async (feedbackId, commentId) => {
    if (!replyText.trim()) return;
    setSubmittingReply(commentId);
    
    // Add a minimum loading time to make animation visible
    const startTime = Date.now();
    const minLoadingTime = 1500; // 1.5 seconds minimum
    
    try {
      await addReplyToComment(feedbackId, commentId, { text: replyText });
      
      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      setReplyingTo(null);
      setReplyText("");
      // Re-fetch all data to show the new reply
      fetchFeedback();
    } catch (err) {
      alert("Failed to submit reply.");
      console.error(err);
    } finally {
      setSubmittingReply(null);
    }
  };

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await getFeedbacks();
      setFeedbackList(res.data);
    } catch (err) {
      setError('Failed to fetch feedback.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateFeedbackStatus(id, status);
      const res = await getFeedbacks();
      setFeedbackList(res.data);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteClick = (feedback) => {
    setFeedbackToDelete(feedback);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!feedbackToDelete) return;
    
    try {
      await deleteFeedback(feedbackToDelete._id);
      setShowDeleteConfirm(false);
      setFeedbackToDelete(null);
      fetchFeedback(); // Re-fetch
    } catch (err) {
      alert('Failed to delete feedback.');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setFeedbackToDelete(null);
  };

  const stats = (() => {
    const total = feedbackList.length;
    const open = feedbackList.filter(f => f.status === 'Open').length;
    const inProgress = feedbackList.filter(f => f.status === 'In Progress').length;
    const done = feedbackList.filter(f => f.status === 'Done').length;
    return { total, open, inProgress, done };
  })();

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '24px auto',
      padding: '24px',
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: '#f9fafb',
    },
    welcomeHeader: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '4px',
    },
    header: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#4f46e5',
      marginBottom: '24px'
    },
    searchFilterContainer: {
      display: 'flex',
      marginBottom: '24px',
    },
    searchContainer: {
      width: '100%',
      maxWidth: '600px',
      position: 'relative',
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px 12px 44px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      fontFamily: "'Poppins', sans-serif",
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      height: '16px',
    },
    searchInputFocus: {
      borderColor: '#4f46e5',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      width: '16px',
      height: '16px',
    },
    filterContainer: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    filterSelect: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      fontSize: '14px',
      fontFamily: "'Poppins', sans-serif",
      cursor: 'pointer',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    filterSelectFocus: {
      borderColor: '#4f46e5',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    statValue: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#111827'
    },
    statLabel: {
      fontSize: '14px',
      color: '#6b7280',
      marginTop: '8px'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
      overflowX: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '800px'
    },
    th: {
      padding: '16px 24px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderBottom: '1px solid #e5e7eb'
    },
    td: {
      padding: '16px 24px',
      fontSize: '14px',
      color: '#374151',
      borderBottom: '1px solid #f3f4f6'
    },
    tr: {
      transition: 'background-color 0.2s',
    },
    trHover: {
      backgroundColor: '#f9fafb',
    },
    statusSelect: {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      fontSize: '14px',
      fontFamily: "'Poppins', sans-serif",
      cursor: 'pointer',
    },
    deleteButton: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#fee2e2',
      color: '#ef4444',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    deleteButtonHover: {
      backgroundColor: '#fecaca',
    },
    loading: { textAlign: 'center', padding: '40px', fontSize: '18px', fontFamily: "'Poppins', sans-serif" },
    reply: {
      marginBottom: '8px',
    },
    replyAuthor: {
      fontWeight: '500',
    },
    replyText: {
      marginLeft: '8px',
    },
    replyInputContainer: {
      marginTop: '8px',
    },
    replyTextarea: {
      width: '100%',
      height: '60px',
      padding: '8px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
    },
    submitReplyButton: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    replyButton: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: '#e0e7ff',
      color: '#4f46e5',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s',
    },
    // Confirmation Dialog Styles
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    confirmDialog: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      maxWidth: '400px',
      width: '90%',
      textAlign: 'center',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    confirmTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
    },
    confirmMessage: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '24px',
      lineHeight: '1.5',
    },
    confirmButtons: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
    },
    confirmButton: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    cancelButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
    },
    cancelButtonHover: {
      backgroundColor: '#e5e7eb',
    },
    deleteConfirmButton: {
      backgroundColor: '#ef4444',
      color: 'white',
    },
    deleteConfirmButtonHover: {
      backgroundColor: '#dc2626',
    },
    noResults: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280',
      fontSize: '16px',
    },
  };

  if (loading) return <div style={styles.loading}>Loading Dashboard...</div>;
  if (error) return <div style={styles.loading}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.welcomeHeader}>Welcome back!</h2>
      <h1 style={styles.header}>Admin Dashboard</h1>
      <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Total Feedback</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.open}</div>
            <div style={styles.statLabel}>Open</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.inProgress}</div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.done}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
      </div>
      
      {/* Search and Filter Section */}
      <div style={styles.searchFilterContainer}>
        <div style={styles.searchContainer}>
          <div style={styles.searchIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search feedback by title , description , category , status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            onFocus={(e) => e.target.style.borderColor = styles.searchInputFocus.borderColor}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
      </div>

      <div style={styles.tableContainer}>
        {filteredFeedbackList.length === 0 ? (
          <div style={styles.noResults}>
            {searchTerm
              ? "No feedback found matching your search criteria." 
              : "No feedback available."}
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Upvotes</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedbackList.map(fb => (
                <tr 
                  key={fb._id}
                  style={styles.tr}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                >
                  <td style={{...styles.td, fontWeight: '500'}}>{fb.title}</td>
                  <td style={styles.td}>{fb.category}</td>
                  <td style={styles.td}>{fb.upvotes}</td>
                  <td style={styles.td}>
                    <select 
                      value={fb.status} 
                      onChange={(e) => handleStatusChange(fb._id, e.target.value)}
                      style={styles.statusSelect}
                    >
                      <option value="Open">Open</option>
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleDeleteClick(fb)} 
                      style={styles.deleteButton}
                      onMouseEnter={(e) => e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor}
                      onMouseLeave={(e) => e.target.style.backgroundColor = styles.deleteButton.backgroundColor}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Comments Management Section */}
      <h2 style={{...styles.header, marginTop: '48px'}}>Comments Management</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Feedback Post</th>
              <th style={styles.th}>User Comment</th>
              <th style={styles.th}>Admin Reply</th>
            </tr>
          </thead>
          <tbody>
            {allComments.map(comment => (
              <tr key={comment._id}>
                <td style={styles.td}>
                  <div style={{fontWeight: '500'}}>{comment.feedbackTitle}</div>
                  <div style={{fontSize: '12px', color: '#6b7280'}}>by {comment.author}</div>
                </td>
                <td style={styles.td}>{comment.text}</td>
                <td style={styles.td}>
                  {comment.replies.map(reply => (
                    <div key={reply._id} style={styles.reply}>
                      <p style={styles.replyAuthor}>{reply.createdBy ? reply.createdBy.username : (reply.author || 'Admin')}:</p>
                      <p style={styles.replyText}>{reply.text}</p>
                    </div>
                  ))}
                  {replyingTo?.commentId === comment._id ? (
                    <div style={styles.replyInputContainer}>
                      <textarea
                        style={styles.replyTextarea}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                      />
                      <button 
                        onClick={() => handleReplySubmit(comment.feedbackId, comment._id)}
                        style={{
                          ...styles.submitReplyButton,
                          cursor: submittingReply === comment._id ? 'not-allowed' : 'pointer',
                          opacity: submittingReply === comment._id ? 0.7 : 1
                        }}
                        disabled={submittingReply === comment._id}
                      >
                        {submittingReply === comment._id ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <LoadingAnimation size="small" color="#1e40af" />
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          'Submit Reply'
                        )}
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setReplyingTo({ feedbackId: comment.feedbackId, commentId: comment._id })}
                      style={styles.replyButton}
                    >
                      Reply
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {showDeleteConfirm && (
        <div style={styles.overlay}>
          <div style={styles.confirmDialog}>
            <h2 style={styles.confirmTitle}>Confirm Deletion</h2>
            <p style={styles.confirmMessage}>
              Are you sure you want to delete this feedback?
              <br /><br />
              <strong>Title:</strong> {feedbackToDelete?.title}
              <br />
              <strong>Category:</strong> {feedbackToDelete?.category}
              <br />
              <strong>Status:</strong> {feedbackToDelete?.status}
            </p>
            <div style={styles.confirmButtons}>
              <button 
                style={{
                  ...styles.confirmButton,
                  ...styles.deleteConfirmButton
                }}
                onClick={handleDeleteConfirm}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.deleteConfirmButtonHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.deleteConfirmButton.backgroundColor}
              >
                Delete Feedback
              </button>
              <button 
                style={{
                  ...styles.confirmButton,
                  ...styles.cancelButton
                }}
                onClick={handleDeleteCancel}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.cancelButtonHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.cancelButton.backgroundColor}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
