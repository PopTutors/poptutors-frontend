// src/components/TeacherDashboard.tsx
import React, { useState } from "react";
import { Star, GraduationCap, Radio, FileText, User, Mail, Instagram, Facebook, PenLine } from "lucide-react";
import ExperienceList, { type Experience } from "../components/ExperienceList";
import ResumeList from "../components/ResumeList";
import EducationList from "../components/EducationList";
import CertificationsList from "../components/CertificatrionList";
import StudentFeedbacks from "../components/StudentsFeedback";

interface TeacherProfileData {
    name: string;
    topRated: boolean;
    jobTitle: string;
    company: string;
    rating: number;
    reviewsCount: number;
    studentsCount: number;
    liveHelpCount: number;
    assignmentsCount: number;
    sessionsCount: number;
    imageUrl: string;
    about: string;
    skills: string[];
    social: { type: string; value: string }[];
    experiences: Experience[];
}

const resumeExperiences = [
    {
        role: "Senior UI/UX Product Designer",
        company: "Enterprise name",
        startDate: "2018-08",
        endDate: null,
        location: "Paris",
        description: "Directly collaborated with CEO and Product team to prototype, design and deliver the UI and UX experience with a lean design process: research, design, test, and iterate."
    },
    {
        role: "UI/UX Product Designer",
        company: "Enterprise name",
        startDate: "2013-08",
        endDate: "2018-08",
        location: "Paris",
        description: "Lead the UI design with accountability of the design system, collaborated with product and development teams on core projects to improve product interfaces and experiences."
    },
    {
        role: "UI Designer",
        company: "Enterprise name",
        startDate: "2012-08",
        endDate: "2013-07",
        location: "Paris",
        description: "Designed mobile UI applications for Orange R&D departement, BNP Paribas, La Poste, Le Cned..."
    },
    {
        role: "Graphic Designer",
        company: "Enterprise name",
        startDate: "2010-09",
        endDate: "2012-07",
        location: "Paris",
        description: "Designed print and web applications for Pau Brasil, Renault, Le théatre du Mantois, La mairie de Mantes la Ville..."
    },
];

const resumeEducation = [
    {
        degree: "Bachelor European in Graphic Design",
        school: "School name",
        startYear: "2009",
        endYear: "2010",
        location: "Bagnolet"
    },
    {
        degree: "BTS Communication Visuelle option Multimédia",
        school: "School name",
        startYear: "2007",
        endYear: "2009",
        location: "Bagnolet"
    }
];

