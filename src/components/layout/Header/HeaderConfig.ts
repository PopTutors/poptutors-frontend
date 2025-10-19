// src/components/header/headerConfig.ts
export const HeaderConfig = {
    student: {
        showSearch: true,
        showNotifications: true,
        menuItems: [
            { label: "Profile", value: "Profile" },
            { label: "Logout", value: "Logout" }
        ],
    },
    teacher: {
        showSearch: true,
        showNotifications: true,
        menuItems: [
            { label: "Teacher Profile", value: "Teacher Profile" },
            { label: "Logout", value: "Logout" },
        ],
    },
    admin: {
        showSearch: false,
        showNotifications: false,
        menuItems: [
            { label: "Admin Panel", value: "AdminPanel" },
            { label: "Logout", value: "Logout" },
        ],
    },
};
