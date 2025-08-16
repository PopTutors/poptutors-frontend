import React from 'react';
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
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onSidebarToggle?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSidebarToggle, isOpen }) => {
  const navigate = useNavigate();

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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm h-[75px] flex items-center px-4">
      {/* Left: Logo + Menu Button (Mobile) */}
      <div className="flex items-center md:justify-center gap-1 w-[220px]">
        <button
          onClick={onSidebarToggle}
          className="relative w-6 h-6 flex flex-col justify-between items-center p-[3px] z-50 lg:hidden"
        >
          <span
            className={`block h-0.5 w-full bg-black transform transition duration-300 ease-in-out ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-black transition-opacity duration-300 ease-in-out ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-black transform transition duration-300 ease-in-out ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
        <img src={logo} alt="Logo" />
      </div>

      {/* Center: Search bar */}
      <div className="flex-1 flex gap-4 items-center justify-start ml-4">
        <img src={Line} alt="" className="h-[26px]" />
        <div className="w-full max-w-md hidden md:block">
          <SearchInput />
        </div>
      </div>

      {/* Right: Notification + Profile */}
      <div className="flex items-center gap-4">
        <img src={notification} alt="Notification" className="w-5 h-5" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer px-2 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center">
                <User2 className="w-4 h-4 text-black" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[13px] font-medium text-black">Shubham Gone</span>
                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                  Student <span className="w-1 h-1 bg-gray-400 rounded-full" /> 23 Dec, Sun
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem onSelect={() => handleSelect('Profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleSelect('Logout')}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
