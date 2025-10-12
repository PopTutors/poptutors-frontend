import { useState } from "react";
import {
    X,
    Search,
    ChevronDown,
    ChevronUp,
    SlidersHorizontal,
    Calendar,
    Clock,
    Upload,
    Briefcase,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Job {
    id: string;
    type: "Assignment" | "Live Session" | "Exam Help";
    title: string;
    dueDate: string;
    datePosted: string;
    skills: string[];
    amount: number;
}

const dummyJobs: Job[] = [
    {
        id: "JB-2024-001",
        type: "Assignment",
        title:
            "Complete Website Responsive Design: from Figma to Webflow - Assignment",
        dueDate: "2024-09-15",
        datePosted: "2024-08-15",
        skills: ["Web design", "Figma", "Webflow"],
        amount: 5056,
    },
    {
        id: "JB-2024-002",
        type: "Exam Help",
        title:
            "Data Structures Problem Set Review: Full Stack Web Assignment - Exam Help",
        dueDate: "2024-09-18",
        datePosted: "2024-08-20",
        skills: ["DSA", "Algorithms", "C++"],
        amount: 4500,
    },
];

export default function TeacherJobListing() {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([
        "Web design",
        "Figma",
        "Development",
        "Match",
    ]);
    const [jobs, setJobs] = useState<Job[]>(dummyJobs);
    const [sortByDatePostedAsc, setSortByDatePostedAsc] = useState(true);
    const [sortByDueDateAsc, setSortByDueDateAsc] = useState(true);
    const [timelineExpanded, setTimelineExpanded] = useState(true);
    const [jobTypeExpanded, setJobTypeExpanded] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const toggleFilter = (label: string) => {
        setSelectedFilters((prev) =>
            prev.includes(label)
                ? prev.filter((f) => f !== label)
                : [...prev, label]
        );
    };

    const removeSkill = (skill: string) =>
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));

    return (
        <div className="flex w-full h-full bg-gray-50">
            {/* Sidebar */}
            <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col overflow-hidden">
                {/* Search */}
                <div className="relative mb-6 px-6 pt-6">
                    <Search className="absolute left-9 top-[55%] w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Skill"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 px-6">
                        {selectedSkills.map((skill) => (
                            <div
                                key={skill}
                                className="bg-cyan-100 text-cyan-700 px-3 py-1 text-sm flex items-center gap-1.5"
                            >
                                {skill}
                                <X
                                    className="w-3.5 h-3.5 cursor-pointer hover:text-cyan-900"
                                    onClick={() => removeSkill(skill)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Filters */}
                <div className="border-t border-b border-gray-200 flex flex-col mb-6 flex-grow overflow-y-auto">
                    <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0">
                        <h3 className="font-semibold text-gray-800">Filter</h3>
                        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                    </div>

                    {/* Timeline */}
                    <div className="border-b border-gray-200">
                        <button
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                            onClick={() => setTimelineExpanded(!timelineExpanded)}
                        >
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                                <Clock className="w-4 h-4 text-gray-500" /> Timeline
                            </div>
                            {timelineExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>

                        {timelineExpanded && (
                            <div className="px-6 pb-4 space-y-3 pl-10">
                                {[
                                    { label: "Deadline in 7 Days", count: 574 },
                                    { label: "Deadline in 15 Days", count: 568 },
                                    { label: "Deadline in 1 Month", count: 1345 },
                                    { label: "Deadline in 3 Months", count: 31 },
                                    { label: "Deadline in 6+ Months", count: 37 },
                                ].map((item) => (
                                    <label
                                        key={item.label}
                                        className="flex items-center justify-between cursor-pointer text-sm text-gray-700 hover:text-gray-900"
                                    >
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.includes(item.label)}
                                                onChange={() => toggleFilter(item.label)}
                                                className="w-4 h-4 border border-gray-300 rounded bg-transparent checked:bg-transparent checked:border-2 checked:border-gray-900 focus:ring-0 focus:ring-offset-0 appearance-none checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgOEw2LjUgMTEuNUwxMyA1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] checked:bg-center checked:bg-no-repeat checked:bg-[length:12px_12px]"
                                            />
                                            {item.label}
                                        </div>
                                        <span className="text-sm text-gray-400">{item.count}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Job Type */}
                    <div>
                        <button
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                            onClick={() => setJobTypeExpanded(!jobTypeExpanded)}
                        >
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                                <Briefcase className="w-4 h-4 text-gray-500" /> By Job Type
                            </div>
                            {jobTypeExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            )}
                        </button>

                        {jobTypeExpanded && (
                            <div className="px-6 pb-4 space-y-3 pl-10">
                                {[
                                    { label: "Assignment", count: 574 },
                                    { label: "Exam Help", count: 568 },
                                    { label: "Session", count: 1345 },
                                ].map((item) => (
                                    <label
                                        key={item.label}
                                        className="flex items-center justify-between cursor-pointer text-sm text-gray-700 hover:text-gray-900"
                                    >
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.includes(item.label)}
                                                onChange={() => toggleFilter(item.label)}
                                                className="w-4 h-4 border border-gray-300 rounded bg-transparent checked:bg-transparent checked:border-2 checked:border-gray-900 focus:ring-0 focus:ring-offset-0 appearance-none checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgOEw2LjUgMTEuNUwxMyA1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] checked:bg-center checked:bg-no-repeat checked:bg-[length:12px_12px]"
                                            />
                                            {item.label}
                                        </div>
                                        <span className="text-sm text-gray-400">{item.count}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sort Section */}
                <div className="border-t border-b border-gray-200 flex flex-col mb-6">
                    <div className="flex items-center justify-between px-6 py-4 border-b">
                        <h3 className="font-semibold text-gray-800">Sort by</h3>
                        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="px-6 py-4 space-y-4">
                        {/* Date Posted */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700 font-medium">Date Posted</span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center gap-3 ml-6">
                                <span className="text-xs text-gray-600">Ascending</span>
                                <button
                                    onClick={() => setSortByDatePostedAsc(!sortByDatePostedAsc)}
                                    className={`relative w-7 h-4 rounded-full transition-colors ${sortByDatePostedAsc ? "bg-gray-300" : "bg-cyan-500"
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${sortByDatePostedAsc ? "translate-x-0" : "translate-x-3"
                                            }`}
                                    />
                                </button>
                                <span className="text-xs text-gray-600">Descending</span>
                            </div>
                        </div>

                        {/* Due Date */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700 font-medium">Due Date</span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center gap-3 ml-6">
                                <span className="text-xs text-gray-600">Ascending</span>
                                <button
                                    onClick={() => setSortByDueDateAsc(!sortByDueDateAsc)}
                                    className={`relative w-7 h-4 rounded-full transition-colors ${sortByDueDateAsc ? "bg-gray-300" : "bg-cyan-500"
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${sortByDueDateAsc ? "translate-x-0" : "translate-x-3"
                                            }`}
                                    />
                                </button>
                                <span className="text-xs text-gray-600">Descending</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 h-full overflow-y-auto p-6 bg-gray-50 border-l border-gray-200">
                <div className="mx-auto space-y-6 h-full">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white border-l-4 border-cyan-500 shadow-sm hover:shadow-md transition-shadow p-5"
                        >
                            <div className="flex justify-between items-start mb-3 pb-3 border-b-2 border-gray-100">
                                {/* Left: Type + ID */}
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`px-3 py-1 text-xs font-medium border rounded-full ${job.type === "Assignment"
                                            ? "bg-green-50 text-green-700 border-green-300"
                                            : job.type === "Live Session"
                                                ? "bg-red-50 text-red-700 border-red-300"
                                                : "bg-yellow-50 text-yellow-700 border-yellow-300"
                                            }`}
                                    >
                                        {job.type}
                                    </span>
                                    <span className="text-sm text-gray-500">ID: {job.id}</span>
                                </div>

                                {/* Apply button */}
                                <button className="border border-gray-300 hover:border-cyan-500 px-4 py-1.5 text-sm text-gray-700 hover:text-cyan-600 font-medium transition-colors flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Apply
                                </button>
                            </div>

                            {/* Title */}
                            <h3 className="text-base font-normal text-gray-900 mb-3 mt-3">
                                {job.title}
                            </h3>

                            {/* Dates and Price */}
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>Due date : {dayjs(job.dueDate).format("DD MMMM YYYY")}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>Date posted : {dayjs(job.datePosted).fromNow()}</span>
                                    </div>
                                </div>
                                <div className="text-2xl font-bold text-cyan-600">
                                    ${job.amount.toLocaleString()}
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="bg-cyan-100 text-cyan-700 px-3 py-1 text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
