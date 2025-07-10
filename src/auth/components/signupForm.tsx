import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const SignupForm = () => {
  return (
    <div className="flex w-full flex-col items-center gap-4 text-gray-600">
      <div className="text-2xl font-bold md:text-3xl">Sign Up your Account</div>
      <div className="md:text-md text-center">
        Showcase your talent & expertise with Poptutors
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="name" className="font-semibold">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          className="border-gray-300 py-5 placeholder:text-gray-300"
          placeholder="Alex Johnson"
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="phone" className="font-semibold">
          Phone
        </Label>
        <Input
          id="phone"
          type="tel"
          className="border-gray-300 py-5 placeholder:text-gray-300"
          placeholder="+91 989898XXXX"
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="email" className="font-semibold">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          className="border-gray-300 py-5 placeholder:text-gray-300"
          placeholder="mail@abc.com"
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="password" className="font-semibold">
          Create Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="*****************"
          className="border-gray-300 py-5 placeholder:text-gray-300"
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <Label htmlFor="password" className="font-semibold">
          Confirm Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="*****************"
          className="border-gray-300 py-5 placeholder:text-gray-300"
        />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember-me"
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
      <Button className="w-full bg-blue-500 py-5 font-bold text-white hover:bg-blue-600">
        Sign Up
      </Button>
      <div className="text-sm font-semibold text-gray-400">
        Already have an account?{" "}
        <span className="text-blue-500 hover:text-blue-600">
          <a href="/login">Login</a>
        </span>
      </div>
    </div>
  );
};

export default SignupForm;
