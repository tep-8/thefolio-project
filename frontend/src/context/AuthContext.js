// frontend/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load: if a token exists, fetch user data
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // CHANGE FROM /auth/me TO /users/me
    API.get('/users/me') 
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  } else {
    setLoading(false);
  }
}, []);

  // --- REGISTER FUNCTION (ADDED THIS) ---
  const register = async (name, email, password) => {
  // CHANGE FROM /auth/register TO /users/register
  const { data } = await API.post('/auth/register', { name, email, password });
  localStorage.setItem('token', data.token);
  setUser(data.user);
  return data.user;
};

  // login(): call the backend, save token, store user in state
  const login = async (email, password) => {
  try {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data)); 
    setUser(res.data); 
    
    return res.data; // <--- CRITICAL: Without this, LoginPage gets 'undefined'
  } catch (err) {
    throw err;
  }
};

  // logout(): clear token and user from memory
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    /* ADDED 'register' TO THE VALUE BELOW */
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);