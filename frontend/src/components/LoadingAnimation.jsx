import React from 'react';

const LoadingAnimation = ({ size = 'medium', color = '#2563eb' }) => {
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: size === 'small' ? '3px' : size === 'large' ? '6px' : '4px',
    },
    dot: {
      width: size === 'small' ? '4px' : size === 'large' ? '8px' : '6px',
      height: size === 'small' ? '4px' : size === 'large' ? '8px' : '6px',
      backgroundColor: color,
      borderRadius: '50%',
      animation: 'commentBounce 2.5s ease-in-out infinite both',
    },
    dot1: {
      animationDelay: '-0.32s',
    },
    dot2: {
      animationDelay: '-0.16s',
    },
    dot3: {
      animationDelay: '0s',
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes commentBounce {
            0%, 80%, 100% { 
              transform: scale(0);
              opacity: 0.5;
            } 
            40% { 
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={{...styles.dot, ...styles.dot1}}></div>
        <div style={{...styles.dot, ...styles.dot2}}></div>
        <div style={{...styles.dot, ...styles.dot3}}></div>
      </div>
    </>
  );
};

export default LoadingAnimation; 