// import React, { useEffect, useState } from "react";

// export interface Certification {
//     title: string;
//     issuer: string;
//     issueDate: string; // e.g., "Sep 2024"
//     credentialId?: string; // optional
// }

// const getRandomColor = () => {
//     const colors = ["#F87171", "#34D399", "#60A5FA", "#FBBF24", "#A78BFA", "#F472B6"];
//     return colors[Math.floor(Math.random() * colors.length)];
// };

// // Dummy fallback data
// const dummyCertifications: Certification[] = [
//     { title: "React.js Advanced", issuer: "Udemy", issueDate: "Jan 2024", credentialId: "12345ABCD" },
//     { title: "Node.js Backend Mastery", issuer: "Coursera", issueDate: "Mar 2023", credentialId: "67890EFGH" },
//     { title: "Fullstack Developer Bootcamp", issuer: "edX", issueDate: "Sep 2022", credentialId: "XYZ987654" },
// ];

// const CertificationsList: React.FC<{ certifications?: Certification[] }> = ({ certifications: propCerts }) => {
//     const [certifications, setCertifications] = useState<Certification[]>([]);

//     useEffect(() => {
//         if (propCerts && propCerts.length > 0) {
//             setCertifications(propCerts);
//             return;
//         }

//         // Use dummy data immediately to ensure render
//         setCertifications(dummyCertifications);

//         // Optionally fetch from API (will overwrite dummy if successful)
//         fetch("/api/teacher/certifications")
//             .then(res => {
//                 if (!res.ok) throw new Error("Failed to fetch certifications");
//                 return res.json();
//             })
//             .then((data: Certification[]) => setCertifications(data))
//             .catch(err => console.error("Error fetching certifications:", err));
//     }, [propCerts]);

//     return (
//         <div className="flex flex-col gap-8">
//             {certifications.map((cert, idx) => {
//                 const letter = cert.issuer.charAt(0).toUpperCase();
//                 const bgColor = getRandomColor();

//                 return (
//                     <div key={idx} className="flex gap-x-4 py-6 border-b border-gray-200 last:border-b-0">
//                         {/* Icon on top */}
//                         <div
//                             className="w-10 h-10 flex-shrink-0 rounded-full text-white font-bold text-sm flex items-center justify-center mt-0"
//                             style={{ backgroundColor: bgColor }}
//                         >
//                             {letter}
//                         </div>

//                         {/* Content */}
//                         <div className="flex flex-col gap-3 flex-1 justify-between">
//                             <span className="text-lg font-semibold">{cert.title}</span>

//                             <div className="flex items-center gap-3 text-gray-600 text-sm">
//                                 <span className="font-medium">{cert.issuer}</span>
//                                 <span>| Issued {cert.issueDate}</span>
//                                 {cert.credentialId && <span>| Credential ID: {cert.credentialId}</span>}
//                             </div>

//                             <button className="self-start px-3 py-1 rounded-full border border-blue-500 text-blue-500 text-sm font-medium">
//                                 Show Credential
//                             </button>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default CertificationsList;

import React, { useEffect, useState } from "react";

export interface Certification {
    title: string;
    issuer: string;
    issueDate: string; // e.g., "Sep 2024"
    credentialId?: string; // optional
}

const getRandomColor = () => {
    const colors = ["#F87171", "#34D399", "#60A5FA", "#FBBF24", "#A78BFA", "#F472B6"];
    return colors[Math.floor(Math.random() * colors.length)];
};

// Dummy fallback data
const dummyCertifications: Certification[] = [
    { title: "React.js Advanced", issuer: "Udemy", issueDate: "Jan 2024", credentialId: "12345ABCD" },
    { title: "Node.js Backend Mastery", issuer: "Coursera", issueDate: "Mar 2023", credentialId: "67890EFGH" },
    { title: "Fullstack Developer Bootcamp", issuer: "edX", issueDate: "Sep 2022", credentialId: "XYZ987654" },
];

const CertificationsList: React.FC<{ certifications?: Certification[] }> = ({ certifications: propCerts }) => {
    const [certifications, setCertifications] = useState<Certification[]>([]);

    useEffect(() => {
        if (propCerts && propCerts.length > 0) {
            setCertifications(propCerts);
            return;
        }

        // Use dummy data immediately to ensure render
        setCertifications(dummyCertifications);

        // Optionally fetch from API (will overwrite dummy if successful)
        fetch("/api/teacher/certifications")
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch certifications");
                return res.json();
            })
            .then((data: Certification[]) => setCertifications(data))
            .catch(err => console.error("Error fetching certifications:", err));
    }, [propCerts]);

    return (
        <div className="flex flex-col h-full p-5">
            {/* Tab Title */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Licenses & Certifications
            </h2>

            {/* Scrollable List */}
            <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                {certifications.map((cert, idx) => {
                    const letter = cert.issuer.charAt(0).toUpperCase();
                    const bgColor = getRandomColor();

                    return (
                        <div key={idx} className="flex gap-x-4 py-6 border-b border-gray-200 last:border-b-0">
                            {/* Icon on top */}
                            <div
                                className="w-10 h-10 flex-shrink-0 rounded-full text-white font-bold text-sm flex items-center justify-center mt-0"
                                style={{ backgroundColor: bgColor }}
                            >
                                {letter}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-3 flex-1 justify-between">
                                <span className="text-xl">{cert.title}</span>

                                <div className="flex items-center gap-x-2 texts-gray-600 text-sm">
                                    <span className="text-base">{cert.issuer}</span>
                                    <span>| Issued {cert.issueDate}</span>
                                    {cert.credentialId && <span>| Credential ID: {cert.credentialId}</span>}
                                </div>

                                <button className="self-start px-3 py-1 rounded-full border border-blue-500 text-blue-500 text-sm font-medium">
                                    Show Credential
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CertificationsList;
