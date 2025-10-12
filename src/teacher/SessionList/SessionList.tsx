import { useState } from "react";
import { Calendar, Video, Star, DollarSign, Clock } from "lucide-react";
import RescheduleModal from "../components/RescheduleModal";

interface Session {
    id: string;
    milestone: string;
    title: string;
    tags: string[];
    postedDate: string;
    meetingDate: string;
    meetingTime: string;
    accentColor: string;
    status: "upcoming" | "requested" | "complete";
    hourlyPrice?: number;
    totalHours?: number;
    rating?: number;
}

const dummySessions: Session[] = [
    // Upcoming Sessions
    {
        id: "JB-2024-001",
        milestone: "Milestone 1",
        title: "System Design Architecture Review",
        tags: ["Web design", "Figma", "Webflow", "UI/UX", "JavaScript"],
        postedDate: "Mar 20, 2024",
        meetingDate: "Mar 28, 2024",
        meetingTime: "12:00 PM",
        accentColor: "#019ACB",
        status: "upcoming",
        hourlyPrice: 50,
        totalHours: 6,
        rating: 4,
    },
    {
        id: "JB-2024-004",
        milestone: "Milestone 2",
        title: "Frontend Optimization Strategies",
        tags: ["React.js", "Next.js", "Performance"],
        postedDate: "Mar 21, 2024",
        meetingDate: "Mar 29, 2024",
        meetingTime: "3:00 PM",
        accentColor: "#019ACB",
        status: "upcoming",
        hourlyPrice: 55,
        totalHours: 5,
        rating: 4,
    },
    {
        id: "JB-2024-007",
        milestone: "Milestone 3",
        title: "API Design and Best Practices",
        tags: ["Node.js", "Express", "REST API"],
        postedDate: "Mar 23, 2024",
        meetingDate: "Apr 01, 2024",
        meetingTime: "11:00 AM",
        accentColor: "#019ACB",
        status: "upcoming",
        hourlyPrice: 60,
        totalHours: 4,
        rating: 5,
    },
    {
        id: "JB-2024-010",
        milestone: "Milestone 4",
        title: "React State Management Deep Dive",
        tags: ["React.js", "Redux", "Context API"],
        postedDate: "Mar 24, 2024",
        meetingDate: "Apr 02, 2024",
        meetingTime: "2:00 PM",
        accentColor: "#019ACB",
        status: "upcoming",
        hourlyPrice: 45,
        totalHours: 3,
        rating: 4,
    },
    {
        id: "JB-2024-011",
        milestone: "Milestone 5",
        title: "UI/UX Design Best Practices",
        tags: ["Figma", "Adobe XD", "Prototyping"],
        postedDate: "Mar 25, 2024",
        meetingDate: "Apr 03, 2024",
        meetingTime: "1:00 PM",
        accentColor: "#019ACB",
        status: "upcoming",
        hourlyPrice: 50,
        totalHours: 4,
        rating: 5,
    },

    // Requested Sessions
    {
        id: "JB-2024-002",
        milestone: "Pending",
        title: "React Component Development",
        tags: ["React.js", "TypeScript", "Tailwind"],
        postedDate: "Mar 22, 2024",
        meetingDate: "Mar 30, 2024",
        meetingTime: "2:00 PM",
        accentColor: "#019ACB",
        status: "requested",
        hourlyPrice: 45,
        totalHours: 4,
        rating: 4,
    },
    {
        id: "JB-2024-005",
        milestone: "Pending",
        title: "UI/UX Review and Feedback",
        tags: ["Figma", "Adobe XD", "Design"],
        postedDate: "Mar 24, 2024",
        meetingDate: "Apr 02, 2024",
        meetingTime: "1:00 PM",
        accentColor: "#019ACB",
        status: "requested",
        hourlyPrice: 50,
        totalHours: 3,
        rating: 4,
    },
    {
        id: "JB-2024-008",
        milestone: "Pending",
        title: "Database Migration Planning",
        tags: ["PostgreSQL", "MySQL", "Data Modeling"],
        postedDate: "Mar 25, 2024",
        meetingDate: "Apr 03, 2024",
        meetingTime: "4:00 PM",
        accentColor: "#019ACB",
        status: "requested",
        hourlyPrice: 65,
        totalHours: 5,
        rating: 5,
    },
    {
        id: "JB-2024-012",
        milestone: "Pending",
        title: "Performance Tuning Backend APIs",
        tags: ["Node.js", "Express", "PostgreSQL"],
        postedDate: "Mar 26, 2024",
        meetingDate: "Apr 04, 2024",
        meetingTime: "11:00 AM",
        accentColor: "#019ACB",
        status: "requested",
        hourlyPrice: 55,
        totalHours: 4,
        rating: 4,
    },
    {
        id: "JB-2024-013",
        milestone: "Pending",
        title: "GraphQL API Development",
        tags: ["Node.js", "GraphQL", "Apollo"],
        postedDate: "Mar 27, 2024",
        meetingDate: "Apr 05, 2024",
        meetingTime: "2:00 PM",
        accentColor: "#019ACB",
        status: "requested",
        hourlyPrice: 60,
        totalHours: 3,
        rating: 5,
    },

    // Completed Sessions
    {
        id: "JB-2024-003",
        milestone: "Completed",
        title: "Database Design Consultation",
        tags: ["Database", "MySQL", "API Design"],
        postedDate: "Mar 15, 2024",
        meetingDate: "Mar 25, 2024",
        meetingTime: "10:00 AM",
        accentColor: "#019ACB",
        status: "complete",
        hourlyPrice: 60,
        totalHours: 8,
        rating: 4,
    },
    {
        id: "JB-2024-006",
        milestone: "Completed",
        title: "Backend Security Audit",
        tags: ["Node.js", "Express", "Security"],
        postedDate: "Mar 16, 2024",
        meetingDate: "Mar 26, 2024",
        meetingTime: "9:00 AM",
        accentColor: "#019ACB",
        status: "complete",
        hourlyPrice: 70,
        totalHours: 6,
        rating: 5,
    },
    {
        id: "JB-2024-009",
        milestone: "Completed",
        title: "Cloud Deployment Setup",
        tags: ["AWS", "Docker", "CI/CD"],
        postedDate: "Mar 18, 2024",
        meetingDate: "Mar 28, 2024",
        meetingTime: "2:00 PM",
        accentColor: "#019ACB",
        status: "complete",
        hourlyPrice: 65,
        totalHours: 7,
        rating: 4,
    },
    {
        id: "JB-2024-014",
        milestone: "Completed",
        title: "Fullstack Project Review",
        tags: ["React.js", "Node.js", "PostgreSQL"],
        postedDate: "Mar 19, 2024",
        meetingDate: "Mar 29, 2024",
        meetingTime: "1:00 PM",
        accentColor: "#019ACB",
        status: "complete",
        hourlyPrice: 55,
        totalHours: 5,
        rating: 5,
    },
    {
        id: "JB-2024-015",
        milestone: "Completed",
        title: "API Documentation and Testing",
        tags: ["Swagger", "Postman", "Node.js"],
        postedDate: "Mar 20, 2024",
        meetingDate: "Mar 30, 2024",
        meetingTime: "3:00 PM",
        accentColor: "#019ACB",
        status: "complete",
        hourlyPrice: 60,
        totalHours: 6,
        rating: 4,
    },
];

