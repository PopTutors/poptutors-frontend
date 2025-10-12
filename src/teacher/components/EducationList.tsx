// import React, { useEffect, useState } from "react";

// export interface Education {
//     degree: string;
//     school: string;
//     startYear: string;
//     endYear: string;
//     location: string;
// }

// interface EducationListProps {
//     education?: Education[];
//     className?: string;
// }

// const getRandomColor = () => {
//     const colors = ["#F87171", "#34D399", "#60A5FA", "#FBBF24", "#A78BFA", "#F472B6"];
//     return colors[Math.floor(Math.random() * colors.length)];
// };

// const EducationList: React.FC<EducationListProps> = ({ education: propEducation, className }) => {
//     const [education, setEducation] = useState<Education[]>([]);

//     useEffect(() => {
//         if (propEducation) {
//             setEducation(propEducation);
//             return;
//         }

//         // ✅ Dummy Data
//         setEducation([
//             {
//                 degree: "Bachelor in Computer Programming, Specific Applications",
//                 school: "T. John College",
//                 startYear: "Sep 2024",
//                 endYear: "Present",
//                 location: "No.80/1, Gottigere Post, Bannerghatta Road, Bangalore-83"
//             },
//             {
//                 degree: "Master in Software Engineering",
//                 school: "Some University",
//                 startYear: "2022",
//                 endYear: "2024",
//                 location: "Some Address, Bangalore"
//             }
//         ]);

//         // 📌 Example API call (commented)
//         /*
//         fetch("/api/teacher/education")
//             .then(res => res.json())
//             .then(data => setEducation(data))
//             .catch(err => console.error(err));
//         */
//     }, [propEducation]);

//     return (
//         <div className={`flex flex-col gap-6 ${className}`}>
//             {education.map((edu, idx) => {
//                 const letter = edu.school.charAt(0).toUpperCase();
//                 const bgColor = getRandomColor();

//                 return (
//                     <div key={idx} className="flex items-start gap-4 border-b border-gray-200 pb-6">
//                         {/* Icon on the left */}
//                         <div
//                             className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-sm flex-shrink-0 mt-2"
//                             style={{ backgroundColor: bgColor }}
//                         >
//                             {letter}
//                         </div>

//                         {/* Text content */}
//                         <div className="flex flex-col gap-y-3">
//                             <span className="text-lg font-semibold">{edu.degree}</span>
//                             <span className="text-gray-600 text-sm">{edu.school}</span>
//                             <span className="text-gray-500 text-xs">{edu.startYear} - {edu.endYear}</span>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default EducationList;

import React, { useEffect, useState } from "react";

export interface Education {
    degree: string;
    school: string;
    startYear: string;
    endYear: string;
    location: string;
}

interface EducationListProps {
    education?: Education[];
    className?: string;
}

const getRandomColor = () => {
    const colors = ["#F87171", "#34D399", "#60A5FA", "#FBBF24", "#A78BFA", "#F472B6"];
    return colors[Math.floor(Math.random() * colors.length)];
};

const EducationList: React.FC<EducationListProps> = ({ education: propEducation, className }) => {
    const [education, setEducation] = useState<Education[]>([]);

    useEffect(() => {
        if (propEducation) {
            setEducation(propEducation);
            return;
        }

        // ✅ Dummy Data
        setEducation([
            {
                degree: "Bachelor in Computer Programming, Specific Applications",
                school: "T. John College",
                startYear: "Sep 2024",
                endYear: "Present",
                location: "No.80/1, Gottigere Post, Bannerghatta Road, Bangalore-83"
            },
            {
                degree: "Master in Software Engineering",
                school: "Some University",
                startYear: "2022",
                endYear: "2024",
                location: "Some Address, Bangalore"
            }
        ]);
    }, [propEducation]);

    return (
        <div className={`flex flex-col gap-2 h-full ${className}`}>
            {/* Tab Title */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Education
            </h2>

            {/* Education Items */}
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                {education.map((edu, idx) => {
                    const letter = edu.school.charAt(0).toUpperCase();
                    const bgColor = getRandomColor();

                    return (
                        <div key={idx} className="flex items-start gap-4 border-b border-gray-200 pb-6 last:border-none">
                            {/* Icon on the left */}
                            <div
                                className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-sm flex-shrink-0 mt-2"
                                style={{ backgroundColor: bgColor }}
                            >
                                {letter}
                            </div>

                            {/* Text content */}
                            <div className="flex flex-col gap-y-3">
                                <span className="text-lg font-semibold">{edu.degree}</span>
                                <span className="text-gray-600 text-sm">{edu.school}</span>
                                <span className="text-gray-500 text-xs">
                                    {edu.startYear} - {edu.endYear}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EducationList;
