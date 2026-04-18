import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Base URL for images
  const IMAGE_BASE_URL = 'https://thefolio-project-k8ep.onrender.com/uploads/';

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Use the environment variable if it exists, otherwise fall back to localhost
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_BASE_URL}/posts`);
        
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="homepage-wrapper" style={styles.wrapper}>
      
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroFlex}>
          <div style={styles.heroText}>
            <h2 style={styles.heroTitle}>
              From Dreaming of Saving Lives to Teaching Them How to Live
            </h2>
            <p style={styles.heroDesc}>
              Hi, I’m Stephanie Mae Gubatan. Once a little girl who dreamed of
              becoming a doctor, now a student who believes that saving lives can
              also happen inside a classroom.
            </p>
          </div>
          <img
            src="/images/picture.png" 
            alt="Stephanie Mae Gubatan"
            style={styles.heroImg}
          />
        </div>
      </section>

      {/* Community Posts Section */}
      <section style={styles.folioSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Community Folio</h2>
          <Link to="/create-post" style={styles.shareLink}>
            + Share Your Thoughts
          </Link>
        </div>
        
        {loadingPosts ? (
          <p style={styles.statusText}>Unfolding the folio...</p>
        ) : (
          <div className="posts-grid" style={styles.grid}>
            {posts.length === 0 ? (
              <p style={styles.emptyText}>No posts shared yet. Be the first!</p>
            ) : (
              posts.map(post => (
                <div key={post._id} className="post-card" style={styles.card}>
                  
                  {/* POST IMAGE SECTION */}
                  <div style={styles.imageContainer}>
                    {post.image ? (
                      <img 
                        src={`${IMAGE_BASE_URL}${post.image}`} 
                        alt={post.title}
                        style={styles.cardImg}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=Stephanie+Mae+Folio'; }}
                      />
                    ) : (
                      <div style={styles.placeholderImg}>✦</div>
                    )}
                  </div>

                  {/* CARD CONTENT */}
                  <div style={styles.cardBody}>
                    <span style={styles.categoryBadge}>{post.category}</span>
                    <h3 style={styles.postTitle}>{post.title}</h3>
                    
                    {/* --- AUTHOR ROW (NEW) --- */}
                    <div style={styles.authorRow}>
                      <img 
                        src={post.author?.profilePic 
                          ? `${IMAGE_BASE_URL}${post.author.profilePic}` 
                          : 'https://via.placeholder.com/40x40?text=S'} 
                        alt={post.author?.name} 
                        style={styles.smallAvatar} 
                      />
                      <div style={styles.authorMeta}>
                        <span style={styles.authorName}>{post.author?.name || 'Member'}</span>
                        <span style={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <p style={styles.excerpt}>
                      {post.content.substring(0, 90)}...
                    </p>

                    <Link to={`/post/${post._id}`} style={styles.readBtn}>
                      Read Full Story
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Summary Section */}
      <section style={styles.summarySection}>
        <h2 style={{ marginBottom: '30px' }}>What This Portfolio Is About</h2>
        <div style={styles.tagCloud}>
            {['A Journey of Purpose', 'Future Professor', 'Resilience & Growth'].map(item => (
                <div key={item} style={styles.tag}>
                    {item}
                </div>
            ))}
        </div>
      </section>

    </div>
  );
};

// COMPREHENSIVE STYLES
const styles = {
  wrapper: { padding: '20px', fontFamily: "'Playfair Display', serif" },
  heroSection: { maxWidth: '1000px', margin: '40px auto' },
  heroFlex: { display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' },
  heroText: { flex: 1, minWidth: '300px' },
  heroTitle: { color: '#D4AF37', fontSize: '2.2rem', marginBottom: '15px' },
  heroDesc: { lineHeight: '1.8', fontSize: '1.1rem', opacity: 0.9, color: '#333' },
  heroImg: { width: '350px', height: '450px', objectFit: 'cover', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' },

  folioSection: { maxWidth: '1000px', margin: '5rem auto' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #D4AF37', paddingBottom: '10px' },
  sectionTitle: { fontSize: '1.8rem', margin: 0 },
  shareLink: { fontWeight: 'bold', color: '#D4AF37', textDecoration: 'none' },
  
  statusText: { textAlign: 'center', marginTop: '40px', color: '#D4AF37' },
  emptyText: { fontStyle: 'italic', opacity: 0.6, marginTop: '20px' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '30px', marginTop: '40px' },
  
  card: { borderRadius: '12px', backgroundColor: '#fff', border: '1px solid #eee', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', transition: 'transform 0.2s' },
  imageContainer: { width: '100%', height: '190px', backgroundColor: '#f9f9f9' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholderImg: { width: '100%', height: '100%', background: 'linear-gradient(135deg, #FAF9F6 0%, #E5D1B1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontSize: '2rem' },
  
  cardBody: { padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 },
  categoryBadge: { fontSize: '0.65rem', textTransform: 'uppercase', color: '#D4AF37', fontWeight: 'bold', letterSpacing: '1.5px' },
  postTitle: { margin: '10px 0', fontSize: '1.3rem', lineHeight: '1.3', color: '#1a1a1a' },
  
  authorRow: { display: 'flex', alignItems: 'center', gap: '12px', margin: '15px 0' },
  smallAvatar: { width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #D4AF37' },
  authorMeta: { display: 'flex', flexDirection: 'column' },
  authorName: { fontSize: '0.9rem', fontWeight: 'bold', color: '#333' },
  postDate: { fontSize: '0.75rem', color: '#999' },
  
  excerpt: { fontSize: '0.95rem', color: '#666', lineHeight: '1.6', marginBottom: '20px' },
  readBtn: { display: 'block', textAlign: 'center', padding: '12px', backgroundColor: '#1a1a1a', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem' },

  summarySection: { maxWidth: '1000px', margin: '6rem auto', textAlign: 'center' },
  tagCloud: { display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' },
  tag: { padding: '12px 25px', background: '#FAF9F6', border: '1px solid #eee', borderRadius: '50px', fontWeight: '500', color: '#555' }
};

export default HomePage;