// export default function SessionsList() {
//     const [activeTab, setActiveTab] = useState<"upcoming" | "requested" | "complete">("upcoming");
//     const [rescheduleModal, setRescheduleModal] = useState(false);
//     const [selectedSession, setSelectedSession] = useState<Session | null>(null);

//     const sessions = dummySessions.filter((session) => session.status === activeTab);

//     return (
//         <div className="w-full min-h-screen bg-gray-50 px-4 py-6">
//             {/* Tabs */}
//             <div className="flex gap-6 border-b border-gray-200 mb-6">
//                 {["upcoming", "requested", "complete"].map((tab) => (
//                     <button
//                         key={tab}
//                         onClick={() => setActiveTab(tab as any)}
//                         className={`pb-2 text-base font-medium capitalize transition-all ${activeTab === tab
//                             ? "border-b-2 border-cyan-600 text-cyan-700"
//                             : "text-gray-500 hover:text-gray-700"
//                             }`}
//                     >
//                         {tab}
//                     </button>
//                 ))}
//             </div>

//             {/* Session Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {sessions.map((session) => (
//                     <div
//                         key={session.id}
//                         className="bg-white border-l-4 shadow-lg w-full"
//                         style={{
//                             borderLeftColor: session.accentColor,
//                             boxShadow: "-2px -2px 15px rgba(0, 0, 0, 0.08)",
//                             minHeight: session.status === "requested" ? 280 : 420,
//                         }}
//                     >
//                         <div className="p-6 flex flex-col space-y-7">
//                             {/* Header Section */}
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-4">
//                                     {session.status === "upcoming" && (
//                                         <span className="px-4 py-2 bg-yellow-50 border border-yellow-400 text-yellow-600 text-xs font-medium rounded-full">
//                                             {session.milestone}
//                                         </span>
//                                     )}
//                                     {session.status === "requested" && (
//                                         <span className="px-4 py-2 bg-orange-50 border border-orange-400 text-orange-600 text-xs font-medium rounded-full">
//                                             Pending
//                                         </span>
//                                     )}
//                                     {session.status === "complete" && (
//                                         <span className="px-4 py-2 bg-green-50 border border-green-400 text-green-600 text-xs font-medium rounded-full">
//                                             {session.milestone}
//                                         </span>
//                                     )}
//                                     <div className="w-px h-6 bg-gray-200"></div>
//                                     <span className="text-gray-400 text-sm font-medium">ID: {session.id}</span>
//                                 </div>
//                             </div>

