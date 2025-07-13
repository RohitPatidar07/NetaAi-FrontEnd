// import React from 'react';
// import { Menu, Bot, Bell, User, Search } from 'lucide-react';

// const Header = ({ setSidebarOpen }) => {
//   return (
//     <header className="position-fixed bg-white border-bottom shadow-sm position-sticky top-0 z-3">
//       <div className="container-fluid">
//         <div className="d-flex align-items-center justify-content-between py-3">
//           {/* Sidebar Toggle Menu Button */}
//           <div className="d-flex align-items-center">
//             <button
//               className="btn btn-outline-secondary me-3"
//               onClick={() => setSidebarOpen(prev => !prev)}
//             >
//               <Menu size={20} />
//             </button>

//             {/* Logo */}
//             <div className="d-flex align-items-center">
//               <Bot size={28} className="text-primary me-2" />
//               <div>
//                 <h5 className="mb-0 fw-bold">Chatbot Admin</h5>
//                 <small className="text-muted">Management Dashboard</small>
//               </div>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="d-none d-md-flex flex-fill mx-4" style={{ maxWidth: '400px' }}>
//             <div className="input-group">
//               <span className="input-group-text bg-light border-end-0">
//                 <Search size={16} className="text-muted" />
//               </span>
//               <input
//                 type="text"
//                 className="form-control border-start-0 bg-light"
//                 placeholder="Search users, reports..."
//               />
//             </div>
//           </div>

//           {/* Profile & Notification */}
//           <div className="d-flex align-items-center">
//             {/* Notifications */}
//             <div className="dropdown me-3">
//               <button className="btn btn-outline-secondary position-relative" data-bs-toggle="dropdown">
//                 <Bell size={18} />
//                 <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
//                   3
//                 </span>
//               </button>
//               <ul className="dropdown-menu dropdown-menu-end">
//                 <li><h6 className="dropdown-header">Notifications</h6></li>
//                 <li><a className="dropdown-item" href="#">New user registered</a></li>
//                 <li><a className="dropdown-item" href="#">System report generated</a></li>
//                 <li><a className="dropdown-item" href="#">Backup completed</a></li>
//                 <li><hr className="dropdown-divider" /></li>
//                 <li><a className="dropdown-item text-center" href="#">View all</a></li>
//               </ul>
//             </div>

//             {/* User Profile */}
//             <div className="dropdown">
//               <button className="btn btn-outline-secondary d-flex align-items-center" data-bs-toggle="dropdown">
//                 <User size={18} className="me-2" />
//                 <span className="d-none d-sm-inline">Admin</span>
//               </button>
//               <ul className="dropdown-menu dropdown-menu-end">
//                 <li><h6 className="dropdown-header">Admin Account</h6></li>
//                 <li><a className="dropdown-item" href="#">Profile Settings</a></li>
//                 <li><a className="dropdown-item" href="#">Account Preferences</a></li>
//                 <li><a className="dropdown-item" href="#">Security</a></li>
//                 <li><hr className="dropdown-divider" /></li>
//                 <li><a className="dropdown-item text-danger" href="#">Sign Out</a></li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// import React from 'react';
// import { Menu, Bot, Bell, User, Search } from 'lucide-react';

// const Header = ({ setSidebarOpen }) => {
//   return (
//     <header className="position-fixed bg-white border-bottom shadow-sm position-sticky top-0 z-3">
//       <div className="container-fluid">
//         <div className="d-flex align-items-center justify-content-between py-3">
//           {/* Sidebar Toggle Menu Button */}
//           <div className="d-flex align-items-center">
//             <button
//               className="btn btn-outline-secondary me-3"
//               onClick={() => setSidebarOpen(prev => !prev)}
//             >
//               <Menu size={20} />
//             </button>


//             {/* Logo */}
//             <div className="d-flex align-items-center">
//               {/* <Bot size={28} className="text-primary me-2" /> */}
//               <div>
//                 {/* <h5 className="mb-0 fw-bold">Chatbot Admin</h5> */}
//                 <h5 className="mb-0 fw-bold">Admin</h5>
//                 {/* <small className="text-muted">Management Dashboard</small> */}
//               </div>
//             </div>
//           </div>

//           {/* Search */}
//           <div className="d-none d-md-flex flex-fill mx-4" style={{ maxWidth: '400px' }}>
//             <div className="input-group">
//               <span className="input-group-text bg-light border-end-0">
//                 <Search size={16} className="text-muted" />
//               </span>
//               <input
//                 type="text"
//                 className="form-control border-start-0 bg-light"
//                 placeholder="Search users, reports..."
//               />
//             </div>
//           </div>

