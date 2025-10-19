import { useState } from 'react';
import SearchBar from './SearchBar';
import RoleSwitcher from './RoleSwitcher';
import useAuthStore from '../../store/useAuthStore';

const TopBar = () => {
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="top-bar">
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
        <span>Sun</span> Training Institute
      </div>

      <SearchBar />

      <div className="top-bar-right">
        <div className="bell-icon-wrapper" onClick={() => setShowNotifications(!showNotifications)}>
          <i className="fas fa-bell"></i>
          <span className="badge">
            <span className="overdue-count">3</span> / 10
          </span>
        </div>

        <div className="user-profile">
          <RoleSwitcher />
          <i className="fas fa-user-circle"></i>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
