import ProfileHeader from './ProfileHeader';
import AboutMe from './AboutMe';
import Skills from './Skills';
import TabsSection from './TabsSection';

const Hirings = () => {
  return (
    <div className="min-h-screen bg-white-50">
      <div className="mx-auto">
        <div className="w-full">
          <ProfileHeader />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About Me and Skills stacked vertically */}
          <div className="lg:col-span-1 space-y-6 items-center">
            <AboutMe />
            <div className="flex flex-col items-center">
              <button className="text-[#019ACB] text-sm font-medium self-center">
                Show 2 more educations
              </button>
            </div>

            <Skills />
          </div>

          {/* Right Column - Tabs Section */}
          <div className="lg:col-span-2">
            <TabsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hirings;
