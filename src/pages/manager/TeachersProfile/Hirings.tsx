import ProfileHeader from "./ProfileHeader";
import AboutMe from "./AboutMe";
import Skills from "./Skills";
import TabsSection from "./TabsSection";
import { SocialLinks, type SocialLink } from "./SocialLinks";
import { useFetch } from "../../../api";

// TODO: Replace with actual userId from context, route, or props
const userId = "USER_ID";

const DEFAULT_LINKS: SocialLink[] = [
  { id: "1", type: "email", label: "Email", value: "jakegyll@email.com" },
  { id: "2", type: "phone", label: "Phone", value: "+44 1245 572 135" },
  { id: "3", type: "instagram", label: "Instagram", value: "instagram.com/jakegyll" },
  { id: "4", type: "twitter", label: "Twitter", value: "twitter.com/jakegyll" },
  { id: "5", type: "website", label: "Website", value: "www.jakegyll.com" },
];

const Hirings = () => {
  const { data: profile, isLoading, error } = useFetch(
    ["profile"],
    `/profile`,
    true,
    { requiresAuth: true }
  );

  // Loading & Error UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading profile.
      </div>
    );
  }

  // Convert profile data into SocialLinks array if exists
  const socialLinks: SocialLink[] =
    profile?.socialLinks?.map((link: any, idx: number) => ({
      id: String(idx + 1),
      type: link.type,
      label: link.label,
      value: link.value,
    })) || DEFAULT_LINKS;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="w-full mb-6">
          <ProfileHeader profile={profile} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <AboutMe profile={profile || {}} />
            <Skills skills={profile?.skills || []} />
            <SocialLinks links={socialLinks} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <TabsSection profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hirings;
