import React from "react";
import { Pencil, User } from "lucide-react";
import { ManagerEditIcon } from "../../assets/managers";

interface NegotiationSectionProps {
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

export default function NegotiationSection({
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
}: NegotiationSectionProps) {
    return (
        <section className="bg-white shadow-sm border border-gray-100 p-6 max-h-fit">
            <h2 className="text-lg font-semibold mb-4">Negotiations Details</h2>

            <div className="flex items-center justify-between my-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">CA</span>
                    </div>
                    <div>
                        <h3 className="font-semibold">{primaryTeacher?.name || "Charles Agley"}</h3>
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
                {/* Teacher Price */}
                <div className="border-r border-gray-200">
                    <div className="flex items-start justify-between px-3 py-2">
                        <div>
                            <span className="text-2xl font-bold">
                                {primaryTeacher?.price ?? "$25"}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">Teacher Price</p>
                        </div>
                        <button
                            onClick={() => onOpenEditModal(
                                "teacher",
                                (primaryTeacher?.price || "").toString().replace(/[^\d.]/g, "") ?? "25"
                            )}
                            className="p-1  hover:bg-gray-50 self-start"
                        >
                            <img src={ManagerEditIcon} className="w-[18px] h-[18px]" />

                        </button>
                    </div>
                </div>

                {/* Student Price */}
                <div className="border-r border-gray-200">
                    <div className="flex items-start justify-between px-3 py-2">
                        <div>
                            <span className="text-2xl font-bold">
                                {primaryTeacher?.total ?? "$25"}
                            </span>
                            <p className="text-sm text-gray-500 mt-1">Student Price</p>
                        </div>
                        <button
                            onClick={() => onOpenEditModal(
                                "student",
                                (primaryTeacher?.total || "").toString().replace(/[^\d.]/g, "") ?? "25"
                            )}
                            className="p-1  hover:bg-gray-50 self-start"
                        >
                            <img src={ManagerEditIcon} className="w-[18px] h-[18px]" />
                        </button>
                    </div>
                </div>

                {/* Profit */}
                <div>
                    <div className="flex items-start justify-between px-3 py-2">
                        <div>
                            <span className="text-2xl font-bold text-cyan-600">$10 (5%)</span>
                            <p className="text-sm text-gray-500 mt-1">Profit</p>
                        </div>
                        <button
                            onClick={() => onOpenEditModal("profit", "10")}
                            className="p-1  hover:bg-gray-50 self-start"
                        >
                            <img src={ManagerEditIcon} className="w-[18px] h-[18px]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Price Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                    <label className="block text-[16px] font-medium text-gray-700 mb-2">
                        Enter price and send to Teacher
                    </label>
                    <input
                        value={priceToTeacher}
                        onChange={(e) => onPriceToTeacherChange(e.target.value)}
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
                        onChange={(e) => onPriceToStudentChange(e.target.value)}
                        placeholder="Enter price"
                        className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                </div>
            </div>

            {/* Send To & Action Buttons */}
            <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-6">
                    <span className="text-[20px] font-medium">Send to:</span>
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

                <div className="flex items-center gap-3">
                    <button
                        className="px-4 py-2 border border-gray-200 text-sm hover:bg-gray-50"
                        onClick={() => {
                            const id = primaryTeacher?.id ?? null;
                            if (!id) return alert("No applicant selected to reject");
                            onReject(id);
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
                            onSendOffer(id, sendTo, price, primaryTeacher?.name);
                        }}
                    >
                        Send Offer
                    </button>
                </div>
            </div>
        </section>
    );
}
