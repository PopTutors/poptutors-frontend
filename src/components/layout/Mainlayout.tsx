import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from './Header/Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header
        isOpen={isSidebarOpen}
        // onClose={() => setIsSidebarOpen(false)}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1 h-[calc(100vh-75px)] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex-1 bg-[#f5f6f8] overflow-y-auto">
          <div className="p-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
