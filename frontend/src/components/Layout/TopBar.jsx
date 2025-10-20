import { useState } from 'react';
import SearchBar from './SearchBar';
import RoleSwitcher from './RoleSwitcher';
import useAuthStore from '../../store/useAuthStore';

const TopBar = () => {
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-[#e0e0e0] flex items-center px-5 z-[1000]">
      <div className="text-[1.2rem] font-bold">
        <img src="/suntraining.png" alt="Logo" className="inline h-8" />
        <span className="text-[#e49732]"> Sun</span> Training Institute
      </div>

      <SearchBar />

      <div className="flex items-center gap-5">
        <div className="flex items-center cursor-pointer text-[1.2rem]" onClick={() => setShowNotifications(!showNotifications)}>
          <i className="fas fa-bell"></i>
          <span className="text-[0.8rem] font-bold whitespace-nowrap ml-[5px] text-[#666]">
            <span className="text-[#d7685b]">3</span> / 10
          </span>
        </div>

        <div className="flex items-center gap-[10px] text-[1.2rem]">
          <RoleSwitcher />
          <i className="fas fa-user-circle"></i>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
