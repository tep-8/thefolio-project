import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This timer matches the 4s (4000ms) animation of your progress bar
    const timer = setTimeout(() => {
      navigate('/home'); 
    }, 4000);

    // Cleanup function to prevent memory leaks if the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen" style={styles.container}>
      {/* Injecting CSS Keyframes for the loading animation */}
      <style>
        {`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .progress-bar-active {
            animation: loading 4s linear forwards;
          }
        `}
      </style>

      <div className="splash-content" style={styles.content}>
        {/* The Sparkle/Star Icon */}
        <div className="splash-icon" style={styles.icon}>✦</div>
        
        <h1 style={styles.title}>My Portfolio</h1>
        <p style={styles.subtitle}>Loading your experience...</p>
        
        {/* The Animated Progress Bar */}
        <div className="progress-container" style={styles.progressContainer}>
          <div className="progress-bar progress-bar-active" style={styles.progressBar}></div>
        </div>
      </div>
    </div>
  );
};

// Complete Inline Styles matching your dark theme screenshot
const styles = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // Dark background
    color: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    position: 'fixed', // Ensures it covers everything
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  content: {
    textAlign: 'center',
  },
  icon: {
    fontSize: '3.5rem',
    marginBottom: '20px',
    color: '#d4af37', // Gold-ish tint
  },
  title: {
    fontSize: '2.8rem',
    margin: '10px 0',
    letterSpacing: '3px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '1.1rem',
    fontStyle: 'italic',
    opacity: 0.6,
    marginBottom: '40px',
    fontWeight: '300',
  },
  progressContainer: {
    width: '250px',
    height: '4px',
    backgroundColor: '#333',
    margin: '0 auto',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ffffff', // Clean white bar
  }
};

export default SplashPage;