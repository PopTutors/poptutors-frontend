import { useState, useEffect } from "react";
import { Calendar, Clock, DollarSign, Plus, X, Check, Star, FileText, Lightbulb, Video } from "lucide-react";
import dayjs from "dayjs";

interface ExamHelpItem {
    id: string;
    title: string;
    subtitle?: string;
    skills: string[];
    postedDate: string;
    examTime: string;
    examDate?: string;
    examType: string;
    price: string;
    meetingDate?: string;
    meetingTime?: string;
    rating?: number;
    status: "upcoming" | "requested" | "complete";
}

const dummyExamHelp: ExamHelpItem[] = [
    // Upcoming
    {
        id: "1",
        title: "Advanced React Hooks and State Management",
        skills: ["Web design", "Figma", "Webflow", "UI/UX", "Java Script"],
        postedDate: "2024-03-20",
        examTime: "2:00 PM - 4:00 PM",
        examDate: "2024-03-20",
        examType: "University Exam",
        price: "$50/hr",
        meetingDate: "2024-03-28",
        meetingTime: "12:00PM",
        status: "upcoming",
    },
    // Requested
    {
        id: "2",
        title: "Advanced React Hooks and State Management",
        subtitle: "React Development",
        skills: ["React", "JavaScript", "TypeScript", "Context API"],
        postedDate: "2024-03-20",
        examTime: "2:00 PM - 4:00 PM",
        examType: "University Exam",
        price: "$50/hr",
        status: "requested",
    },
    {
        id: "3",
        title: "RESTful API Development with Express...",
        subtitle: "History",
        skills: ["Node.js", "Express.js", "MongoDB", "API Design"],
        postedDate: "2025-03-30",
        examTime: "10:00 AM - 12:30 PM",
        examType: "University Exam",
        price: "$100/hr",
        status: "requested",
    },
    {
        id: "4",
        title: "SQL Optimization and Database Architecture",
        subtitle: "Database Design",
        skills: ["SQL", "PostgreSQL", "Database Design", "Indexing"],
        postedDate: "2025-04-02",
        examTime: "1:00 PM - 3:30 PM",
        examType: "Live Interview",
        price: "$110/hr",
        status: "requested",
    },
    {
        id: "5",
        title: "Unit and Integration Testing with Jest...",
        subtitle: "Frontend Testing",
        skills: ["Jest", "React Testing Library", "TDD", "Mocking"],
        postedDate: "2025-04-05",
        examTime: "11:00 AM - 1:00 PM",
        examType: "Certifications",
        price: "$250/hr",
        status: "requested",
    },
    // Complete
    {
        id: "6",
        title: "Advanced React Hooks and State Management",
        subtitle: "React Development",
        skills: ["React", "JavaScript", "TypeScript", "Context API"],
        postedDate: "2024-03-20",
        examTime: "2:00 PM - 4:00 PM",
        examType: "University Exam",
        price: "$50/hr",
        rating: 4,
        status: "complete",
    },
    {
        id: "7",
        title: "RESTful API Development with Express...",
        subtitle: "History",
        skills: ["Node.js", "Express.js", "MongoDB", "API Design"],
        postedDate: "2025-03-30",
        examTime: "10:00 AM - 12:30 PM",
        examType: "University Exam",
        price: "$100/hr",
        rating: 4,
        status: "complete",
    },
    {
        id: "8",
        title: "SQL Optimization and Database Architecture",
        subtitle: "Database Design",
        skills: ["SQL", "PostgreSQL", "Database Design", "Indexing"],
        postedDate: "2025-04-02",
        examTime: "1:00 PM - 3:30 PM",
        examType: "Live Interview",
        price: "$110/hr",
        rating: 4,
        status: "complete",
    },
    {
        id: "9",
        title: "Unit and Integration Testing with Jest...",
        subtitle: "Frontend Testing",
        skills: ["Jest", "React Testing Library", "TDD", "Mocking"],
        postedDate: "2025-04-05",
        examTime: "11:00 AM - 1:00 PM",
        examType: "Certifications",
        price: "$250/hr",
        rating: 4,
        status: "complete",
    },
];

