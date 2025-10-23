// components/layout/Sidebar.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarTab from '../../components/ui/sidebarTab';
import { paths } from '../../config/path';
import { useFetch } from '../../api';
import { LogOut } from 'lucide-react';

/* Combined icon imports:
   - Some icons live in ../../assets/sidebar-icon
   - Manager/other icons live in ../../assets/managers
   Adjust these imports if your project exports differ.
*/
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
  SettingsIcon as SidebarSettingsIcon,
  HelpCenterIcon,
} from '../../assets/sidebar-icon';

import {
  ManagerHelpIcon,
  ManagerLogOutIcon,
  ManagerMessagesIcon,
  ManageTeacher,
  MyDashboardIcon,
  MyProfileIcon,
  MySessionIcon,
  SettingsIcon as ManagerSettingsIcon,
  ProfileIcon,
  JobIcon as JobListingIcon,
  FinanceHub as FinanceIcon,
} from '../../assets/managers';

type IconType = string | React.ComponentType<any> | React.ReactElement | undefined;

const RenderIcon: React.FC<{ icon?: IconType; className?: string; imgClassName?: string }> = ({ icon, className, imgClassName }) => {
  if (!icon) return null;
  if (typeof icon === 'string') {
    return <img src={icon} className={imgClassName || className} alt="icon" />;
  }
  if (React.isValidElement(icon)) return React.cloneElement(icon);
  const Comp = icon as React.ComponentType<any>;
  try {
    return <Comp className={className} />;
  } catch {
    return null;
  }
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Profile fetch (keeps previous useFetch for manager/student if backend is used)
  const { data: profile, isLoading, error, refetch } = useFetch(['profile'], `/profile`, true, {
    requiresAuth: true,
  });

  // Determine role from URL and/or localStorage fallback
  const isManager = location.pathname.startsWith('/manager');
  const isTeacher = location.pathname.startsWith('/teacher');
  const roleFromStorage = typeof window !== 'undefined' ? (localStorage.getItem('role') || '') : '';
  const role = isManager ? 'manager' : isTeacher ? 'teacher' : roleFromStorage === 'teacher' ? 'teacher' : 'student';

  // Hidden routes where sidebar shouldn't appear (manager-specific)
  const hiddenManagerRoutes = [
    paths.manager?.postAssignment?.getHref?.() ?? '/manager/post-assignment',
    paths.manager?.postSession?.getHref?.() ?? '/manager/post-session',
    paths.manager?.postLiveHelp?.getHref?.() ?? '/manager/post-live-help',
  ];

  const shouldHideSidebar = hiddenManagerRoutes.some((route) => route && location.pathname.startsWith(route));
  if (shouldHideSidebar) return null;

  // --- Student tabs (compact) ---
  const studentTabs = [
    { label: 'Dashboard', icon: DashboardIcon, iconActive: DashboardIconActive, path: paths.student.home.getHref() },
    { label: 'Assignment', icon: AssignmentIcon, iconActive: AssignmentIconActive, path: paths.student.assignment.getHref() },
    { label: 'Live Question', icon: LiveQuestionsIcon, iconActive: LiveQuestionsIconActive, path: paths.student.livequestion.getHref() },
    { label: 'Sessions', icon: SessionsIcon, iconActive: SessionsIconActive, path: paths.student.session.getHref() },
    { label: 'Wallet', icon: WalletIcon, iconActive: WalletIconActive, path: paths.student.wallet.getHref() },
    { label: 'Help & Support', icon: HelpIcon, iconActive: HelpIconActive, path: '/help-support' },
  ];

  // --- Manager tabs (full-row style) ---
  const managerTabs = [
    { label: 'Dashboard', icon: MyDashboardIcon, path: paths.manager.dashboard.getHref() },
    { label: 'Messages', icon: ManagerMessagesIcon, path: paths.manager.messages.getHref() },
    { label: 'My Profile', icon: ProfileIcon, path: paths.manager.profile.getHref() },
    { label: 'Job Listing', icon: JobListingIcon, path: paths.manager.jobListing.getHref() },
    { label: 'My Session', icon: MySessionIcon, path: paths.manager.sessions.getHref() },
    { label: 'My Live Helps', icon: MyProfileIcon, path: paths.manager.exams.getHref() },
    { label: 'Finance', icon: FinanceIcon, path: paths.manager.finance.getHref() },
    { label: 'Manage Teacher', icon: ManageTeacher, path: paths.manager.teacher.getHref() },
  ];

  // --- Teacher tabs (compact) ---
  const teacherTabs = [
    { label: 'Dashboard', icon: DashboardIcon, iconActive: DashboardIconActive, path: paths.teacher.dashboard.getHref() },
    { label: 'My Exam', icon: Filecon, iconActive: DashboardIconActive, path: paths.teacher.examHelpList.getHref() },
    { label: 'My Assignment', icon: FileTextIcon, iconActive: DashboardIconActive, path: paths.teacher.assignmentList.getHref() },
    { label: 'Job Listing', icon: FolderSearchIcon, iconActive: DashboardIconActive, path: paths.teacher.jobListing.getHref() },
    { label: 'My Sessions', icon: BookTextIcon, iconActive: DashboardIconActive, path: paths.teacher.sessionList.getHref() },
    { label: 'Earnings', icon: CircleDollarIcon, iconActive: DashboardIconActive, path: paths.teacher.earnings?.getHref?.() ?? undefined },
  ];

  const teacherProfileTabs = [
    { label: 'Settings', icon: SidebarSettingsIcon ?? ManagerSettingsIcon, iconActive: DashboardIconActive, path: paths.teacher.settings.getHref() },
    { label: 'Help Center', icon: HelpCenterIcon ?? ManagerHelpIcon, iconActive: DashboardIconActive, path: '/help-center' },
  ];

  const clearAllCookies = () => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    clearAllCookies();
    navigate('/login', { replace: true });
  };

  // Choose which tabs to render
  const compactTabs = role === 'teacher' ? teacherTabs : studentTabs;

  // Profile info fallback
  const localProfile = (() => {
    try {
      const raw = localStorage.getItem('userprofile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const displayName = profile?.userId?.name || localProfile?.name || localProfile?.fullName || 'No name';
  const displayEmail = profile?.userId?.email || localProfile?.email || 'No email provided';
  const avatarUrl = profile?.profileImage || localProfile?.avatar || localProfile?.profileImage || '';

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 lg:hidden" onClick={onClose} aria-hidden />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white w-[220px] border-r shadow-md overflow-y-auto transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}
      >
        {/* Compact navigation for student & teacher */}
        {role !== 'manager' && (
          <nav className="mt-6 px-4 space-y-2 flex flex-col">
            {compactTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <SidebarTab
                  key={tab.label}
                  icon={tab.icon as any}
                  iconActive={tab.iconActive as any}
                  label={tab.label}
                  active={isActive}
                  redirectPath={tab.path}
                />
              );
            })}
            {/* If teacher, render teacher profile/settings area */}
            {role === 'teacher' && (
              <div className="mt-6 border-t pt-4">
                {teacherProfileTabs.map((t) => {
                  const isActive = location.pathname === t.path;
                  return (
                    <SidebarTab
                      key={t.label}
                      icon={t.icon as any}
                      iconActive={t.iconActive as any}
                      label={t.label}
                      active={isActive}
                      redirectPath={t.path}
                    />
                  );
                })}
                <div
                  onClick={handleLogout}
                  className="mt-2 flex items-center gap-3 px-2 py-2 rounded hover:bg-slate-100 cursor-pointer text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-[15px] font-medium">Logout</span>
                </div>
              </div>
            )}
          </nav>
        )}

        {/* Full-row manager style */}
        {role === 'manager' && (
          <div className="flex flex-col h-full justify-between">
            <div>
              <nav className="mt-3 px-2">
                {managerTabs.map((tab) => {
                  const isActive = location.pathname === tab.path || location.pathname.startsWith(tab.path);
                  return (
                    <button
                      key={tab.label}
                      onClick={() => navigate(tab.path)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 transition
                        ${isActive ? 'bg-[#e8f4fa] text-[16px] text-[#141414] font-inter' : 'text-[16px] text-[#141414] font-inter'}`}
                    >
                      <span className="w-5 h-5 flex-shrink-0">
                        <RenderIcon icon={tab.icon as IconType} imgClassName="w-5 h-5 object-contain" className="w-5 h-5" />
                      </span>
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Settings + Help block */}
              <div className="mt-6 px-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Settings</div>

                <button
                  onClick={() => navigate('/manager/settings')}
                  className="w-full text-left flex items-center gap-3 px-2 py-3 transition text-slate-700 hover:bg-slate-50"
                >
                  <span className="w-5 h-5 flex-shrink-0">
                    <RenderIcon icon={ManagerSettingsIcon ?? SidebarSettingsIcon as IconType} imgClassName="w-5 h-5 object-contain" />
                  </span>
                  <span className="text-[16px] text-[#141414] font-inter">Settings</span>
                </button>

                <button
                  onClick={() => navigate('/help-center')}
                  className="w-full text-left flex items-center gap-3 px-2 py-2 transition text-[16px] text-[#141414] font-inter"
                >
                  <span className="w-5 h-5 flex-shrink-0">
                    <RenderIcon icon={ManagerHelpIcon as IconType} imgClassName="w-5 h-5 object-contain" />
                  </span>
                  <span className="text-[16px] text-[#141414] font-inter">Help Center</span>
                </button>
              </div>

              {/* Logout area */}
              <div className="px-2 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-start gap-3 px-4 py-2 text-red-600"
                >
                  <span className="w-5 h-5 flex-shrink-0">
                    <RenderIcon icon={ManagerLogOutIcon as IconType} imgClassName="w-5 h-5 object-contain" />
                  </span>
                  <span className="text-[16px] text-red-600 font-inter">Log out</span>
                </button>
              </div>
            </div>

            {/* Bottom profile area */}
            <div className="px-4 pb-6 mt-6">
              <div
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate(role === 'manager' ? '/manager/profile' : role === 'teacher' ? paths.teacher.profile.getHref() : '/profile')}
              >
                <img src={avatarUrl || '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900">{displayName}</div>
                  <div className="text-xs text-slate-400 truncate">{displayEmail}</div>
                </div>
                <div className="text-slate-300" />
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
