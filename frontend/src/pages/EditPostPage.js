import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        const post = res.data;
        
        // Final safety check: If not owner and not admin, kick them out
        if (post.author?._id !== user?._id && user?.role !== 'admin') {
          alert("You don't have permission to edit this.");
          return navigate('/profile');
        }

        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        navigate('/profile');
      }
    };
    if (user) fetchPost();
  }, [id, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const updateData = {
      title,
      content,
      category
    };

    try {
      await API.put(`/posts/${id}`, updateData);
      alert("Changes saved to your folio! ✦");
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || "Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  // NEW: Handle Delete Function
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to permanently remove this story? This action cannot be undone.")) {
      setUpdating(true);
      try {
        await API.delete(`/posts/${id}`);
        alert("Story removed successfully.");
        navigate('/profile');
      } catch (err) {
        alert(err.response?.data?.message || "Failed to remove story.");
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) return <div style={styles.loading}>Opening your draft...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.pageTitle}>Edit Story</h1>
        <div style={styles.underline}></div>
      </header>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>TITLE</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            style={styles.input} 
            required 
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>CATEGORY</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            style={styles.select}
          >
            <option value="General">General</option>
            <option value="Travel">Travel</option>
            <option value="Academic">Academic</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>STORY CONTENT</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            style={styles.textarea} 
            required 
          />
        </div>

        <div style={styles.btnGroup}>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            style={styles.cancelBtn}
            disabled={updating}
          >
            Cancel
          </button>

          {/* NEW: Remove Button */}
          <button 
            type="button" 
            onClick={handleDelete} 
            style={styles.deleteBtn}
            disabled={updating}
          >
            {updating ? '...' : 'Remove'}
          </button>

          <button 
            type="submit" 
            disabled={updating} 
            style={styles.submitBtn}
          >
            {updating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: '700px', margin: '50px auto', padding: '40px', backgroundColor: '#FAF9F6', borderRadius: '15px', border: '1px solid #eee' },
  header: { textAlign: 'center', marginBottom: '40px' },
  pageTitle: { fontSize: '2rem', color: '#1a1a1a', margin: 0, fontFamily: "'Playfair Display', serif" },
  underline: { width: '50px', height: '3px', backgroundColor: '#D4AF37', margin: '10px auto' },
  form: { display: 'flex', flexDirection: 'column', gap: '25px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px', color: '#D4AF37' },
  input: { padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', outlineColor: '#D4AF37' },
  select: { padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' },
  textarea: { padding: '12px', border: '1px solid #ddd', borderRadius: '8px', minHeight: '250px', fontSize: '1rem', lineHeight: '1.6', outlineColor: '#D4AF37', resize: 'vertical' },
  btnGroup: { display: 'flex', gap: '15px', marginTop: '20px' },
  submitBtn: { flex: 2, padding: '15px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px' },
  cancelBtn: { flex: 1, padding: '15px', backgroundColor: 'transparent', border: '1px solid #ddd', color: '#666', borderRadius: '8px', cursor: 'pointer' },
  // Styled for a distinct "danger" action
  deleteBtn: { flex: 1, padding: '15px', backgroundColor: 'transparent', border: '1px solid #d32f2f', color: '#d32f2f', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  loading: { textAlign: 'center', padding: '100px', color: '#D4AF37', fontStyle: 'italic' }
};

export default EditPostPage;