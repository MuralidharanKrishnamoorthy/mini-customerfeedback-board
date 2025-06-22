import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/feedbackApi';
import LoadingAnimation from '../components/LoadingAnimation';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

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
      color: '#1f2937'
    },
    input: {
      border: '1px solid #d1d5db',
      width: '100%',
      padding: '8px 12px',
      marginBottom: '8px',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    passwordContainer: {
      position: 'relative',
      width: '100%',
      marginBottom: '16px'
    },
    passwordInput: {
      border: '1px solid #d1d5db',
      width: '100%',
      padding: '8px 40px 8px 12px',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
    },
    togglePasswordVisibility: {
      position: 'absolute',
      top: '50%',
      right: '12px',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#6b7280'
    },
    button: {
      backgroundColor: '#2563eb',
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
      backgroundColor: '#1d4ed8'
    },
    signupLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '16px',
      color: '#4f46e5',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500'
    }
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      alert("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      console.log('Login - Attempting login with:', form);
      
      // Add a minimum loading time to make animation visible
      const startTime = Date.now();
      const minLoadingTime = 2000; // 2 seconds minimum
      
      const res = await login(form);
      
      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
      }
      
      console.log('Login - Response received:', res);
      const userData = res.data;
      console.log('Login - User data to store:', userData);
      console.log('Login - Token in userData:', userData.token);
      
      localStorage.setItem("user", JSON.stringify(userData));
      console.log('Login - User stored in localStorage:', localStorage.getItem('user'));
      
      navigate(userData.role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error('Login - Error:', error);
      alert("Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <input 
        style={styles.input}
        placeholder="Username" 
        onChange={(e) => setForm({ ...form, username: e.target.value })} 
        disabled={loading}
      />
      <div style={styles.passwordContainer}>
        <input 
          type={isPasswordVisible ? 'text' : 'password'} 
          style={styles.passwordInput}
          placeholder="Password" 
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
          disabled={loading}
        />
        <div 
          style={styles.togglePasswordVisibility} 
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        >
          {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      </div>
      <button 
        onClick={handleLogin} 
        style={{
          ...styles.button,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
        onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = styles.button.backgroundColor)}
        disabled={loading}
      >
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <LoadingAnimation size="small" color="white" />
            <span>Logging in...</span>
          </div>
        ) : (
          'Login'
        )}
      </button>
      <Link to="/register" style={styles.signupLink}>
        Don't have an account? Sign Up
      </Link>
    </div>
  );
};

export default Login;
