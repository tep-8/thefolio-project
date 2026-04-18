// frontend/src/App.js
import React, { useState, useEffect } from 'react'; // Added useState & useEffect
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectPage from './pages/ProjectPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import AdminPage from './pages/AdminPage';
import EditProfilePage from './pages/EditProfilePage';
import SettingsPage from './pages/SettingsPage';
import EditPostPage from './pages/EditPostPage';
import ChangePassword from './pages/ChangePassword';

function App() {
  // 1. Move Theme State here so it's global
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  // 2. Apply theme to the <html> element whenever it changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <>
      {/* 3. Pass theme state to Navbar so the toggle works */}
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<SplashPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/projects' element={<ProjectPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/edit-post/:id" element={<EditPostPage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />

        {/* Protected routes */}
        <Route 
          path='/profile' 
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
        />
        <Route 
          path='/settings' 
          element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} 
        />
        <Route 
          path='/create-post' 
          element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} 
        />

        {/* Admin only */}
        <Route 
          path='/admin' 
          element={<ProtectedRoute role='admin'><AdminPage /></ProtectedRoute>} 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;