import React, { useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import ChatSection from "../components/ChatSection";

interface SessionDetailProps {
  session: {
    id: string;
    milestone: string;
    title: string;
    description: string;
    tags: string[];
    postedDate: string;
    meetingDate: string;
    meetingTime: string;
    status: "upcoming" | "requested" | "complete";
    hourlyPrice?: number;
    totalHours?: number;
    rating?: number;
  };
  onBack: () => void;
}

export default function SessionDetail({ session, onBack }: SessionDetailProps) {
  const [activeTab, setActiveTab] = useState<"Details" | "Chat">("Details");

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      {/* Tabs */}
      <div className="bg-white px-8 border-b border-gray-200 flex items-center h-14">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 transition-colors mr-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => setActiveTab("Details")}
          className={`h-full px-4 font-medium ${activeTab === "Details"
            ? "text-blue-600 border-b-2 border-b-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab("Chat")}
          className={`h-full px-4 font-medium ${activeTab === "Chat"
            ? "text-blue-600 border-b-2 border-b-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Chat
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        {activeTab === "Details" ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <h2 className="text-3xl font-semibold text-gray-900">{session.title}</h2>

              {/* Description */}
              <div className="bg-white p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Session Description
                </h3>
                <p className="text-gray-600">{session.description}</p>
              </div>

              {/* Tags */}
              <div className="bg-white p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {session.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-cyan-50 text-cyan-500 text-sm rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white p-6 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  [session.meetingDate, "Meeting Date"],
                  [session.meetingTime, "Meeting Time"],
                  [`${session.hourlyPrice || 0}/hr`, "Hourly Rate"],
                  [`${session.totalHours || 0} hours`, "Total Hours"],
                  [`$${(session.hourlyPrice || 0) * (session.totalHours || 1)}`, "Total Amount"],
                  [session.status.charAt(0).toUpperCase() + session.status.slice(1), "Status"],
                ].map(([value, label], i) => (
                  <div key={i} className="relative pr-6 lg:pr-8">
                    <div className="text-gray-900 font-medium">{value}</div>
                    <div className="text-sm text-gray-500">{label}</div>
                    {i % 3 !== 2 && (
                      <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Session Info */}
              <div className="bg-white p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Session Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Session ID:</span>
                    <span className="font-semibold text-gray-900">{session.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Milestone:</span>
                    <span className="font-semibold text-gray-900">{session.milestone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className={`w-4 h-4 ${session.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      <span className="font-semibold text-gray-900">{session.rating || 0}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Chat Section takes full content area
          <div className="h-full">
            <ChatSection />
          </div>
        )}
      </div>
    </div>
  );
}
