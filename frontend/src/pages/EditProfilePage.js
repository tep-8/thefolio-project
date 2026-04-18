import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
// 1. Import the password component
import ChangePassword from './ChangePassword'; 

const EditProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [file, setFile] = useState(null);
 const IMAGE_BASE_URL = process.env.REACT_APP_API_URL 
  ? process.env.REACT_APP_API_URL.replace('/api', '/uploads') 
  : 'http://localhost:5000/uploads';

const [preview, setPreview] = useState(user?.profilePic ? `${IMAGE_BASE_URL}/${user.profilePic}` : '');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (file) formData.append('profilePic', file);

    try {
      const res = await API.put('/users/profile', formData);
      setUser(res.data); 
      localStorage.setItem('user', JSON.stringify(res.data)); 
      alert("Profile polished! ✦");
      navigate('/profile');
    } catch (err) {
      alert("Update failed.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Edit Profile</h2>
      
      {/* PROFILE FORM */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.avatarSection}>
          <img src={preview || 'https://via.placeholder.com/150'} alt="Avatar" style={styles.avatar} />
          <br />
          <input type="file" onChange={handleFileChange} style={{ fontSize: '0.8rem' }} />
        </div>

        <label style={styles.label}>DISPLAY NAME</label>
        <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />

        <label style={styles.label}>BIO</label>
        <textarea 
          style={styles.textarea} 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
          placeholder="Tell the community about yourself..." 
        />

        <button type="submit" style={styles.saveBtn}>Save Profile Changes</button>
      </form>

      {/* 2. SECURITY SECTION */}
      <div style={styles.divider}></div>
      
      <ChangePassword />

      <button 
        onClick={() => navigate('/profile')} 
        style={styles.backBtn}
      >
        ← Back to Profile
      </button>
    </div>
  );
};

const styles = {
  container: { maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: '#FAF9F6', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  title: { textAlign: 'center', color: '#1a1a1a', fontFamily: 'Playfair Display', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  avatarSection: { textAlign: 'center', marginBottom: '10px' },
  avatar: { width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px', border: '3px solid #D4AF37' },
  label: { fontSize: '0.7rem', fontWeight: 'bold', color: '#D4AF37', letterSpacing: '1px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px', fontFamily: 'inherit' },
  saveBtn: { padding: '15px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' },
  divider: { height: '1px', backgroundColor: '#e0e0e0', margin: '40px 0' },
  backBtn: { marginTop: '30px', background: 'none', border: 'none', color: '#888', cursor: 'pointer', textDecoration: 'underline', width: '100%', fontSize: '0.9rem' }
};

export default EditProfilePage;