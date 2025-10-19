// import { useState } from "react";
// import { Calendar, Star, DollarSign, Clock, MessageSquare, Search, SlidersHorizontal, Video } from "lucide-react";
// import RescheduleModal from "../components/RescheduleModal";
// import SessionDetail from "./SessionDetail";
// import ChatSection from "../../components/ChatSection";

// interface Session {
//     id: string;
//     milestone: string;
//     title: string;
//     tags: string[];
//     postedDate: string;
//     meetingDate: string;
//     meetingTime: string;
//     accentColor: string;
//     status: "upcoming" | "requested" | "complete";
//     hourlyPrice?: number;
//     totalHours?: number;
//     rating?: number;
// }

// const dummySessions: Session[] = [
//     // Upcoming Sessions
//     {
//         id: "JB-2024-001",
//         milestone: "Milestone 1",
//         title: "System Design Architecture Review",
//         tags: ["Web design", "Figma", "Webflow", "UI/UX", "JavaScript"],
//         postedDate: "Mar 20, 2024",
//         meetingDate: "Mar 28, 2024",
//         meetingTime: "12:00 PM",
//         accentColor: "#019ACB",
//         status: "upcoming",
//         hourlyPrice: 50,
//         totalHours: 6,
//         rating: 4,
//     },
//     {
//         id: "JB-2024-004",
//         milestone: "Milestone 2",
//         title: "Frontend Optimization Strategies",
//         tags: ["React.js", "Next.js", "Performance"],
//         postedDate: "Mar 21, 2024",
//         meetingDate: "Mar 29, 2024",
//         meetingTime: "3:00 PM",
//         accentColor: "#019ACB",
//         status: "upcoming",
//         hourlyPrice: 55,
//         totalHours: 5,
//         rating: 4,
//     },
//     {
//         id: "JB-2024-007",
//         milestone: "Milestone 3",
//         title: "API Design and Best Practices",
//         tags: ["Node.js", "Express", "REST API"],
//         postedDate: "Mar 23, 2024",
//         meetingDate: "Apr 01, 2024",
//         meetingTime: "11:00 AM",
//         accentColor: "#019ACB",
//         status: "upcoming",
//         hourlyPrice: 60,
//         totalHours: 4,
//         rating: 5,
//     },
//     {
//         id: "JB-2024-010",
//         milestone: "Milestone 4",
//         title: "React State Management Deep Dive",
//         tags: ["React.js", "Redux", "Context API"],
//         postedDate: "Mar 24, 2024",
//         meetingDate: "Apr 02, 2024",
//         meetingTime: "2:00 PM",
//         accentColor: "#019ACB",
//         status: "upcoming",
//         hourlyPrice: 45,
//         totalHours: 3,
//         rating: 4,
//     },
//     {
//         id: "JB-2024-011",
//         milestone: "Milestone 5",
//         title: "UI/UX Design Best Practices",
//         tags: ["Figma", "Adobe XD", "Prototyping"],
//         postedDate: "Mar 25, 2024",
//         meetingDate: "Apr 03, 2024",
//         meetingTime: "1:00 PM",
//         accentColor: "#019ACB",
//         status: "upcoming",
//         hourlyPrice: 50,
//         totalHours: 4,
//         rating: 5,
//     },

