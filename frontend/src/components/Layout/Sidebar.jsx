import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const menuConfig = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt', path: '/', roles: ['Admin'] },
    {
      id: 'enquiries',
      label: 'Enquiries',
      icon: 'fa-question-circle',
      roles: ['Admin', 'Trainer', 'Training Coordinator'],
      submenu: [
        { id: 'new_enquiry', label: 'New Enquiry', icon: 'fa-plus-circle', path: '/enquiries/new', roles: ['Admin', 'Trainer', 'Training Coordinator'] },
        { id: 'pending_enquiries', label: 'Pending Enquiries', icon: 'fa-file-signature', path: '/enquiries/pending', roles: ['Admin', 'Trainer', 'Training Coordinator'] }
      ]
    },
    {
      id: 'nomination',
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
    { id: 'trainer', label: 'Trainer', icon: 'fa-chalkboard-teacher', path: '/trainers', roles: ['Admin'] },
    { id: 'rate_card', label: 'Rate Card', icon: 'fa-dollar-sign', path: '/rate-cards', roles: ['Admin'] },
    { id: 'results', label: 'Results', icon: 'fa-award', path: '/results', roles: ['Admin', 'Trainer'] },
    { id: 'feedback', label: 'Feedback', icon: 'fa-comments', path: '/feedback', roles: ['Admin', 'Trainer'] },
    { id: 'reports', label: 'Reports', icon: 'fa-chart-pie', path: '/reports', roles: ['Admin'] },
    { id: 'invoices', label: 'Invoices', icon: 'fa-file-invoice-dollar', path: '/invoices', roles: ['Admin', 'Accountant'] },
    { id: 'certificates', label: 'Certificates', icon: 'fa-certificate', path: '/certificates', roles: ['Admin', 'Accountant'] },
    { id: 'revenue', label: 'Revenue', icon: 'fa-chart-line', path: '/revenue', roles: ['Admin', 'Accountant'] }
  ];

  const userRole = user?.role || 'Admin';
  const visibleMenu = menuConfig.filter(item => item.roles.includes(userRole));

  const toggleSubmenu = (itemId) => {
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`bg-white border-r border-[#e0e0e0] transition-all duration-300 flex-shrink-0 pt-[60px] relative flex flex-col ${collapsed ? 'w-[70px]' : 'w-[220px]'}`}>
      <div className={`text-2xl cursor-pointer text-[#333] py-[15px] flex items-center border-b border-[#e0e0e0] flex-shrink-0 ${collapsed ? 'px-[23px]' : 'px-[25px]'}`} onClick={onToggle}>
        <i className="fas fa-bars text-lg min-w-[20px] text-center"></i>
      </div>

      <ul className="list-none p-0 m-0 flex-grow overflow-y-auto [scrollbar-color:transparent_transparent] hover:[scrollbar-color:#ccc_transparent]">
        {visibleMenu.map(item => (
          <li key={item.id} className={item.submenu ? 'group' : ''}>
            {item.submenu ? (
              <>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); toggleSubmenu(item.id); }}
                  className="relative flex items-center py-[15px] px-[25px] text-[#333] no-underline whitespace-nowrap overflow-hidden hover:bg-[#f5f7fa]"
                >
                  <i className={`fas ${item.icon} text-[1.2rem] min-w-[20px] text-center`}></i>
                  <span className={`ml-[15px] transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0 pointer-events-none' : ''}`}>{item.label}</span>
                  <i className={`fas fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 transition-transform duration-300 ease text-[0.8em] ${openSubmenu === item.id ? 'rotate-180' : ''} ${collapsed ? 'opacity-0 w-0 pointer-events-none' : ''}`}></i>
                </a>
                <ul className={`list-none p-0 m-0 bg-[#f5f7fa] overflow-hidden transition-[max-height] duration-300 ease-out ${openSubmenu === item.id ? 'max-h-[500px]' : 'max-h-0'} ${collapsed ? 'hidden' : ''}`}>
                  {item.submenu
                    .filter(subItem => (subItem.roles || item.roles).includes(userRole))
                    .map(subItem => (
                      <li key={subItem.id}>
                        <Link
                          to={subItem.path}
                          className={`flex items-center py-[15px] px-[25px] text-[#333] no-underline whitespace-nowrap overflow-hidden hover:bg-[#f5f7fa] ${isActive(subItem.path) ? 'bg-[#f0f0f0] text-[#4a90e2] font-bold' : ''}`}
                          style={{ paddingLeft: '35px' }}
                        >
                          <i className={`fas ${subItem.icon} text-[1rem] min-w-[20px] text-center`}></i>
                          <span className={`ml-[15px] transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0 pointer-events-none' : ''}`}>{subItem.label}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center py-[15px] px-[25px] text-[#333] no-underline whitespace-nowrap overflow-hidden hover:bg-[#f5f7fa] ${isActive(item.path) ? 'bg-[#f0f0f0] text-[#4a90e2] font-bold' : ''}`}
              >
                <i className={`fas ${item.icon} text-[1.2rem] min-w-[20px] text-center`}></i>
                <span className={`ml-[15px] transition-opacity duration-200 ${collapsed ? 'opacity-0 w-0 pointer-events-none' : ''}`}>{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
