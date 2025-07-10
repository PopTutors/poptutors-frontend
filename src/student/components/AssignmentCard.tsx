import { FaPen, FaTrash, FaCopy } from "react-icons/fa";
import { Button } from "../../components/ui/button";

type AssignmentCardProps = {
    title: string;
    status: "Completed" | "Requested" | "Negotiate";
    price: number;
    milestone?: string;
    showIcons?: boolean;
};

const statusColors: Record<string, string> = {
    Completed: "bg-green-100 text-green-700",
    Requested: "bg-blue-100 text-blue-700",
    Negotiate: "bg-red-100 text-red-700",
};

export default function AssignmentCard({
    title,
    status,
    price,
    milestone,
    showIcons = true,
}: AssignmentCardProps) {
    return (
        <div className="bg-white shadow-sm rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex justify-between items-start">
                {/* Left Side */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-poppinsmedium text-[15px] text-gray-800">{title}</h3>
                        <span>
                            <Button variant="secondary" size="sm" className={statusColors[status]}>
                                {status}
                            </Button>
                        </span>
                        {showIcons && status === "Negotiate" && (
                            <div className="flex items-center gap-2 ml-2 text-gray-400 text-sm">
                                <FaPen className="hover:text-blue-500 cursor-pointer" />
                                <FaCopy className="hover:text-gray-600 cursor-pointer" />
                                <FaTrash className="hover:text-red-500 cursor-pointer" />
                            </div>
                        )}
                    </div>

                    <div className="text-sm font-poppinsregular text-gray-500 flex items-center gap-2">
                        <span>Topic Name</span>
                        {milestone && (
                            <a href="#" className="text-sky-500 text-xs hover:underline">
                                {milestone}
                            </a>
                        )}
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                        University Name &nbsp;&nbsp; Teacher Code : #56789
                    </p>
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-end gap-2">
                    <p className="text-sm font-semibold text-gray-400">${price}</p>
                    <div className="flex items-center justify-end mt-4">
                        <Button variant="outline_rounded">
                            <span>View Assignment</span>
                        </Button>
                    </div>
                </div>
            </div>


        </div>
    );
}
