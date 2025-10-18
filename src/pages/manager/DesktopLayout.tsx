import React from "react";
import NegotiationSection from "./NegotiationSection";
import RecentUpdatesSection from "./RecentUpdatesSection";
import TeachersAside from "./TeachersAside";
import StatsAside from "./StatsAside";
import StudentDocuments from "./StudentDocuments";

interface DesktopLayoutProps {
    activeLeftView: "Negotiation" | "Documents";
    jobId: string;
    jobType: string;
    updatesLoading: boolean;
    updates: any[];
    debouncedSearch: string;
    search: string;
    onSearchChange: (search: string) => void;
    onBackToUpdates: () => void;
    onOpenDocsForTeacher: (id?: string) => void;
    selectedTeacherId: string | null;
    primaryTeacher: any;
    onOpenEditModal: (target: "teacher" | "student" | "profit", initial: string) => void;
    priceToTeacher: string;
    onPriceToTeacherChange: (price: string) => void;
    priceToStudent: string;
    onPriceToStudentChange: (price: string) => void;
    sendTo: "teacher" | "student";
    onSendToChange: (sendTo: "teacher" | "student") => void;
    onReject: (applicantId: string | number) => void;
    onSendOffer: (applicantId: string | number, to: "teacher" | "student", price: number, teacherName?: string) => void;
    teachers: any[];
    teachersLoading: boolean;
}

export default function DesktopLayout({
    activeLeftView,
    jobId,
    jobType,
    updatesLoading,
    updates,
    debouncedSearch,
    search,
    onSearchChange,
    onBackToUpdates,
    onOpenDocsForTeacher,
    selectedTeacherId,
    primaryTeacher,
    onOpenEditModal,
    priceToTeacher,
    onPriceToTeacherChange,
    priceToStudent,
    onPriceToStudentChange,
    sendTo,
    onSendToChange,
    onReject,
    onSendOffer,
    teachers,
    teachersLoading,
}: DesktopLayoutProps) {
    return (
        <>
            {/* Left column: Negotiation Details OR Documents */}
            <div className="flex flex-col gap-6 lg:col-span-2">
                {activeLeftView === "Negotiation" ? (
                    <>
                        <NegotiationSection
                            primaryTeacher={primaryTeacher}
                            onOpenEditModal={onOpenEditModal}
                            priceToTeacher={priceToTeacher}
                            onPriceToTeacherChange={onPriceToTeacherChange}
                            priceToStudent={priceToStudent}
                            onPriceToStudentChange={onPriceToStudentChange}
                            sendTo={sendTo}
                            onSendToChange={onSendToChange}
                            onReject={onReject}
                            onSendOffer={onSendOffer}
                        />
                        <RecentUpdatesSection
                            updatesLoading={updatesLoading}
                            updates={updates}
                            debouncedSearch={debouncedSearch}
                            search={search}
                            onSearchChange={onSearchChange}
                        />
                    </>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Student Documents</h2>
                            <button
                                onClick={onBackToUpdates}
                                className="px-3 py-1 border rounded-md hover:bg-gray-50"
                            >
                                Back
                            </button>
                        </div>
                        <StudentDocuments jobId={jobId} type={jobType} teacherId={selectedTeacherId ?? undefined} />
                    </div>
                )}
            </div>

            {/* Right column: Teachers + Stats */}
            <div className="flex flex-col gap-6 lg:col-span-1">
                <TeachersAside
                    teachers={teachers}
                    teachersLoading={teachersLoading}
                    onOpenDocsForTeacher={onOpenDocsForTeacher}
                    onSendOffer={onSendOffer}
                    onReject={onReject}
                />
                <StatsAside onOpenDocsForTeacher={onOpenDocsForTeacher} />
            </div>
        </>
    );
}