//     // Requested Sessions
//     {
//         id: "JB-2024-002",
//         milestone: "Pending",
//         title: "React Component Development",
//         tags: ["React.js", "TypeScript", "Tailwind"],
//         postedDate: "Mar 22, 2024",
//         meetingDate: "Mar 30, 2024",
//         meetingTime: "2:00 PM",
//         accentColor: "#019ACB",
//         status: "requested",
//         hourlyPrice: 45,
//         totalHours: 4,
//         rating: 4,
//     },
//     {
//         id: "JB-2024-005",
//         milestone: "Pending",
//         title: "UI/UX Review and Feedback",
//         tags: ["Figma", "Adobe XD", "Design"],
//         postedDate: "Mar 24, 2024",
//         meetingDate: "Apr 02, 2024",
//         meetingTime: "1:00 PM",
//         accentColor: "#019ACB",
//         status: "requested",
//         hourlyPrice: 50,
//         totalHours: 3,
//         rating: 4,
//     },
//     {
//         id: "JB-2024-008",
//         milestone: "Pending",
//         title: "Database Migration Planning",
//         tags: ["PostgreSQL", "MySQL", "Data Modeling"],
//         postedDate: "Mar 25, 2024",
//         meetingDate: "Apr 03, 2024",
//         meetingTime: "4:00 PM",
//         accentColor: "#019ACB",
//         status: "requested",
//         hourlyPrice: 65,
//         totalHours: 5,
//         rating: 5,
//     },
//     {
//         id: "JB-2024-012",
//         milestone: "Pending",
//         title: "Performance Tuning Backend APIs",
//         tags: ["Node.js", "Express", "PostgreSQL"],
//         postedDate: "Mar 26, 2024",
//         meetingDate: "Apr 04, 2024",
//         meetingTime: "11:00 AM",
//         accentColor: "#019ACB",
//         status: "requested",
//         hourlyPrice: 55,
//         totalHours: 4,
//         rating: 4,
//     },
//     {
//         id: "JB-2024-013",
//         milestone: "Pending",
//         title: "GraphQL API Development",
//         tags: ["Node.js", "GraphQL", "Apollo"],
//         postedDate: "Mar 27, 2024",
//         meetingDate: "Apr 05, 2024",
//         meetingTime: "2:00 PM",
//         accentColor: "#019ACB",
//         status: "requested",
//         hourlyPrice: 60,
//         totalHours: 3,
//         rating: 5,
//     },

//     // Completed Sessions
//     {
//         id: "JB-2024-003",
//         milestone: "Completed",
//         title: "Database Design Consultation",
//         tags: ["Database", "MySQL", "API Design"],
//         postedDate: "Mar 15, 2024",
//         meetingDate: "Mar 25, 2024",
//         meetingTime: "10:00 AM",
//         accentColor: "#019ACB",
//         status: "complete",
//         hourlyPrice: 60,
//         totalHours: 8,
//         rating: 4,
//     },
//     {
//         id: "JB-2024-006",
//         milestone: "Completed",
//         title: "Backend Security Audit",
//         tags: ["Node.js", "Express", "Security"],
//         postedDate: "Mar 16, 2024",
//         meetingDate: "Mar 26, 2024",
//         meetingTime: "9:00 AM",
//         accentColor: "#019ACB",
//         status: "complete",
//         hourlyPrice: 70,
//         totalHours: 6,
//         rating: 5,
//     },
//     {
//         id: "JB-2024-009",
//         milestone: "Completed",
//         title: "Cloud Deployment Setup",
//         tags: ["AWS", "Docker", "CI/CD"],
//         postedDate: "Mar 18, 2024",
//         meetingDate: "Mar 28, 2024",
//         meetingTime: "2:00 PM",
//         accentColor: "#019ACB",
//         status: "complete",
//         hourlyPrice: 65,
//         totalHours: 7,
//         rating: 4,
//     },
//     {
//         id: "JB-2024-014",
//         milestone: "Completed",
//         title: "Fullstack Project Review",
//         tags: ["React.js", "Node.js", "PostgreSQL"],
//         postedDate: "Mar 19, 2024",
//         meetingDate: "Mar 29, 2024",
//         meetingTime: "1:00 PM",
//         accentColor: "#019ACB",
//         status: "complete",
//         hourlyPrice: 55,
//         totalHours: 5,
//         rating: 5,
//     },
//     {
//         id: "JB-2024-015",
//         milestone: "Completed",
//         title: "API Documentation and Testing",
//         tags: ["Swagger", "Postman", "Node.js"],
//         postedDate: "Mar 20, 2024",
//         meetingDate: "Mar 30, 2024",
//         meetingTime: "3:00 PM",
//         accentColor: "#019ACB",
//         status: "complete",
//         hourlyPrice: 60,
//         totalHours: 4,
//         rating: 4,
//     },
// ];

// export default function SessionsList() {
//     const [activeTab, setActiveTab] = useState<"upcoming" | "requested" | "complete">("upcoming");
//     const [rescheduleModal, setRescheduleModal] = useState(false);
//     const [selectedSession, setSelectedSession] = useState<Session | null>(null);
//     const [searchQuery, setSearchQuery] = useState("");

//     const filteredSessions = dummySessions.filter(
//         (session) => session.status === activeTab &&
//             (session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                 session.id.toLowerCase().includes(searchQuery.toLowerCase()))
//     );

