import { User2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../ui/dropdown";
import { useNavigate } from "react-router-dom";

interface HeaderUserInfoProps {
    name: string;
    role: string;
    menuItems: { label: string; value: string }[];
}

const HeaderUserInfo: React.FC<HeaderUserInfoProps> = ({
    name,
    role,
    menuItems,
}) => {
    const navigate = useNavigate();

    const clearAllCookies = () => {
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
        });
    };

    const handleSelect = (item: string) => {
        if (item === "Logout") {
            localStorage.clear();
            sessionStorage.clear();
            clearAllCookies();
            navigate("/login", { replace: true });
        } else {
            navigate(`/${item.toLowerCase()}`);
        }
    };

    const today = new Date();
    const formattedDate = `${today.getDate()} ${today.toLocaleString("default", {
        month: "short",
    })}, ${today.toLocaleString("default", { weekday: "short" })}`;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
                        <User2 className="w-4 h-4 text-black" />
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                        <span className="text-[13px] font-medium text-black">{name}</span>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            {role}{" "}
                            <span className="w-1 h-1 bg-gray-400 rounded-full" /> {formattedDate}
                        </span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                {menuItems.map((item) => (
                    <DropdownMenuItem
                        key={item.value}
                        onSelect={() => handleSelect(item.value)}
                    >
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default HeaderUserInfo;
