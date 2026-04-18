import React, { useState, useEffect } from 'react';
import { } from 'react-router-dom';

const ContactPage = () => {
  

  // --- THEME STATE ---
  const [isDark] = useState(localStorage.getItem('theme') === 'dark');

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- THEME EFFECT ---
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted for:", formData.name);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitted(false);
  };

  return (
    <div className="contact-page-wrapper">
      {/* Main Contact Form Section */}
      <section style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2>Let's Connect</h2>
        
        {!isSubmitted ? (
          <div className="auth-card"> {/* Reusing card styling for consistency */}
            <p style={{ marginBottom: '20px' }}>Whether you have a question about my research or just want to say hi, my inbox is always open.</p>
            <form id="contactForm" onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="e.g. Juan Dela Cruz" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="yourname@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  placeholder="What's on your mind?" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="quiz-submit-btn" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>
        ) : (
          <div className="quiz-results" style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: 'var(--primary-color)' }}>Message Received!</h3>
            <p>Thank you, <strong>{formData.name}</strong>. I'll get back to you at <em>{formData.email}</em> as soon as possible.</p>
            <button 
              onClick={handleReset} 
              className="quiz-submit-btn"
              style={{ marginTop: '20px' }}
            >
              Send Another Message
            </button>
          </div>
        )}
      </section>

      {/* Resources Table Section */}
      <section>
        <h2>Academic Resources</h2>
        <p>A few platforms that have helped me along my journey in IT and Education:</p>
        <div className="table-container" style={{ overflowX: 'auto', marginTop: '20px' }}>
          <table>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Focus</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>MDN Web Docs</td>
                <td>Technical Documentation</td>
                <td><a href="https://developer.mozilla.org/" target="_blank" rel="noopener noreferrer">Visit</a></td>
              </tr>
              <tr>
                <td>freeCodeCamp</td>
                <td>Project-Based Learning</td>
                <td><a href="https://www.freecodecamp.org/" target="_blank" rel="noopener noreferrer">Visit</a></td>
              </tr>
              <tr>
                <td>W3Schools</td>
                <td>Quick Reference</td>
                <td><a href="https://www.w3schools.com/" target="_blank" rel="noopener noreferrer">Visit</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Social & Map Section */}
      <section className="content-flex" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h2>Find Me Online</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>📧 <strong>Email:</strong> stephanie@email.com</li>
            <li style={{ marginBottom: '10px' }}>🔗 <strong>LinkedIn:</strong> /in/stephanie-mae</li>
            <li style={{ marginBottom: '10px' }}>📸 <strong>Instagram:</strong> @steph_rides</li>
          </ul>
        </div>
        <div style={{ flex: 1 }}>
          <h2>Current Base</h2>
          <img 
            src="/images/map.jpg" 
            alt="Map location" 
            className="content-img"
            style={{ marginTop: '10px', width: '100%', maxWidth: '400px' }}
          />
        </div>
      </section>
    </div>
  );
};

export default ContactPage;