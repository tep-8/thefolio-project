import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 1. Request Interceptor (Adds the token to every request)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Response Interceptor (The "Token Expiry" Bug Fix)
API.interceptors.response.use(
  (response) => response, // If the request is successful, just return it.
  (error) => {
    // Check if the error is 401 (Unauthorized/Expired)
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Redirecting to login...");
      
      // Clear the local data so the app knows we are logged out
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Force a redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;