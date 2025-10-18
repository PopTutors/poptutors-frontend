import React from "react";
import { User } from "lucide-react";

interface MobileNegotiationViewProps {
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
}

export default function MobileNegotiationView({
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
}: MobileNegotiationViewProps) {
    return (
        <div className="space-y-6">
            <section className="bg-white shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-semibold mb-4">Negotiations Details</h2>

                <div className="flex items-center justify-between my-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">CA</span>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">{primaryTeacher?.name || "Charles Agley"}</h3>
                            <p className="text-xs text-gray-500">Education Specialist</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-1 border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-700 hover:bg-gray-50">
                        <User className="w-3 h-3" />
                        View
                    </button>
                </div>

                <div className="border-b my-4" />

                {/* Price Grid - Stacked */}
                <div className="grid grid-cols-1 gap-4 mt-4">
                    <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xl font-bold">
                                    {primaryTeacher?.price ?? "$25"}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">Teacher Price</p>
                            </div>
                            <button
                                onClick={() => onOpenEditModal(
                                    "teacher",
                                    (primaryTeacher?.price || "").toString().replace(/[^\d.]/g, "") ?? "25"
                                )}
                                className="p-1 rounded-md border border-gray-100 hover:bg-gray-50"
                            >
                                ✏️
                            </button>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xl font-bold">
                                    {primaryTeacher?.total ?? "$25"}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">Student Price</p>
                            </div>
                            <button
                                onClick={() => onOpenEditModal(
                                    "student",
                                    (primaryTeacher?.total || "").toString().replace(/[^\d.]/g, "") ?? "25"
                                )}
                                className="p-1 rounded-md border border-gray-100 hover:bg-gray-50"
                            >
                                ✏️
                            </button>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xl font-bold text-cyan-600">$10 (5%)</span>
                                <p className="text-xs text-gray-500 mt-1">Profit</p>
                            </div>
                            <button
                                onClick={() => onOpenEditModal("profit", "10")}
                                className="p-1 rounded-md border border-gray-100 hover:bg-gray-50"
                            >
                                ✏️
                            </button>
                        </div>
                    </div>
                </div>

                {/* Price Inputs */}
                <div className="space-y-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price to Teacher
                        </label>
                        <input
                            value={priceToTeacher}
                            onChange={(e) => onPriceToTeacherChange(e.target.value)}
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
                            onChange={(e) => onPriceToStudentChange(e.target.value)}
                            placeholder="Enter price"
                            className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                        />
                    </div>
                </div>

                {/* Send To Section */}
                <div className="mt-6">
                    <span className="text-sm font-medium block mb-3">Send to:</span>
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="sendTo"
                                value="teacher"
                                checked={sendTo === "teacher"}
                                onChange={() => onSendToChange("teacher")}
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
                                onChange={() => onSendToChange("student")}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Student</span>
                        </label>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        className="flex-1 px-4 py-2 border border-gray-200 text-sm hover:bg-gray-50 rounded-md"
                        onClick={() => {
                            const id = primaryTeacher?.id ?? null;
                            if (!id) return alert("No applicant selected to reject");
                            onReject(id);
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
                            onSendOffer(id, sendTo, price, primaryTeacher?.name);
                        }}
                    >
                        Send Offer
                    </button>
                </div>
            </section>
        </div>
    );
}

