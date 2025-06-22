import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/feedbackApi';
import LoadingAnimation from '../components/LoadingAnimation';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordHintVisible, setPasswordHintVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{7,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Username and password are required.');
      return;
    }
    if (!validatePassword(form.password)) {
      setError('Password does not meet the requirements.');
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
    passwordContainer: {
      position: 'relative',
      width: '100%'
    },
    passwordInput: {
      border: '1px solid #d1d5db',
      width: '100%',
      padding: '8px 40px 8px 12px',
      marginBottom: '16px',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    togglePasswordVisibility: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#6b7280'
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
    },
    passwordHint: {
      fontSize: '12px',
      color: '#6b7280',
      marginBottom: '16px',
      paddingLeft: '4px',
      lineHeight: '1.5'
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
        <div style={styles.passwordContainer}>
          <input 
            type={isPasswordVisible ? 'text' : 'password'} 
            style={styles.passwordInput}
            placeholder="Password" 
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onFocus={() => setPasswordHintVisible(true)}
            onBlur={() => setPasswordHintVisible(false)}
          />
          <div 
            style={styles.togglePasswordVisibility} 
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>
        {passwordHintVisible && (
          <div style={styles.passwordHint}>
            Password must contain:
            <ul>
              <li>At least 7 characters</li>
              <li>One uppercase letter (A-Z)</li>
              <li>One number (0-9)</li>
              <li>One special character (!@#$&*)</li>
            </ul>
          </div>
        )}
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