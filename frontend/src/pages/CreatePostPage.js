import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import API from '../api/axios'; // 1. Use your smart API instance

const CreatePostPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    title: '',
    category: 'General',
    content: ''
  });
  const [imageFile, setImageFile] = useState(null); // 2. State for the image file
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPosting(true);

    try {
      // 3. Use FormData to handle both Text and Files
      const data = new FormData();
      data.append('title', postData.title);
      data.append('category', postData.category);
      data.append('content', postData.content);
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      // 4. Send using your API instance (no need to manually set headers!)
      const response = await API.post('/posts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Post shared successfully to Stephanie's Folio!");
      navigate('/home');
      
    } catch (err) {
      console.error("Post creation failed:", err);
      alert("Failed to share post: " + (err.response?.data?.message || "Check console"));
    } finally {
      setIsPosting(false);
    }
  };

  if (!user) {
    return (
      <div className="auth-card" style={{ textAlign: 'center', margin: '100px auto', maxWidth: '500px' }}>
        <h2 style={{ color: 'var(--primary-color)' }}>🔒 Members Only</h2>
        <p>You need an account to post on this folio.</p>
        <p>Redirecting you to the Login page...</p>
        <Link to="/login" className="quiz-submit-btn" style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="create-post-wrapper">
      <main style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <div className="auth-card" style={{ background: 'var(--surface-color)', padding: '30px', borderRadius: '15px' }}>
          <h2 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Share Your Thoughts</h2>
          <p>Logged in as: <strong>{user.name} ({user.role.toUpperCase()})</strong></p>
          <hr style={{ margin: '20px 0', opacity: '0.2' }} />

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Post Title</label>
              <input 
                type="text" 
                name="title" 
                placeholder="What's on your mind?" 
                value={postData.title}
                onChange={handleChange}
                required 
              />
            </div>

            {/* 5. IMAGE UPLOAD SECTION - Only for Admin */}
            {/* 5. IMAGE UPLOAD SECTION - Now available for all registered Members */}
<div className="form-group" style={{ marginTop: '15px' }}>
  <label style={{ color: 'var(--primary-color)' }}>✦ Add a Photo to your Post (Optional)</label>
  <input 
    type="file" 
    accept="image/*" 
    onChange={handleFileChange}
    disabled={isPosting}
    style={{ 
      marginTop: '5px', 
      padding: '10px', 
      border: '1px dashed var(--primary-color)', 
      width: '100%',
      cursor: 'pointer'
    }}
  />
</div>
            <div className="form-group" style={{ marginTop: '15px' }}>
              <label>Category</label>
              <select name="category" value={postData.category} onChange={handleChange}>
                <option value="General">General Thoughts</option>
                <option value="Study Tip">Study Tip</option>
                <option value="Inspiration">Inspiration</option>
                <option value="Question">Ask a Question</option>
              </select>
            </div>

            <div className="form-group" style={{ marginTop: '15px' }}>
              <label>Your Message</label>
              <textarea 
                name="content" 
                rows="6" 
                placeholder="Write your post here..." 
                value={postData.content}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="quiz-submit-btn" 
              style={{ width: '100%', marginTop: '20px' }}
              disabled={isPosting}
            >
              {isPosting ? 'Posting...' : 'Publish to Folio'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePostPage;