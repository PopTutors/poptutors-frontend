import React from "react";
import { CheckCircle, FileText } from "lucide-react";
import { OpenIcon } from "../../assets/managers";

interface Teacher {
    id: string;
    name: string;
    location: string;
    type: string;
    price: string;
    total: string;
}

interface MobileTeachersViewProps {
    teachers: Teacher[];
    teachersLoading: boolean;
    onOpenDocsForTeacher: (id?: string) => void;
    onSendOffer: (applicantId: string | number, to: "teacher" | "student", price: number, teacherName?: string) => void;
    onReject: (applicantId: string | number) => void;
}

export default function MobileTeachersView({
    teachers,
    teachersLoading,
    onOpenDocsForTeacher,
    onSendOffer,
    onReject,
}: MobileTeachersViewProps) {
    const mockTeachers = Array.from({ length: 6 }).map((_, i) => ({
        id: `t${i}`,
        name: "Mona Lisa",
        location: "Paris, France",
        type: "Full-Time",
        price: "$10 (5%)",
        total: "$15",
    }));

    const teachersList = teachersLoading ? mockTeachers : teachers ?? [];

    return (
        <div className="space-y-6">
            <section className="bg-white shadow-sm border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Teachers</h2>
                    <button className="text-cyan-600 text-sm">View all</button>
                </div>

                <div className="space-y-3">
                    {teachersList.map((t: Teacher) => (
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
                                    onClick={() => onOpenDocsForTeacher(t.id)}
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
                                            onSendOffer(
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
                                        onClick={() => onReject(t.id)}
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

            {/* Stats */}
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
                        <button onClick={() => onOpenDocsForTeacher(undefined)}>
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
                        <button onClick={() => onOpenDocsForTeacher(undefined)}>
                            <img src={OpenIcon} alt="Open" className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}