// components/layout/Sidebar.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  // Manager icons (replace with your actual SVG exports)
  ProfileIcon,
  HiringIcon,
  JobListingIcon,
  SessionManagerIcon,
  ExamIcon,
  FinanceIcon,
  HubManagerIcon,
} from '../../assets/sidebar-icon';
import { paths } from '../../config/path';
import { ManagerHelpIcon, ManagerLogOutIcon, ManagerMessagesIcon, ManageTeacher, MyDashboardIcon, MyProfileIcon, MySessionIcon, SettingsIcon } from '../../assets/managers';
import { useFetch } from '../../api';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: profile, isLoading, error, refetch } = useFetch(["profile"], `/profile`, true, {
    requiresAuth: true,
  });

  // Detect portal type from URL
  const isManager = location.pathname.startsWith('/manager');

  // Student tabs (unchanged behavior)
  const studentTabs = [
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
    { label: 'Help & Support', icon: HelpIcon, iconActive: HelpIconActive, path: '/help-support' },
  ];

  // Manager tabs (rendered in full-row style)
  const managerTabs = [
    { label: 'Dashboard', icon: MyDashboardIcon, path: paths.manager.dashboard.getHref() },
    { label: 'Messages', icon: ManagerMessagesIcon, path: paths.manager.messages.getHref() },
    { label: 'My Profile', icon: ProfileIcon, path: paths.manager.profile.getHref() },
    // { label: 'Hirings', icon: HiringIcon, path: paths.manager.hirings.getHref() },
    { label: 'Job Listing', icon: JobListingIcon, path: paths.manager.jobListing.getHref() },
    { label: 'My Session', icon: MySessionIcon, path: paths.manager.sessions.getHref() },
    { label: 'My Live Helps', icon: MyProfileIcon, path: paths.manager.exams.getHref() },
    { label: 'Finance', icon: FinanceIcon, path: paths.manager.finance.getHref() },
    // { label: 'Manager', icon: HubManagerIcon, path: paths.manager.hubManager.getHref() },
    { label: 'Manage Teacher', icon: ManageTeacher, path: paths.manager.teacher.getHref() },
  ];
  const clearAllCookies = () => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
  };
  const handleSelect = (item: string) => {
    if (item === 'Logout') {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      clearAllCookies();

      // Redirect to login page
      navigate('/login', { replace: true });
    } else {
      console.log('Selected:', item);
    }
  };
  const sidebarTabs = isManager ? managerTabs : studentTabs;

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white w-[256px] border-r shadow-md overflow-y-auto transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}
      >

        {/* STUDENT: original compact tab style (uses SidebarTab component) */}
        {!isManager && (
          <nav className="mt-6 px-4 space-y-2">
            {sidebarTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <SidebarTab
                  key={tab.label}
                  icon={tab.icon}
                  label={tab.label}
                  active={isActive}
                  redirectPath={tab.path}
                />
              );
            })}
          </nav>
        )}

        {/* MANAGER: full-row style with sections, logout, and bottom profile */}
        {isManager && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <nav className="mt-3 px-2">
                {sidebarTabs.map((tab) => {
                  const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path);
                  return (
                    <button
                      key={tab.label}
                      onClick={() => navigate(tab.path)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition
                        ${isActive ? 'bg-[#e9f5fb] text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      {/* Icon (SVG component) */}
                      <span className="w-5 h-5 flex-shrink-0">
                        {/* @ts-ignore - icon is an SVG React component */}
                        <img src={tab.icon} />
                      </span>

                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Settings + Help in a separate "Settings" block */}
              <div className="mt-6 px-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Settings</div>

                <button
                  onClick={() => navigate('/manager/settings')}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-700 hover:bg-slate-50`}
                >
                  <span className="w-5 h-5 flex-shrink-0">
                    {/* @ts-ignore */}
                    <img src={SettingsIcon} />

                  </span>
                  <span className="text-sm font-medium">Settings</span>
                </button>

                <button
                  onClick={() => navigate('/help-center')}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition text-slate-700 hover:bg-slate-50 mt-2"
                >
                  <span className="w-5 h-5 flex-shrink-0">
                    {/* @ts-ignore */}
                    <img src={ManagerHelpIcon} />
                  </span>
                  <span className="text-sm font-medium">Help Center</span>
                </button>
              </div>

              {/* Logout dotted box */}
              <div className="px-4 mt-5">
                <button
                  onClick={() => {
                    // call your logout logic here (navigate to logout or call context)
                    // example:
                    handleSelect('Logout');
                  }}
                  className="w-full flex items-center justify-start gap-3 px-4 py-3 text-red"
                >
                  <span className="w-5 h-5 flex-shrink-0">
                    {/* @ts-ignore */}
                    <img src={ManagerLogOutIcon} />
                  </span>
                  <span className="text-sm font-medium text-red">Log out</span>
                </button>
              </div>
            </div>

            {/* Bottom profile area */}
            <div className="px-4 pb-6 mt-6">
              <div
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate('/manager/profile')}
              >
                <img
                  src={profile?.profileImage}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">{profile?.userId?.name || "No name provided"}</div>
                  <div className="text-xs text-slate-400 truncate">{profile?.userId?.email || "No name provided"}</div>
                </div>

                <div className="text-slate-300">{/* chevron or caret if you want */}</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
