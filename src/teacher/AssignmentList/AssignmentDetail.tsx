import React, { useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import ChatSection from "../../components/ChatSection";

interface AssignmentDetailProps {
    assignment: {
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
    };
    onClose: () => void;
}

export default function AssignmentDetail({ assignment, onClose }: AssignmentDetailProps) {
    const [activeTab, setActiveTab] = useState<"Details" | "Chat">("Details");

    return (
        <div className="w-full h-full bg-gray-50 flex flex-col">
            {/* Tabs */}
            <div className="bg-white px-8 border-b border-gray-200">
                <div className="flex items-center relative">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 transition-colors mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex h-14 items-center relative">
                        <button
                            onClick={() => setActiveTab("Details")}
                            className={`h-full px-4 font-medium relative ${activeTab === "Details"
                                ? "text-blue-600 border-b-2 border-b-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab("Chat")}
                            className={`h-full px-4 font-medium relative ${activeTab === "Chat"
                                ? "text-blue-600 border-b-2 border-b-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Chat
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === "Details" ? (
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {/* Title Section */}
                    <div className="mb-8">
                        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                            {assignment.title}
                        </h2>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>Assignment</span>
                            <span>ID: {assignment.id}</span>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 h-full">
                        {/* Left Column */}
                        <div className="space-y-8">
                            {/* Description */}
                            <div className="bg-white p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Description
                                </h3>
                                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                                    <p>
                                        I'm a product designer + filmmaker currently working
                                        remotely at Twitter from beautiful Manchester, United
                                        Kingdom. I'm passionate about designing digital products
                                        that have a positive impact on the world.
                                    </p>
                                    <p>
                                        For 10 years, I've specialised in interface, experience &
                                        interaction design as well as working in user research and
                                        product strategy for product agencies, big tech companies
                                        & start-ups.
                                    </p>
                                </div>
                            </div>

                            {/* Required Skills */}
                            <div className="bg-white p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Required Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Project Management",
                                        "English",
                                        "Social Media Marketing",
                                        "Tele Communication",
                                        "Copy Editing",
                                        "Social Science",
                                    ].map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-4 py-2 bg-cyan-50 text-cyan-500 text-sm rounded-lg"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="bg-white border border-gray-200 p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 relative">
                                    {[
                                        ["Computer Science", "Academic Subjects"],
                                        ["Case Studies", "Assignment Types"],
                                        ["5 yrs", "Expertise Levels"],
                                        ["UI/UX Designing", "Additional Services"],
                                        ["Hindi, Gujarati, English", "Language Support"],
                                        ["Designing", "Skills"],
                                    ].map(([title, label], i) => (
                                        <div key={i} className="relative pr-6 lg:pr-8">
                                            <div className="text-gray-900 font-medium">{title}</div>
                                            <div className="text-sm text-gray-500">{label}</div>
                                            {i % 3 !== 2 && (
                                                <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-gray-200" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Project Info */}
                            <div className="bg-white p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    Project Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Budget:</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            ${assignment.amount}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Rating:</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-semibold text-gray-900">
                                                4
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Job ID:</span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {assignment.id}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Job Status:</span>
                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                                            Open
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-white p-6 border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                    Timeline
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Posted:</span>
                                        <span className="text-sm text-gray-900">2024-01-08</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Applied:</span>
                                        <span className="text-sm text-gray-900">
                                            {assignment.appliedDate}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Due Date:</span>
                                        <span className="text-sm text-gray-900">
                                            {assignment.dueDate}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                                            Scheduled
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Chat Section (full width + height)
                <ChatSection />
            )}
        </div>
    );
}
