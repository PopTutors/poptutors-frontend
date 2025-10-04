// src/pages/manager/Updates.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  FileText,
  CheckCircle,
  User,
  Pencil,
  X as XIcon,
  Menu,
  ArrowLeft,
} from "lucide-react";
import { OpenIcon } from "../../assets/managers";
import StudentDocuments from "./StudentDocuments";
import { useFetch } from "../../api";
import { useGenericMutation } from "../../api/useGenericMutation";
import { Button } from "../../components/ui/button";
import { useParams } from "react-router-dom";

type Teacher = {
  id: string;
  name: string;
  location: string;
  type: string;
  price: string;
  total: string;
};

type Update = {
  id: string;
  teacher: string;
  location: string;
  type: string;
  actionTaker: string;
  action: string;
  actionColorClass: string;
  date: string;
  time: string;
};

export default function Updates(): JSX.Element {
  const params = useParams()
  const jobId = params.id || "";
  const jobType = "assignment";

  const [sendTo, setSendTo] = useState < "teacher" | "student" > ("teacher");
  const [priceToTeacher, setPriceToTeacher] = useState("");
  const [priceToStudent, setPriceToStudent] = useState("");
  const [search, setSearch] = useState("");

  // Mobile-specific states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState < "negotiation" | "updates" | "teachers" > ("negotiation");

  // debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // state to switch between Updates view and Documents view
  const [activeLeftView, setActiveLeftView] = useState < "Negotiation" | "Documents" > ("Negotiation");
  const [selectedTeacherId, setSelectedTeacherId] = useState < string | null > (null);

  // For editing price modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState < "teacher" | "student" | "profit" > ("teacher");
  const [editValue, setEditValue] = useState < string > ("");

  // debounce search (400ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // fetch updates & teachers
  const {
    data: updatesData,
    isLoading: updatesLoading,
    error: updatesError,
    refetch: refetchUpdates,
  } = useFetch(
    ["updates", jobId, jobType, debouncedSearch],
    `/updates/job/${jobId}/updates?type=${jobType}&search=${encodeURIComponent(debouncedSearch)}`,
    !!jobId,
    { requiresAuth: true }
  );

  const {
    data: teachersData,
    isLoading: teachersLoading,
    error: teachersError,
    refetch: refetchTeachers,
  } = useFetch(
    ["jobTeachers", jobId, jobType],
    `/updates/job/${jobId}/teachers?type=${jobType}`,
    !!jobId,
    { requiresAuth: true }
  );

  const updates: Update[] = Array.isArray(updatesData) ? updatesData : updatesData ?? [];
  const teachers: Teacher[] = Array.isArray(teachersData) ? teachersData : teachersData ?? [];

  // generic mutation hook
  const { mutate } = useGenericMutation();

  // helper to refetch both lists
  const refreshLists = useCallback(() => {
    if (refetchUpdates) refetchUpdates();
    if (refetchTeachers) refetchTeachers();
  }, [refetchUpdates, refetchTeachers]);

  // send offer implementation
  const sendOffer = useCallback(
    (applicantId: string | number, to: "teacher" | "student", price: number, teacherName?: string) => {
      if (!jobId) return alert("Missing job context");
      if (isNaN(price) || price <= 0) return alert("Enter a valid price");
      mutate({
        endpoint: "/updates/negotiation/send-offer",
        method: "POST",
        data: { jobId, type: jobType, applicantId, to, price, teacherName },
        requiresAuth: true,
        successMessage: "Offer sent",
        errorMessage: "Failed to send offer",
        invalidateKeys: [
          ["updates", jobId, jobType],
          ["jobTeachers", jobId, jobType],
        ],
        onSuccessCallback: () => {
          refreshLists();
        },
        onErrorCallback: (err) => {
          console.error("Send offer failed", err);
        },
      });
    },
    [jobId, jobType, mutate, refreshLists]
  );

  const confirmAndReject = useCallback(
    (applicantId: string | number) => {
      if (!jobId) return alert("Missing job context");
      const ok = window.confirm("Are you sure you want to reject this applicant?");
      if (!ok) return;
      mutate({
        endpoint: "/updates/negotiation/reject",
        method: "POST",
        data: { jobId, type: jobType, applicantId },
        requiresAuth: true,
        successMessage: "Applicant rejected",
        errorMessage: "Failed to reject",
        invalidateKeys: [
          ["updates", jobId, jobType],
          ["jobTeachers", jobId, jobType],
        ],
        onSuccessCallback: () => {
          refreshLists();
        },
      });
    },
    [jobId, jobType, mutate, refreshLists]
  );

  // open documents: set view to Documents and pass teacherId (optional)
  function openDocsForTeacher(id?: string) {
    setSelectedTeacherId(id ?? null);
    setActiveLeftView("Documents");
  }

  // edit flow: open modal with the current value
  function openEditModal(target: "teacher" | "student" | "profit", initial: string) {
    setEditTarget(target);
    setEditValue(initial ?? "");
    setIsEditOpen(true);
  }

  async function saveEdit() {
    if (!jobId) {
      alert("Job context missing");
      setIsEditOpen(false);
      return;
    }

    const parsed = Number(editValue);
    if (isNaN(parsed) || parsed < 0) {
      alert("Please enter a valid non-negative number");
      return;
    }

    const payload = {
      jobId,
      type: jobType,
      target: editTarget,
      value: parsed,
    };

    try {
      await mutate({
        endpoint: "/updates/job/price-update",
        method: "POST",
        data: payload,
        requiresAuth: true,
        successMessage: "Price updated",
        errorMessage: "Failed to update price",
        invalidateKeys: [
          ["jobTeachers", jobId, jobType],
          ["updates", jobId, jobType],
        ],
        onSuccessCallback: () => {
          refreshLists();
        },
      });
    } catch (err) {
      console.error("Price update failed", err);
    } finally {
      setIsEditOpen(false);
    }
  }

  // Back button for documents view to return to Updates
  function backToUpdates() {
    setActiveLeftView("Negotiation");
    setSelectedTeacherId(null);
  }

  // compute primary teacher (first) for negotiation UI convenience
  const primaryTeacher = useMemo(() => teachers?.[0] ?? null, [teachers]);

  // Mobile navigation tabs
  const mobileNavTabs = [
    { key: "negotiation", label: "Negotiation", icon: User },
    { key: "updates", label: "Updates", icon: FileText },
    { key: "teachers", label: "Teachers", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Updates</h1>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="flex">
          {mobileNavTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key as any)}
                className={`flex-1 py-3 px-2 text-center border-b-2 transition-colors ${activeView === tab.key
                  ? "border-[#019ACB] text-[#019ACB]"
                  : "border-transparent text-gray-500"
                  }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 lg:p-6">
        <div className="mx-auto">
          {/* Desktop Layout - Always visible on lg+ screens */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {/* Left column: Negotiation Details OR Documents */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {activeLeftView === "Negotiation" ? (
                <>
                  {/* Negotiation Details */}
                  <section className="bg-white shadow-sm border border-gray-100 p-6 max-h-fit">
                    <h2 className="text-lg font-semibold mb-4">Negotiations Details</h2>

                    <div className="flex items-center justify-between my-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">CA</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">Charles agley</h3>
                          <p className="text-sm text-gray-500">Education Specialist</p>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="w-4 h-4" />
                        View profile
                      </button>
                    </div>

                    <div className="border-b my-4" />

                    <div className="grid grid-cols-3 gap-6 mt-6">
                      {/* Teacher Price Block */}
                      <div className="border-r border-gray-200">
                        <div className="flex items-start justify-between px-3 py-2">
                          <div>
                            <span className="text-2xl font-bold">
                              {primaryTeacher?.price ?? "$25"}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">Teacher Price</p>
                          </div>
                          <button
                            onClick={() => openEditModal(
                              "teacher",
                              (primaryTeacher?.price || "").toString().replace(/[^\d.]/g, "") ?? "25"
                            )}
                            className="p-1 rounded-md border border-gray-100 hover:bg-gray-50 self-start"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Student Price Block */}
                      <div className="border-r border-gray-200">
                        <div className="flex items-start justify-between px-3 py-2">
                          <div>
                            <span className="text-2xl font-bold">
                              {primaryTeacher?.total ?? "$25"}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">Student Price</p>
                          </div>
                          <button
                            onClick={() => openEditModal(
                              "student",
                              (primaryTeacher?.total || "").toString().replace(/[^\d.]/g, "") ?? "25"
                            )}
                            className="p-1 rounded-md border border-gray-100 hover:bg-gray-50 self-start"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Profit Block */}
                      <div>
                        <div className="flex items-start justify-between px-3 py-2">
                          <div>
                            <span className="text-2xl font-bold text-cyan-600">$10 (5%)</span>
                            <p className="text-sm text-gray-500 mt-1">Profit</p>
                          </div>
                          <button
                            onClick={() => openEditModal("profit", "10")}
                            className="p-1 rounded-md border border-gray-100 hover:bg-gray-50 self-start"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <label className="block text-[16px] font-medium text-gray-700 mb-2">
                          Enter price and send to Teacher
                        </label>
                        <input
                          value={priceToTeacher}
                          onChange={(e) => setPriceToTeacher(e.target.value)}
                          placeholder="Enter price"
                          className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[16px] font-medium text-gray-700 mb-2">
                          Enter price and send to Student
                        </label>
                        <input
                          value={priceToStudent}
                          onChange={(e) => setPriceToStudent(e.target.value)}
                          placeholder="Enter price"
                          className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center space-x-6">
                        <span className="text-[20px] font-medium">Send to:</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="sendTo"
                            value="teacher"
                            checked={sendTo === "teacher"}
                            onChange={() => setSendTo("teacher")}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Teacher</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="sendTo"
                            value="student"
                            checked={sendTo === "student"}
                            onChange={() => setSendTo("student")}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">Student</span>
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          className="px-4 py-2 border border-gray-200 text-sm hover:bg-gray-50"
                          onClick={() => {
                            const id = primaryTeacher?.id ?? null;
                            if (!id) return alert("No applicant selected to reject");
                            confirmAndReject(id);
                          }}
                        >
                          Reject
                        </button>
                        <button
                          className="px-4 py-2 bg-[#019ACB] text-white text-sm"
                          onClick={() => {
                            const id = primaryTeacher?.id ?? "dummy";
                            const price =
                              sendTo === "teacher"
                                ? Number(priceToTeacher || 0)
                                : Number(priceToStudent || 0);
                            if (!price || price <= 0) return alert("Enter a valid price");
                            sendOffer(id, sendTo, price, primaryTeacher?.name);
                          }}
                        >
                          Send Offer
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Recent Updates */}
                  <section className="bg-white shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Recent Updates</h2>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="pl-10 pr-3 py-2 rounded-md border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                            aria-label="Search updates"
                          />
                        </div>
                        <button className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50">
                          <Filter className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left">Teacher</th>
                            <th className="px-6 py-3">Action Taker</th>
                            <th className="px-6 py-3">Action</th>
                            <th className="px-6 py-3">Date & Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {(updatesLoading ? [] : updates ?? [])
                            .filter((u: Update) =>
                              (u.teacher || "").toLowerCase().includes(debouncedSearch.toLowerCase())
                            )
                            .map((u: Update) => (
                              <tr
                                key={u.id}
                                className="hover:bg-gray-50 group cursor-pointer h-[80px] text-[16px] text-center text-[#141414]"
                              >
                                <td className="py-4 px-4 align-top text-left">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-left">
                                      <span className="text-xs text-gray-600">ML</span>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-left">{u.teacher}</p>
                                      <p className="text-xs text-gray-500 text-left">
                                        {u.location} • {u.type}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-4 text-sm align-top">{u.actionTaker}</td>
                                <td className="py-4 px-4 align-top">
                                  <span
                                    className={`${u.actionColorClass} inline-block px-3 py-1 text-xs rounded-full font-medium`}
                                  >
                                    {u.action}
                                  </span>
                                </td>
                                <td className="py-4 px-4 align-top text-sm">
                                  <div>
                                    <p>{u.date}</p>
                                    <p className="text-gray-500">{u.time}</p>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </>
              ) : (
                // Documents view
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Student Documents</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={backToUpdates}
                        className="px-3 py-1 border rounded-md hover:bg-gray-50"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                  <div>
                    <StudentDocuments
                      jobId={jobId}
                      type={jobType}
                      teacherId={selectedTeacherId ?? undefined}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right column: Teachers + Stats */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              <aside className="bg-white shadow-sm border border-gray-100 p-6 max-h-[500px] overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Teachers</h3>
                  <button className="text-cyan-600 text-sm">View all</button>
                </div>

                <div className="space-y-3">
                  {(teachersLoading
                    ? Array.from({ length: 6 }).map((_, i) => ({
                      id: `t${i}`,
                      name: "Mona Lisa",
                      location: "Paris, France",
                      type: "Full-Time",
                      price: "$10 (5%)",
                      total: "$15",
                    }))
                    : teachers ?? []
                  ).map((t: any) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between py-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-600">ML</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{t.name}</p>
                          <p className="text-xs text-gray-500">
                            {t.location} • {t.type}
                          </p>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div className="text-cyan-600 text-sm font-medium">{t.price}</div>
                        <div className="text-sm font-bold ml-1">{t.total}</div>
                        <button
                          onClick={() => openDocsForTeacher(t.id)}
                          className="ml-2 p-1 rounded hover:bg-gray-100"
                          title="Open documents"
                        >
                          <img src={OpenIcon} alt="Open" />
                        </button>
                        <div className="flex flex-col ml-2">
                          <button
                            onClick={() =>
                              sendOffer(
                                t.id,
                                "teacher",
                                Number((t.price || "0").toString().replace(/[^\d.]/g, "") || 0),
                                t.name
                              )
                            }
                            className="text-xs px-2 py-1 bg-blue-50 rounded"
                          >
                            Offer
                          </button>
                          <button
                            onClick={() => confirmAndReject(t.id)}
                            className="text-xs px-2 py-1 mt-1 text-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

              <aside className="space-y-4">
                <div className="bg-white shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded">
                      <CheckCircle className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">45</p>
                      <p className="text-sm text-[#8E8E93]">| Complete Submissions</p>
                    </div>
                  </div>
                  <button onClick={() => openDocsForTeacher(undefined)} className="cursor-pointer">
                    <img src={OpenIcon} alt="Open" />
                  </button>
                </div>

                <div className="bg-white shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">18</p>
                      <p className="text-sm text-[#8E8E93]">| Student Documents</p>
                    </div>
                  </div>
                  <button onClick={() => openDocsForTeacher(undefined)} className="cursor-pointer">
                    <img src={OpenIcon} alt="Open documents" />
                  </button>
                </div>
              </aside>
            </div>
          </div>

          {/* Mobile Layout - Only visible on mobile screens */}
          <div className="lg:hidden">
            {/* Mobile Negotiation View */}
            {activeView === "negotiation" && (
              <div className="space-y-6">
                {/* Mobile Negotiation Details */}
                <section className="bg-white shadow-sm border border-gray-100 p-4">
                  <h2 className="text-lg font-semibold mb-4">Negotiations Details</h2>

                  <div className="flex items-center justify-between my-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">CA</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">Charles agley</h3>
                        <p className="text-xs text-gray-500">Education Specialist</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-1 border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700 hover:bg-gray-50">
                      <User className="w-3 h-3" />
                      View
                    </button>
                  </div>

                  <div className="border-b my-4" />

                  {/* Mobile Price Grid - Stacked */}
                  <div className="grid grid-cols-1 gap-4 mt-4">
                    {/* Teacher Price Block */}
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold">
                            {primaryTeacher?.price ?? "$25"}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Teacher Price</p>
                        </div>
                        <button
                          onClick={() => openEditModal(
                            "teacher",
                            (primaryTeacher?.price || "").toString().replace(/[^\d.]/g, "") ?? "25"
                          )}
                          className="p-1 rounded-md border border-gray-100 hover:bg-gray-50"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Student Price Block */}
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold">
                            {primaryTeacher?.total ?? "$25"}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Student Price</p>
                        </div>
                        <button
                          onClick={() => openEditModal(
                            "student",
                            (primaryTeacher?.total || "").toString().replace(/[^\d.]/g, "") ?? "25"
                          )}
                          className="p-1 rounded-md border border-gray-100 hover:bg-gray-50"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Profit Block */}
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-cyan-600">$10 (5%)</span>
                          <p className="text-xs text-gray-500 mt-1">Profit</p>
                        </div>
                        <button
                          onClick={() => openEditModal("profit", "10")}
                          className="p-1 rounded-md border border-gray-100 hover:bg-gray-50"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Price Inputs */}
                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price to Teacher
                      </label>
                      <input
                        value={priceToTeacher}
                        onChange={(e) => setPriceToTeacher(e.target.value)}
                        placeholder="Enter price"
                        className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price to Student
                      </label>
                      <input
                        value={priceToStudent}
                        onChange={(e) => setPriceToStudent(e.target.value)}
                        placeholder="Enter price"
                        className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                      />
                    </div>
                  </div>

                  {/* Mobile Send To Section */}
                  <div className="mt-6">
                    <span className="text-sm font-medium block mb-3">Send to:</span>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sendTo"
                          value="teacher"
                          checked={sendTo === "teacher"}
                          onChange={() => setSendTo("teacher")}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Teacher</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="sendTo"
                          value="student"
                          checked={sendTo === "student"}
                          onChange={() => setSendTo("student")}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Student</span>
                      </label>
                    </div>
                  </div>

                  {/* Mobile Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      className="flex-1 px-4 py-2 border border-gray-200 text-sm hover:bg-gray-50 rounded-md"
                      onClick={() => {
                        const id = primaryTeacher?.id ?? null;
                        if (!id) return alert("No applicant selected to reject");
                        confirmAndReject(id);
                      }}
                    >
                      Reject
                    </button>
                    <button
                      className="flex-1 px-4 py-2 bg-[#019ACB] text-white text-sm rounded-md"
                      onClick={() => {
                        const id = primaryTeacher?.id ?? "dummy";
                        const price =
                          sendTo === "teacher"
                            ? Number(priceToTeacher || 0)
                            : Number(priceToStudent || 0);
                        if (!price || price <= 0) return alert("Enter a valid price");
                        sendOffer(id, sendTo, price, primaryTeacher?.name);
                      }}
                    >
                      Send Offer
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* Mobile Updates View */}
            {activeView === "updates" && (
              <div className="space-y-6">
                <section className="bg-white shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Updates</h2>
                    <button className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search updates..."
                      className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                      aria-label="Search updates"
                    />
                  </div>

                  {/* Mobile Updates List */}
                  <div className="space-y-3">
                    {(updatesLoading ? [] : updates ?? [])
                      .filter((u: Update) =>
                        (u.teacher || "").toLowerCase().includes(debouncedSearch.toLowerCase())
                      )
                      .map((u: Update) => (
                        <div
                          key={u.id}
                          className="border border-gray-200 rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-gray-600">ML</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{u.teacher}</p>
                              <p className="text-xs text-gray-500">
                                {u.location} • {u.type}
                              </p>
                            </div>
                          </div>
                          <div className="pl-11 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-600">Action by: {u.actionTaker}</span>
                              <span
                                className={`${u.actionColorClass} px-2 py-1 text-xs rounded-full font-medium`}
                              >
                                {u.action}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {u.date} • {u.time}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </section>
              </div>
            )}

            {/* Mobile Teachers View */}
            {activeView === "teachers" && (
              <div className="space-y-6">
                <section className="bg-white shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Teachers</h2>
                    <button className="text-cyan-600 text-sm">View all</button>
                  </div>

                  <div className="space-y-3">
                    {(teachersLoading
                      ? Array.from({ length: 6 }).map((_, i) => ({
                        id: `t${i}`,
                        name: "Mona Lisa",
                        location: "Paris, France",
                        type: "Full-Time",
                        price: "$10 (5%)",
                        total: "$15",
                      }))
                      : teachers ?? []
                    ).map((t: any) => (
                      <div
                        key={t.id}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <span className="text-sm text-gray-600">ML</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{t.name}</p>
                            <p className="text-xs text-gray-500">
                              {t.location} • {t.type}
                            </p>
                          </div>
                          <button
                            onClick={() => openDocsForTeacher(t.id)}
                            className="p-1 rounded hover:bg-gray-100"
                            title="Open documents"
                          >
                            <img src={OpenIcon} alt="Open" className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-cyan-600 text-sm font-medium">{t.price}</div>
                            <div className="text-sm font-bold">{t.total}</div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                sendOffer(
                                  t.id,
                                  "teacher",
                                  Number((t.price || "0").toString().replace(/[^\d.]/g, "") || 0),
                                  t.name
                                )
                              }
                              className="text-xs px-3 py-1 bg-blue-50 rounded-md text-blue-600"
                            >
                              Offer
                            </button>
                            <button
                              onClick={() => confirmAndReject(t.id)}
                              className="text-xs px-3 py-1 text-red-600 border border-red-200 rounded-md"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Mobile Stats */}
                <div className="space-y-4">
                  <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded">
                          <CheckCircle className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xl font-bold">45</p>
                          <p className="text-xs text-[#8E8E93]">Complete Submissions</p>
                        </div>
                      </div>
                      <button onClick={() => openDocsForTeacher(undefined)}>
                        <img src={OpenIcon} alt="Open" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded">
                          <FileText className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xl font-bold">18</p>
                          <p className="text-xs text-[#8E8E93]">Student Documents</p>
                        </div>
                      </div>
                      <button onClick={() => openDocsForTeacher(undefined)}>
                        <img src={OpenIcon} alt="Open" className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal - Responsive */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsEditOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit {editTarget}</h3>
              <button onClick={() => setIsEditOpen(false)} className="p-1 rounded hover:bg-gray-100">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Value (number)</label>
              <input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-[#019ACB] text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
