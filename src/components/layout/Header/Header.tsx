import React from "react";
import HeaderUserContent from "./HeaderUserContent";
import HeaderTeacherContent from "./HeaderTeacherContent";

interface HeaderProps {
    onSidebarToggle?: () => void;
    isOpen?: boolean;
}

const Header: React.FC<HeaderProps> = () => {
    let role = localStorage.getItem("role") ?? "student";
    role = role.toLowerCase();

    return role === 'student' ? <HeaderUserContent /> : <HeaderTeacherContent />;
};

export default Header;