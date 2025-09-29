import { useState } from "react";
import ExperienceTab from "./tabs/ExperienceTab";
import ResumeTab from "./tabs/ResumeTab";
import EducationTab from "./tabs/EducationTab";
import CertificationsTab from "./tabs/CertificationsTab";
import ReviewTab from "./tabs/ReviewTab";

interface TabsSectionProps {
  profile?: any;
}

const TabsSection: React.FC<TabsSectionProps> = ({ profile }) => {
  const [activeTab, setActiveTab] = useState("Experience");

  const tabs = [
    "Experience",
    "Resume",
    "Education",
    "Certifications",
    "Review",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "Experience":
        return <ExperienceTab profile={profile} />;
      case "Resume":
        return <ResumeTab profile={profile} />;
      case "Education":
        return <EducationTab profile={profile} />;
      case "Certifications":
        return <CertificationsTab profile={profile} />;
      case "Review":
        return <ReviewTab profile={profile} />;
      default:
        return <ExperienceTab profile={profile} />;
    }
  };

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-[16px] ${activeTab === tab
                ? "border-[#019ACB] text-[#141414]"
                : "border-transparent text-[#8E8E93] hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-[24px]">{renderTabContent()}</div>
    </div>
  );
};

export default TabsSection;
