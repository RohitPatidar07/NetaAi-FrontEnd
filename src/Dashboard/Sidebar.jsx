import React from 'react';
import {
  Users, UserCheck, Settings, Plus, BarChart3,
  FileText, Bot, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FaDollarSign, FaLock } from 'react-icons/fa';

const Sidebar = ({ activeSection, setActiveSection, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const isMobile = () => window.innerWidth < 992;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, path: '' },
    { id: 'allusers', label: 'All Users', icon: Users, path: 'allusers' },
  
    { id: 'plans', label: 'Subscription Plan', icon: FaDollarSign, path: 'plans' },
    { id: 'chatbot', label: 'Chat Bot', icon: FileText, path: 'chatbot' },
      { id: 'adminprofile', label: 'Admin Profile', icon: UserCheck, path: 'adminprofile' },
  ];

  const handleNavigation = (id, path) => {
    // Always close the sidebar on mobile
    if (isMobile()) setSidebarOpen(false);

    if (id !== 'chatbot') {
      navigate(path ? `/dashboard/${path}` : '/dashboard');
    } else {
      navigate(path ? `/${path}` : '/chatbot');
    }

    setActiveSection(id);
  };

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  return (
    <div
      className="position-fixed top-10 start-0 vh-100 bg-white shadow-sm border-end"
      style={{
        width: '280px',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1050,
      }}
    >
      {/* Sidebar Header */}
      <div className="d-flex align-items-center justify-content-between p-3">
        <div className="d-flex align-items-center">
          {/* Optional branding */}
        </div>
        <button className="btn-close d-lg-none" onClick={() => setSidebarOpen(false)} />
      </div>

      {/* Navigation */}
      <nav className="p-3">
        <div className="nav nav-pills flex-column">
          {menuItems.map(({ id, label, icon: Icon, path }) => (
            <button
              key={id}
              onClick={() => handleNavigation(id, path)}
              className={`nav-link text-start d-flex align-items-center py-3 px-3 mb-1 border-0 ${activeSection === id ? 'active bg-primary text-white' : 'text-dark'
                }`}
            >
              <Icon size={20} className="me-3" />
              {label}
            </button>
          ))}
        </div>
        <div className="nav nav-pills flex-column">
          <button
            onClick={handleLogout}
            className={`nav-link text-start d-flex align-items-center py-3 px-3 mb-1 border-0
            }`}
          >
            <FaLock size={20} className="me-3" />
            Logout
          </button>
        </div>

      </nav>
    </div>
  );
};

export default Sidebar;
