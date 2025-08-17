import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { paths } from './config/path';

const ProtectedRoute = () => {
  const location = useLocation();

  // Check if token exists in localStorage
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('authToken') ||
    localStorage.getItem('accessToken');

  if (!token) {
    console.warn('🚫 No authentication token found');
    const redirectTo = paths.auth.login.getHref(location.pathname + location.search);
    return <Navigate to={redirectTo} replace />;
  }

  // Optional: Check if token is expired (if it's a JWT)
  try {
    if (token.includes('.')) {
      // Basic JWT check (has dots)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp && payload.exp < currentTime) {
        console.warn('🚫 Token has expired');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        const redirectTo = paths.auth.login.getHref(location.pathname + location.search);
        return <Navigate to={redirectTo} replace />;
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not decode token, but proceeding anyway');
  }

  // ✅ Token exists - render protected routes
  return <Outlet />;
};

export default ProtectedRoute;
