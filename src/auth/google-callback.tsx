import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGenericMutation } from '../api/useGenericMutation';
import { useFetch } from '../api/UseFetch';

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  const googleLoginMutation = useGenericMutation<{ token: string }>();
  const { refetch: fetchUserProfile } = useFetch<any>(['user-profile'], `/users/profile`, false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idToken = params.get('credential');
    const role = (params.get('role') as 'student' | 'teacher') || 'student';

    if (!idToken) {
      toast.error('Google login failed. No token received.');
      navigate('/auth/login');
      return;
    }

    googleLoginMutation.mutate({
      endpoint: '/auth/google-login',
      data: { idToken, role },
      requiresAuth: false,
      successMessage: `Welcome! Google login successful! 🎉`,
      errorMessage: 'Google login failed! Please try again.',
      onSuccessCallback: (data) => {
        if (data?.token) {
          localStorage.setItem('authToken', data.token);
        }
        fetchUserProfile();
        navigate(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
      },
    });
  }, [location, navigate]);

  return <div className="p-6 text-center">Signing you in...</div>;
}
