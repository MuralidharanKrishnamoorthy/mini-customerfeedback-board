import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeedbacks, deleteFeedback } from '../services/feedbackApi';
import FeedbackCard from '../components/FeedbackCard';
import LoadingAnimation from '../components/LoadingAnimation';

const UserFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserFeedback = async (userId) => {
      setLoading(true);
      try {
        const res = await getFeedbacks({ createdBy: userId });
        setFeedbackList(res.data);
      } catch (err) {
        setError('Failed to fetch your feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchUserFeedback(loggedInUser.userId);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleDelete = async (feedbackId) => {
   
    if (window.confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
      try {
        await deleteFeedback(feedbackId);
        
        setFeedbackList(currentList => currentList.filter(item => item._id !== feedbackId));
      } catch (err) {
        console.error("Failed to delete feedback:", err);
        alert("There was an error deleting your feedback. Please try again.");
      }
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
      marginBottom: '32px',
    },
    feedbackGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '32px',
    },
    loading: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#6b7280',
      marginTop: '40px',
    },
    error: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#ef4444',
      marginTop: '40px',
    },
    noFeedback: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#6b7280',
        marginTop: '40px',
    }
  };

  if (loading) return (
    <div style={{...styles.loading, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
      <LoadingAnimation size="medium" />
      <span>Loading your feedback...</span>
    </div>
  );
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Feedback</h1>
      {feedbackList.length > 0 ? (
        <div style={styles.feedbackGrid}>
          {feedbackList.map(feedback => (
            <FeedbackCard
              key={feedback._id}
              feedback={feedback}
              user={user}
              onViewDetail={() => navigate(`/feedback/${feedback._id}`)}
              showDelete={true}
              onDelete={() => handleDelete(feedback._id)}
            />
          ))}
        </div>
      ) : (
        <p style={styles.noFeedback}>You haven't submitted any feedback yet.</p>
      )}
    </div>
  );
};

export default UserFeedback; 