import React from "react";

interface AboutMeProps {
  profile?: {
    experience?: string;
    about?: string;
  };
}

const AboutMe: React.FC<AboutMeProps> = ({ profile }) => {
  return (
    <div className="bg-white p-6 mb-6 shadow-sm ">
      <h2 className="text-[20px] font-bold text-[#141414] mb-3">About Me</h2>

      {/* Prefer profile.about -> then profile.experience -> fallback text */}
      <p className="text-[16px] text-[rgba(20,20,20,0.8)] font-light leading-relaxed">
        {profile?.about ||
          profile?.experience ||
          "I'm a product designer + filmmaker currently working remotely at Twitter from beautiful Manchester, United Kingdom. I'm passionate about designing digital products that have a positive impact on the world."}
      </p>

      {/* Optional second paragraph, only if profile.about is missing */}
      {!profile?.about && (
        <p className="text-[16px] text-[rgba(20,20,20,0.8)] font-light leading-relaxed mt-3">
          {"For 10 years, I've specialised in interface, experience & interaction design as well as working in user research and design strategy for product agencies, big tech companies & start-ups."}
        </p>
      )}
    </div>
  );
};

export default AboutMe;
