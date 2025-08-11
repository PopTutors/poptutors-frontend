import { useEffect, useRef, useState } from 'react';
import { useGenericMutation } from '../../api/useGenericMutation';
import { useFetch } from '../../api/UseFetch';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

type Props = {
  email: string;
};

const OtpForm = ({ email }: Props) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();

  // Auto-focus the first box when mounting
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Mutations
  const verifyOtpMutation = useGenericMutation();
  const resendOtpMutation = useGenericMutation();

  // Optional: Fetch user profile after successful verification
  const { refetch: fetchUserProfile } = useFetch<any>(
    ['user-profile', email],
    `/users/profile`,
    false, // Initially disabled
    {
      onSuccessCallback: (data) => {
        console.log('User profile loaded:', data);
        // Store user data in localStorage or context if needed
        localStorage.setItem('userProfile', JSON.stringify(data));
      },
      onErrorCallback: (error) => {
        console.error('Failed to fetch user profile:', error);
      },
    }
  );

  // Handle typing and move focus
  const handleChange = (i: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return; // allow only single digit

    const newOtp = [...otp];
    newOtp[i] = value;
    setOtp(newOtp);

    if (value && i < 5) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  // Arrow keys and backspace navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === 'Backspace') {
      if (otp[i]) {
        // Clear only current box
        const newOtp = [...otp];
        newOtp[i] = '';
        setOtp(newOtp);
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
      }
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && i < 5) {
      inputRefs.current[i + 1]?.focus();
    }
  };

  // On paste (let user paste all 6 digits)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      setOtp(pasted.split('').concat(Array(6 - pasted.length).fill('')));
      setTimeout(() => {
        inputRefs.current[Math.min(pasted.length - 1, 5)]?.focus();
      }, 0);
    }
    e.preventDefault();
  };

  // Clear OTP inputs
  const clearOtp = () => {
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  // Handlers
  const joinedOtp = otp.join('');
  const isReady = joinedOtp.length === 6 && otp.every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isReady) {
      toast.error('Please enter complete OTP');
      return;
    }

    verifyOtpMutation.mutate({
      endpoint: '/auth/verify-otp',
      data: {
        email,
        otp: joinedOtp,
      },
      successMessage: 'OTP Verified Successfully! 🎉',
      errorMessage: 'Invalid OTP! Please try again.',
      requiresAuth: false,
      onSuccessCallback: (data) => {
        console.log('OTP verification response:', data);

        // Store auth token if provided
        if (data?.token) {
          localStorage.setItem('authToken', data.token);
        }

        // Fetch user profile after successful verification
        fetchUserProfile();

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 1500);
      },
      onErrorCallback: (error) => {
        console.error('OTP verification error:', error);
        // Clear OTP on error for better UX
        clearOtp();
      },
    });
  };

  const handleResendOtp = () => {
    if (resendCooldown > 0) return;

    resendOtpMutation.mutate({
      endpoint: '/auth/resend-otp',
      data: { email },
      successMessage: 'OTP sent successfully! 📧',
      errorMessage: 'Failed to resend OTP. Please try again.',
      requiresAuth: false,
      onSuccessCallback: () => {
        setResendCooldown(60); // 60 seconds cooldown
        clearOtp(); // Clear current OTP
      },
      onErrorCallback: (error) => {
        console.error('Resend OTP error:', error);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5 text-gray-700">
      <div className="text-xl font-bold text-center">Verify Your Email</div>
      <p className="text-sm text-center text-gray-500">
        We've sent a 6-digit OTP to <span className="font-semibold text-blue-600">{email}</span>
      </p>

      <div className="flex justify-center gap-2">
        {otp.map((digit, i) => (
          <Input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            className="w-12 h-12 text-center font-semibold text-lg border-2 border-blue-200 focus:border-blue-500 transition-colors disabled:opacity-50"
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={i === 0 ? handlePaste : undefined}
            autoFocus={i === 0}
            disabled={verifyOtpMutation.isLoading}
          />
        ))}
      </div>

      <Button
        type="submit"
        disabled={verifyOtpMutation.isLoading || !isReady}
        className="bg-blue-600 hover:bg-blue-700 text-white py-5 w-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {verifyOtpMutation.isLoading ? 'Verifying...' : 'Verify OTP'}
      </Button>

      {/* Resend OTP Section */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>

        {resendCooldown > 0 ? (
          <p className="text-sm text-gray-400">Resend OTP in {resendCooldown} seconds</p>
        ) : (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendOtpMutation.isLoading}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {resendOtpMutation.isLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        )}
      </div>

      {/* Back to signup option */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to signup
        </button>
      </div>
    </form>
  );
};

export default OtpForm;
