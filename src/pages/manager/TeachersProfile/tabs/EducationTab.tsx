import React from "react";

interface EducationTabProps {
  profile?: {
    education?: {
      id?: string | number;
      institution: string;
      degree: string;
      duration?: string;
      startYear?: string; // from schema
      endYear?: string;
      fieldOfStudy?: string;
      currentlyStudying?: boolean;
    }[];
  };
}

const EducationTab: React.FC<EducationTabProps> = ({ profile }) => {
  const educationData =
    profile?.education && profile.education.length > 0
      ? profile.education
      : [
        {
          id: 1,
          institution:
            "T. John College, No.80/1, Gottigere post, bannergatta Road, Bangalore-83",
          degree:
            "Bachelor's degree, Computer Programming, Specific Applications",
          duration: "Sep 2024 - Present",
        },
        {
          id: 2,
          institution: "B.C.A, Computer Programming",
          degree:
            "Bachelor's degree, Computer Programming, Specific Applications",
          duration: "Sep 2010 - 2013",
        },
      ];

  // Helper to pick background color based on institution name
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
      <h2 className="text-[24px] font-semibold text-[#141414] mb-6">Education</h2>
      {educationData.length > 0 ? (
        <div className="space-y-6">
          {educationData.map((education, index) => (
            <div
              key={education.id || index}
              className="flex gap-4 border-b mb-2 pb-4 last:border-b-0 last:mb-0 last:pb-0"
            >
              {/* Avatar with first letter */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 ${getColor(
                  education.institution
                )}`}
              >
                {education.institution.charAt(0).toUpperCase()}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-[#141414] text-[22px] mb-1">
                  {education.institution}
                </h3>
                <p className="text-[#141414] text-[16px] mb-2">
                  {education.degree} , {education.fieldOfStudy}
                </p>
                <p className="text-[#595959] text-[16px]">
                  {education.startYear} - {education.
                    currentlyStudying ? "Present" : education.endYear}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-sm">No education details available.</p>
      )}
    </div>
  );
};

export default EducationTab;
