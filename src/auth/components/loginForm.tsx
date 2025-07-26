'use client';

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { google } from "../../assets";

// ✅ Define login payload type
type LoginPayload = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

//    axios.post(
//   'http://localhost:5000/api/auth/login',
//   { email: form.email, password: form.password },
//   { withCredentials: true }
// );

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    setError("Please enter email and password.");
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/login',
      {
        email: form.email,
        password: form.password,
      },
      {
        withCredentials: true, // ✅ for sending/receiving cookies
      }
    );

    console.log("Login successful:", response.data);
    setError("");

    // ✅ Redirect after successful login
    navigate("/student/dashboard");

  } catch (err: any) {
    console.error("Login error:", err);
    if (err.response?.data?.message) {
      setError(err.response.data.message);
    } else {
      setError("Login failed. Please try again.");
    }
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col items-center gap-5 text-gray-600"
    >
      <div className="text-[36px] font-semibold md:text-3xl">Login to your Account</div>
      <div className="text-[16px] font-regular">Complete your on going assignments</div>

      <Button
        type="button"
        className="hover:bg-accent flex w-full items-center border bg-white py-6 font-semibold text-gray-500"
      >
        <img
          src={google}
          alt="google-logo"
          width={30}
          height={30}
        />
       <span className="text-[14px] text-[#A1A1A1] font-medium">Continue with Google </span> 
      </Button>

      <div className="flex w-8/12 items-center justify-center">
        <div className="flex-grow border-t border-dashed border-gray-300" />
        <div className="px-1 text-[12px] font-medium text-[#A1A1A1]">or Sign in with Email</div>
        <div className="flex-grow border-t border-dashed border-gray-300" />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="email" className="font-semibold text-[14px]">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border-gray-300 py-6 placeholder:text-gray-300"
          placeholder="mail@abc.com"
        />
      </div>

      <div className="flex w-full flex-col gap-2 text-[14px]">
        <Label htmlFor="password" className="font-semibold">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="*****************"
          className="border-gray-300 py-6 placeholder:text-gray-300"
        />
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember-me"
            className="data-[state=checked]:bg-foreground data-[state=checked]:border-blue-600"
          />
          <Label htmlFor="remember-me" className="text-sm text-[14px] text-[#A1A1A1]">
            Remember me
          </Label>
        </div>
        <div className="cursor-pointer text-sm font-semibold text-primary hover:text-accent">
          Forgot Password?
        </div>
      </div>

      {error && (
        <div className="text-red-500 font-medium w-full text-left">{error}</div>
      )}

      <Button
        type="submit"
        className="bg-primary hover:bg-foreground w-full py-6 font-bold text-white"
      >
        Login
      </Button>

      <div className="mt-8 text-sm font-semibold text-gray-400">
        Not Registered Yet?{" "}
        <span className="text-primary hover:text-primary">
          <a href="/auth/signup">Create an Account</a>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
