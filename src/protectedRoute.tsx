import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { paths } from './config/path';
import api from './lib/api';

const ProtectedRoute = () => {
  const location = useLocation();

  const getUser = async () => {
    try {
      const response = await api.get('/auth/me');

      console.log('✅ [getUser] Response:', response);

      if (response?.data?.success && response?.data?.data) {
        return response.data.data;
      }

      throw new Error('User not authenticated');
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      throw error;
    }
  };

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['authenticatedUser'],
    queryFn: getUser,
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-gray-500">Checking authentication...</span>
      </div>
    );
  }

  if (isError || !user) {
    console.warn('🚫 Not authenticated:', error);
    const redirectTo = paths.auth.login.getHref(location.pathname + location.search);
    return <Navigate to={redirectTo} replace />;
  }

  // ✅ Authenticated - render protected routes
  return <Outlet />;
};

export default ProtectedRoute;