//           {/* Profile & Notification */}
//           <div className="d-flex align-items-center">
//             {/* Notifications */}
//             <div className="dropdown me-3">
//               <button className="btn btn-outline-secondary position-relative" data-bs-toggle="dropdown" aria-expanded="false">
//                 <Bell size={18} />
//                 <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
//                   3
//                 </span>
//               </button>
//               <ul className="dropdown-menu dropdown-menu-end">
//                 <li><h6 className="dropdown-header">Notifications</h6></li>
//                 <li><a className="dropdown-item" href="#">New user registered</a></li>
//                 <li><a className="dropdown-item" href="#">System report generated</a></li>
//                 <li><a className="dropdown-item" href="#">Backup completed</a></li>
//                 <li><hr className="dropdown-divider" /></li>
//                 <li><a className="dropdown-item text-center" href="#">View all</a></li>
//               </ul>
//             </div>

//             {/* User Profile */}
//             <div className="dropdown">
//               <button className="btn btn-outline-secondary d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
//                 <User size={18} className="me-2" />
//                 <span className="d-none d-sm-inline">Admin</span>
//               </button>
//               <ul className="dropdown-menu dropdown-menu-end">
//                 <li><h6 className="dropdown-header">Admin Account</h6></li>
//                 <li><a className="dropdown-item" href="#">Profile Settings</a></li>
//                 <li><a className="dropdown-item" href="#">Account Preferences</a></li>
//                 <li><a className="dropdown-item" href="#">Security</a></li>
//                 <li><hr className="dropdown-divider" /></li>
//                 <li><a className="dropdown-item text-danger" href="#">Sign Out</a></li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useEffect, useState } from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../config';

const Header = ({ setSidebarOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/getAllUsers`);
        setUsers(response?.data?.data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = users.filter(user =>
        (user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        user.id !== 13
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, users]);

  const handleUserSelect = (user) => {
    // Navigate to update profile with selected user data
    navigate('/dashboard/updateprofile', { state: { userData: user } });
    // Clear search and results for better UX
    setSearchTerm('');
    setFilteredUsers([]);
  };

  return (
    <header className="position-fixed bg-white border-bottom shadow-sm position-sticky top-0 z-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between py-3">
          {/* Sidebar Toggle Menu Button */}
          <div className="d-flex ">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={() => setSidebarOpen(prev => !prev)}
              aria-label="Toggle sidebar"
              type="button"
            >
              <Menu size={20} />
            </button>

            {/* Logo */}
            <div className="d-flex align-items-center">
              <h5 className="mb-0 fw-bold" style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '0.03em' }}>Admin</h5>
            </div>
          </div>

          {/* Search */}
          <div className="d-none d-md-flex flex-fill mx-4 position-relative" style={{ maxWidth: '400px' }}>
            <div className="input-group w-100">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Search users, reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search users or reports"
                autoComplete="off"
              />
            </div>
            {filteredUsers.length > 0 && (
              <ul
                className="dropdown-menu show"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  marginTop: '0.25rem',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgb(0 0 0 / 0.15)',
                  zIndex: 1050,
                  backgroundColor: 'white',
                  padding: 0,
                  listStyle: 'none'
                }}
                role="listbox"
              >
                {filteredUsers.map(user => (
                  <li
                    key={user.id}
                    className="dropdown-item d-flex flex-column"
                    role="option"
                    tabIndex={0}
                    onClick={() => handleUserSelect(user)}
                    // onKeyPress={(e) => {
                    //   if (e.key === 'Enter' || e.key === ' ') {
                    //     e.preventDefault();
                    //     handleUserSelect(user);
                    //   }
                    // }}
                    style={{ cursor: 'pointer' }}
                    aria-label={`Select user ${user.full_name} with email ${user.email}`}
                  >
                    <span className="fw-semibold text-dark">{user.full_name}</span>
                    <small className="text-muted">{user.email}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Profile & Notification */}
          <div className="d-flex align-items-center">
            {/* Notifications */}
            {/* <div className="dropdown me-3">
              <button
                className="btn btn-outline-secondary position-relative"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="Notifications"
                type="button"
              >
                <Bell size={18} />
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.6rem' }}
                >
                  3
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><h6 className="dropdown-header">Notifications</h6></li>
                <li><a className="dropdown-item" href="#">New user registered</a></li>
                <li><a className="dropdown-item" href="#">System report generated</a></li>
                <li><a className="dropdown-item" href="#">Backup completed</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-center" href="#">View all</a></li>
              </ul>
            </div> */}

            {/* User Profile */}
            {/* <div className="dropdown">
              <button
                className="btn btn-outline-secondary d-flex align-items-center"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="User account menu"
                type="button"
              >
                <User size={18} className="me-2" />
                <span className="d-none d-sm-inline">Admin</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><h6 className="dropdown-header">Admin Account</h6></li>
                <li><a className="dropdown-item" onClick={() => navigate('/dashboard/adminprofile')}>Profile Settings</a></li>
                <li><a className="dropdown-item" href="#">Account Preferences</a></li>
                <li><a className="dropdown-item" href="#">Security</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-danger" href="#">Sign Out</a></li>
              </ul>
            </div> */}

            <button
              className="btn btn-outline-secondary d-flex align-items-center"
              type="button"
              onClick={() => navigate('/dashboard/adminprofile')}
            >
              <User size={18} className="me-2" />
              <span className="d-none d-sm-inline">Admin Profile</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;