//                             <hr className="border-gray-200" />

//                             {/* Title Section */}
//                             <div>
//                                 <h3 className="text-xl font-medium text-gray-900 leading-6">{session.title}</h3>
//                             </div>

//                             {/* Tags Section */}
//                             <div className="flex flex-wrap gap-4">
//                                 {session.tags.map((tag) => (
//                                     <span
//                                         key={tag}
//                                         className="px-3 py-2 bg-cyan-50 text-cyan-600 text-sm font-normal rounded"
//                                     >
//                                         {tag}
//                                     </span>
//                                 ))}
//                             </div>

//                             {/* Info Section */}
//                             {session.status === "complete" ? (
//                                 <div className="grid grid-cols-2 gap-4">
//                                     {/* Row 1 - Posted Date */}
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-11 h-11 bg-purple-100 rounded-full flex items-center justify-center">
//                                             <Calendar size={20} className="text-gray-700" />
//                                         </div>
//                                         <div className="flex flex-col gap-1">
//                                             <span className="font-medium text-gray-900 text-base">{session.postedDate}</span>
//                                             <span className="text-gray-400 text-sm">Posted</span>
//                                         </div>
//                                     </div>

//                                     {/* Row 1 - Meeting Date */}
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center">
//                                             <Video size={20} className="text-gray-700" />
//                                         </div>
//                                         <div className="flex flex-col gap-1">
//                                             <span className="font-medium text-gray-900 text-base">
//                                                 {`${session.meetingDate} - ${session.meetingTime}`}
//                                             </span>
//                                             <span className="text-gray-400 text-sm">Meeting</span>
//                                         </div>
//                                     </div>

//                                     {/* Row 2 - Hourly Price */}
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center">
//                                             <div className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center">
//                                                 <DollarSign className="w-4 h-4 text-black" />
//                                             </div>
//                                         </div>
//                                         <div className="flex flex-col gap-1">
//                                             <span className="font-medium text-gray-900 text-base">${session.hourlyPrice || 0}/hrs</span>
//                                             <span className="text-gray-400 text-sm">Hourly Price</span>
//                                         </div>
//                                     </div>

//                                     {/* Total Price & Hours */}
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-11 h-11 bg-red-100 rounded-full flex items-center justify-center">
//                                             <Clock size={20} className="text-gray-700" />
//                                         </div>
//                                         <div className="flex flex-col gap-1">
//                                             <span className="font-medium text-gray-900 text-base">
//                                                 {session.hourlyPrice && session.totalHours ? session.hourlyPrice * session.totalHours : session.hourlyPrice || 0}$
//                                             </span>
//                                             <span className="text-gray-400 text-sm">{session.totalHours || 0}hours</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center gap-6">
//                                     {/* Upcoming & Requested */}
//                                     <div className="flex items-center gap-3 flex-1">
//                                         <div className="w-11 h-11 bg-purple-100 rounded-full flex items-center justify-center">
//                                             <Calendar size={20} className="text-gray-700" />
//                                         </div>
//                                         <div className="flex flex-col gap-1">
//                                             <span className="font-medium text-gray-900 text-base">{session.postedDate}</span>
//                                             <span className="text-gray-400 text-sm">Posted</span>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-3 flex-1">
//                                         <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center">
//                                             <Video size={20} className="text-gray-700" />
//                                         </div>
//                                         <div className="flex flex-col gap-1">
//                                             <span className="font-medium text-gray-900 text-base">
//                                                 {`${session.meetingDate} - ${session.meetingTime}`}
//                                             </span>
//                                             <span className="text-gray-400 text-sm">Meeting</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {['complete', 'upcoming'].includes(session.status) && (<hr className="border-gray-200" />)}

