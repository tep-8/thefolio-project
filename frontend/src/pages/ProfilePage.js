import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback for old local images (new Cloudinary images won't use this)
  const IMAGE_BASE_URL = 'https://thefolio-project-k8ep.onrender.com/uploads/';

  const fetchMyPosts = useCallback(async () => {
    try {
      const res = await API.get('/posts');
      const filtered = res.data.filter(post => post.author?._id === user?._id);
      setMyPosts(filtered);
    } catch (err) {
      console.error("Error fetching your stories:", err);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user) {
      fetchMyPosts();
    }
  }, [user, fetchMyPosts]);

  /**
   * Helper to determine image source.
   * Works for both Profile Pictures and Post Images.
   */
  const getImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${IMAGE_BASE_URL}${path}`;
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to remove this story?")) {
      try {
        await API.delete(`/posts/${postId}`);
        setMyPosts(myPosts.filter(p => p._id !== postId));
      } catch (err) {
        alert("Failed to remove story.");
      }
    }
  };

  if (!user) return <div style={styles.loading}>Loading profile...</div>;

  return (
    <div style={styles.pageWrapper}>
      {/* Profile Header */}
      <section style={styles.headerSection}>
        <div style={styles.profileInfo}>
          
          <div style={styles.avatar}>
            {user.profilePic ? (
              <img 
                src={getImageUrl(user.profilePic)} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=1a1a1a&color=D4AF37&bold=true`; 
                }}
              />
            ) : (
              <img 
                src={`https://ui-avatars.com/api/?name=${user.name}&background=1a1a1a&color=D4AF37&bold=true&size=128`} 
                alt="Default Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            )}
          </div>

          <div style={styles.details}>
            <h1 style={styles.name}>{user.name}</h1>
            <p style={styles.bio}>{user.bio || "No bio yet."}</p>
            <div style={styles.stats}>
              <strong>{myPosts.length}</strong> Stories
            </div>
          </div>
        </div>
        
        <button onClick={() => navigate('/edit-profile')} style={styles.editProfileBtn}>
          Edit Profile
        </button>
      </section>

      {/* Stories Section */}
      <section style={styles.storiesSection}>
        <h2 style={styles.sectionTitle}>MY STORIES</h2>
        <div style={styles.underline}></div>

        <div style={styles.grid}>
          {myPosts.map(post => (
            <div key={post._id} style={styles.card}>
              <div style={styles.imagePlaceholder}>
                {post.image && (
                  <img 
                    src={getImageUrl(post.image)} 
                    alt={post.title} 
                    style={styles.cardImg} 
                  />
                )}
              </div>
              <div style={styles.cardContent}>
                <span style={styles.cardCategory}>{post.category?.toUpperCase()}</span>
                <h3 style={styles.cardTitle}>{post.title}</h3>
                <div style={styles.cardActions}>
                  <button onClick={() => navigate(`/edit-post/${post._id}`)} style={styles.actionLink}>
                    Edit Story
                  </button>
                  <button onClick={() => handleDelete(post._id)} style={{...styles.actionLink, color: '#d32f2f'}}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ... Styles stay exactly the same as you had them ...
const styles = {
  pageWrapper: { maxWidth: '1100px', margin: '0 auto', padding: '60px 20px', fontFamily: "'Playfair Display', serif" },
  headerSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' },
  profileInfo: { display: 'flex', alignItems: 'center', gap: '30px' },
  avatar: { width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#1a1a1a', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #fff', boxShadow: '0 0 0 2px #D4AF37', overflow: 'hidden' },
  name: { fontSize: '2.2rem', margin: '0 0 5px 0', color: '#2c3e50' },
  bio: { color: '#666', margin: '0 0 15px 0', fontSize: '1rem' },
  stats: { fontSize: '0.9rem', color: '#333' },
  editProfileBtn: { padding: '10px 25px', backgroundColor: 'transparent', border: '1px solid #D4AF37', color: '#D4AF37', cursor: 'pointer', borderRadius: '4px' },
  storiesSection: { marginBottom: '60px' },
  sectionTitle: { fontSize: '1.1rem', letterSpacing: '3px', color: '#2c3e50', margin: 0 },
  underline: { width: '60px', height: '3px', backgroundColor: '#D4AF37', marginTop: '8px', marginBottom: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' },
  card: { backgroundColor: '#FAF9F6', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f0f0f0' },
  imagePlaceholder: { width: '100%', height: '200px', backgroundColor: '#F3F1ED' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  cardContent: { padding: '25px' },
  cardCategory: { fontSize: '0.7rem', color: '#D4AF37', fontWeight: 'bold', letterSpacing: '1px' },
  cardTitle: { fontSize: '1.3rem', margin: '15px 0 25px 0', color: '#2c3e50' },
  cardActions: { display: 'flex', gap: '20px', borderTop: '1px solid #eee', paddingTop: '15px' },
  actionLink: { background: 'none', border: 'none', padding: 0, fontSize: '0.85rem', color: '#333', cursor: 'pointer', fontFamily: 'inherit' },
  loading: { textAlign: 'center', padding: '100px', color: '#D4AF37' }
};

export default ProfilePage;