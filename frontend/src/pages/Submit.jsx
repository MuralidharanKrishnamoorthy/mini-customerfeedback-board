// src/pages/Submit.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFeedback } from '../services/feedbackApi';
import LoadingAnimation from '../components/LoadingAnimation';

const Submit = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Feature');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    setLoadingProgress(0);
    setLoadingMessage('Preparing your feedback...');
    
    const startTime = Date.now();
    const minLoadingDuration = 3000; // 3 seconds minimum loading time
    
    // Progress simulation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev < 90) {
          const newProgress = prev + Math.random() * 15;
          if (newProgress < 30) {
            setLoadingMessage('Validating your feedback...');
          } else if (newProgress < 60) {
            setLoadingMessage('Processing your submission...');
          } else if (newProgress < 90) {
            setLoadingMessage('Almost done...');
          }
          return Math.min(newProgress, 90);
        }
        return prev;
      });
    }, 200);

    try {
      await createFeedback({ title, description, category });
      
      // Ensure minimum loading duration
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingDuration - elapsedTime);
      
      if (remainingTime > 0) {
        setLoadingMessage('Finalizing...');
        setLoadingProgress(95);
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setLoadingProgress(100);
      setLoadingMessage('Success! Redirecting...');
      
      // Brief pause to show completion
      setTimeout(() => {
        navigate('/');
      }, 500);
      
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error(err);
    } finally {
      clearInterval(progressInterval);
      setSubmitting(false);
      setLoadingProgress(0);
      setLoadingMessage('');
    }
  };
  
  const styles = {
    container: {
      maxWidth: '700px',
      margin: '40px auto',
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '24px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    textarea: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      fontSize: '14px',
      minHeight: '120px',
      resize: 'vertical',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.2s, opacity 0.2s',
      alignSelf: 'flex-start',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    submitButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
    },
    submitButtonHover: {
      backgroundColor: '#4338ca',
    },
    error: {
      color: '#ef4444',
      fontSize: '14px',
      marginTop: '16px',
      textAlign: 'center'
    },
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    loadingCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      maxWidth: '400px',
      width: '90%',
      textAlign: 'center',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    loadingTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px'
    },
    loadingMessage: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '24px'
    },
    progressContainer: {
      width: '100%',
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      height: '8px',
      overflow: 'hidden',
      marginBottom: '16px'
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#4f46e5',
      borderRadius: '8px',
      transition: 'width 0.3s ease',
      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)'
    },
    progressText: {
      fontSize: '12px',
      color: '#6b7280',
      fontWeight: '500'
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }
  };

  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <>
      <div style={styles.container}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <h1 style={styles.title}>Submit New Feedback</h1>
        <p style={styles.subtitle}>Share your idea to help us improve.</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{...styles.input, backgroundColor: submitting ? '#f3f4f6' : 'white'}}
              placeholder="A short, descriptive title"
              disabled={submitting}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="category" style={styles.label}>Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{...styles.input, backgroundColor: submitting ? '#f3f4f6' : 'white'}}
              disabled={submitting}
            >
              <option value="Feature">Feature Request</option>
              <option value="Bug">Bug Report</option>
              <option value="UI">UI/UX Improvement</option>
            </select>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="description" style={styles.label}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{...styles.textarea, backgroundColor: submitting ? '#f3f4f6' : 'white'}}
              placeholder="Provide details about your feedback..."
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              ...styles.button, 
              ...styles.submitButton,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1
            }}
            onMouseEnter={(e) => !submitting && (e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor)}
            onMouseLeave={(e) => !submitting && (e.target.style.backgroundColor = styles.submitButton.backgroundColor)}
          >
            {submitting && <LoadingAnimation size="small" color="white" />}
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
        </form>
      </div>

      {/* Loading Overlay */}
      {submitting && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingCard}>
            <h3 style={styles.loadingTitle}>Submitting Feedback</h3>
            <p style={styles.loadingMessage}>{loadingMessage}</p>
            
            <div style={styles.progressContainer}>
              <div 
                style={{
                  ...styles.progressBar,
                  width: `${loadingProgress}%`
                }}
              />
            </div>
            
            <p style={styles.progressText}>{Math.round(loadingProgress)}% Complete</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Submit;