import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname.split('/')[2]; // e.g. 'allusers'
    setActiveSection(path || 'dashboard');
  }, [location]);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <Header setSidebarOpen={setSidebarOpen} />

      {/* Body */}
      <div className="d-flex flex-grow-1 position-relative">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Content */}
        <div
          className="flex-grow-1 p-3 overflow-auto"
          style={{ marginLeft: sidebarOpen ? '280px' : '0px', transition: 'margin-left 0.3s ease' }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
