import React from "react";
import { OpenIcon } from "../../assets/managers";

interface Teacher {
    id: string;
    name: string;
    location: string;
    type: string;
    price: string;
    total: string;
}

interface TeachersAsideProps {
    teachers: Teacher[];
    teachersLoading: boolean;
    onOpenDocsForTeacher: (id?: string) => void;
    onSendOffer: (applicantId: string | number, to: "teacher" | "student", price: number, teacherName?: string) => void;
    onReject: (applicantId: string | number) => void;
}

export default function TeachersAside({
    teachers,
    teachersLoading,
    onOpenDocsForTeacher,
    onSendOffer,
    onReject,
}: TeachersAsideProps) {
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
        <aside className="bg-white shadow-sm border border-gray-100 p-6 max-h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Teachers</h3>
                <button className="text-cyan-600 text-sm">View all</button>
            </div>

            <div className="space-y-3">
                {teachersList.map((t: Teacher) => (
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
                                onClick={() => onOpenDocsForTeacher(t.id)}
                                className="ml-2 p-1 rounded hover:bg-gray-100"
                                title="Open documents"
                            >
                                <img src={OpenIcon} alt="Open" />
                            </button>
                            <div className="flex flex-col ml-2">
                                <button
                                    onClick={() =>
                                        onSendOffer(
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
                                    onClick={() => onReject(t.id)}
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
    );
}