//     const handleSessionClick = (session: Session) => {
//         setSelectedSession(session);
//     };

//     const handleCloseDetail = () => {
//         setSelectedSession(null);
//     };

//     return (
//         <div className="w-full h-full bg-gray-50">
//             {selectedSession ? (
//                 <div className="h-full">
//                     <SessionDetail session={selectedSession} onBack={handleCloseDetail} />
//                 </div>
//             ) : (
//                 <div className="w-full h-full overflow-y-auto">
//                     <div className="shadow-sm p-4 mb-6">
//                         <div className="flex items-center justify-between mb-4">
//                             {/* Tabs */}
//                             <div className="flex gap-6">
//                                 <button
//                                     onClick={() => setActiveTab("upcoming")}
//                                     className={`pb-2 font-medium transition-colors relative ${activeTab === "upcoming"
//                                         ? "text-cyan-500"
//                                         : "text-gray-500 hover:text-gray-700"
//                                         }`}
//                                 >
//                                     Upcoming
//                                     {activeTab === "upcoming" && (
//                                         <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
//                                     )}
//                                 </button>
//                                 <button
//                                     onClick={() => setActiveTab("requested")}
//                                     className={`pb-2 font-medium transition-colors relative ${activeTab === "requested"
//                                         ? "text-cyan-500"
//                                         : "text-gray-500 hover:text-gray-700"
//                                         }`}
//                                 >
//                                     Requested
//                                     {activeTab === "requested" && (
//                                         <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
//                                     )}
//                                 </button>
//                                 <button
//                                     onClick={() => setActiveTab("complete")}
//                                     className={`pb-2 font-medium transition-colors relative ${activeTab === "complete"
//                                         ? "text-cyan-500"
//                                         : "text-gray-500 hover:text-gray-700"
//                                         }`}
//                                 >
//                                     Complete
//                                     {activeTab === "complete" && (
//                                         <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
//                                     )}
//                                 </button>
//                             </div>

//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
//                         {filteredSessions.map((session) => (
//                             <div
//                                 key={session.id}
//                                 onClick={() => handleSessionClick(session)}
//                                 className="bg-white shadow-sm border-l-4 border-cyan-500 p-6 hover:shadow-md transition-shadow cursor-pointer"
//                             >
//                                 {/* Header with Status/Milestone and ID */}
//                                 <div className="flex items-center gap-4 mb-4">
//                                     <span
//                                         className={`px-4 py-2 text-sm font-medium rounded-full ${session.status === "upcoming"
//                                             ? "bg-amber-50 text-amber-700"
//                                             : session.status === "requested"
//                                                 ? "bg-blue-50 text-blue-700"
//                                                 : "bg-emerald-50 text-emerald-700"
//                                             }`}
//                                     >
//                                         {session.status === "requested" ? "Pending" : session.milestone}
//                                     </span>
//                                     <div className="h-6 w-px bg-gray-300"></div>
//                                     <span className="text-gray-400 text-sm">ID: {session.id}</span>
//                                 </div>

//                                 {/* Separator */}
//                                 <div className="border-t border-gray-200 mb-6"></div>

//                                 {/* Title */}
//                                 <h3 className="text-xl font-semibold text-gray-900 mb-6 line-clamp-2">
//                                     {session.title}
//                                 </h3>

//                                 {/* Tags */}
//                                 <div className="flex flex-wrap gap-2 mb-6">
//                                     {session.tags.map((tag) => (
//                                         <span
//                                             key={tag}
//                                             className="px-4 py-2 bg-cyan-50 text-cyan-500 text-sm rounded-md"
//                                         >
//                                             {tag}
//                                         </span>
//                                     ))}
//                                 </div>

//                                 {/* Info Grid */}
//                                 <div className="grid grid-cols-2 gap-4 mb-6">
//                                     {/* Posted Date */}
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                                             <Calendar className="w-5 h-5 text-blue-600" />
//                                         </div>
//                                         <div>
//                                             <div className="text-base font-semibold text-gray-900">{session.postedDate}</div>
//                                             <div className="text-sm text-gray-400">Posted</div>
//                                         </div>
//                                     </div>

