import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface SubTab {
  label: string;
  onClick?: () => void;
}

interface SidebarTabProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  subTabs?: SubTab[];
  iconActive?: string;
  redirectPath?: string;
}

const SidebarTab: React.FC<SidebarTabProps> = ({
  redirectPath,
  icon: Icon,
  label,
  active,
  onClick,
  subTabs,
  iconActive: IconActive,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (subTabs?.length) {
      setIsOpen(!isOpen);
    } else {
      onClick?.();
    }
  };

  const TabContent = (
    <div
      onClick={handleClick}
      className={`flex items-center  px-4 py-3 rounded-md cursor-pointer transition-all
        ${active ? 'bg-[#00A5CF] text-white' : 'text-[#9197B3] hover:bg-gray-100'}
      `}
    >
      <img
        src={active && IconActive ? IconActive : Icon}
        alt={`${label} icon`}
        className="object-contain w-6  h-6 mr-3 transition duration-200"
      />
      <span className={`text-base  ${active ? 'font-poppinsmedium' : 'font-poppinsregular'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div>
      {redirectPath && !subTabs ? <Link to={redirectPath}>{TabContent}</Link> : TabContent}

      {isOpen && subTabs && (
        <div className="ml-8 mt-1 space-y-1">
          {subTabs.map((sub) => (
            <div
              key={sub.label}
              onClick={sub.onClick}
              className="text-sm text-gray-600 hover:text-[#00bcd4] hover:underline cursor-pointer"
            >
              {sub.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarTab;
