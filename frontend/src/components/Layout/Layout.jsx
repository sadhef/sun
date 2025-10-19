import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NotificationContainer from '../Common/NotificationContainer';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="app-container">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="main-content-wrapper">
        <TopBar />
        <div className="main-content">
          <Outlet />
        </div>
      </div>

      <NotificationContainer />
    </div>
  );
};

export default Layout;