//                                     {/* Meeting Date */}
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
//                                             <Clock className="w-5 h-5 text-pink-600" />
//                                         </div>
//                                         <div>
//                                             <div className="text-base font-semibold text-gray-900">{session.meetingDate}</div>
//                                             <div className="text-sm text-gray-400">{session.meetingTime}</div>
//                                         </div>
//                                     </div>

//                                     {/* Hourly Rate */}
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
//                                             <DollarSign className="w-5 h-5 text-purple-600" />
//                                         </div>
//                                         <div>
//                                             <div className="text-base font-semibold text-gray-900">
//                                                 ${session.hourlyPrice || 0}/hr
//                                             </div>
//                                             <div className="text-sm text-gray-400">Rate</div>
//                                         </div>
//                                     </div>

//                                     {/* Total Cost */}
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
//                                             <Clock className="w-5 h-5 text-cyan-600" />
//                                         </div>
//                                         <div>
//                                             <div className="text-base font-semibold text-gray-900">
//                                                 ${(session.hourlyPrice || 0) * (session.totalHours || 1)}
//                                             </div>
//                                             <div className="text-sm text-gray-400">{session.totalHours || 1} hrs</div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Footer */}
//                                 <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//                                     {/* Left: Rating */}
//                                     {session.status === "complete" && session.rating ? (
//                                         <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
//                                             <Star size={16} className="text-amber-400 fill-amber-400" />
//                                             <span>{session.rating.toFixed(1)} Ratings</span>
//                                         </div>
//                                     ) : (
//                                         <div></div>
//                                     )}

//                                     {/* Right: View Recording Button */}
//                                     <button
//                                         className="px-4 py-2 border border-gray-300 bg-transparent text-gray-900 text-sm font-medium hover:bg-gray-50 transition-colors"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleSessionClick(session);
//                                         }}
//                                     >
//                                         View Recording
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Reschedule Modal - Only render when there's a selected session */}
//             {selectedSession && (
//                 <RescheduleModal
//                     isOpen={rescheduleModal}
//                     onClose={() => setRescheduleModal(false)}
//                     session={selectedSession}
//                 />
//             )}
//         </div>
//     );
// }

import { useState } from "react";
import { Calendar, Star, DollarSign, Clock, Video } from "lucide-react";
import RescheduleModal from "../components/RescheduleModal";
import SessionDetail from "./SessionDetail";

interface Session {
    id: string;
    milestone: string;
    title: string;
    description: string;
    tags: string[];
    postedDate: string;
    appliedDate?: string;
    dueDate?: string;
    meetingDate: string;
    meetingTime: string;
    accentColor: string;
    status: "upcoming" | "requested" | "complete" | "rejected";
    hourlyPrice?: number;
    totalHours?: number;
    rating?: number;
    amount?: number;
}

