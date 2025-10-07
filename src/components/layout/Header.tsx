// components/Header.tsx
import React, { useMemo } from 'react';
import logo from '../../assets/Mentoos_logo.svg';
import notification from '../../assets/notification.svg';
import { User2 } from 'lucide-react';
import SearchInput from '../ui/searchInput';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown';
import Line from '../../assets/line.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui';
import { paths } from '../../config/path';
import { AddIcon } from '../../assets/managers';

interface HeaderProps {
  onSidebarToggle?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if current route is manager
  const isManagerRoute = useMemo(() => location.pathname.startsWith('/manager'), [location.pathname]);

  // Get user info from localStorage (guarded)
  const name = typeof window !== 'undefined' ? localStorage.getItem('name') || 'User' : 'User';
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') || 'Student' : 'Student';

  // Format today's date as 'DD MMM, ddd'
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleString('default', { month: 'short' });
  const weekday = today.toLocaleString('default', { weekday: 'short' });
  const formattedDate = `${day} ${month}, ${weekday}`;

  const clearAllCookies = () => {
    if (typeof document === 'undefined') return;
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
  };

  const handleSelect = (item: string) => {
    if (item === 'Logout') {
      // Clear all storage
      if (typeof localStorage !== 'undefined') localStorage.clear();
      if (typeof sessionStorage !== 'undefined') sessionStorage.clear();
      clearAllCookies();

      // Redirect to login page
      navigate('/login', { replace: true });
    } else if (item === 'Profile') {
      // navigate to profile (non-manager profile)
      navigate('/profile');
    } else {
      console.log('Selected:', item);
    }
  };

  // Derive a page title for manager routes to show in place of the search bar
  const managerPageTitle = useMemo(() => {
    if (!isManagerRoute) return '';
    const map: Record<string, string> = {
      '/manager/dashboard': 'Dashboard',
      '/manager/messages': 'Messages',
      '/manager/profile': 'My Profile',
      '/manager/hirings': 'Hirings',
      '/manager/job-listing': 'Job Listing',
      '/manager/sessions': 'My Session',
      '/manager/liveHelp': 'Live Helps',
      '/manager/finance': 'Finance',
      '/manager/hub-manager': 'Manager Hub',
      '/manager/teacher': 'Manage Teacher',
      '/manager/settings': 'Settings',
    };

    if (map[location.pathname]) return map[location.pathname];
    const found = Object.keys(map).find((k) => location.pathname.startsWith(k));
    if (found) return map[found];

    const segments = location.pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || 'Manager';
    const words = last.replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
    return words.charAt(0).toUpperCase() + words.slice(1);
  }, [isManagerRoute, location.pathname]);

  // Manager post-job actions -> route targets (adjust routes as needed)
  const onManagerPostAction = (action: 'assignment' | 'livehelp' | 'session') => {
    switch (action) {
      case 'assignment':
        navigate(paths.manager.postAssignment.getHref()); // posting a job/assignment
        break;
      case 'livehelp':
        navigate(paths.manager.postLiveHelp.getHref()); // start live help
        break;
      case 'session':
        navigate(paths.manager.postSession.getHref()); // create a new session
        break;
      default:
        break;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm h-[75px] flex items-center px-4">
      {/* Left: Logo + Menu Button (Mobile) */}
      <div className="flex items-center  gap-1 w-[200px]">
        <button
          onClick={onSidebarToggle}
          className="relative w-6 h-6 flex flex-col justify-between items-center p-[3px] z-50 lg:hidden"
        >
          <span
            className={`block h-0.5 w-full bg-black transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
          />
          <span
            className={`block h-0.5 w-full bg-black transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'
              }`}
          />
          <span
            className={`block h-0.5 w-full bg-black transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
          />
        </button>
        <img src={logo} alt="Logo" className='self-start' />
      </div>

      {/* Center: Search bar (non-manager) OR Page header (manager) */}
      {!isManagerRoute ? (
        <div className="flex-1 flex gap-4 items-center justify-start ml-4">
          <img src={Line} alt="" className="h-[26px]" />
          <div className="w-full max-w-md hidden md:block">
            <SearchInput />
          </div>
        </div>
      ) : (
        // Manager: Show page title only on desktop, hide on mobile
        <div className="flex-1 flex items-center justify-start ml-0">
          <img src={Line} alt="" className="h-full" />
          <div className="ml-3 hidden lg:block">
            <h1 className="text-[24px] font-inter font-semibold">{managerPageTitle}</h1>
          </div>
        </div>
      )}

      {/* Right: Notification + Profile (Profile removed on manager routes) */}
      <div className="flex items-center gap-4">
        <img src={notification} alt="Notification" className="w-5 h-5" />

        {/* Render profile dropdown only on non-manager routes */}
        {!isManagerRoute ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
                  <User2 className="w-4 h-4 text-black" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[13px] font-medium text-black">{name}</span>
                  <span className="text-[11px] text-gray-500 flex items-center gap-1">
                    {role} <span className="w-1 h-1 bg-gray-400 rounded-full" /> {formattedDate}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onSelect={() => handleSelect('Profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSelect('Logout')}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Manager: Post A Job button with dropdown actions
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-primary w-[158px] h-[50px] font-inter text-[16px] hidden md:flex items-center gap-2">
                <img src={AddIcon} className='w-[24px] h-[24px]' />
                <span>Post A Job</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onSelect={() => onManagerPostAction('assignment')}>
                Post Assignment
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onManagerPostAction('livehelp')}>
                Start Live Help
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onManagerPostAction('session')}>
                Create Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Header;