"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeedbacks, upvoteFeedback } from '../services/feedbackApi';
import FeedbackCard from '../components/FeedbackCard';
import FilterBar from '../components/FilterBar';
import LoadingAnimation from '../components/LoadingAnimation';

const Home = () => {
  const [allFeedbackList, setAllFeedbackList] = useState([]);
  const [filteredFeedbackList, setFilteredFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [activeFilter, setActiveFilter] = useState('sort:mostVoted');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllFeedback = async () => {
      setLoading(true);
      try {
        const res = await getFeedbacks();
        setAllFeedbackList(res.data);
      } catch (err) {
        setError('Failed to fetch feedback. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);
    fetchAllFeedback();
  }, []);

  useEffect(() => {
    let listToProcess = [...allFeedbackList];
    const [type, value] = activeFilter.split(':');

    if (type === 'sort') {
      if (value === 'mostVoted') {
        listToProcess.sort((a, b) => b.upvotes - a.upvotes);
      } else if (value === 'leastVoted') {
        listToProcess.sort((a, b) => a.upvotes - b.upvotes);
      } else if (value === 'newest') {
        listToProcess.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } else if (type === 'status') {
      if (value !== 'All') {
        listToProcess = listToProcess.filter(item => item.status === value);
      }
    } else if (type === 'category') {
      if (value !== 'All') {
        const categoryValue = value === 'UI Improvement' ? 'UI' : value;
        listToProcess = listToProcess.filter(item => item.category === categoryValue);
      }
    }

    setFilteredFeedbackList(listToProcess);
  }, [activeFilter, allFeedbackList]);

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
  };

  const handleUpvote = async (id) => {
    if (!user) {
      alert("You must be logged in to upvote.");
      return;
    }
    
    try {
      const res = await upvoteFeedback(id);
      setAllFeedbackList(prevList => prevList.map(fb => (fb._id === id ? res.data : fb)));
    } catch (err) {
      console.error("Failed to upvote:", err);
      if (err.response?.status === 400 && err.response?.data?.hasUpvoted) {
        alert("You have already upvoted this feedback!");
      } else {
        alert("Failed to upvote. Please try again.");
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
    welcomeMessage: {
        textAlign: 'left',
        marginBottom: '24px',
        fontSize: '28px',
        fontWeight: '600',
        color: '#374151',
    },
    heroSection: {
      textAlign: 'center',
      padding: '0 0 64px 0',
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: '700',
      color: '#111827',
      lineHeight: '1.2',
      marginBottom: '16px'
    },
    heroSubtitle: {
      fontSize: '18px',
      color: '#4b5563',
      maxWidth: '600px',
      margin: '0 auto',
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
    },
    error: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#ef4444',
      marginTop: '40px',
    },
  };

  return (
    <div style={styles.container}>
      {user && <div style={styles.welcomeMessage}>Welcome, {user.username}!</div>}
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Build better products with customer feedback</h1>
        <p style={styles.heroSubtitle}>Centralize product feedback to uncover insights and make informed product decisions</p>
      </div>
      <FilterBar onFilterChange={handleFilterChange} currentFilter={activeFilter} />
      {loading ? (
        <div style={{...styles.loading, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'}}>
          <LoadingAnimation size="medium" />
          <span>Loading feedback...</span>
        </div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <div style={styles.feedbackGrid}>
          {filteredFeedbackList.length > 0 ? (
            filteredFeedbackList.map(feedback => (
              <FeedbackCard
                key={feedback._id}
                feedback={feedback}
                user={user}
                onUpvote={() => handleUpvote(feedback._id)}
                onViewDetail={() => navigate(`/feedback/${feedback._id}`)}
              />
            ))
          ) : (
            <p>No feedback matching your filters.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;