const dummySessions: Session[] = [
    // Upcoming Sessions
    {
        id: "JB-2024-001",
        milestone: "Milestone 1",
        title: "System Design Architecture Review",
        description:
            "Reviewing the overall architecture and design patterns for the upcoming web application, focusing on scalability and maintainability.",
        tags: ["Web design", "Figma", "Webflow", "UI/UX", "JavaScript"],
        postedDate: "Mar 20, 2024",
        appliedDate: "Mar 21, 2024",
        dueDate: "Mar 28, 2024",
        meetingDate: "Mar 28, 2024",
        meetingTime: "12:00 PM",
        accentColor: "#019ACB",
        status: "upcoming",
        hourlyPrice: 50,
        totalHours: 6,
        rating: 4,
        amount: 300,
    },
    {
        id: "JB-2024-004",
        milestone: "Milestone 2",
        title: "Frontend Optimization Strategies",
        description:
            "Discussing methods to optimize frontend performance, reduce bundle size, and improve page load times using modern frameworks.",
        tags: ["React.js", "Next.js", "Performance"],
        postedDate: "Mar 21, 2024",
        appliedDate: "Mar 22, 2024",
        dueDate: "Mar 29, 2024",
        meetingDate: "Mar 29, 2024",
        meetingTime: "3:00 PM",
        accentColor: "#019ACB",
        status: "upcoming",
        hourlyPrice: 55,
        totalHours: 5,
        rating: 4,
        amount: 275,
    },

    // Requested Sessions
    {
        id: "JB-2024-002",
        milestone: "Pending",
        title: "React Component Development",
        description:
            "Hands-on session focusing on building reusable React components with TypeScript and Tailwind CSS.",
        tags: ["React.js", "TypeScript", "Tailwind"],
        postedDate: "Mar 22, 2024",
        appliedDate: "Mar 23, 2024",
        dueDate: "Mar 30, 2024",
        meetingDate: "Mar 30, 2024",
        meetingTime: "2:00 PM",
        accentColor: "#FFB038",
        status: "requested",
        hourlyPrice: 45,
        totalHours: 4,
        rating: 4,
        amount: 180,
    },
    {
        id: "JB-2024-005",
        milestone: "Pending",
        title: "UI/UX Review and Feedback",
        description:
            "Providing feedback on UI/UX designs, wireframes, and prototypes, focusing on usability and visual consistency.",
        tags: ["Figma", "Adobe XD", "Design"],
        postedDate: "Mar 24, 2024",
        appliedDate: "Mar 25, 2024",
        dueDate: "Apr 02, 2024",
        meetingDate: "Apr 02, 2024",
        meetingTime: "1:00 PM",
        accentColor: "#FFB038",
        status: "requested",
        hourlyPrice: 50,
        totalHours: 3,
        rating: 4,
        amount: 150,
    },

    // Completed Sessions
    {
        id: "JB-2024-003",
        milestone: "Completed",
        title: "Database Design Consultation",
        description:
            "Consultation on designing relational databases, normalization, indexing strategies, and API integration considerations.",
        tags: ["Database", "MySQL", "API Design"],
        postedDate: "Mar 15, 2024",
        appliedDate: "Mar 16, 2024",
        dueDate: "Mar 25, 2024",
        meetingDate: "Mar 25, 2024",
        meetingTime: "10:00 AM",
        accentColor: "#FFB038",
        status: "complete",
        hourlyPrice: 60,
        totalHours: 8,
        rating: 4,
        amount: 480,
    },
    {
        id: "JB-2024-006",
        milestone: "Completed",
        title: "Backend Security Audit",
        description:
            "Audit of Node.js and Express backend for security vulnerabilities, authentication issues, and best practices implementation.",
        tags: ["Node.js", "Express", "Security"],
        postedDate: "Mar 16, 2024",
        appliedDate: "Mar 17, 2024",
        dueDate: "Mar 26, 2024",
        meetingDate: "Mar 26, 2024",
        meetingTime: "9:00 AM",
        accentColor: "#FFB038",
        status: "complete",
        hourlyPrice: 70,
        totalHours: 6,
        rating: 5,
        amount: 420,
    },

    // Rejected Sessions
    {
        id: "JB-2024-016",
        milestone: "Rejected",
        title: "Old Project Code Review",
        description:
            "Reviewing legacy codebase for optimization and security issues. Session rejected due to scheduling conflicts.",
        tags: ["Node.js", "Legacy Code", "Optimization"],
        postedDate: "Mar 10, 2024",
        appliedDate: "Mar 11, 2024",
        dueDate: "Mar 20, 2024",
        meetingDate: "Mar 20, 2024",
        meetingTime: "11:00 AM",
        accentColor: "#FF0000",
        status: "rejected",
        hourlyPrice: 40,
        totalHours: 2,
        rating: 0,
        amount: 80,
    },
    {
        id: "JB-2024-017",
        milestone: "Rejected",
        title: "Frontend Bug Fixing Session",
        description:
            "Fixing UI bugs in React components. Rejected by student due to mismatch of expertise.",
        tags: ["React.js", "CSS", "Bug Fixing"],
        postedDate: "Mar 12, 2024",
        appliedDate: "Mar 13, 2024",
        dueDate: "Mar 22, 2024",
        meetingDate: "Mar 22, 2024",
        meetingTime: "2:00 PM",
        accentColor: "#FF0000",
        status: "rejected",
        hourlyPrice: 45,
        totalHours: 3,
        rating: 0,
        amount: 135,
    },
];

