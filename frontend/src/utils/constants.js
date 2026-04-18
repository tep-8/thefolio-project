// Use the environment variable if it exists, otherwise fall back to localhost
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// This safely replaces /api with /uploads and ensures no double slashes
export const IMAGE_BASE_URL = API_BASE_URL.replace('/api', '') + '/uploads/';