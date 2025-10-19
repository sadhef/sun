import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';

const RoleSwitcher = () => {
  const { user, switchRole } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState(user?.role || 'Admin');

  useEffect(() => {
    if (user?.role) {
      setSelectedRole(user.role);
    }
  }, [user]);

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
