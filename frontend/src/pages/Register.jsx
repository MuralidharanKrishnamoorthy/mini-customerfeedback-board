import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/feedbackApi';
import LoadingAnimation from '../components/LoadingAnimation';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Username and password are required.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Username might already exist.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '80px auto 0',
      backgroundColor: 'white',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    },
    title: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '16px',
      color: '#1f2937',
      textAlign: 'center'
    },
    input: {
      border: '1px solid #d1d5db',
      width: '100%',
      padding: '8px 12px',
      marginBottom: '16px',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    button: {
      backgroundColor: '#4f46e5',
      color: 'white',
      width: '100%',
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    buttonHover: {
      backgroundColor: '#4338ca'
    },
    error: {
      color: '#ef4444',
      textAlign: 'center',
      marginBottom: '12px'
    },
    loginLink: {
      fontSize: '14px',
      color: '#6b7280',
      textAlign: 'center',
      marginTop: '16px'
    },
    link: {
      color: '#4f46e5',
      textDecoration: 'none',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create an Account</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleRegister}>
        <input 
          style={styles.input}
          placeholder="Username" 
          onChange={(e) => setForm({ ...form, username: e.target.value })} 
        />
        <input 
          type="password" 
          style={styles.input}
          placeholder="Password" 
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
        />
        <button 
          type="submit"
          disabled={loading}
          style={{ 
            ...styles.button, 
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <LoadingAnimation size="small" color="white" />
              <span>Creating account...</span>
            </div>
          ) : (
            'Register'
          )}
        </button>
      </form>
      <p style={styles.loginLink}>
        Already have an account? <Link to="/login" style={styles.link}>Login</Link>
      </p>
    </div>
  );
};

export default Register; 