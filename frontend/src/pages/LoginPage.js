import React, { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // --- THEME STATE ---
  const [isDark] = useState(localStorage.getItem('theme') === 'dark');

  // --- FORM STATE ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- THEME EFFECT ---
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [isDark]);

  // --- HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. login() now returns the user object thanks to your Context fix
      const loggedInUser = await login(email, password);
      
      // 2. We check if it worked, then navigate
      if (loggedInUser) {
        // 'replace: true' wipes the login page from the back-button history
        const targetPath = loggedInUser.role === 'admin' ? '/admin' : '/home';
        navigate(targetPath, { replace: true });
      }
    } catch (err) {
      // 3. This ONLY runs if the server actually sends a 401/400 error
      console.error("Login Error:", err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <main style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div className="content-flex">
          
          {/* Left Side: Welcome Text */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>Welcome Back</h2>
            <p style={{ fontSize: '1.1rem', marginTop: '15px' }}>
              Log in to access your personal dashboard, saved resources, and community updates.
            </p>
            <div style={{ marginTop: '30px', padding: '20px', borderLeft: '4px solid var(--secondary-color)', background: 'var(--surface-color)' }}>
                <p style={{ fontStyle: 'italic' }}>
                    "The beautiful thing about learning is that no one can take it away from you."
                </p>
            </div>
          </div>

          {/* Right Side: Login Card */}
          <div className="auth-card" style={{ flex: 1, background: 'var(--surface-color)', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '25px' }}>Member Login</h3>
            
            {error && (
              <div style={{ background: '#f8d7da', color: '#721c24', padding: '12px', borderRadius: '8px', marginBottom: '20px', borderLeft: '5px solid #dc3545', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="quiz-submit-btn" 
                style={{ width: '100%', marginTop: '25px', padding: '15px' }}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
              <p style={{ fontSize: '0.9rem' }}>
                New to the platform? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Create an account</Link>
              </p>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default LoginPage;