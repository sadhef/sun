# Frontend Implementation Guide

## 📚 Table of Contents
1. [Setup & Dependencies](#setup--dependencies)
2. [Layout Components](#layout-components)
3. [Common Components](#common-components)
4. [Page Components](#page-components)
5. [State Management](#state-management)
6. [Custom Hooks](#custom-hooks)
7. [Services](#services)

---

## 🚀 Setup & Dependencies

### Install Required Packages

```bash
cd frontend

# Remove Tailwind CSS
npm uninstall tailwindcss postcss autoprefixer

# Install Bootstrap 5
npm install bootstrap@5.3.2 react-bootstrap @popperjs/core

# Install additional dependencies
npm install chart.js react-chartjs-2
npm install date-fns react-datepicker
npm install react-select
npm install @fortawesome/fontawesome-free
npm install file-saver
npm install react-to-print
```

### Update main.jsx

**File:** `frontend/src/main.jsx`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'react-datepicker/dist/react-datepicker.css'

// Import custom CSS (from style.css)
import './styles/custom.css'
import './styles/bootstrap-overrides.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### Create Custom CSS

**File:** `frontend/src/styles/custom.css`

Copy the entire content from `style.css` with minimal modifications for React/Bootstrap compatibility.

**File:** `frontend/src/styles/bootstrap-overrides.css`

```css
/* Bootstrap Overrides to match original design */

:root {
  --primary-color: #4a90e2;
  --secondary-color: #f5f7fa;
  --light-gray-bg: #f0f0f0;
  --font-color: #333;
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --danger-color: #d7685b;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --logo-color: #e49732;
  --action-icon-color: #6d6d6d;
}

/* Override Bootstrap primary color */
.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #3a7bc8;
  border-color: #3a7bc8;
}

/* Override Bootstrap text colors */
.text-primary {
  color: var(--primary-color) !important;
}

.text-danger {
  color: var(--danger-color) !important;
}

.text-success {
  color: var(--success-color) !important;
}

.text-warning {
  color: var(--warning-color) !important;
}

/* Match original font size */
body {
  font-size: 0.8rem;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Remove default Bootstrap margins */
.modal-content {
  border-radius: 0px;
}

/* Custom scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
}

*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 0px;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: #aaa;
}
```

---

## 🎨 Layout Components

### 1. Main Layout

**File:** `frontend/src/components/Layout/Layout.jsx`

```jsx
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
```

### 2. Sidebar Component

**File:** `frontend/src/components/Layout/Sidebar.jsx`

```jsx
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
```

### 3. TopBar Component

**File:** `frontend/src/components/Layout/TopBar.jsx`

```jsx
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
```

### 4. SearchBar Component

**File:** `frontend/src/components/Layout/SearchBar.jsx`

```jsx
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useAppStore from '../../store/useAppStore';
import { debounce } from '../../utils/helpers';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { setGlobalSearch } = useAppStore();
  const location = useLocation();

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((value) => {
      setGlobalSearch(value);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const clearSearch = () => {
    setSearchTerm('');
    setGlobalSearch('');
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <i className="fas fa-magnifying-glass"></i>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search across all pages..."
        />
        {searchTerm && (
          <span className="search-clear-btn" onClick={clearSearch}>
            &times;
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
```

### 5. RoleSwitcher Component

**File:** `frontend/src/components/Layout/RoleSwitcher.jsx`

```jsx
import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';

const RoleSwitcher = () => {
  const { user, switchRole } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState(user?.role || 'Admin');

  const roles = ['Admin', 'Trainer', 'Training Coordinator', 'Accountant'];

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    switchRole(newRole);
  };

  return (
    <select
      id="roleSwitcher"
      value={selectedRole}
      onChange={handleRoleChange}
      title="Switch Role"
    >
      {roles.map(role => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  );
};

export default RoleSwitcher;
```

---

## 🧩 Common Components

### 1. DataTable Component

**File:** `frontend/src/components/Common/DataTable.jsx`

```jsx
import { useState } from 'react';
import { Table } from 'react-bootstrap';

const DataTable = ({
  columns,
  data,
  onSort,
  sortKey,
  sortDirection,
  viewId,
  grouped,
  groupBy,
  renderRow,
  renderGroupHeader
}) => {
  const [localSortKey, setLocalSortKey] = useState(sortKey || '');
  const [localSortDir, setLocalSortDir] = useState(sortDirection || 'asc');

  const handleSort = (key, type = 'string') => {
    const newDir = localSortKey === key && localSortDir === 'asc' ? 'desc' : 'asc';
    setLocalSortKey(key);
    setLocalSortDir(newDir);

    if (onSort) {
      onSort(key, newDir, type);
    }
  };

  return (
    <Table className="data-table" data-view-id={viewId} hover responsive>
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
              className={`${col.sortable ? 'sortable' : ''} ${col.className || ''} ${
                localSortKey === col.key ? (localSortDir === 'asc' ? 'sorted-asc' : 'sorted-desc') : ''
              }`}
              data-sort-key={col.key}
              data-sort-type={col.sortType || 'string'}
              onClick={() => col.sortable && handleSort(col.key, col.sortType)}
              style={col.style}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {grouped && groupBy ? (
          // Grouped rendering
          Object.entries(
            data.reduce((groups, item) => {
              const groupKey = item[groupBy];
              if (!groups[groupKey]) groups[groupKey] = [];
              groups[groupKey].push(item);
              return groups;
            }, {})
          ).map(([groupKey, groupData]) => (
            <React.Fragment key={groupKey}>
              {renderGroupHeader && renderGroupHeader(groupKey, groupData)}
              {groupData.map((item, index) => renderRow(item, index))}
            </React.Fragment>
          ))
        ) : (
          // Regular rendering
          data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center" style={{ padding: '20px' }}>
                No data found
              </td>
            </tr>
          )
        )}
      </tbody>
    </Table>
  );
};

export default DataTable;
```

### 2. StatusBadge Component

**File:** `frontend/src/components/Common/StatusBadge.jsx`

```jsx
const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    if (!status) return '';
    return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
```

### 3. ActionIcons Component

**File:** `frontend/src/components/Common/ActionIcons.jsx`

```jsx
const ActionIcons = ({ actions, item }) => {
  return (
    <div className="action-icons-container">
      {actions.map((action, index) => (
        action.visible !== false && (
          <span
            key={index}
            className="action-icon"
            data-action={action.type}
            title={action.label}
            onClick={() => action.onClick(item)}
            style={action.style}
          >
            <i className={`fas ${action.icon}`}></i>
            {action.showLabel && <span className="icon-label">{action.label}</span>}
          </span>
        )
      ))}
    </div>
  );
};

export default ActionIcons;
```

### 4. Modal Component

**File:** `frontend/src/components/Common/Modal.jsx`

```jsx
import { useEffect } from 'react';
import { Modal as BSModal } from 'react-bootstrap';

const Modal = ({
  show,
  onHide,
  title,
  children,
  size = 'md', // 'sm', 'md', 'lg', 'xl'
  footer,
  className = ''
}) => {
  useEffect(() => {
    if (show) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [show]);

  const sizeMap = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };

  return (
    <BSModal
      show={show}
      onHide={onHide}
      centered
      className={`${className} ${show ? 'show' : ''}`}
      dialogClassName={sizeMap[size]}
    >
      <BSModal.Header>
        <BSModal.Title className="modal-title">{title}</BSModal.Title>
        <span className="modal-close" onClick={onHide}>&times;</span>
      </BSModal.Header>

      <BSModal.Body className="modal-body">
        {children}
      </BSModal.Body>

      {footer && (
        <BSModal.Footer className="modal-footer">
          {footer}
        </BSModal.Footer>
      )}
    </BSModal>
  );
};

export default Modal;
```

### 5. Breadcrumb Component

**File:** `frontend/src/components/Common/Breadcrumb.jsx`

```jsx
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  return (
    <div id="breadcrumb-container">
      {items.map((item, index) => (
        <span key={index}>
          {index === items.length - 1 ? (
            <span className="breadcrumb-item active">{item.label}</span>
          ) : (
            <>
              {item.onClick ? (
                <a
                  href="#"
                  className="breadcrumb-item"
                  onClick={(e) => {
                    e.preventDefault();
                    item.onClick();
                  }}
                >
                  {item.label}
                </a>
              ) : item.path ? (
                <Link to={item.path} className="breadcrumb-item">
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb-item">{item.label}</span>
              )}
              <span className="breadcrumb-separator">/</span>
            </>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
```

### 6. ConfirmDialog Component

**File:** `frontend/src/components/Common/ConfirmDialog.jsx`

```jsx
import Modal from './Modal';
import { Button } from 'react-bootstrap';

const ConfirmDialog = ({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary'
}) => {
  const handleConfirm = () => {
    onConfirm();
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      title={title}
      size="sm"
    >
      <div className="confirmation-modal-body">
        <p>{message}</p>
        <div className="confirmation-modal-actions">
          <Button variant="secondary" onClick={onHide}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
```

### 7. NotificationContainer Component

**File:** `frontend/src/components/Common/NotificationContainer.jsx`

```jsx
import { Toaster } from 'react-hot-toast';

const NotificationContainer = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          style: {
            background: 'var(--success-color)',
          },
        },
        error: {
          style: {
            background: 'var(--danger-color)',
          },
        },
      }}
    />
  );
};

export default NotificationContainer;
```

---

## 📄 Page Components

### Dashboard Page

**File:** `frontend/src/pages/Dashboard.jsx`

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import Breadcrumb from '../components/Common/Breadcrumb';
import StatusBadge from '../components/Common/StatusBadge';
import { getDashboardStats, getTodaySchedule, getRecentEnquiries } from '../services/dashboardService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, scheduleData, enquiriesData] = await Promise.all([
        getDashboardStats(),
        getTodaySchedule(),
        getRecentEnquiries(5)
      ]);

      setStats(statsData.data);
      setTodaySchedule(scheduleData.data);
      setRecentEnquiries(enquiriesData.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: 'fa-file-invoice-dollar',
      color: 'var(--warning-color)',
      number: stats?.pendingInvoicesCount || 0,
      label: 'Pending Invoices',
      sublabel: `(${(stats?.pendingInvoicesAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })})`,
      navigate: '/invoices'
    },
    {
      icon: 'fa-chart-line',
      color: 'var(--success-color)',
      number: (stats?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 }),
      label: 'Total Revenue',
      navigate: '/revenue'
    },
    {
      icon: 'fa-file-alt',
      color: '#3498db',
      number: stats?.openEnquiries || 0,
      label: 'Open Enquiries',
      navigate: '/enquiries/pending'
    },
    {
      icon: 'fa-user-check',
      color: '#9b59b6',
      number: stats?.pendingNominations || 0,
      label: 'Pending Nominations',
      navigate: '/nomination/pending'
    },
    {
      icon: 'fa-calendar-alt',
      color: '#16a085',
      number: stats?.upcomingClasses || 0,
      label: 'Upcoming Classes (7d)',
      navigate: '/schedule'
    },
    {
      icon: 'fa-calendar-times',
      color: 'var(--danger-color)',
      number: stats?.pendingLeaves || 0,
      label: 'Pending Leave Approvals',
      navigate: '/trainers'
    }
  ];

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      <div className="page-header">
        <Breadcrumb items={[{ label: 'Dashboard' }]} />
      </div>

      <Row className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {statCards.map((card, index) => (
          <Col key={index}>
            <Card
              className="stat-card"
              onClick={() => card.navigate && navigate(card.navigate)}
              style={{ cursor: card.navigate ? 'pointer' : 'default' }}
            >
              <Card.Body className="d-flex align-items-center gap-3">
                <div className="icon" style={{ backgroundColor: card.color }}>
                  <i className={`fas ${card.icon}`}></i>
                </div>
                <div className="info">
                  <div className="number">{card.number}</div>
                  <div className="label">{card.label}</div>
                  {card.sublabel && (
                    <div className="label" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {card.sublabel}
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Card className="dashboard-section">
            <Card.Body>
              <h3>Today's Schedule</h3>
              {todaySchedule.length > 0 ? (
                todaySchedule.map((schedule, index) => (
                  <div key={index} className="dashboard-list-item">
                    <div>
                      <strong>{schedule.course}</strong><br />
                      <small>{schedule.client} | {schedule.roomName}</small>
                    </div>
                    <span>{schedule.startTime} - {schedule.endTime}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#888' }}>No classes scheduled for today.</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="dashboard-section">
            <Card.Body>
              <h3>Recent Enquiries</h3>
              {recentEnquiries.length > 0 ? (
                recentEnquiries.map((enquiry, index) => (
                  <div key={index} className="dashboard-list-item">
                    <div>
                      <strong>{enquiry.client}</strong><br />
                      <small>{enquiry.course}</small>
                    </div>
                    <StatusBadge status={enquiry.status} />
                  </div>
                ))
              ) : (
                <p style={{ color: '#888' }}>No recent enquiries found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
```

---

## 🗂️ State Management with Zustand

### App Store

**File:** `frontend/src/store/useAppStore.js`

```javascript
import { create } from 'zustand';

const useAppStore = create((set) => ({
  globalSearch: '',
  setGlobalSearch: (searchTerm) => set({ globalSearch: searchTerm }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), ...notification }]
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }))
}));

export default useAppStore;
```

### Auth Store (Enhanced)

**File:** `frontend/src/store/useAuthStore.js`

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) =>
        set({
          user: userData,
          token,
          isAuthenticated: true
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false
        }),

      switchRole: (newRole) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, role: newRole }
          });
          // Store in localStorage for persistence
          localStorage.setItem('userRole', newRole);
        }
      },

      updateUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData }
        }))
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
```

---

## 🔧 Custom Hooks

### useSearch Hook

**File:** `frontend/src/hooks/useSearch.js`

```javascript
import { useMemo } from 'react';

export const useSearch = (data, searchTerm, searchFields) => {
  return useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return data;
    }

    const term = searchTerm.toLowerCase();

    return data.filter(item => {
      return searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value && String(value).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchFields]);
};
```

### useSort Hook

**File:** `frontend/src/hooks/useSort.js`

```javascript
import { useMemo, useState } from 'react';

export const useSort = (data, initialKey = '', initialDirection = 'asc') => {
  const [sortConfig, setSortConfig] = useState({
    key: initialKey,
    direction: initialDirection
  });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
      const bVal = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

      if (aVal === bVal) return 0;

      const comparison = aVal > bVal ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { sortedData, requestSort, sortConfig };
};
```

### useModal Hook

**File:** `frontend/src/hooks/useModal.js`

```javascript
import { useState } from 'react';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (data = null) => {
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData(null);
  };

  return {
    isOpen,
    modalData,
    openModal,
    closeModal
  };
};
```

---

## 📡 Services

### Dashboard Service

**File:** `frontend/src/services/dashboardService.js`

```javascript
import api from '../utils/api';

export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getTodaySchedule = async () => {
  const response = await api.get('/dashboard/today-schedule');
  return response.data;
};

export const getRecentEnquiries = async (limit = 5) => {
  const response = await api.get(`/dashboard/recent-enquiries?limit=${limit}`);
  return response.data;
};
```

### Enquiry Service

**File:** `frontend/src/services/enquiryService.js`

```javascript
import api from '../utils/api';

export const getAllEnquiries = async (params = {}) => {
  const response = await api.get('/enquiries', { params });
  return response.data;
};

export const getEnquiryById = async (id) => {
  const response = await api.get(`/enquiries/${id}`);
  return response.data;
};

export const createEnquiry = async (data) => {
  const response = await api.post('/enquiries', data);
  return response.data;
};

export const updateEnquiry = async (id, data) => {
  const response = await api.put(`/enquiries/${id}`, data);
  return response.data;
};

export const deleteEnquiry = async (id) => {
  const response = await api.delete(`/enquiries/${id}`);
  return response.data;
};

export const updateEnquiryStatus = async (id, status) => {
  const response = await api.patch(`/enquiries/${id}/status`, { status });
  return response.data;
};

export const addNoteToEnquiry = async (id, content) => {
  const response = await api.post(`/enquiries/${id}/notes`, { content });
  return response.data;
};

export const sendQuotation = async (enquiryIds) => {
  const response = await api.post('/enquiries/send-quotation', { enquiryIds });
  return response.data;
};

export const sendAgreement = async (enquiryIds) => {
  const response = await api.post('/enquiries/send-agreement', { enquiryIds });
  return response.data;
};
```

---

## ✅ Next Steps

1. Follow patterns above to create remaining page components
2. Implement all modals (Enquiry, Nomination, Schedule, etc.)
3. Create service files for all entities
4. Test components individually
5. Integrate with backend APIs
6. Add responsive design tweaks
7. Test all workflows end-to-end

For detailed styling migration, see [STYLING_GUIDE.md](./STYLING_GUIDE.md).

For complete API documentation, see [API_REFERENCE.md](./API_REFERENCE.md).
