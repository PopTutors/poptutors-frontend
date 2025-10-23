import { useState } from "react";
import { Search, SlidersHorizontal, Calendar, Briefcase } from "lucide-react";
import AssignmentDetail from "./AssignmentDetail";

interface Assignment {
    id: string;
    milestone: number;
    title: string;
    description: string;
    skills: string[];
    appliedDate: string;
    dueDate: string;
    amount: number;
    status: "ongoing" | "complete" | "applied";
    jobStatus: "open" | "closed" | "in-progress";
    studentName: string;
    studentAvatar?: string;
}

const dummyAssignments: Assignment[] = [
    {
        id: "JB-2024-001",
        milestone: 1,
        title: "React Frontend Development for E-commerce Platform",
        description: "We are looking for an experienced React developer to build a modern e-commerce platform. The project involves creating a responsive frontend with advanced features including product catalog, shopping cart, checkout process, and user authentication. The ideal candidate should have strong knowledge of React, Redux, and modern CSS frameworks.",
        skills: ["Web design", "Figma", "Webflow", "UI/UX", "Java Script", "Design", "Prototype", "Computer Science", "Laravel"],
        appliedDate: "2024-01-10",
        dueDate: "2024-02-15",
        amount: 2000,
        status: "ongoing",
        jobStatus: "open",
        studentName: "John Doe",
        studentAvatar: "JD"
    },
    {
        id: "JB-2024-002",
        milestone: 1,
        title: "React Frontend Development for E-commerce Platform",
        description: "We are looking for an experienced React developer to build a modern e-commerce platform. The project involves creating a responsive frontend with advanced features including product catalog, shopping cart, checkout process, and user authentication.",
        skills: ["Web design", "Figma", "Webflow", "UI/UX", "Java Script", "Design", "Prototype", "Computer Science", "Laravel"],
        appliedDate: "2024-01-10",
        dueDate: "2024-02-15",
        amount: 2000,
        status: "ongoing",
        jobStatus: "open",
        studentName: "Sarah Smith",
        studentAvatar: "SS"
    },
    {
        id: "JB-2024-003",
        milestone: 1,
        title: "React Frontend Development for E-commerce Platform",
        description: "We are looking for an experienced React developer to build a modern e-commerce platform. The project involves creating a responsive frontend with advanced features.",
        skills: ["Web design", "Figma", "Webflow", "UI/UX", "Java Script", "Design", "Prototype", "Computer Science", "Laravel"],
        appliedDate: "2024-01-10",
        dueDate: "2024-02-15",
        amount: 2000,
        status: "ongoing",
        jobStatus: "open",
        studentName: "Mike Johnson",
        studentAvatar: "MJ"
    },
    {
        id: "JB-2024-004",
        milestone: 1,
        title: "React Frontend Development for E-commerce Platform",
        description: "Complete e-commerce platform development with React and modern technologies.",
        skills: ["Web design", "Figma", "Webflow", "UI/UX", "Java Script", "Design", "Prototype", "Computer Science", "Laravel"],
        appliedDate: "2024-01-10",
        dueDate: "2024-02-15",
        amount: 2000,
        status: "complete",
        jobStatus: "closed",
        studentName: "Emily Davis",
        studentAvatar: "ED"
    },
    {
        id: "JB-2024-005",
        milestone: 1,
        title: "React Frontend Development for E-commerce Platform",
        description: "Build a responsive e-commerce frontend with React.",
        skills: ["Web design", "Figma", "Webflow", "UI/UX", "Java Script"],
        appliedDate: "2024-01-10",
        dueDate: "2024-02-15",
        amount: 2000,
        status: "applied",
        jobStatus: "open",
        studentName: "Alex Brown",
        studentAvatar: "AB"
    },
];

export default function AssignmentList() {
    const [activeTab, setActiveTab] = useState<"ongoing" | "complete" | "applied">("ongoing");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

    const filteredAssignments = dummyAssignments.filter(
        (assignment) => assignment.status === activeTab &&
            (assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                assignment.id.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleAssignmentClick = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
    };

    const handleCloseDetail = () => {
        setSelectedAssignment(null);
    };

    return (
        <div className="w-full h-full bg-gray-50">
            {selectedAssignment ? (
                /* Assignment Detail View */
                <AssignmentDetail
                    assignment={selectedAssignment}
                    onClose={handleCloseDetail}
                />
            ) : (
                /* Assignment List View */
                <div className="w-full h-full overflow-y-auto">
                    <div className="bg-white shadow-sm p-4 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            {/* Tabs */}
                            <div className="flex gap-6">
                                <button
                                    onClick={() => setActiveTab("ongoing")}
                                    className={`pb-2 font-medium transition-colors relative ${activeTab === "ongoing"
                                        ? "text-cyan-500"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Ongoing
                                    {activeTab === "ongoing" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("complete")}
                                    className={`pb-2 font-medium transition-colors relative ${activeTab === "complete"
                                        ? "text-cyan-500"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Complete
                                    {activeTab === "complete" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("applied")}
                                    className={`pb-2 font-medium transition-colors relative ${activeTab === "applied"
                                        ? "text-cyan-500"
                                        : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Applied
                                    {activeTab === "applied" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
                                    )}
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
                                    />
                                </div>
                                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {filteredAssignments.map((assignment, index) => (
                            <div
                                key={`${assignment.id}-${index}`}
                                onClick={() => handleAssignmentClick(assignment)}
                                className="bg-white shadow-sm border-l-4 border-cyan-500 p-6 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                {/* Header with Milestone and ID */}
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="px-4 py-2 bg-green-25 border-2 border-green-500 text-green-500 text-sm font-medium rounded-full">
                                        Mile Stone {assignment.milestone}
                                    </span>
                                    <div className="h-6 w-px bg-gray-300"></div>
                                    <span className="text-gray-400">ID: {assignment.id}</span>
                                </div>

                                {/* Separator Linse */}
                                <div className="border-t border-gray-200 mb-6"></div>

                                {/* Title */}
                                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                                    {assignment.title}
                                </h3>

                                {/* Skills Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {assignment.skills.map((skill, skillIndex) => (
                                        <span
                                            key={skillIndex}
                                            className="px-4 py-2 bg-cyan-50 text-cyan-500 text-sm rounded-md"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>

                                {/* Details Row */}
                                <div className="flex items-center gap-8 mb-6">
                                    {/* Applied Date */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-base font-semibold text-gray-900">{assignment.appliedDate}</div>
                                            <div className="text-sm text-gray-400">Applied</div>
                                        </div>
                                    </div>

                                    {/* Due Date */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-pink-600" />
                                        </div>
                                        <div>
                                            <div className="text-base font-semibold text-gray-900">{assignment.dueDate}</div>
                                            <div className="text-sm text-gray-400">Due date</div>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center">
                                                <span className="text-sm text-gray-900">$</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-base font-semibold text-gray-900">${assignment.amount}</div>
                                            <div className="text-sm text-gray-400">Amount</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Status */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-base font-semibold text-gray-900">Open</div>
                                        <div className="text-sm text-gray-400">Job</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredAssignments.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                            <div className="text-gray-400 mb-2">
                                <Search className="w-16 h-16 mx-auto mb-4" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No assignments found</h3>
                            <p className="text-gray-500">
                                {searchQuery
                                    ? "Try adjusting your search terms"
                                    : `No ${activeTab} assignments at the moment`}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
