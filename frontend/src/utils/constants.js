// Use the environment variable if it exists, otherwise fall back to localhost
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// This safely replaces /api with /uploads and ensures no double slashes
export const IMAGE_BASE_URL = API_BASE_URL.replace('/api', '') + '/uploads/';

export const getAvatar = (user) => {
  if (user?.profilePic) {
    // Return the uploaded image URL
    return `${IMAGE_BASE_URL}${user.profilePic}`;
  }
  // Return a generated initial-based avatar that matches your gold theme
  // background=FAF9F6 (Cream) & color=D4AF37 (Gold)
  return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=FAF9F6&color=D4AF37&bold=true`;
};