export default function ExamHelp() {
    const [activeTab, setActiveTab] = useState<"upcoming" | "requested" | "complete">("upcoming");
    const [examHelps, setExamHelps] = useState<ExamHelpItem[]>(dummyExamHelp);
    const [loading, setLoading] = useState(false);

    // Fetch exam help data from API
    useEffect(() => {
        const fetchExamHelps = async () => {
            setLoading(true);
            try {
                // API Call to fetch exam help list
                // const response = await fetch('/api/teacher/exam-help', {
                //     method: 'GET',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': `Bearer ${localStorage.getItem('token')}`
                //     }
                // });
                // const data = await response.json();
                // 
                // Expected API Response Format:
                // {
                //     success: true,
                //     data: [
                //         {
                //             id: "1",
                //             title: "Advanced React Hooks and State Management",
                //             skills: ["Web design", "Figma", "Webflow", "UI/UX", "Java Script"],
                //             postedDate: "2024-03-20",
                //             examTime: "2:00 PM - 4:00 PM",
                //             examDate: "2024-03-20",
                //             meetingDate: "2024-03-28",
                //             meetingTime: "12:00PM",
                //             status: "upcoming"
                //         },
                //         ...
                //     ]
                // }
                //
                // if (data.success) {
                //     setExamHelps(data.data);
                // }

                // Using dummy data for now
                setExamHelps(dummyExamHelp);
            } catch (error) {
                console.error('Error fetching exam helps:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExamHelps();
    }, []);

    const filteredExamHelps = examHelps.filter((item) => item.status === activeTab);

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col">
            {/* Tabs */}
            <div className="bg-white border-b border-gray-200 px-6">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "upcoming"
                            ? "border-cyan-500 text-cyan-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab("requested")}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "requested"
                            ? "border-cyan-500 text-cyan-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Requested
                    </button>
                    <button
                        onClick={() => setActiveTab("complete")}
                        className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "complete"
                            ? "border-cyan-500 text-cyan-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Complete
                    </button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Loading exam helps...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredExamHelps.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border-l-4 border-cyan-500 shadow-sm hover:shadow-md transition-shadow p-6 relative"
                            >
                                {/* Title */}
                                <h3 className="text-base font-medium text-gray-900 mb-2">
                                    {item.title}
                                </h3>
                                {/* Subtitle */}
                                {item.subtitle && (
                                    <p className="text-sm text-gray-500 mb-4">{item.subtitle}</p>
                                )}

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {item.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="bg-cyan-50 text-cyan-600 px-3 py-1 text-xs rounded"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Date and Time Info */}
                                <div className="grid grid-cols-2 gap-6 mb-5">
                                    {/* Posted Date / Exam Timing */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-4 h-4 text-black" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {dayjs(item.postedDate).format("MMM DD, YYYY")}
                                            </div>
                                            <div className="text-xs text-gray-500">Posted</div>
                                        </div>
                                    </div>

                                    {/* Exam Time / Time */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-4 h-4 text-black" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.examTime}
                                            </div>
                                            <div className="text-xs text-gray-500">Time</div>
                                        </div>
                                    </div>

                                    {/* Posted / Meeting Date */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-4 h-4 text-black" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {activeTab === "upcoming" && item.examDate
                                                    ? dayjs(item.examDate).format("MMM DD, YYYY")
                                                    : dayjs(item.postedDate).format("MMM DD, YYYY")}
                                            </div>
                                            <div className="text-xs text-gray-500">Posted</div>
                                        </div>
                                    </div>

                                    {/* Meeting Info */}
                                    {activeTab === "upcoming" && item.meetingDate ? (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                                <Video className="w-4 h-4 text-black" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {dayjs(item.meetingDate).format("MMM DD, YYYY")} - {item.meetingTime}
                                                </div>
                                                <div className="text-xs text-gray-500">Meeting</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                                                <DollarSign className="w-4 h-4 text-black" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.price}
                                                </div>
                                                <div className="text-xs text-gray-500">Price</div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {activeTab === "upcoming" && (
                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                            <Calendar className="w-4 h-4" />
                                            Reschedule
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors">
                                            <Plus className="w-4 h-4" />
                                            Join Meeting
                                        </button>
                                    </div>
                                )}

                                {activeTab === "requested" && (
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2.5">
                                            <button className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 56, 60, 0.1)' }}>
                                                <div className="w-5 h-5 rounded-full border-[2.5px] border-black flex items-center justify-center">
                                                    <X className="w-3 h-3 text-black" style={{ strokeWidth: '2.5px' }} />
                                                </div>
                                            </button>
                                            <button className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                                                <div className="w-5 h-5 rounded-full border-[2.5px] border-black flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-black" style={{ strokeWidth: '2.5px' }} />
                                                </div>
                                            </button>
                                        </div>
                                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors">
                                            <Calendar className="w-4 h-4" />
                                            Reschedule
                                        </button>
                                    </div>
                                )}

                                {activeTab === "complete" && (
                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                                            <span className="text-sm font-medium text-gray-700">{item.rating} Rating</span>
                                        </div>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                                            <FileText className="w-4 h-4" />
                                            Question Paper
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors">
                                            <Lightbulb className="w-4 h-4" />
                                            View Solution
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}