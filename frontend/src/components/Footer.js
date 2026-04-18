import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        {/* Column 1: Branding */}
        <div style={styles.footerColumn}>
          <h3 style={styles.footerLogo}>✦ TheFolio</h3>
          <p style={styles.footerTagline}>
            Redefining what it means to save lives through education, 
            technology, and personal story.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div style={styles.footerColumn}>
          <h4 style={styles.footerHeading}>Explore</h4>
          <Link to="/home" style={styles.footerLink}>Home</Link>
          <Link to="/about" style={styles.footerLink}>My Journey</Link>
          <Link to="/projects" style={styles.footerLink}>Interests</Link>
          <Link to="/contact" style={styles.footerLink}>Connect</Link>
        </div>

        {/* Column 3: Contact Info */}
        <div style={styles.footerColumn}>
          <h4 style={styles.footerHeading}>Contact</h4>
          <p style={styles.footerText}>📍 Pangasinan, Philippines</p>
          <p style={styles.footerText}>✉️ stephanie@email.com</p>
          <p style={styles.footerText}>📞 09XX XXX XXXX</p>
        </div>
      </div>

      <div style={styles.footerBottom}>
        <p>&copy; 2026 Stephanie Mae Gubatan. All rights reserved.</p>
        <p style={{ fontSize: '0.7rem', opacity: 0.4, marginTop: '5px' }}>
          All images are original and personally owned by the author.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1a1a1a', 
    color: '#ffffff',
    padding: '60px 20px 20px 20px',
    marginTop: '100px',
    borderTop: '2px solid #d4af37', 
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '40px',
  },
  footerColumn: {
    flex: '1',
    minWidth: '200px',
  },
  footerLogo: {
    fontSize: '1.5rem',
    color: '#d4af37',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  footerTagline: {
    fontSize: '0.9rem',
    lineHeight: '1.6',
    opacity: 0.7,
  },
  footerHeading: {
    fontSize: '1rem',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#d4af37',
  },
  footerLink: {
    display: 'block',
    color: '#ccc',
    textDecoration: 'none',
    marginBottom: '10px',
    fontSize: '0.9rem',
    transition: 'color 0.3s',
  },
  footerText: {
    fontSize: '0.9rem',
    color: '#ccc',
    marginBottom: '10px',
    margin: 0,
    lineHeight: '1.8'
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '40px auto 0 auto',
    paddingTop: '20px',
    borderTop: '1px solid #333',
    textAlign: 'center',
    fontSize: '0.8rem',
    opacity: 0.6,
  }
};

export default Footer;