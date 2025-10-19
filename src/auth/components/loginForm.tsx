import React, { useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useGenericMutation } from '../../api/useGenericMutation';
import { useFetch } from '../../api/UseFetch';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { google } from '../../assets';
import { GoogleLogin } from '@react-oauth/google';
// import jwtDecode from 'jwt-decode';

type LoginPayload = {
  email: string;
  password: string;
};

type GoogleLoginPayload = {
  idToken: string;
  role: 'student' | 'teacher';
};

type LoginFormProps = {
  role: 'student' | 'teacher';
};

const LoginForm: React.FC<LoginFormProps> = ({ role }) => {
  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginMutation = useGenericMutation<{ token: string }>();
  const forgotPasswordMutation = useGenericMutation();
  const googleLoginMutation = useGenericMutation<{ token: string }>();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const { refetch: fetchUserProfile } = useFetch<unknown>(
    ['user-profile', form.email],
    `/profile`,
    false,
    {
      onSuccessCallback: (data) => {
        if (remember) {
          localStorage.setItem('userProfile', JSON.stringify(data));
          localStorage.setItem('rememberMe', 'true');
        } else {
          sessionStorage.setItem('userProfile', JSON.stringify(data));
        }
      },
    }
  );

  const handleGoogleLogin = (idToken: string) => {
    googleLoginMutation.mutate({
      endpoint: '/auth/google-login',
      data: { idToken, role } as GoogleLoginPayload,
      requiresAuth: false,
      successMessage: `Welcome! Google login successful! 🎉`,
      errorMessage: 'Google login failed! Please try again.',
      onSuccessCallback: (data) => {
        if (data?.token) {
          if (remember) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('role', role);
            console.log('role stored in localStorage:', role);
          } else {
            sessionStorage.setItem('authToken', data.token);
          }
        }
        fetchUserProfile();
        setTimeout(() => {
          navigate(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
        }, 1500);
      },
      onErrorCallback: (err) => {
        console.error('Google login error:', err);
        setError(err?.message || 'Google login failed!');
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) return setError('Please enter your email');
    if (!form.password.trim()) return setError('Please enter your password');

    loginMutation.mutate({
      endpoint: '/auth/login',
      data: { ...form, role, remember },
      requiresAuth: false,
      successMessage: `Welcome back! 🎉`,
      errorMessage: 'Login failed! Please check your credentials.',
      onSuccessCallback: (data) => {
        console.log('Login successful:', data);
        if (data?.token) {
          console.log('name', data?.user?.name)
          localStorage.setItem('token', data.token);
          localStorage.setItem('name', data?.user?.name || 'user');
          localStorage.setItem('userprofile', data?.user ? JSON.stringify(data.user) : '');
          localStorage.setItem('role', role);
          console.log('role stored in localStorage:', role);
        }
        fetchUserProfile();
        setTimeout(() => {
          navigate(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
        }, 1500);
      },
      onErrorCallback: (err) => {
        setForm((prev) => ({ ...prev, password: '' }));
        setError(err?.message || 'Login failed!');
      },
    });
  };

  const handleForgotPassword = () => {
    if (!form.email.trim()) {
      return toast.error('Please enter your email first');
    }
    forgotPasswordMutation.mutate({
      endpoint: '/auth/forgot-password',
      data: { email: form.email.trim(), role },
      requiresAuth: false,
      successMessage: 'Password reset link sent! 📧',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div className="text-[36px] font-semibold md:text-3xl text-center">Login to your Account</div>
      <div className="text-[16px] text-center">Complete your ongoing assignments</div>

      {/* Google login button */}
      {/* Hidden Google Login - so we can click programmatically */}
      <div ref={googleButtonRef} style={{ display: 'none' }}>
        <GoogleLogin
          onSuccess={(credResponse) => {
            if (credResponse.credential) {
              handleGoogleLogin(credResponse.credential);
            }
          }}
          onError={() => {
            toast.error('Google login failed! Please try again.');
          }}
          useOneTap={false}
        />
      </div>

      {/* Custom Google login button */}
      <Button
        type="button"
        onClick={() => {
          const googleBtn = googleButtonRef.current?.querySelector('div[role="button"]');
          (googleBtn as HTMLDivElement)?.click();
        }}
        className="hover:bg-accent flex w-full h-[50px] items-center border bg-white py-6 font-semibold text-gray-500"
      >
        <img src={google} alt="google-logo" width={30} height={30} />
        <span className="text-[14px] text-[#A1A1A1] font-medium">Continue with Google</span>
      </Button>

      <div className="flex w-12/12 items-center justify-center">
        <div className="flex-grow border-t border-dashed" />
        <div className="px-1 text-[12px]">or Sign in with Email</div>
        <div className="flex-grow border-t border-dashed" />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <Label>Email *</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="mail@abc.com"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <Label>Password *</Label>
        <Input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="*****************"
        />
      </div>

      {/* Remember + Forgot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          <Checkbox checked={remember} onCheckedChange={(val) => setRemember(!!val)} />
          <Label>Remember me</Label>
        </div>
        <button type="button" onClick={handleForgotPassword}>
          Forgot Password?
        </button>
      </div>

      {/* Error */}
      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Submit */}
      <Button
        className="bg-primary hover:bg-foreground w-full py-6 font-bold text-white h-[50px]"
        type="submit"
        disabled={loginMutation.isLoading || googleLoginMutation.isLoading}
      >
        {loginMutation.isLoading ? 'Logging in...' : 'Login'}
      </Button>
      <div className="mt-8 text-sm font-semibold text-gray-400 text-center">
        Not Registered Yet?{' '}
        <span className="text-primary hover:text-primary">
          <a href="/auth/signup">Create an Account</a>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
