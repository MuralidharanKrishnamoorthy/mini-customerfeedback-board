import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFeedbackById, updateFeedback } from '../services/feedbackApi';
import LoadingAnimation from '../components/LoadingAnimation';

const EditFeedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await getFeedbackById(id);
        const { title, description, category } = res.data;
        setTitle(title);
        setDescription(description);
        setCategory(category);
      } catch (err) {
        setError('Failed to load feedback data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await updateFeedback(id, { title, description, category });
      navigate('/my-feedback');
    } catch (err) {
      setError('Failed to update feedback. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
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
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '40px'}}><LoadingAnimation /></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Edit Feedback</h1>
      <p style={styles.subtitle}>Update the details of your feedback below.</p>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="title" style={styles.label}>Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            disabled={submitting}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="category" style={styles.label}>Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
            disabled={submitting}
          >
            <option value="Feature">Feature</option>
            <option value="Bug">Bug</option>
            <option value="UI">UI</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
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
            {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditFeedback; 