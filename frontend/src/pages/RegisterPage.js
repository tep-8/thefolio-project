import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuth } from '../context/AuthContext'; // Added this import

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); // Connect to the "engine"

  // --- THEME STATE ---
  const [isDark,] = useState(localStorage.getItem('theme') === 'dark');

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    fullname: '',
    dob: '',
    email: '',
    password: '',
    confirm_password: '',
    gender: '',
    account_type: '',
    level: '',
    terms: false
  });
  
  const [loading, setLoading] = useState(false); // Added loading state
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // --- THEME EFFECT ---
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setErrorMessage(''); 
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => { // Added 'async'
    e.preventDefault();
    setErrorMessage('');

    // 1. Password Match Check
    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    // 2. Age Verification
    const dobDate = new Date(formData.dob);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setErrorMessage("Sorry, you must be at least 18 years old to register.");
      return;
    }

    // 3. SEND DATA TO BACKEND
    setLoading(true);
    try {
      // We map 'fullname' to 'name' because your Backend User model expects 'name'
      await register(formData.fullname, formData.email, formData.password);
      
      console.log("Registration Successful!");
      setIsRegistered(true);
      
      // Redirect after 3 seconds so they can see the success message
      setTimeout(() => {
        navigate('/home');
      }, 3000);

    } catch (err) {
      console.error("Register Error:", err);
      setErrorMessage(err.response?.data?.message || "Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-wrapper">
      <main style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="content-flex" style={{ alignItems: 'flex-start' }}>
          
          <div style={{ flex: 1 }}>
            <h2>Create Your Account</h2>
            <p>Join my academic community to receive updates and explore research interests.</p>
            <img

              src="/images/register-image.jpg"

              alt="Registration Illustration"

              style={{ width: '100%', maxWidth: '450px', borderRadius: '15px', marginTop: '20px' }}

            />
            <div style={{ marginTop: '20px' }}>
                <p>Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Log in here</Link></p>
            </div>
          </div>

          <div className="auth-card" style={{ flex: 1.2, background: 'var(--surface-color)', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            
            {isRegistered ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <h3 style={{ color: 'var(--primary-color)', fontSize: '2rem' }}>✨ Welcome!</h3>
                <p>Registration successful for <strong>{formData.fullname}</strong>.</p>
                <p>Redirecting you to the home page...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                {errorMessage && (
                  <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '8px', marginBottom: '20px', borderLeft: '5px solid #dc3545' }}>
                    {errorMessage}
                    
                  </div>

                )}

                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} required />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                      <option value="" disabled>Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Confirm Password</label>
                    <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
                  </div>
                </div>

                <button type="submit" className="quiz-submit-btn" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
                  {loading ? 'Creating Account...' : 'Register Account'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;