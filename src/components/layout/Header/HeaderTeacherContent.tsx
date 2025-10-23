import React from "react";
import { HeaderConfig } from "./HeaderConfig";
import MentoosLogo from "../../../assets/Mentoos_logo.png";
import NotificationIcon from "../../../assets/notification.svg";
import Line from "../../../assets/line.png";
import { PlusIcon } from 'lucide-react'

const HeaderTeacherContent: React.FC = () => {
    const name = localStorage.getItem("name");
    console.log('name : ', name)
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
                Dashboard
            </div>

            <div className="flex items-center gap-4">
                {config.showNotifications && (
                    <img src={NotificationIcon} alt="Notification" className="w-5 h-5" />
                )}
                <button className="flex items-center gap-2 text-white bg-[#019ACB] px-4 py-2">
                    <PlusIcon size={20} /> Post a Job
                </button>
            </div>
        </header>
    );
}

export default HeaderTeacherContent;