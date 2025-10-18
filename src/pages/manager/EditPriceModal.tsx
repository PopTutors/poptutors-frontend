import React from "react";
import { X as XIcon } from "lucide-react";

interface EditPriceModalProps {
    isOpen: boolean;
    target: "teacher" | "student" | "profit";
    value: string;
    onValueChange: (value: string) => void;
    onClose: () => void;
    onSave: () => void;
}

export default function EditPriceModal({
    isOpen,
    target,
    value,
    onValueChange,
    onClose,
    onSave,
}: EditPriceModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Edit {target}</h3>
                    <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">Value (number)</label>
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => onValueChange(e.target.value)}
                        className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-[#019ACB] text-white rounded-md"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
