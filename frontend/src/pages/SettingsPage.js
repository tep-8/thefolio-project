import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        {/* SIMPLIFIED SIDEBAR */}
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>SETTINGS</h2>
          <nav style={styles.sideNav}>
            {/* We keep only the active section */}
            <div style={styles.sideLinkActive}>Security & Password</div>
          </nav>
          
          {/* Back button positioned clearly at the bottom of the sidebar */}
          <button onClick={() => navigate('/profile')} style={styles.backBtn}>
            ← Back to Folio
          </button>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main style={styles.content}>
          <header style={styles.header}>
            <h1 style={styles.title}>Security Settings</h1>
            <p style={styles.subtitle}>Manage your password and protect your account.</p>
          </header>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Change Password</h3>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>CURRENT PASSWORD</label>
              <input type="password" style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>NEW PASSWORD</label>
              <input type="password" style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>CONFIRM NEW PASSWORD</label>
              <input type="password" style={styles.input} />
            </div>

            <button style={styles.actionBtn}>Update Password</button>
          </section>

          <section style={styles.infoBox}>
            <p><strong>Note:</strong> Changing your password will log you out of all other active sessions to ensure your account remains secure.</p>
          </section>
        </main>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { minHeight: '100vh', backgroundColor: '#f4f4f4', padding: '80px 20px' },
  container: { 
    maxWidth: '1000px', 
    margin: '0 auto', 
    display: 'flex', 
    backgroundColor: '#fff', 
    border: '1px solid #ddd',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  },
  
  // Sidebar Styles
  sidebar: { width: '250px', backgroundColor: '#1a1a1a', padding: '40px 20px', color: '#fff' },
  sidebarTitle: { fontSize: '0.7rem', letterSpacing: '2px', color: '#D4AF37', marginBottom: '30px' },
  sideNav: { display: 'flex', flexDirection: 'column', gap: '15px' },
  sideLink: { fontSize: '0.85rem', color: '#999', cursor: 'pointer', transition: '0.3s' },
  sideLinkActive: { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold', borderLeft: '3px solid #D4AF37', paddingLeft: '10px' },
  backBtn: { marginTop: '100px', background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.8rem' },

  // Content Styles
  content: { flex: 1, padding: '60px' },
  header: { marginBottom: '40px' },
  title: { fontSize: '1.8rem', margin: '0 0 10px 0', fontFamily: 'serif' },
  subtitle: { color: '#777', fontSize: '0.9rem' },
  
  section: { maxWidth: '400px' },
  sectionTitle: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '25px', color: '#333' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '1px', marginBottom: '8px', color: '#555' },
  input: { width: '100%', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '4px', outline: 'none' },
  
  actionBtn: { padding: '14px 25px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' },
  infoBox: { marginTop: '40px', padding: '20px', backgroundColor: '#fffdf5', border: '1px solid #E5D1B1', fontSize: '0.8rem', color: '#886d2b' }
};

export default SettingsPage;