//                             {/* Bottom Section */}
//                             <div className="flex items-center justify-between">
//                                 {session.status === "complete" && (
//                                     <div className="flex items-center gap-2">
//                                         <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
//                                         <span className="text-gray-900 font-medium text-base">{session.rating} Rating</span>
//                                     </div>
//                                 )}
//                                 {session.status === "complete" && (
//                                     <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-900 font-medium text-base hover:bg-gray-50">
//                                         <Video size={20} className="text-gray-700" />
//                                         View Recording
//                                     </button>
//                                 )}
//                                 {session.status === "upcoming" && (
//                                     <div className="flex gap-4 w-full">
//                                         <button className="flex items-center justify-center gap-2 flex-1 p-4 text-black text-base text-lg border border-gray-300">
//                                             <Calendar size={16} className="text-black" />
//                                             <span>Reschedule</span>
//                                         </button>
//                                         <button className="flex items-center justify-center gap-2 flex-1 p-4 bg-cyan-600 text-white text-base text-lg">
//                                             <span className="text-white">+</span>
//                                             <span>Join Now</span>
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
export default function SessionsList() {
    const [activeTab, setActiveTab] = useState<"upcoming" | "requested" | "complete">("upcoming");
    const [rescheduleModal, setRescheduleModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);

    const sessions = dummySessions.filter((session) => session.status === activeTab);

    return (
        <div className="w-full min-h-screen bg-gray-50 px-4 py-6">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
                {["upcoming", "requested", "complete"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-2 text-base font-medium capitalize transition-all ${activeTab === tab ? "border-b-2 border-cyan-600 text-cyan-700" : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Session Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className="bg-white border-l-4 shadow-lg w-full"
                        style={{
                            borderLeftColor: session.accentColor,
                            boxShadow: "-2px -2px 15px rgba(0, 0, 0, 0.08)",
                            minHeight: session.status === "requested" ? 280 : 420,
                        }}
                    >
                        <div className="p-6 flex flex-col space-y-7">
                            {/* Header Section */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {session.status === "upcoming" && (
                                        <span className="px-4 py-2 bg-yellow-50 border border-yellow-400 text-yellow-600 text-xs font-medium rounded-full">
                                            {session.milestone}
                                        </span>
                                    )}
                                    {session.status === "requested" && (
                                        <span className="px-4 py-2 bg-orange-50 border border-orange-400 text-orange-600 text-xs font-medium rounded-full">
                                            Pending
                                        </span>
                                    )}
                                    {session.status === "complete" && (
                                        <span className="px-4 py-2 bg-green-50 border border-green-400 text-green-600 text-xs font-medium rounded-full">
                                            {session.milestone}
                                        </span>
                                    )}
                                    <div className="w-px h-6 bg-gray-200"></div>
                                    <span className="text-gray-400 text-sm font-medium">ID: {session.id}</span>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            {/* Title Section */}
                            <div>
                                <h3 className="text-xl font-medium text-gray-900 leading-6">{session.title}</h3>
                            </div>

                            {/* Tags Section */}
                            <div className="flex flex-wrap gap-4">
                                {session.tags.map((tag) => (
                                    <span key={tag} className="px-3 py-2 bg-cyan-50 text-cyan-600 text-sm font-normal rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Info Section */}
                            {session.status === "complete" ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {/* ...complete session info... */}
                                </div>
                            ) : (
                                <div className="flex items-center gap-6">
                                    {/* Upcoming & Requested */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-11 h-11 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Calendar size={20} className="text-gray-700" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-900 text-base">{session.postedDate}</span>
                                            <span className="text-gray-400 text-sm">Posted</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="w-11 h-11 bg-amber-100 rounded-full flex items-center justify-center">
                                            <Video size={20} className="text-gray-700" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-medium text-gray-900 text-base">
                                                {`${session.meetingDate} - ${session.meetingTime}`}
                                            </span>
                                            <span className="text-gray-400 text-sm">Meeting</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {["complete", "upcoming"].includes(session.status) && <hr className="border-gray-200" />}

                            {/* Bottom Section */}
                            <div className="flex items-center justify-between">
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
                                            <span>Join Now</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reschedule Modal */}
            {rescheduleModal && selectedSession && (
                <RescheduleModal
                    session={selectedSession}
                    onClose={() => setRescheduleModal(false)}
                />
            )}
        </div>
    );
}
