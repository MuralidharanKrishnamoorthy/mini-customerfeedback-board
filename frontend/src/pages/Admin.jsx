import React, { useState, useEffect } from 'react';
import { getFeedbacks, updateFeedbackStatus, deleteFeedback, addReplyToComment } from '../services/feedbackApi';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // { feedbackId, commentId }
  const [replyText, setReplyText] = useState("");

  const allComments = feedbackList.flatMap(fb =>
    fb.comments.map(comment => ({
      ...comment,
      feedbackId: fb._id,
      feedbackTitle: fb.title
    }))
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleReplySubmit = async (feedbackId, commentId) => {
    if (!replyText.trim()) return;
    try {
      await addReplyToComment(feedbackId, commentId, { text: replyText });
      setReplyingTo(null);
      setReplyText("");
      // Re-fetch all data to show the new reply
      fetchFeedback();
    } catch (err) {
      alert("Failed to submit reply.");
      console.error(err);
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await deleteFeedback(id);
        fetchFeedback(); // Re-fetch
      } catch (err) {
        alert('Failed to delete feedback.');
      }
    }
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
      <div style={styles.tableContainer}>
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
            {feedbackList.map(fb => (
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
                    onClick={() => handleDelete(fb._id)} 
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
                        style={styles.submitReplyButton}
                      >
                        Submit Reply
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
    </div>
  );
};

export default Admin;
