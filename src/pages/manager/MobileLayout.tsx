import React from "react";
import MobileNegotiationView from "./MobileNegotiationView";
import MobileUpdatesView from "./MobileUpdatesView";
import MobileTeachersView from "./MobileTeachersView";

interface MobileLayoutProps {
    activeView: "negotiation" | "updates" | "teachers";
    jobId: string;
    jobType: string;
    updatesLoading: boolean;
    updates: any[];
    debouncedSearch: string;
    search: string;
    onSearchChange: (search: string) => void;
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
    onOpenDocsForTeacher: (id?: string) => void;
}

export default function MobileLayout({
    activeView,
    jobId,
    jobType,
    updatesLoading,
    updates,
    debouncedSearch,
    search,
    onSearchChange,
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
    onOpenDocsForTeacher,
}: MobileLayoutProps) {
    return (
        <>
            {activeView === "negotiation" && (
                <MobileNegotiationView
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
            )}
            {activeView === "updates" && (
                <MobileUpdatesView
                    updatesLoading={updatesLoading}
                    updates={updates}
                    debouncedSearch={debouncedSearch}
                    search={search}
                    onSearchChange={onSearchChange}
                />
            )}
            {activeView === "teachers" && (
                <MobileTeachersView
                    teachers={teachers}
                    teachersLoading={teachersLoading}
                    onOpenDocsForTeacher={onOpenDocsForTeacher}
                    onSendOffer={onSendOffer}
                    onReject={onReject}
                />
            )}
        </>
    );
}