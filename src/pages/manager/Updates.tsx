// src/pages/manager/Updates.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../api";
import { useGenericMutation } from "../../api/useGenericMutation";

import MobileHeader from "./MobileHeader";
import MobileNavTabs from "./MobileNavTabs";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "./MobileLayout";
import EditPriceModal from "./EditPriceModal";

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
  const params = useParams();
  const jobId = params.id || "";
  const jobType = "assignment";

  // Form state
  const [sendTo, setSendTo] = useState < "teacher" | "student" > ("teacher");
  const [priceToTeacher, setPriceToTeacher] = useState("");
  const [priceToStudent, setPriceToStudent] = useState("");
  const [search, setSearch] = useState("");

  // Mobile UI state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState < "negotiation" | "updates" | "teachers" > ("negotiation");

  // Search debounce
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // View switching state
  const [activeLeftView, setActiveLeftView] = useState < "Negotiation" | "Documents" > ("Negotiation");
  const [selectedTeacherId, setSelectedTeacherId] = useState < string | null > (null);

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState < "teacher" | "student" | "profit" > ("teacher");
  const [editValue, setEditValue] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch data
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

  const { mutate } = useGenericMutation();

  const refreshLists = useCallback(() => {
    if (refetchUpdates) refetchUpdates();
    if (refetchTeachers) refetchTeachers();
  }, [refetchUpdates, refetchTeachers]);

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
        onSuccessCallback: () => refreshLists(),
        onErrorCallback: (err) => console.error("Send offer failed", err),
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
        onSuccessCallback: () => refreshLists(),
      });
    },
    [jobId, jobType, mutate, refreshLists]
  );

  const openDocsForTeacher = (id?: string) => {
    setSelectedTeacherId(id ?? null);
    setActiveLeftView("Documents");
  };

  const openEditModal = (target: "teacher" | "student" | "profit", initial: string) => {
    setEditTarget(target);
    setEditValue(initial ?? "");
    setIsEditOpen(true);
  };

  const saveEdit = async () => {
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

    try {
      await mutate({
        endpoint: "/updates/job/price-update",
        method: "POST",
        data: { jobId, type: jobType, target: editTarget, value: parsed },
        requiresAuth: true,
        successMessage: "Price updated",
        errorMessage: "Failed to update price",
        invalidateKeys: [
          ["jobTeachers", jobId, jobType],
          ["updates", jobId, jobType],
        ],
        onSuccessCallback: () => refreshLists(),
      });
    } catch (err) {
      console.error("Price update failed", err);
    } finally {
      setIsEditOpen(false);
    }
  };

  const backToUpdates = () => {
    setActiveLeftView("Negotiation");
    setSelectedTeacherId(null);
  };

  const primaryTeacher = useMemo(() => teachers?.[0] ?? null, [teachers]);

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} />
      <MobileNavTabs activeView={activeView} onViewChange={setActiveView} />

      <div className="p-4 lg:p-6">
        <div className="mx-auto">
          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            <DesktopLayout
              activeLeftView={activeLeftView}
              jobId={jobId}
              jobType={jobType}
              updatesLoading={updatesLoading}
              updates={updates}
              debouncedSearch={debouncedSearch}
              search={search}
              onSearchChange={setSearch}
              onBackToUpdates={backToUpdates}
              onOpenDocsForTeacher={openDocsForTeacher}
              selectedTeacherId={selectedTeacherId}
              primaryTeacher={primaryTeacher}
              onOpenEditModal={openEditModal}
              priceToTeacher={priceToTeacher}
              onPriceToTeacherChange={setPriceToTeacher}
              priceToStudent={priceToStudent}
              onPriceToStudentChange={setPriceToStudent}
              sendTo={sendTo}
              onSendToChange={setSendTo}
              onReject={confirmAndReject}
              onSendOffer={sendOffer}
              teachers={teachers}
              teachersLoading={teachersLoading}
            />
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <MobileLayout
              activeView={activeView}
              jobId={jobId}
              jobType={jobType}
              updatesLoading={updatesLoading}
              updates={updates}
              debouncedSearch={debouncedSearch}
              search={search}
              onSearchChange={setSearch}
              primaryTeacher={primaryTeacher}
              onOpenEditModal={openEditModal}
              priceToTeacher={priceToTeacher}
              onPriceToTeacherChange={setPriceToTeacher}
              priceToStudent={priceToStudent}
              onPriceToStudentChange={setPriceToStudent}
              sendTo={sendTo}
              onSendToChange={setSendTo}
              onReject={confirmAndReject}
              onSendOffer={sendOffer}
              teachers={teachers}
              teachersLoading={teachersLoading}
              onOpenDocsForTeacher={openDocsForTeacher}
            />
          </div>
        </div>
      </div>

      <EditPriceModal
        isOpen={isEditOpen}
        target={editTarget}
        value={editValue}
        onValueChange={setEditValue}
        onClose={() => setIsEditOpen(false)}
        onSave={saveEdit}
      />
    </div>
  );
}