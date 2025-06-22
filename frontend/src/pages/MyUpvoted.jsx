import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyUpvotedFeedbacks, removeUpvote, upvoteFeedback } from '../services/feedbackApi';
import FeedbackCard from '../components/FeedbackCard';
import LoadingAnimation from '../components/LoadingAnimation';

const MyUpvoted = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpvotedFeedback = async () => {
      setLoading(true);
      try {
        const res = await getMyUpvotedFeedbacks();
        setFeedbackList(res.data);
      } catch (err) {
        setError('Failed to fetch your upvoted feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchUpvotedFeedback();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleRemoveUpvote = async (id) => {
    if (window.confirm("Are you sure you want to remove your upvote for this fix?")) {
      try {
        await removeUpvote(id);
        setFeedbackList(prevList => prevList.filter(fb => fb._id !== id));
      } catch (err) {
        console.error("Failed to remove upvote:", err);
        alert("Failed to remove upvote. Please try again.");
      }
    }
  };

  const handleUpvote = async (id) => {
    try {
      const res = await upvoteFeedback(id);
      // This is unlikely to be called here, but good for consistency
      setFeedbackList(prevList => prevList.map(fb => (fb._id === id ? res.data : fb)));
    } catch (err) {
      console.error("Failed to upvote:", err);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: "'Poppins', sans-serif"
    },
    header: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '32px'
    },
    feedbackGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '32px',
      alignItems: 'start',
    },
    loading: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#6b7280',
      marginTop: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    error: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#ef4444',
      marginTop: '40px',
    },
    emptyState: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#6b7280',
        marginTop: '40px',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Upvoted Feedback</h1>
      {loading ? (
        <div style={styles.loading}>
          <LoadingAnimation size="medium" />
          <span>Loading your upvoted feedback...</span>
        </div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <div style={styles.feedbackGrid}>
          {feedbackList.length > 0 ? (
            feedbackList.map(feedback => (
              <FeedbackCard
                key={feedback._id}
                feedback={feedback}
                user={user}
                onUpvote={() => handleUpvote(feedback._id)}
                onRemoveUpvote={() => handleRemoveUpvote(feedback._id)}
                onViewDetail={() => navigate(`/feedback/${feedback._id}`)}
                showComments={false}
              />
            ))
          ) : (
            <p style={styles.emptyState}>You haven't upvoted any feedback yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyUpvoted; 