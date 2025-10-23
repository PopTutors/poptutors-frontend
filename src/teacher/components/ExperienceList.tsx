import React from "react";

export interface Experience {
    role: string;
    company: string;
    city: string;
    employmentType: string; // "Full-time" | "Part-time"
    startDate: string; // "YYYY-MM"
    endDate: string | null; // null = Present
    mode: string; // "Remote" | "On-site" | "Hybrid"
}

interface ExperienceProps {
    experiences: Experience[];
}

const ExperienceList: React.FC<ExperienceProps> = ({ experiences }) => {
    const calculateMonths = (start: string, end: string | null) => {
        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date();
        return (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    };

    return (
        <div className="flex flex-col gap-6 p-5">
            {/* Tab Title */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Experience
            </h2>

            {/* Experience Items */}
            <div className="flex flex-col gap-6 pr-2 custom-scrollbar">
                {experiences.map((exp, idx) => (
                    <div key={idx} className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            {/* Icon/Initial */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                                {exp.role.charAt(0)}
                            </div>

                            <div className="flex-1 flex flex-col gap-2 md:gap-5">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-lg md:text-xl font-bold text-gray-800">{exp.role}</span>
                                    <span className="text-gray-500">| {exp.city}</span>
                                    <span className="text-gray-500">• {exp.employmentType}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
                                    <span>
                                        {new Date(exp.startDate).toLocaleString("default", { month: "short", year: "numeric" })} -{" "}
                                        {exp.endDate ? new Date(exp.endDate).toLocaleString("default", { month: "short", year: "numeric" }) : "Present"}
                                    </span>
                                    <span>• {calculateMonths(exp.startDate, exp.endDate)} months</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
                                    <span>{exp.city}</span>
                                    <span>• {exp.mode}</span>
                                </div>
                            </div>
                        </div>

                        {idx !== experiences.length - 1 && <hr className="border-gray-300 mt-4" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceList;