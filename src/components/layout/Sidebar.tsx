// components/layout/Sidebar.tsx
import React from 'react';
import SidebarTab from '../../components/ui/sidebarTab';
import {
  AssignmentIcon,
  WalletIcon,
  DashboardIcon,
  HelpIcon,
  LiveQuestionsIcon,
  SessionsIcon,
  DashboardIconActive,
  LiveQuestionsIconActive,
  AssignmentIconActive,
  HelpIconActive,
  WalletIconActive,
  SessionsIconActive,
} from '../../assets/sidebar-icon';
import { paths } from '../../config/path';
import { useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  // const role = localStorage.getItem('role');

  const studentNavigationTabs = [
    {
      label: 'Dashboard',
      icon: DashboardIcon,
      iconActive: DashboardIconActive,
      path: paths.student.home.getHref(),
    },
    {
      label: 'Assignment',
      icon: AssignmentIcon,
      iconActive: AssignmentIconActive,
      path: paths.student.assignment.getHref(),
    },
    {
      label: 'Live Question',
      icon: LiveQuestionsIcon,
      iconActive: LiveQuestionsIconActive,
      path: paths.student.livequestion.getHref(),
    },
    {
      label: 'Sessions',
      icon: SessionsIcon,
      iconActive: SessionsIconActive,
      path: paths.student.session.getHref(),
    },
    {
      label: 'Wallet',
      icon: WalletIcon,
      iconActive: WalletIconActive,
      path: paths.student.wallet.getHref(),
    },
    {
      label: 'Help & Support',
      icon: HelpIcon,
      iconActive: HelpIconActive,
      path: '/help-support'
    },
  ];

  const teacherNavigationTabs = [
    {
      label: 'Dashboard',
      icon: DashboardIcon,
      iconActive: DashboardIconActive,
      // path: paths.teacher.dashboard.getHref(),
    }
  ];

  // const sidebarTabs = local === 'teacher' ? teacherNavigationTabs : studentNavigationTabs;
  // const sidebarTabs = teacherNavigationTabs;
  const sidebarTabs = studentNavigationTabs;

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white w-[256px] border-r shadow-md overflow-y-auto transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}
      >
        <nav className="mt-6 px-4 space-y-2">
          {studentNavigationTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <SidebarTab
                key={tab.label}
                icon={tab.icon}
                iconActive={tab.iconActive}
                label={tab.label}
                active={isActive}
                redirectPath={tab.path}
              />
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
