import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  // 1. Pull 'loading' out of your useAuth context
  const { user, loading } = useAuth();

  // 2. CRITICAL: If the app is still fetching the user, show nothing (or a spinner)
  // This prevents the "false positive" redirect to the login page
  if (loading) {
    return null; 
  }

  // 3. Now that we know loading is done, check for the user
  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // 4. Role check
  if (role && user.role !== role) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;