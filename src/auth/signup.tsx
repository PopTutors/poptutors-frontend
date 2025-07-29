import { logo } from '../assets';
import HeroSection from './components/heroSection';
import SignupForm from './components/signupForm';

export default function Signup() {
  return (
    <div className="h-screen w-full sm:block md:grid md:grid-cols-12">
      <HeroSection>
        <div className="font-bold">
          <span className="text-xl text-primary">Are You Expert? </span>
          <span className="text-xl">in Particular fields then Poptutors is Here</span>
        </div>
        <div className="absolute -bottom-5 w-11/12 translate-y-1/2 bg-accent px-2 text-center text-sm text-gray-500">
          Poptutors is here to provide expertise in specific fields, surpassing my own capabilities.
          Whether it&apos;s science, technology, or any specialized area, Poptutors brings a wealth
          of knowledge and guidance. Together, we make a formidable team, ready to tackle any
          challenge.
        </div>
      </HeroSection>
      <div className="mx-auto w-full md:col-span-5 md:w-8/12 lg:w-7/12">
        <div className="flex h-full flex-col items-center justify-center gap-5 px-8 py-2 md:px-0">
          <img src={logo} alt="Poptutors-logo" width={200} height={400} />
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
