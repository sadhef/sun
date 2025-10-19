import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="flex-grow flex flex-col">
        <TopBar />
        <div className="pt-[80px] px-5 pb-5 overflow-y-auto flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
