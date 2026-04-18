import React, { useState } from 'react';
import API from '../api/axios';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({ 
    oldPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Basic validation
    if (passwords.newPassword.length < 6) {
      return alert("New password must be at least 6 characters long.");
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("New passwords do not match!");
    }

    setLoading(true);
    try {
      // 2. API Call
      const res = await API.put('/users/change-password', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      
      alert(res.data.message || "Security updated! Your new password is set.");
      
      // 3. Clear form on success
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      
    } catch (err) {
      // 4. Catching backend errors
      const errorMsg = err.response?.data?.message || "Error updating password.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  }; // Only ONE closing brace for the function here!

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Security Settings</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>CURRENT PASSWORD</label>
          <input 
            type="password" 
            style={styles.input}
            value={passwords.oldPassword}
            onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>NEW PASSWORD</label>
          <input 
            type="password" 
            style={styles.input}
            value={passwords.newPassword}
            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>CONFIRM NEW PASSWORD</label>
          <input 
            type="password" 
            style={styles.input}
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
            required
          />
        </div>
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #eee', marginTop: '30px' },
  title: { fontSize: '1.1rem', marginBottom: '20px', color: '#1a1a1a' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.7rem', fontWeight: 'bold', color: '#D4AF37' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', outlineColor: '#D4AF37' },
  btn: { padding: '12px', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default ChangePassword;