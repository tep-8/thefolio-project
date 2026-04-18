import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios'; // Use your API instance with the token
import { useAuth } from '../context/AuthContext'; // To check if user is logged in

const PostDetailPage = () => {
  const { id } = useParams(); 
  const { user } = useAuth();
  const [post, setPost] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  // NEW: Comment States
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch Post
        const postRes = await API.get(`/posts/${id}`);
        setPost(postRes.data);
        
        // Fetch Comments
        const commentRes = await API.get(`/posts/${id}/comments`);
        setComments(commentRes.data);
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Remember we named the field 'body' in your Comment.js model!
      const res = await API.post(`/posts/${id}/comments`, { body: newComment });
      setComments([res.data, ...comments]); // Add new reply to top
      setNewComment(''); // Clear input
    } catch (err) {
      alert("Failed to post reply. Please check if you are logged in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Remove this reply?")) return;
    try {
      await API.delete(`/posts/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      alert("Could not delete comment.");
    }
  };

  if (loading) return <div style={styles.centerText}>Unfolding the story...</div>;
  if (!post) return <div style={styles.centerText}>Post not found.</div>;

  return (
    <div style={styles.wrapper}>
      <Link to="/home" style={styles.backLink}>← Back to Folio</Link>
      
      <article style={{ marginTop: '30px' }}>
        <span style={styles.category}>{post.category}</span>
        <h1 style={styles.title}>{post.title}</h1>
        
        <div style={styles.meta}>
          <strong>{post.author?.name || 'Community Member'}</strong>
          <span>•</span>
          <span>{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
        </div>

        {post.image && (
          <div style={{ marginBottom: '40px' }}>
            <img src={`http://localhost:5000/uploads/${post.image}`} alt={post.title} style={styles.mainImg} />
          </div>
        )}

        <div style={styles.content}>{post.content}</div>
      </article>

      {/* REPLIES SECTION */}
      <section style={styles.commentSection}>
        <h3 style={styles.sectionHeading}>Replies ({comments.length})</h3>

        {/* Reply Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} style={styles.form}>
            <textarea 
              style={styles.textarea}
              placeholder="Write a respectful reply..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit" disabled={isSubmitting} style={styles.replyBtn}>
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </button>
          </form>
        ) : (
          <p style={styles.loginPrompt}>Please <Link to="/login" style={{color:'#D4AF37'}}>login</Link> to join the conversation.</p>
        )}

        {/* Display Comments */}
        <div style={styles.commentList}>
          {comments.map(c => (
            <div key={c._id} style={styles.commentItem}>
              <div style={styles.commentHeader}>
                <strong>{c.author?.name}</strong>
                <span style={styles.commentDate}>{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={styles.commentBody}>{c.body}</p>
              
              {/* Show delete only to author or admin */}
              {(user?._id === c.author?._id || user?.role === 'admin') && (
                <button 
                  onClick={() => handleDeleteComment(c._id)} 
                  style={styles.deleteCommentBtn}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Champagne Gold & Minimalist Styles
const styles = {
  wrapper: { maxWidth: '800px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' },
  centerText: { padding: '100px', textAlign: 'center', color: '#D4AF37' },
  backLink: { color: '#D4AF37', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' },
  category: { color: '#D4AF37', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' },
  title: { fontSize: '2.8rem', margin: '15px 0', lineHeight: '1.1', color: '#1a1a1a' },
  meta: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', opacity: 0.6, fontSize: '0.9rem' },
  mainImg: { width: '100%', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  content: { lineHeight: '1.8', fontSize: '1.15rem', whiteSpace: 'pre-wrap', color: '#333' },
  
  commentSection: { marginTop: '80px', paddingTop: '40px', borderTop: '1px solid #eee' },
  sectionHeading: { fontSize: '1.3rem', marginBottom: '30px', color: '#1a1a1a' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '50px' },
  textarea: { padding: '15px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '100px', fontFamily: 'inherit', outlineColor: '#D4AF37' },
  replyBtn: { alignSelf: 'flex-end', padding: '10px 25px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '600' },
  loginPrompt: { textAlign: 'center', padding: '20px', backgroundColor: '#FAF9F6', borderRadius: '10px', color: '#666' },
  commentList: { display: 'flex', flexDirection: 'column', gap: '25px' },
  commentItem: { paddingBottom: '20px', borderBottom: '1px solid #f5f5f5', position: 'relative' },
  commentHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' },
  commentDate: { color: '#999', fontSize: '0.8rem' },
  commentBody: { margin: 0, color: '#444', fontSize: '1rem', lineHeight: '1.5' },
  deleteCommentBtn: { background: 'none', border: 'none', color: '#ff4d4d', fontSize: '0.75rem', cursor: 'pointer', padding: '5px 0', marginTop: '5px' }
};

export default PostDetailPage;