import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const AssignmentSelect: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative w-64">
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left bg-white border border-gray-200 rounded-xl shadow-sm p-2 hover:border-gray-300 focus:outline-none transition-all"
            >
                <div className='flex items-center justify-between '>
                    <div>
                        <p className="text-xs text-gray-500">Request New</p>
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-800">Assignment</span>
                        </div>
                    </div>
                    <ChevronDown className=" w-5 text-gray-600" />
                </div>
            </button>

            {open && (
                <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Assignment</li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Project</li>
                    <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Quiz</li>
                </ul>
            )}
        </div>
    );
};

export default AssignmentSelect;
