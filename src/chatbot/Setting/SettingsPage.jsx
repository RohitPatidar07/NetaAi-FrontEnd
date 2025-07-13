import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';
import OpenRequest from './OpenRequest';
import UpdatePassword from './UpdatePassword';
import './Setting.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../config';
const SettingsUI = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Edit Profile');
  const [formData, setFormData] = useState({
    fullName: 'amanh',
    displayName: 'amanh',
    workFunction: '',
    preferences: 'e.g. remember I primarily code in Python (not a coding beginner)'
  });

  const userId = localStorage.getItem('user_id'); // Assuming user_id is stored here
  const token = localStorage.getItem('token'); // JWT token for auth
  // Delete Account Handler (already existing)
  const handleDeleteAccount = async () => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (!confirmed) return;

      const response = await axios.delete(`${BASE_URL}/user/deleteUserById/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        alert('Account deleted successfully.');
        localStorage.clear();
        window.location.href = '/';  // Redirect to home or login page
      } else {
        alert('Failed to delete account.');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      alert('An error occurred while deleting the account.');
    }
  };

  // Logout All Devices Handler (new)
  const handleLogoutAllDevices = async () => {
    if (!token) {
      alert('You are not logged in');
      return;
    }
    const confirmLogout = window.confirm('Are you sure you want to logout from all devices?');
    if (!confirmLogout) return;

    try {
      const response = await axios.post(
        `${BASE_URL}/user/logoutAll`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === 'true') {
        alert(response.data.message);
        localStorage.clear(); // Clear stored tokens/data
        window.location.href = '/login';  // Redirect to login page
      } else {
        alert('Failed to logout from all devices.');
      }
    } catch (error) {
      console.error('Logout all devices error:', error);
      alert('An error occurred during logout.');
    }
  };

  const sidebarItems = [
    'Edit Profile',
    'Open Request',
    'Account',
    'Update Password',
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    navigate("/chatbot");
  }

  const renderContent = () => {
    switch (activeTab.trim()) {
      case 'Edit Profile':
        return <EditProfile />;

      case 'Account':
        return (
          <section className="container ">
            <div className="card border rounded-4 p-4 bg-light">
              <h4 className="fw-bold mb-4">Account</h4>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5">Log out of all devices</span>
                <button
                  onClick={handleLogoutAllDevices}
                  className="btn btn-outline-danger px-4"
                >
                  Logout All Devices
                </button>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span className="fs-5">Delete your account</span>
                <button
                  onClick={handleDeleteAccount}
                  className="plan-btn fw-bold px-4 py-2 rounded"
                >
                  Delete account
                </button>
              </div>
            </div>
          </section>
        );

      case 'Open Request':
        return <OpenRequest />;

      case 'Update Password':
        return <UpdatePassword />;

      default:
        return <div>Select a setting from the sidebar</div>;
    }
  };

  return (
    <div className="container-fluid p-0" style={{ backgroundColor: '#fafafa', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Back Button - Top Left */}
      <button
        onClick={handleBack}
        className="btn btn-link position-absolute top-0 start-0 m-3"
        style={{ zIndex: 1 }}
      >
        <FaArrowLeft className="fs-4" />
      </button>

      <div className="row g-0" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <div className="col-lg-2 col-md-3 d-none d-md-block" style={{ backgroundColor: '#ffffff', borderRight: '1px solid #e9ecef', minHeight: '100vh' }}>
          <div className="p-4 mt-5">
            <h4 className="mb-4" style={{ color: '#333', fontWeight: '400', fontSize: '28px' }}>Settings</h4>
            <nav className="nav flex-column">
              {sidebarItems.map((item) => (
                <button
                  key={item}
                  className={`nav-link text-start border-0 bg-transparent mb-1 ${activeTab === item
                    ? 'text-primary fw-medium'
                    : 'text-dark'
                    }`}
                  onClick={() => setActiveTab(item)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    backgroundColor: activeTab === item ? '#f0f0f0' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Sidebar Tabs */}
        <div className="col-12 d-md-none">
          <div className="p-3">
            <h4 className="mb-3 mt-5" style={{ color: '#333', fontWeight: '400', fontSize: '24px' }}>Settings</h4>
            <div className="d-flex overflow-auto flex-wrap py-1">
              {sidebarItems.map((item) => (
                <button
                  key={item}
                  className={`plan-btn py-1 px-2 rounded me-2  ${activeTab === item
                    ? 'btn-primary'
                    : 'btn-outline-secondary'
                    }`}
                  onClick={() => setActiveTab(item)}
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '14px'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-10 col-md-9 col-12" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <div className="p-3 p-md-5 w-100">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Add this CSS for the hover effect */}
      <style jsx>{`
        .nav-link:hover {
          color: #0066cc !important;
        }
      `}</style>
    </div>
  );
};

export default SettingsUI;
