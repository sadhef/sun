import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const menuConfig = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt', path: '/', roles: ['Admin'] },
    {
      id: 'enquiries_parent',
      label: 'Enquiries',
      icon: 'fa-question-circle',
      roles: ['Admin', 'Trainer', 'Training Coordinator'],
      submenu: [
        { id: 'new_enquiry', label: 'New Enquiry', icon: 'fa-plus-circle', path: '/enquiries/new', roles: ['Admin', 'Trainer', 'Training Coordinator'] },
        { id: 'pending_enquiries', label: 'Pending Enquiries', icon: 'fa-file-signature', path: '/enquiries/pending', roles: ['Admin', 'Trainer', 'Training Coordinator'] }
      ]
    },
    {
      id: 'nomination_parent',
      label: 'Nomination',
      icon: 'fa-user-check',
      roles: ['Admin', 'Trainer', 'Training Coordinator'],
      submenu: [
        { id: 'add_nomination', label: 'Add Nomination', icon: 'fa-user-plus', path: '/nomination', roles: ['Admin', 'Trainer', 'Training Coordinator'] },
        { id: 'pending_nominations', label: 'Pending Nominations', icon: 'fa-tasks', path: '/nomination/pending', roles: ['Admin', 'Trainer', 'Training Coordinator'] }
      ]
    },
    { id: 'all_records', label: 'All Records', icon: 'fa-list-ul', path: '/records', roles: ['Admin', 'Trainer', 'Training Coordinator'] },
    { id: 'schedule', label: 'Course Schedule', icon: 'fa-calendar-alt', path: '/schedule', roles: ['Admin', 'Trainer', 'Training Coordinator'] },
    { id: 'roster', label: 'Class Roster', icon: 'fa-clipboard-list', path: '/roster', roles: ['Admin', 'Trainer', 'Training Coordinator', 'Accountant'] },
    { id: 'trainer', label: 'Trainer', icon: 'fa-chalkboard-teacher', path: '/trainer', roles: ['Admin'] },
    { id: 'rate_card', label: 'Rate Card', icon: 'fa-dollar-sign', path: '/rate-card', roles: ['Admin'] },
    { id: 'results', label: 'Results', icon: 'fa-award', path: '/results', roles: ['Admin', 'Trainer'] },
    { id: 'feedback', label: 'Feedback', icon: 'fa-comments', path: '/feedback', roles: ['Admin', 'Trainer'] },
    { id: 'reports', label: 'Reports', icon: 'fa-chart-pie', path: '/reports', roles: ['Admin'] },
    { id: 'invoices', label: 'Invoices', icon: 'fa-file-invoice-dollar', path: '/invoices', roles: ['Admin', 'Accountant'] },
    { id: 'certificates', label: 'Certificates', icon: 'fa-certificate', path: '/certificates', roles: ['Admin', 'Accountant'] },
    { id: 'revenue', label: 'Revenue', icon: 'fa-chart-line', path: '/revenue', roles: ['Admin', 'Accountant'] }
  ];

  const toggleSubmenu = (menuId) => {
    if (isCollapsed) return;
    setOpenSubmenu(openSubmenu === menuId ? null : menuId);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter menu items based on user role
  const filteredMenu = menuConfig.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <div className="flex h-screen">
      {/* Side Menu */}
      <div
        className={`bg-white border-r border-border-color flex-shrink-0 pt-[60px] relative flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[70px]' : 'w-[220px]'
        }`}
      >
        {/* Menu Toggle */}
        <div
          className={`text-2xl cursor-pointer text-font-color flex items-center border-b border-border-color flex-shrink-0 ${
            isCollapsed ? 'px-[23px] py-[15px]' : 'px-[25px] py-[15px]'
          }`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i className="fas fa-bars"></i>
        </div>

        {/* Menu List */}
        <ul className="list-none p-0 m-0 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-[#ccc] scrollbar-track-transparent">
          {filteredMenu.map((item) => (
            <li key={item.id} className={item.submenu ? 'has-submenu' : ''}>
              {item.submenu ? (
                <>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSubmenu(item.id);
                    }}
                    className="flex items-center px-[25px] py-[15px] text-font-color no-underline whitespace-nowrap overflow-hidden hover:bg-secondary relative"
                  >
                    <i className={`fas ${item.icon} text-xl min-w-[20px] text-center`}></i>
                    <span className={`ml-[15px] transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none' : ''}`}>
                      {item.label}
                    </span>
                    <i className={`fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out text-[0.8em] ${
                      openSubmenu === item.id ? 'rotate-180' : ''
                    } ${isCollapsed ? 'opacity-0 w-0 pointer-events-none' : ''}`}></i>
                  </a>
                  <ul
                    className={`list-none p-0 m-0 bg-secondary overflow-hidden transition-all duration-300 ease-out ${
                      isCollapsed ? 'hidden' : (openSubmenu === item.id ? 'max-h-[500px]' : 'max-h-0')
                    }`}
                  >
                    {item.submenu.map((subitem) => (
                      <li key={subitem.id}>
                        <NavLink
                          to={subitem.path}
                          className={({ isActive }) =>
                            `flex items-center !pl-[35px] py-[15px] text-font-color no-underline whitespace-nowrap overflow-hidden hover:bg-secondary ${
                              isActive ? 'bg-light-gray-bg text-primary font-bold' : ''
                            }`
                          }
                        >
                          <i className={`fas ${subitem.icon} text-base min-w-[20px] text-center`}></i>
                          <span className="ml-[15px]">{subitem.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-[25px] py-[15px] text-font-color no-underline whitespace-nowrap overflow-hidden hover:bg-secondary ${
                      isActive ? 'bg-light-gray-bg text-primary font-bold' : ''
                    }`
                  }
                >
                  <i className={`fas ${item.icon} text-xl min-w-[20px] text-center`}></i>
                  <span className={`ml-[15px] transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 pointer-events-none' : ''}`}>
                    {item.label}
                  </span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Wrapper */}
      <div className="flex-grow flex flex-col">
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-border-color flex items-center px-5 z-[1000]">
          {/* Logo */}
          <div className="text-xl font-bold flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-8" />
            <span className="text-logo-color">Sun</span>
            <span>Training Institute</span>
          </div>

          {/* Search Container */}
          <div className="flex-grow flex justify-center">
            <div className="relative w-1/2 max-w-[500px]">
              <i className="fas fa-magnifying-glass absolute left-[15px] top-1/2 -translate-y-1/2 text-[#aaa]"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search across all pages..."
                className="w-full py-[10px] px-5 pl-10 pr-10 rounded-[20px] border border-border-color text-sm"
              />
              {searchTerm && (
                <span
                  onClick={handleSearchClear}
                  className="absolute right-[15px] top-1/2 -translate-y-1/2 cursor-pointer text-[#aaa] text-xl"
                >
                  &times;
                </span>
              )}
            </div>
          </div>

          {/* Top Bar Right */}
          <div className="flex items-center gap-5">
            {/* Bell Icon */}
            <div className="flex items-center cursor-pointer text-xl">
              <i className="fas fa-bell"></i>
              <span className="text-sm font-bold whitespace-nowrap ml-[5px] text-[#666]"></span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-[10px] text-xl">
              <select
                className="border border-border-color rounded-[5px] p-[5px] font-inter text-[13px] bg-white cursor-pointer"
                defaultValue={user?.role}
              >
                <option value="Admin">Admin</option>
                <option value="Trainer">Trainer</option>
                <option value="Training Coordinator">Training Coordinator</option>
                <option value="Accountant">Accountant</option>
              </select>
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-[80px] px-5 pb-5 overflow-y-auto flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
