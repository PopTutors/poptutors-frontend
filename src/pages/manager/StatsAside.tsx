import React from "react";
import { CheckCircle, FileText } from "lucide-react";
import { OpenIcon } from "../../assets/managers";

interface StatsAsideProps {
    onOpenDocsForTeacher: (id?: string) => void;
}

export default function StatsAside({ onOpenDocsForTeacher }: StatsAsideProps) {
    return (
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
                <button onClick={() => onOpenDocsForTeacher(undefined)} className="cursor-pointer">
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
                <button onClick={() => onOpenDocsForTeacher(undefined)} className="cursor-pointer">
                    <img src={OpenIcon} alt="Open documents" />
                </button>
            </div>
        </aside>
    );
}