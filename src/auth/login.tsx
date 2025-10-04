import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { logo } from '../assets';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import HeroSection from './components/heroSection';
import LoginForm from './components/loginForm';

export default function Login() {
  const [role, setRole] = useState < 'student' | 'teacher' | 'manager' > ('student');

  return (
    <>
      {/* Toast container */}
      <Toaster />

      <div className="h-screen w-full sm:block md:grid md:grid-cols-12">
        <HeroSection>
          <div className="font-bold">
            <span className="text-2xl text-primary">All-in-one </span>
            <span className="text-2xl">Experts Platform.</span>
          </div>
          <div className="bg-accent absolute bottom-0 w-9/12 translate-y-1/2 px-2 text-center text-sm text-gray-500">
            Poptutors is one powerful online tool suite that combines all the experts needed to
            complete a successful assignment or project.
          </div>
        </HeroSection>

        <div className="mx-auto w-full md:col-span-5 md:w-8/12 lg:w-7/12">
          <div className="flex h-full flex-col items-center justify-center px-8 py-2 md:px-0">
            <img src={logo} alt="Poptutors-logo" width={200} height={400} />

            <Tabs
              className="mt-8 mb-8 w-full"
              value={role}
              onValueChange={(val) => setRole(val as 'student' | 'teacher')}
            >
              <TabsList className="mx-auto w-9/12 bg-transparent">
                <TabsTrigger
                  value="student"
                  className="data-[state=active]:bg-accent py-4 font-semibold data-[state=active]:text-primary transition-all duration-200"
                >
                  Student
                </TabsTrigger>
                <TabsTrigger
                  value="teacher"
                  className="data-[state=active]:bg-accent py-4 font-semibold data-[state=active]:text-primary transition-all duration-200"
                >
                  Teacher
                </TabsTrigger>
                <TabsTrigger
                  value="manager"
                  className="data-[state=active]:bg-accent py-4 font-semibold data-[state=active]:text-primary transition-all duration-200"
                >
                  Manager
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <LoginForm role={role} />
          </div>
        </div>
      </div>
    </>
  );
}
