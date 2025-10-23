import React from "react";
import { HeaderConfig } from "./HeaderConfig";
import MentoosLogo from "../../../assets/Mentoos_logo.png";
import NotificationIcon from "../../../assets/notification.svg";
import Line from "../../../assets/line.png";
import SearchInput from "../../ui/searchInput";
import HeaderUserInfo from "./HeaderUserInfo";

const HeaderUserContent: React.FC = () => {
    const name = localStorage.getItem("name") || "user";
    console.log('name : ', name)
    const role = localStorage.getItem("role") || "student";
    console.log('role : ', role)
    const config = HeaderConfig.student;

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm h-[75px] flex items-center px-4">
            <div className="flex items-center md:justify-center gap-1 w-[220px]">
                <button className="relative w-6 h-6 flex flex-col justify-between items-center p-[3px] z-50 lg:hidden">
                    <span
                        className="block h-0.5 w-full bg-black transform transition duration-300 ease-in-out rotate-45 translate-y-2" />
                    <span
                        className="block h-0.5 w-full bg-black transition-opacity duration-300 ease-in-out opacity-100"
                    />
                    <span
                        className="block h-0.5 w-full bg-black transform transition duration-300 ease-in-out" />
                </button>
                <img src={MentoosLogo} alt="Logo" />
            </div>

            <div className="flex-1 flex gap-4 items-center justify-start ml-4">
                <img src={Line} alt="" className="h-[26px]" />
                {config.showSearch && (
                    <div className="w-full max-w-md hidden md:block">
                        <SearchInput />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {config.showNotifications && (
                    <img src={NotificationIcon} alt="Notification" className="w-5 h-5" />
                )}
                <HeaderUserInfo name={name} role={role} menuItems={config.menuItems} />
            </div>
        </header>
    );
}

export default HeaderUserContent;