import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';

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
    if (subTabs && subTabs.length > 0) {
      setIsOpen(!isOpen);
    } else {
      onClick?.();
    }
  };

  const TabContent = (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer font-poppinsmedium transition-all
      ${active ? 'text-[#019ACB]  ' : 'text-[#9197B3] hover:bg-gray-100'}`}
    >
      <div className="flex items-center gap-3">
        <img
          src={active && IconActive ? IconActive : Icon}
          alt={`${label} icon`}
          className="w-5 h-5 transition duration-200"
        />
        <span
          className={`text-[16px] transition duration-200 ${
            active ? 'font-poppinsmedium text-[#019ACB]' : 'text-[#9197B3]'
          }`}
        >
          {label}
        </span>
      </div>
      {subTabs && subTabs.length > 0 ? (
        isOpen ? (
          <FiChevronDown className="text-gray-400" />
        ) : (
          <FiChevronRight className="text-gray-400" />
        )
      ) : (
        <FiChevronRight className={`text-base ${active ? 'text-[#00bcd4]' : 'text-gray-400'}`} />
      )}
    </div>
  );

  return (
    <div>
      {redirectPath && !subTabs ? (
        <Link to={redirectPath}>
          {TabContent}
        </Link>
      ) : (
        TabContent
      )}

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
