import React from "react";

interface ExperienceTabProps {
  profile?: {
    experience?: {
      id?: string | number;
      title: string;
      company: string;
      type?: string;
      duration?: string;
      location?: string;
    }[];
  };
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ profile }) => {
  const experiences =
    profile?.experience && Array.isArray(profile.experience)
      ? profile.experience
      : [
        {
          id: 1,
          title: "Founding Designer",
          company: "Swish",
          type: "Full-time",
          duration: "Sep 2024 - Present • 9 Months",
          location: "Bengaluru, Karnataka, India • On-site",
        },
        {
          id: 2,
          title: "UI/UX Designer",
          company: "Figma",
          type: "Internship",
          duration: "Jun 2023 - Aug 2023 • 3 Months",
          location: "Remote",
        },
        {
          id: 3,
          title: "Product Designer",
          company: "Adobe",
          type: "Contract",
          duration: "Jan 2022 - May 2023 • 1 Yr 5 Mos",
          location: "Bengaluru, India • Hybrid",
        },
      ];

  // Helper to pick background color from company name
  const getColor = (name: string) => {
    const colors = [
      "bg-red-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-yellow-400",
      "bg-indigo-400",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white p-6 mb-6 shadow-sm ">
      <h2 className="text-[24px] font-semibold text-[#141414] mb-6">Experience</h2>
      {experiences.length > 0 ? (
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={exp.id || index}
              className={`flex gap-4 ${index !== experiences.length - 1 ? "border-b mb-2 pb-4" : ""
                }`}
            >
              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 ${getColor(
                  exp.company
                )}`}
              >
                {exp.company.charAt(0).toUpperCase()}
              </div>

              {/* Experience Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="text-[22px] font-semibold text-[#141414]">
                    {exp.title}
                  </h3>
                  <span className="text-[#141414] text-[18px]">{exp.company}</span>
                  {exp.type && (
                    <>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600 text-[16px]">{exp.type}</span>
                    </>
                  )}
                </div>
                {exp.duration && (
                  <p className="text-[#595959] text-[16px] mb-1">{exp.duration}</p>
                )}
                {exp.location && (
                  <p className="text-[#595959] text-[16px]">{exp.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">No experience added yet.</p>
      )}
    </div>
  );
};

export default ExperienceTab;