const TeacherProfile: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Experience");

    const tabs = [
        { key: "Experience", title: "Experience" },
        { key: "Resume" },
        { key: "Education", title: "Education" },
        { key: "Certifications", title: "Licenses & Certifications" },
        { key: "Reviews", title: "Student Feedbacks" },
    ];


    const [teacherData, setTeacherData] = useState<TeacherProfileData>({
        name: "Adam Smith",
        topRated: true,
        jobTitle: "Product Designer",
        company: "Twitter",
        rating: 4.8,
        reviewsCount: 13424,
        studentsCount: 12532,
        liveHelpCount: 7,
        assignmentsCount: 24,
        sessionsCount: 32,
        imageUrl: "https://randomuser.me/api/portraits/men/75.jpg",
        about: "I’m a product designer + filmmaker currently working remotely at Twitter from beautiful Manchester, United Kingdom. I’m passionate about designing digital products that have a positive impact on the world. For 10 years, I’ve specialised in interface, experience & interaction design as well as working in user research and product strategy for product agencies, big tech companies & start-ups.",
        skills: ["React.js", "Node.js", "NestJS", "MongoDB", "PostgreSQL", "GraphQL", "TypeScript", "JavaScript"],
        social: [
            { type: "Mail", value: "rushil@example.com" },
            { type: "Instagram", value: "@rushil_insta" },
            { type: "Facebook", value: "/rushil_fb" },
        ],
        experiences: [
            { role: "Product Designer", company: "Twitter", city: "Manchester", employmentType: "Full-time", startDate: "2020-06", endDate: null, mode: "Remote" },
            { role: "UI/UX Designer", company: "Google", city: "London", employmentType: "Part-time", startDate: "2018-03", endDate: "2020-05", mode: "On-site" },
            { role: "UI/UX Designer", company: "Google", city: "London", employmentType: "Part-time", startDate: "2018-03", endDate: "2020-05", mode: "On-site" }
        ]
    });

    return (
        <div className="w-full h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* Top Profile Section */}
            <div className="w-full flex flex-col md:flex-row items-start gap-4 p-5 flex-shrink-0 bg-gray-100">
                {/* Profile Image */}
                <div className="relative w-32 md:w-40 flex-shrink-0">
                    <div
                        className="w-full h-32 md:h-40 rounded-full flex items-center justify-center"
                        style={{ border: "8px solid #ffffff", backgroundColor: "#26A4FF" }}
                    >
                        <img
                            src={teacherData.imageUrl}
                            alt="Profile"
                            className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-full"
                        />
                        <button className="absolute bottom-0 right-0 -translate-x-1/2 translate-y-1/2 bg-white p-2 rounded-full shadow-md border border-white flex items-center justify-center">
                            <PenLine size={16} className="text-gray-700" />
                        </button>
                    </div>
                </div>

                {/* User Details */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{teacherData.name}</h1>
                        {teacherData.topRated && (
                            <span className="px-2 py-0.5 text-xs md:text-sm font-medium text-blue-600 border border-blue-600 rounded-md">
                                Top Rated
                            </span>
                        )}
                    </div>

                    <span className="text-lg md:text-xl">
                        <span className="font-semibold text-gray-800">{teacherData.jobTitle}</span> at{" "}
                        <span className="font-bold text-base md:text-lg">{teacherData.company}</span>
                    </span>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-5 text-gray-700 text-sm md:text-base">
                        <div className="flex items-center gap-1">
                            <Star size={16} className="text-yellow-500" />
                            <span>{teacherData.rating}</span>
                        </div>
                        <span>({teacherData.reviewsCount.toLocaleString()} reviews)</span>
                        <div className="flex items-center gap-1">
                            <GraduationCap size={16} />
                            <span>{teacherData.studentsCount.toLocaleString()} Students</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Radio size={16} />
                            <span>{teacherData.liveHelpCount} Live Help</span>
                        </div>
                    </div>

                    {/* Assignments & Sessions */}
                    <div className="flex flex-wrap gap-5 text-gray-700 mt-3 text-sm md:text-base">
                        <div className="flex items-center gap-1">
                            <FileText size={16} />
                            <span>{teacherData.assignmentsCount} Assignments</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <User size={16} />
                            <span>{teacherData.sessionsCount} Sessions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="w-full grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden px-5 pb-5">
                {/* Left Sidebar */}
                <div className="col-span-12 md:col-span-4 flex flex-col gap-6 min-h-0">
                    {/* About Me */}
                    <div className="bg-white p-4 shadow-md flex flex-col space-y-3">
                        <h2 className="text-xl font-bold mb-3">About Me</h2>
                        {teacherData.about.split("\n").map((line, idx) => (
                            <p key={idx} className="text-gray-700 leading-relaxed">{line}</p>
                        ))}
                    </div>

                    {/* Skills */}
                    <div className="bg-white p-4 shadow-md">
                        <h2 className="text-xl font-semibold mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-4">
                            {teacherData.skills.map(skill => (
                                <span key={skill} className="bg-[#aceaff] text-[#03b2ec] px-3 py-1 text-sm font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white p-4 shadow-md">
                        <h2 className="text-xl font-semibold mb-3">Social Links</h2>
                        <div className="flex flex-col gap-2 text-gray-700">
                            {teacherData.social.map(social => {
                                let Icon;
                                if (social.type === "Mail") Icon = Mail;
                                if (social.type === "Instagram") Icon = Instagram;
                                if (social.type === "Facebook") Icon = Facebook;
                                return (
                                    <div key={social.value} className="flex items-center gap-2">
                                        {Icon && <Icon size={16} />} <span>{social.value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Dynamic Content */}
                <div className="col-span-12 md:col-span-8 flex flex-col min-h-0">
                    {/* Tab Buttons */}
                    <div className="flex gap-4 border-b border-gray-300 mb-3 flex-shrink-0 bg-gray-100">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 font-medium ${activeTab === tab.key ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
                                    }`}
                            >
                                {tab.key}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-white shadow-md flex flex-col flex-1 min-h-0">
                        {/* Inner scrollable content removed */}
                        <div className="flex-1 min-h-0">
                            {activeTab === "Experience" && <ExperienceList experiences={teacherData.experiences} />}
                            {activeTab === "Resume" && (
                                <ResumeList
                                    profileImage={teacherData.imageUrl}
                                    name={teacherData.name}
                                    jobTitle={teacherData.jobTitle}
                                    experiences={resumeExperiences}
                                    education={resumeEducation}
                                />
                            )}
                            {activeTab === "Education" && <EducationList education={resumeEducation} className="flex-1 min-h-0 p-5" />}
                            {activeTab === "Certifications" && <CertificationsList />}
                            {activeTab === "Reviews" && <StudentFeedbacks />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
