import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, Filter, MoreVertical } from "lucide-react";
import Updates from "./Updates";
import StudentDocuments from "./StudentDocuments";
import { FinalizeIcon, GoodIcon, RejectIcon } from "../../assets/managers";
import { useFetch } from "../../api"; // ✅ your custom hook
import JobDetailsPage from "./JobDetails";

interface Applicant {
  id: string;
  name: string;
  rating: number;
  budget: string;
  deadline: string;
  applied: string;
  status:
  | "Good Fit"
  | "Reject"
  | "Negotiate"
  | "Rejected"
  | "Finalized"
  | "Finalist";
  avatar: string;
}

const statusColors: Record<string, string> = {
  "Good Fit": "bg-green-50 text-green-600 border-green-200 hover:bg-green-100",
  Reject: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
  Negotiate:
    "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100",
  Rejected: "bg-red-50 text-red-600 border-red-200 hover:bg-red-100",
  Finalized: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
  Finalist: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => (
  <input
    {...props}
    className={`border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const JobApplicants: React.FC = () => {
  const { id: jobId, type } = useParams < {
    id: string;
    type: "assignment" | "session" | "liveHelp";
  } > ();

  const [activeTab, setActiveTab] = useState < string > ("Applicants");
  const [search, setSearch] = useState("");
  const [openActionDropdownId, setOpenActionDropdownId] = useState <
    string | null
    > (null);

  const actionContainerRefs = useRef < Record < string, HTMLDivElement | null >> ({});

  // ✅ Fetch applicants
  const { data, isLoading, error } = useFetch(
    ["applicants", jobId, type],
    `/manager-dashboard/applicants/${jobId}?type=${type}`,
    true,
    { requiresAuth: true }
  );

  const applicants: Applicant[] = data?.applicants ?? [];
  const [applicantList, setApplicantList] = useState < Applicant[] > ([]);

  useEffect(() => {
    if (applicants.length) setApplicantList(applicants);
  }, [applicants]);

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (openActionDropdownId !== null) {
        const container = actionContainerRefs.current[openActionDropdownId];
        if (container && !container.contains(e.target as Node)) {
          setOpenActionDropdownId(null);
        }
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [openActionDropdownId]);

  const handleStatusChange = (
    applicantId: string,
    newStatus: Applicant["status"]
  ) => {
    setApplicantList((prev) =>
      prev.map((app) =>
        app.id === applicantId ? { ...app, status: newStatus } : app
      )
    );
    setOpenActionDropdownId(null);
  };

  const handleRemove = (applicantId: string) => {
    setApplicantList((prev) => prev.filter((p) => p.id !== applicantId));
    setOpenActionDropdownId(null);
  };

  const filteredApplicants = applicantList.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );
  const getColor = (name: string) => {
    const colors = [
      "bg-red-400",
      "bg-blue-400",
      "bg-green-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-yellow-400",
      "bg-indigo-400",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  const tabs = ["Applicants", "Job Details", "Updates", "Chat"];

  if (isLoading) return <div className="p-6">Loading applicants...</div>;
  if (error)
    return <div className="p-6 text-red-500">Failed to load applicants</div>;

  return (
    <div className="p-6  min-h-screen">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-[16px] font-inter ${activeTab === tab
                ? "border-[#019ACB] text-[#141414]"
                : "border-transparent text-[#8E8E93] hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "Applicants" && (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-[20px] font-epilogue font-bold text-gray-900">
              Total Applicants :{" "}
              <span className="font-normal text-gray-600">
                {applicantList.length}
              </span>
            </h1>

            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  className="pl-10 pr-4 py-2 text-sm w-64 bg-white"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="border border-gray-200  px-4 py-2 flex items-center gap-2 bg-white shadow-sm text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Applicants Table */}
          <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-gray-600 h-[60px] text-center text-[#141414]">
                    <th className="px-6 py-3 font-medium text-[16px] font-inter">
                      Full Name
                    </th>
                    <th className="px-6 py-3 font-medium text-[16px] font-inter">
                      Rating
                    </th>
                    <th className="px-6 py-3 font-medium text-[16px] font-inter">
                      Teacher Budget
                    </th>
                    <th className="px-6 py-3 font-medium text-[16px] font-inter">
                      Teacher Deadline
                    </th>
                    <th className="px-6 py-3 font-medium text-[16px] font-inter">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 font-medium text-[16px] font-inter">
                      Selection status
                    </th>
                    <th className="px-6 py-3 font-medium text-[16px] font-inter">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 text-center">
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          {app.avatar ? (<img
                            src={app.avatar}
                            alt={app.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />) : (<div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 ${getColor(
                              app.name
                            )}`}
                          >
                            {app.name.charAt(0).toUpperCase()}
                          </div>)}

                          <div className="ml-3 text-[16px] font-inter font-medium text-gray-900">
                            {app.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[16px] font-inter">{app.rating}</td>
                      <td className="px-6 py-4 text-[16px] font-inter">{app.budget}</td>
                      <td className="px-6 py-4 text-[16px] font-inter">{app.deadline}</td>
                      <td className="px-6 py-4 text-[16px] font-inter">{app.applied}</td>
                      <td className="px-6 py-4 text-[16px] font-inter">
                        <span
                          className={`px-4 py-2 border rounded-full ${statusColors[app.status]}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 relative"
                        ref={(el) => (actionContainerRefs.current[app.id] = el)}
                      >
                        <button
                          onClick={() =>
                            setOpenActionDropdownId(
                              openActionDropdownId === app.id ? null : app.id
                            )
                          }
                          className="p-2 rounded-lg hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>

                        {openActionDropdownId === app.id && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                              onClick={() =>
                                handleStatusChange(app.id, "Good Fit")
                              }
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                            >
                              <img
                                src={GoodIcon}
                                alt="Good Fit"
                                className="w-4 h-4"
                              />
                              Mark Good Fit
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(app.id, "Rejected")
                              }
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                            >
                              <img
                                src={RejectIcon}
                                alt="Reject"
                                className="w-4 h-4"
                              />
                              Reject
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(app.id, "Finalized")
                              }
                              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 w-full"
                            >
                              <img
                                src={FinalizeIcon}
                                alt="Finalize"
                                className="w-4 h-4"
                              />
                              Finalize
                            </button>
                            <hr />
                            <button
                              onClick={() => handleRemove(app.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredApplicants.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No applicants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "Job Details" && (
        <div className="text-gray-600"><JobDetailsPage /></div>
      )}

      {activeTab === "Updates" && <Updates />}
      {activeTab === "Chat" && <StudentDocuments />}
    </div>
  );
};

export default JobApplicants;
