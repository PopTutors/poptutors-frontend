import React, { useState, useRef, useEffect } from 'react';
import SearchInput from '../ui/searchInput';
import DropdownCard from '../ui/dropdownCard';

// Replace with actual imports if you use Webpack/Vite
import logo from '../../assets/Mentoos_logo.png';
import notification from '../../assets/notification.svg';
import profile_pic from '../../assets/user_profile.png';

const Navbar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<null | 'profile'>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (item: string) => {
    console.log('Selected:', item);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-50 bg-white flex">
      {/* Logo Group */}
      <div className="w-[291px] flex items-center justify-center">
        <img src={logo} alt="Logo" className="h-[60px] w-[150px] object-contain" />
      </div>

      <div className="container mx-auto ">
        <div className="flex w-full justify-between items-center py-2 md:py-2">
          <div className="hidden md:flex items-center gap-2 justify-center w-[304px] md:w-[354px]">
            <SearchInput />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            <div>
              <img src={notification} alt="Notification" width={25} height={25} />
            </div>

            <DropdownCard
              title="Alexa Jhon"
              label="Welcome back,"
              iconType="image"
              imageSrc={profile_pic}
              menuItems={['Profile', 'Settings']}
              
              onSelect={handleSelect}
              isOpen={openDropdown === 'profile'}
              onToggle={() =>
                setOpenDropdown((prev) => (prev === 'profile' ? null : 'profile'))
              }
              dropdownRef={profileDropdownRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
