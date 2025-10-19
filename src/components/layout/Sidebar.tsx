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
  FolderSearchIcon,
  FileTextIcon,
  Filecon,
  BookTextIcon,
  CircleDollarIcon,
  SettingsIcon,
  HelpCenterIcon
} from '../../assets/sidebar-icon';
import { paths } from '../../config/path';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  console.log('userprofile : ', localStorage.getItem('userprofile'))
  const user = localStorage.getItem('userprofile') ? JSON.parse(localStorage.getItem('userprofile') || '{}') : {};
  const name = user.name || 'user';
  const email = user.email || 'email'
  const role = localStorage.getItem('role') || 'student';
  const navigate = useNavigate();

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
      path: paths.teacher.dashboard.getHref(),
    },
    {
      label: 'My Exam',
      icon: Filecon,
      iconActive: DashboardIconActive,
      path: paths.teacher.examHelpList.getHref()
    },
    {
      label: 'My Assignment',
      icon: FileTextIcon,
      iconActive: DashboardIconActive,
      path: paths.teacher.assignmentList.getHref(),
    },
    {
      label: 'Job Listing',
      icon: FolderSearchIcon,
      iconActive: DashboardIconActive,
      path: paths.teacher.jobListing.getHref(),
    },
    {
      label: 'My Sessions',
      icon: BookTextIcon,
      iconActive: DashboardIconActive,
      path: paths.teacher.sessionList.getHref(),
    },
    {
      label: 'Earnings',
      icon: CircleDollarIcon,
      iconActive: DashboardIconActive,
    },
  ];

  const teacherProfileNavigationTabs = [
    {
      label: 'Settings',
      icon: SettingsIcon,
      iconActive: DashboardIconActive,
      path: paths.teacher.settings.getHref(),
    },
    {
      label: 'Help Center',
      icon: HelpCenterIcon,
      iconActive: DashboardIconActive
    },
  ];

  const sidebarTabs = role === 'student' ? studentNavigationTabs : teacherNavigationTabs;

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white w-[256px] border-r shadow-md overflow-y-auto transform transition-transform duration-300
  ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block flex flex-col`}
      >
        {/* Main navigation takes all remaining space */}
        <nav className="mt-6 px-4 space-y-2 flex-1">
          {sidebarTabs.map((tab) => {
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

        {/* Settings + User Profile always at bottom */}
        {role === 'teacher' && (
          <div className="px-4 flex flex-col mt-10">
            <div className="space-y-1">
              <p className="text-gray-500 text-md font-semibold uppercase mb-2">Settings</p>
              {teacherProfileNavigationTabs.map((tab) => {
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

              {/* Logout button styled like tabs */}
              <div
                onClick={() => {
                  localStorage.clear();
                  navigate('/login'); // your login path
                }}
                className="flex items-center ml-3 gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer mt-1"
              >
                {/* Icon */}
                <LogOut className="w-5 h-5 text-red-600" />

                {/* Label */}
                <span className="text-lg font-medium text-red-600">Logout</span>
              </div>
            </div>

            {/* Teacher User Profile at bottom */}
            <div
              onClick={() => {
                navigate(paths.teacher.profile.getHref());
              }}
              className="mt-32 flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src="https://randomuser.me/api/portraits/men/12.jpg"
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-[10px] truncate">
                <span className="font-medium text-black truncate">{name}</span>
                <span className="text-gray-500 truncate">{email}</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
