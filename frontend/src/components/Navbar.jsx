
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);// clear the local storage
    navigate('/login');
  };

  const styles = {
    navbar: {
      backgroundColor: 'white',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #e5e7eb',
      fontFamily: "'Poppins', sans-serif"
    },
    logo: {
      textDecoration: 'none',
      color: '#111827',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    },
    navLink: {
      textDecoration: 'none',
      color: '#4b5563',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'color 0.2s',
    },
    navLinkHover: {
      color: '#111827',
    },
    button: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s, color 0.2s',
    },
    primaryButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
    },
    primaryButtonHover: {
      backgroundColor: '#4338ca',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#4b5563',
    },
    secondaryButtonHover: {
      backgroundColor: '#f3f4f6',
      color: '#111827',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logo}>
        Insightify
      </Link>
      <div style={styles.navLinks}>
        {user ? (
          <div style={styles.userInfo}>
            {user.role !== 'admin' && (
              <Link to="/my-feedback" style={{...styles.navLink}}
                  onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
                  onMouseLeave={(e) => e.target.style.color = styles.navLink.color}>
                  My Feedback
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" style={{...styles.navLink, fontWeight: 'bold' }}
                onMouseEnter={(e) => e.target.style.color = styles.navLinkHover.color}
                onMouseLeave={(e) => e.target.style.color = styles.navLink.color}>
                Dashboard
              </Link>
            )}
            <button 
              onClick={handleLogout} 
              style={{...styles.button, ...styles.secondaryButton}}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = styles.secondaryButtonHover.backgroundColor;
                e.target.style.color = styles.secondaryButtonHover.color;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = styles.secondaryButton.backgroundColor;
                e.target.style.color = styles.secondaryButton.color;
              }}>
              Logout
            </button>
            <Link to="/submit">
              <button 
                style={{...styles.button, ...styles.primaryButton}}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.primaryButtonHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.primaryButton.backgroundColor}>
                + Add Feedback
              </button>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login">
              <button 
                style={{...styles.button, ...styles.secondaryButton}}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = styles.secondaryButtonHover.backgroundColor;
                  e.target.style.color = styles.secondaryButtonHover.color;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = styles.secondaryButton.backgroundColor;
                  e.target.style.color = styles.secondaryButton.color;
                }}>
                Login
              </button>
            </Link>
            <Link to="/register">
               <button 
                style={{...styles.button, ...styles.primaryButton}}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.primaryButtonHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.primaryButton.backgroundColor}>
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;