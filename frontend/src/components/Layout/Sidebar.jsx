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
    <div className={`side-menu ${collapsed ? 'collapsed' : ''}`}>
      <div className="menu-toggle" onClick={onToggle}>
        <i className="fas fa-bars icon"></i>
      </div>

      <ul className="list-unstyled">
        {visibleMenu.map(item => (
          <li key={item.id} className={item.submenu ? 'has-submenu' + (openSubmenu === item.id ? ' open' : '') : ''}>
            {item.submenu ? (
              <>
                <a href="#" onClick={(e) => { e.preventDefault(); toggleSubmenu(item.id); }}>
                  <i className={`fas ${item.icon} icon`}></i>
                  <span className="text">{item.label}</span>
                  <i className="fas fa-chevron-down submenu-toggle-icon"></i>
                </a>
                <ul className="submenu">
                  {item.submenu
                    .filter(subItem => (subItem.roles || item.roles).includes(userRole))
                    .map(subItem => (
                      <li key={subItem.id}>
                        <Link to={subItem.path} className={isActive(subItem.path) ? 'active' : ''}>
                          <i className={`fas ${subItem.icon} icon`}></i>
                          <span className="text">{subItem.label}</span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </>
            ) : (
              <Link to={item.path} className={isActive(item.path) ? 'active' : ''}>
                <i className={`fas ${item.icon} icon`}></i>
                <span className="text">{item.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
