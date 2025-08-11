import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useGenericMutation } from '../../api/useGenericMutation';
import { useFetch } from '../../api/UseFetch';

type SignupFormProps = {
  onAuthRequestSuccess: (email: string) => void;
};

const SignupForm: React.FC<SignupFormProps> = ({ onAuthRequestSuccess }) => {
  // States for inputs
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(false);

  // Use the mutation for signup
  const mutation = useGenericMutation();

  // Use the fetch hook for additional data fetching if needed
  const { refetch: refetchUserProfile } = useFetch<any>(
    ['user-profile', email],
    `/users/profile/${email}`,
    false, // Initially disabled
    {
      onSuccessCallback: (data) => {
        console.log('User profile fetched successfully:', data);
      },
      onErrorCallback: (error) => {
        console.error('Failed to fetch user profile:', error);
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    // Submit signup form
    mutation.mutate({
      endpoint: '/auth/signup',
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password,
        role: 'student',
      },
      requiresAuth: false,
      successMessage: 'Signup successful! 🎉 Check your inbox for OTP.',
      errorMessage: 'Signup failed! Please try again.',
      onSuccessCallback: (data) => {
        console.log('Signup response:', data);
        // Additional success logic here if needed
      },
      onErrorCallback: (error) => {
        console.error('Signup error:', error);
        // Additional error handling here if needed
      },
    });
  };

  // On mutation success, trigger parent callback and optionally fetch user profile
  React.useEffect(() => {
    if (mutation.isSuccess) {
      onAuthRequestSuccess(email);

      // Optionally fetch user profile after successful signup
      if (email && remember) {
        refetchUserProfile();
      }
    }
  }, [mutation.isSuccess, email, onAuthRequestSuccess, refetchUserProfile, remember]);

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col items-center gap-4 text-gray-600">
      <div className="text-2xl font-bold md:text-3xl">Sign Up your Account</div>
      <div className="md:text-md text-center">Showcase your talent & expertise with Poptutors</div>

      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="name" className="font-semibold">
          Name *
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-gray-300 py-5 placeholder:text-gray-300"
          placeholder="Alex Johnson"
          required
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="phone" className="font-semibold">
          Phone *
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border-gray-300 py-5 placeholder:text-gray-300"
          placeholder="+91 989898XXXX"
          required
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="email" className="font-semibold">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-gray-300 py-5 placeholder:text-gray-300"
          placeholder="mail@abc.com"
          required
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="password" className="font-semibold">
          Create Password *
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="*****************"
          className="border-gray-300 py-5 placeholder:text-gray-300"
          required
          minLength={6}
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="confirm-password" className="font-semibold">
          Confirm Password *
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="*****************"
          className="border-gray-300 py-5 placeholder:text-gray-300"
          required
          minLength={6}
        />
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember-me"
            checked={remember}
            onCheckedChange={(val) => setRemember(!!val)}
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
          />
          <Label htmlFor="remember-me" className="text-sm">
            Remember me
          </Label>
        </div>
        <div className="cursor-pointer text-sm font-semibold text-blue-500 hover:text-blue-600">
          Forgot Password?
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-blue-500 py-5 font-bold text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Signing Up...' : 'Sign Up'}
      </Button>

      <div className="text-sm font-semibold text-gray-400">
        Already have an account?{' '}
        <span className="text-blue-500 hover:text-blue-600">
          <a href="/login">Login</a>
        </span>
      </div>
    </form>
  );
};

export default SignupForm;
