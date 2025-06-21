import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/feedbackApi';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
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
    passwordInput: {
      border: '1px solid #d1d5db',
      width: '100%',
      padding: '8px 12px',
      marginBottom: '16px',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box'
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
    try {
      console.log('Login - Attempting login with:', form);
      const res = await login(form);
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
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <input 
        style={styles.input}
        placeholder="Username" 
        onChange={(e) => setForm({ ...form, username: e.target.value })} 
      />
      <input 
        type="password" 
        style={styles.passwordInput}
        placeholder="Password" 
        onChange={(e) => setForm({ ...form, password: e.target.value })} 
      />
      <button 
        onClick={handleLogin} 
        style={styles.button}
        onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
      >
        Login
      </button>
      <Link to="/register" style={styles.signupLink}>
        Don't have an account? Sign Up
      </Link>
    </div>
  );
};

export default Login;
