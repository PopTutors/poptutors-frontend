// ResumeList.tsx
import React from "react";

interface ResumeExperience {
    role: string;
    company: string;
    startDate: string; // YYYY-MM
    endDate: string | null;
    location: string;
    description?: string;
}

interface ResumeEducation {
    degree: string;
    school: string;
    startYear: string;
    endYear: string;
    location: string;
}

interface ResumeProps {
    profileImage: string;
    name: string;
    jobTitle: string;
    experiences: ResumeExperience[];
    education: ResumeEducation[];
}

const ResumeList: React.FC<ResumeProps> = ({ profileImage, name, jobTitle, experiences, education }) => {
    const formatDate = (start: string, end: string | null) => {
        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date();
        const diffYears = endDate.getFullYear() - startDate.getFullYear();
        const diffMonths = endDate.getMonth() - startDate.getMonth();
        const totalYears = diffYears + diffMonths / 12;
        return `${startDate.toLocaleString("default", { month: "short", year: "numeric" })} - ${end ? endDate.toLocaleString("default", { month: "short", year: "numeric" }) : "Present"
            } (${Math.floor(totalYears)} year${Math.floor(totalYears) > 1 ? "s" : ""})`;
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Top Profile */}
            <div className="flex items-center gap-6 bg-white p-6 flex-shrink-0">
                <img
                    src={profileImage}
                    alt={name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white"
                />
                <div className="flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-bold uppercase">{name}</h1>
                    <span className="text-xl md:text-2xl text-gray-700 mt-1">{jobTitle}</span>
                </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white p-6 flex flex-col gap-4">
                <h2 className="text-2xl font-bold mb-4">Experience</h2>
                {experiences.map((exp, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                        <span className="text-xl font-semibold">{exp.role}</span>
                        <span className="text-gray-600">{exp.company}</span>
                        <span className="text-gray-500 text-sm">
                            {formatDate(exp.startDate, exp.endDate)}, {exp.location}
                        </span>
                        {exp.description && <p className="text-gray-700 mt-1">{exp.description}</p>}
                    </div>
                ))}
            </div>

            {/* Education Section */}
            <div className="bg-white p-6 flex flex-col gap-4">
                <h2 className="text-2xl font-bold mb-4">Education</h2>
                {education.map((edu, idx) => (
                    <div key={idx} className="flex flex-col gap-1">
                        <span className="text-xl font-semibold">{edu.degree}</span>
                        <span className="text-gray-600">{edu.school}</span>
                        <span className="text-gray-500 text-sm">
                            {edu.startYear} - {edu.endYear}, {edu.location}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResumeList;