export default function SessionsList() {
    const [activeTab, setActiveTab] = useState<"upcoming" | "requested" | "complete">("upcoming");
    const [rescheduleModal, setRescheduleModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredSessions = dummySessions.filter(
        (session) =>
            session.status === activeTab &&
            (session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleSessionClick = (session: Session) => {
        setSelectedSession(session);
    };

    const handleCloseDetail = () => {
        setSelectedSession(null);
    };

    return (
        <div className="w-full h-full bg-gray-50">
            {selectedSession ? (
                // Only render SessionDetail when a session is selected
                <div className="h-full">
                    <SessionDetail session={selectedSession} onClose={handleCloseDetail} />
                </div>
            ) : (
                <div className="w-full h-full overflow-y-auto">
                    {/* Tabs */}
                    <div className="shadow-sm p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-6">
                                {["upcoming", "requested", "complete"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`pb-2 font-medium transition-colors relative ${activeTab === tab
                                            ? "text-cyan-500"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Session Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        {filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => handleSessionClick(session)}
                                className="bg-white shadow-sm border-l-4 border-cyan-500 p-6 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                {/* Header */}
                                <div className="flex items-center gap-4 mb-4">
                                    <span
                                        className="flex justify-center items-center text-sm font-medium rounded-full"
                                        style={{
                                            padding: "8px 16px",
                                            width: session.status === "requested" ? "102px" : "134px",
                                            height: "31px",
                                            backgroundColor:
                                                session.status === "upcoming"
                                                    ? "rgba(0, 128, 0, 0.05)" // light green
                                                    : session.status === "rejected"
                                                        ? "rgba(255, 0, 0, 0.05)" // light red
                                                        : "rgba(255, 176, 56, 0.05)", // light yellow for requested & completed
                                            border:
                                                session.status === "upcoming"
                                                    ? "1px solid #008000" // green border
                                                    : session.status === "rejected"
                                                        ? "1px solid #FF0000" // red border
                                                        : "1px solid #FFB038", // yellow border
                                            borderRadius: "100px",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        {session.status === "requested" ? "Pending" : session.status === "rejected" ? "Rejected" : session.milestone}
                                    </span>

                                    <div className="h-6 w-px bg-gray-300"></div>
                                    <span className="text-gray-400 text-sm">ID: {session.id}</span>
                                </div>

                                {/* Separator */}
                                <div className="border-t border-gray-200 mb-6"></div>

                                {/* Title */}
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 line-clamp-2">
                                    {session.title}
                                </h3>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {session.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-4 py-2 bg-cyan-50 text-cyan-500 text-sm rounded-md"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-base font-semibold text-gray-900">
                                                {session.postedDate}
                                            </div>
                                            <div className="text-sm text-gray-400">Posted</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div>
                                            <div className="text-base font-semibold text-gray-900">
                                                {session.meetingDate}
                                            </div>
                                            <div className="text-sm text-gray-400">{session.meetingTime}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="text-base font-semibold text-gray-900">
                                                ${session.hourlyPrice || 0}/hr
                                            </div>
                                            <div className="text-sm text-gray-400">Rate</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <div>
                                            <div className="text-base font-semibold text-gray-900">
                                                ${(session.hourlyPrice || 0) * (session.totalHours || 1)}
                                            </div>
                                            <div className="text-sm text-gray-400">{session.totalHours || 1} hrs</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Section */}
                                <div className="flex items-center justify-between mt-6">
                                    {session.status === "complete" && (
                                        <div className="flex items-center gap-2">
                                            <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
                                            <span className="text-gray-900 font-medium text-base">{session.rating} Rating</span>
                                        </div>
                                    )}
                                    {session.status === "complete" && (
                                        <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-900 font-medium text-base hover:bg-gray-50">
                                            <Video size={20} className="text-gray-700" />
                                            View Recording
                                        </button>
                                    )}
                                    {session.status === "upcoming" && (
                                        <div className="flex gap-4 w-full">
                                            <button
                                                className="flex items-center justify-center gap-2 flex-1 p-4 text-black text-base text-lg border border-gray-300"
                                                onClick={() => {
                                                    setSelectedSession(session);
                                                    setRescheduleModal(true);
                                                }}
                                            >
                                                <Calendar size={16} className="text-black" />
                                                <span>Reschedule</span>
                                            </button>
                                            <button className="flex items-center justify-center gap-2 flex-1 p-4 bg-cyan-600 text-white text-base text-lg">
                                                <span className="text-white">+</span>
                                                <span>Join Meeting</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {selectedSession && (
                <RescheduleModal
                    isOpen={rescheduleModal}
                    onClose={() => setRescheduleModal(false)}
                    session={selectedSession}
                />
            )}
        </div>
    );
}
