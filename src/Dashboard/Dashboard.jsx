//  import React, { useEffect, useState } from 'react';
// import {
//   Users,
//   MessageSquare,
// } from 'lucide-react';
// import axios from 'axios';
// import BASE_URL from '../../config';
// import { Link, useNavigate } from 'react-router-dom';
// import { ThumbsDown, ThumbsUp } from 'react-feather';
// import './Dashboard.css';

// const Dashboard = () => {
//   const [users, setUsers] = useState('');
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [showAll, setShowAll] = useState(false);
//   const navigate = useNavigate();

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5; // Number of items per page

//   // Determine visible feedbacks based on showAll
//   const visibleFeedbacks = showAll
//     ? feedbacks
//     : feedbacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   // Calculate total pages
//   const totalPages = showAll
//     ? 1
//     : Math.ceil(feedbacks.length / itemsPerPage);

//   // Calculate start index for displaying entries
//   const startIndex = (currentPage - 1) * itemsPerPage;

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/user/getAllUsers`);
//         setUsers(response?.data?.data.length);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       }
//     };

//     const fetchFeedBacks = async () => {
//       try {
//         const response = await axios.get(`${BASE_URL}/ai/feedback`);

//         // Sort feedbacks by created_at in descending order (latest first)
//         const sortedFeedbacks = response?.data?.feedbacks.sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         );

//         setFeedbacks(sortedFeedbacks);
//       } catch (error) {
//         console.error('Error fetching feedbacks:', error);
//       }
//     };

//     fetchUsers();
//     fetchFeedBacks();
//   }, []);

//   const stats = [
//     { title: 'Total Users', value: users, change: '+12%', icon: Users, color: 'primary' },
//     { title: 'Active Chats', value: '0', change: '+5%', icon: MessageSquare, color: 'success' },
//   ];

//   const getActivityIcon = (type) => {
//     switch (type) {
//       case 'thumbs-down': return <ThumbsDown size={16} className="text-primary" />;
//       case 'thumbs-up': return <ThumbsUp size={16} className="text-info" />;
//       default: return <ThumbsDown size={16} className="text-muted" />;
//     }
//   };

//   const formatTimeDifference = (createdAt) => {
//     const createdTime = new Date(createdAt);
//     const currentTime = new Date();
//     const difference = currentTime - createdTime;

//     const seconds = Math.floor(difference / 1000);
//     const minutes = Math.floor(seconds / 60);
//     const hours = Math.floor(minutes / 60);
//     const days = Math.floor(hours / 24);

//     const timeParts = [];
//     if (days > 0) timeParts.push(`${days}D`);
//     if (hours % 24 > 0) timeParts.push(`${hours % 24}h`);
//     if (minutes % 60 > 0) timeParts.push(`${minutes % 60}m`);

//     return timeParts.join(' ');
//   };

//   return (
//     <div className="container-fluid">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h1 className="h2 mb-1">Dashboard Overview</h1>
//           <p className="text-muted mb-0">Welcome back! Here's what's happening with your chatbot system.</p>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="row g-4 mb-4">
//         {stats.map((stat, index) => (
//           <div key={index} className="col-xl-3 col-md-6">
//             <div className="card h-100 border-0 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex align-items-center justify-content-between">
//                   <div>
//                     <h6 className="card-subtitle mb-2 text-muted">{stat.title}</h6>
//                     <h3 className="card-title mb-1">{stat.value}</h3>
//                   </div>
//                   <div className={`bg-${stat.color} rounded-3 p-3`}>
//                     <stat.icon size={24} className="text-white" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Feedbacks */}
//       <div className="row">
//         <div className="col-lg">
//           <div className="card border-0 shadow-sm h-100">
//             <div className="card-header bg-white border-bottom">
//               <div className="d-flex justify-content-between align-items-center">
//                 <h5 className="card-title mb-0">Recent Feedbacks</h5>
//                 <button
//                   className="btn btn-sm btn-outline-primary"
//                   onClick={() => {
//                     setShowAll(!showAll);
//                     setCurrentPage(1); // Reset to first page on toggle
//                   }}
//                 >
//                   {showAll ? 'Show Less' : 'View All'}
//                 </button>
//               </div>
//             </div>
//             <div className="card-body">
//               <div className="table-responsive">
//                 <table className="table table-borderless">
//                   <thead>
//                     <tr>
//                       <th>Index</th>
//                       <th>Reaction</th>
//                       <th>Feedback</th>
//                       <th className="question-column">Prompt</th>
//                       <th>Email</th>
//                       <th className="time-column">Time</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {visibleFeedbacks.map((activity, index) => (
//                       <tr key={activity.id}>
//                         <td>{startIndex + index + 1}</td>
//                         <td>{getActivityIcon(activity.feedback)}</td>
//                         <td className="question-column">{activity.reason}</td>
//                         <td className="question-column">{activity.question}</td>
//                         <td>{activity.email}</td>
//                         <td className="time-column">{formatTimeDifference(activity.created_at)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             <div className="card-footer bg-white">
//               <div className="d-flex justify-content-between align-items-center">
//                 <small className="text-muted">
//                   Showing {visibleFeedbacks.length ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, feedbacks.length)} of {feedbacks.length} entries
//                 </small>
//                 <nav>
//                   <ul className="pagination pagination-sm mb-0">
//                     <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//                       <button
//                         className="page-link"
//                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                         disabled={currentPage === 1}
//                       >
//                         &laquo;
//                       </button>
//                     </li>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                       <li
//                         key={page}
//                         className={`page-item ${currentPage === page ? 'active' : ''}`}
//                       >
//                         <button
//                           className="page-link"
//                           onClick={() => setCurrentPage(page)}
//                         >
//                           {page}
//                         </button>
//                       </li>
//                     ))}
//                     <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//                       <button
//                         className="page-link"
//                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                         disabled={currentPage === totalPages}
//                       >
//                         &raquo;
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useEffect, useState, useRef } from 'react';
import {
  Users,
  MessageSquare,
  Flag,
  FileText,
  Download,
  Clock,
  Activity,
  Calendar,
  PieChart,
  BarChart2,
  Settings,
  Edit,
  Power
} from 'lucide-react';
import axios from 'axios';
import BASE_URL from '../../config';
import { Link, useNavigate } from 'react-router-dom';
import { ThumbsDown, ThumbsUp } from 'react-feather';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import './Dashboard.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const Dashboard = () => {
  const [users, setUsers] = useState('');
  const [userList, setUserList] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const refreshInterval = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Determine visible feedbacks based on showAll
  const visibleFeedbacks = showAll
    ? feedbacks
    : feedbacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Calculate total pages
  const totalPages = showAll
    ? 1
    : Math.ceil(feedbacks.length / itemsPerPage);

  // Calculate start index for displaying entries
  const startIndex = (currentPage - 1) * itemsPerPage;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [usersRes, feedbacksRes, analyticsRes] = await Promise.all([
        axios.get(`${BASE_URL}/user/getAllUsers`),
        axios.get(`${BASE_URL}/ai/feedback`),
        axios.get(`${BASE_URL}/analytics?range=${timeRange}`)
      ]);

      setUsers(usersRes?.data?.data.length);
      setUserList(usersRes?.data?.data);

      // Sort feedbacks by created_at in descending order (latest first)
      const sortedFeedbacks = feedbacksRes?.data?.feedbacks.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setFeedbacks(sortedFeedbacks);

      setAnalyticsData(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 5 minutes
    refreshInterval.current = setInterval(fetchData, 300000);
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [timeRange]);

  const stats = [
    { title: 'Total Users', value: users, change: '+12%', icon: Users, color: 'primary' },
    { title: 'Active Chats', value: analyticsData?.activeChats || '0', change: '+5%', icon: MessageSquare, color: 'success' },
    { title: 'DAU', value: analyticsData?.dau || '0', change: '+3%', icon: Activity, color: 'info' },
    { title: 'Avg Session', value: analyticsData?.avgSessionDuration ? `${Math.floor(analyticsData.avgSessionDuration / 60)}m` : '0m', change: '+2%', icon: Clock, color: 'warning' },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'thumbs-down': return <ThumbsDown size={16} className="text-primary" />;
      case 'thumbs-up': return <ThumbsUp size={16} className="text-info" />;
      default: return <ThumbsDown size={16} className="text-muted" />;
    }
  };

  const formatTimeDifference = (createdAt) => {
    const createdTime = new Date(createdAt);
    const currentTime = new Date();
    const difference = currentTime - createdTime;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const timeParts = [];
    if (days > 0) timeParts.push(`${days}D`);
    if (hours % 24 > 0) timeParts.push(`${hours % 24}h`);
    if (minutes % 60 > 0) timeParts.push(`${minutes % 60}m`);

    return timeParts.join(' ') || 'Just now';
  };

  const exportToCSV = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.csv`);
  };

  const exportToPDF = (data, fileName, columns) => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns],
      body: data.map(item => columns.map(col => item[col.toLowerCase().replace(' ', '_')] || '')),
    });
    doc.save(`${fileName}.pdf`);
  };

  const handleAddNote = async (userId) => {
    try {
      await axios.post(`${BASE_URL}/user/note`, {
        userId,
        note: adminNote
      });
      setAdminNote('');
      alert('Note added successfully');
      fetchData();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleFlagUser = async (userId) => {
    try {
      await axios.post(`${BASE_URL}/user/flag`, {
        userId,
        reason: flagReason
      });
      setFlagReason('');
      alert('User flagged successfully');
      fetchData();
    } catch (error) {
      console.error('Error flagging user:', error);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await axios.post(`${BASE_URL}/user/deactivate`, { userId });
        alert('User deactivated successfully');
        fetchData();
      } catch (error) {
        console.error('Error deactivating user:', error);
      }
    }
  };

  // Chart data configurations
  const userGrowthData = {
    labels: analyticsData?.userGrowth?.labels || [],
    datasets: [
      {
        label: 'Daily Active Users',
        data: analyticsData?.userGrowth?.dau || [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Weekly Active Users',
        data: analyticsData?.userGrowth?.wau || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Monthly Active Users',
        data: analyticsData?.userGrowth?.mau || [],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const sessionData = {
    labels: analyticsData?.sessionDuration?.labels || [],
    datasets: [
      {
        label: 'Average Session Duration (minutes)',
        data: analyticsData?.sessionDuration?.values?.map(d => d / 60) || [],
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
        tension: 0.1,
      },
    ],
  };

  const feedbackData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [
          analyticsData?.feedbackDistribution?.positive || 0,
          analyticsData?.feedbackDistribution?.negative || 0,
          analyticsData?.feedbackDistribution?.neutral || 0,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(201, 203, 207, 0.5)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const queryData = {
    labels: analyticsData?.queryVolume?.labels || [],
    datasets: [
      {
        label: 'Queries per Hour',
        data: analyticsData?.queryVolume?.values || [],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const renderDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="card-subtitle mb-2 text-muted">{stat.title}</h6>
                    <h3 className="card-title mb-1">{stat.value}</h3>
                    <small className={`text-${stat.change.startsWith('+') ? 'success' : 'danger'}`}>
                      {stat.change} from yesterday
                    </small>
                  </div>
                  <div className={`bg-${stat.color} rounded-3 p-3`}>
                    <stat.icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Feedbacks */}
      <div className="row">
        <div className="col-lg">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Recent Feedbacks</h5>
                <div>
                  <button
                    className="btn btn-sm btn-outline-secondary me-2"
                    onClick={() => exportToCSV(feedbacks, 'feedbacks')}
                  >
                    <Download size={16} className="me-1" /> Export CSV
                  </button>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      setShowAll(!showAll);
                      setCurrentPage(1);
                    }}
                  >
                    {showAll ? 'Show Less' : 'View All'}
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-borderless">
                  <thead>
                    <tr>
                      <th>Index</th>
                      <th>Reaction</th>
                      <th>Feedback</th>
                      <th className="question-column">Prompt</th>
                      <th>Email</th>
                      <th className="time-column">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleFeedbacks.map((activity, index) => (
                      <tr key={activity.id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{getActivityIcon(activity.feedback)}</td>
                        <td className="question-column">{activity.reason}</td>
                        <td className="question-column">{activity.question}</td>
                        <td>{activity.email}</td>
                        <td className="time-column">{formatTimeDifference(activity.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {visibleFeedbacks.length ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, feedbacks.length)} of {feedbacks.length} entries
                </small>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        &laquo;
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">All Users</h5>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={() => exportToCSV(userList, 'users')}
            >
              <Download size={16} className="me-1" /> Export CSV
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => exportToPDF(userList, 'users', ['ID', 'Name', 'Email', 'Status', 'Device', 'Sessions', 'Last Active'])}
            >
              <FileText size={16} className="me-1" /> Export PDF
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Device</th>
                <th>Sessions</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map(user => (
                <tr key={user.id} onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer' }}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.active ? 'bg-success' : 'bg-secondary'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{user.device || 'Unknown'}</td>
                  <td>{user.sessionCount || 0}</td>
                  <td>{formatTimeDifference(user.lastActive)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1">
                      <Edit size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUserProfile = () => (
    selectedUser && (
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">User Profile: {selectedUser.name}</h5>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedUser(null)}>
              Back to list
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <h6>Basic Information</h6>
                <div className="p-3 bg-light rounded">
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> 
                    <span className={`badge ${selectedUser.active ? 'bg-success' : 'bg-secondary'} ms-2`}>
                      {selectedUser.active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <h6>Device Information</h6>
                <div className="p-3 bg-light rounded">
                  <p><strong>Platform:</strong> {selectedUser.device || 'Unknown'}</p>
                  <p><strong>First Used:</strong> {selectedUser.firstUsed ? formatTimeDifference(selectedUser.firstUsed) : 'Unknown'}</p>
                  <p><strong>Last Active:</strong> {formatTimeDifference(selectedUser.lastActive)}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <h6>Activity Statistics</h6>
                <div className="p-3 bg-light rounded">
                  <p><strong>Total Sessions:</strong> {selectedUser.sessionCount || 0}</p>
                  <p><strong>Avg Session Duration:</strong> {selectedUser.avgSessionDuration ? `${Math.floor(selectedUser.avgSessionDuration / 60)}m` : '0m'}</p>
                  <p><strong>Feedback Given:</strong> {selectedUser.feedbackCount || 0}</p>
                  <p><strong>Last Feedback:</strong> {selectedUser.lastFeedback ? formatTimeDifference(selectedUser.lastFeedback) : 'Never'}</p>
                </div>
              </div>

              <div className="mb-3">
                <h6>Admin Actions</h6>
                <div className="p-3 bg-light rounded">
                  <div className="mb-2">
                    <label className="form-label">Add Note</label>
                    <div className="d-flex">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                        placeholder="Add admin note..."
                      />
                      <button className="btn btn-sm btn-primary ms-2" onClick={() => handleAddNote(selectedUser.id)}>
                        Save
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label">Flag User</label>
                    <div className="d-flex">
                      <select
                        className="form-select form-select-sm"
                        value={flagReason}
                        onChange={(e) => setFlagReason(e.target.value)}
                      >
                        <option value="">Select reason</option>
                        <option value="spam">Spam</option>
                        <option value="inappropriate">Inappropriate Content</option>
                        <option value="abuse">Abuse</option>
                      </select>
                      <button className="btn btn-sm btn-warning ms-2" onClick={() => handleFlagUser(selectedUser.id)}>
                        <Flag size={14} className="me-1" /> Flag
                      </button>
                    </div>
                  </div>

                  <button className="btn btn-sm btn-danger w-100" onClick={() => handleDeactivateUser(selectedUser.id)}>
                    <Power size={14} className="me-1" /> Deactivate User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderAnalytics = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">System Analytics</h5>
          <div className="btn-group">
            <button 
              className={`btn btn-sm btn-outline-secondary ${timeRange === '24h' ? 'active' : ''}`}
              onClick={() => setTimeRange('24h')}
            >
              24 Hours
            </button>
            <button 
              className={`btn btn-sm btn-outline-secondary ${timeRange === '7d' ? 'active' : ''}`}
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </button>
            <button 
              className={`btn btn-sm btn-outline-secondary ${timeRange === '30d' ? 'active' : ''}`}
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* User Growth */}
            <div className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <Line 
                    data={userGrowthData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        tooltip: { mode: 'index', intersect: false },
                      },
                      scales: {
                        y: { beginAtZero: true }
                      },
                      interaction: { mode: 'nearest', axis: 'x', intersect: false }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Session Duration */}
            <div className="col-lg-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <Line 
                    data={sessionData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Feedback Distribution */}
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body d-flex justify-content-center" style={{ height: '250px' }}>
                  <Pie 
                    data={feedbackData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'right' },
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Query Volume */}
            <div className="col-lg-8">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <Bar 
                    data={queryData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Top Queries Table */}
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white">
                  <h5 className="mb-0">Top Queries</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Query</th>
                          <th>Count</th>
                          <th>Last Asked</th>
                          <th>Positive Feedback</th>
                          <th>Negative Feedback</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData?.topQueries?.map((query, index) => (
                          <tr key={index}>
                            <td>{query.text}</td>
                            <td>{query.count}</td>
                            <td>{new Date(query.lastAsked).toLocaleString()}</td>
                            <td>{query.positiveFeedback || 0}</td>
                            <td>{query.negativeFeedback || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Admin Dashboard</h1>
          <p className="text-muted mb-0">
            {activeTab === 'dashboard' && 'System overview and recent activity'}
            {activeTab === 'users' && 'User management and profiles'}
            {activeTab === 'analytics' && 'Detailed analytics and metrics'}
          </p>
        </div>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={16} className="me-1" /> Dashboard
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} className="me-1" /> Users
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart2 size={16} className="me-1" /> Analytics
          </button>
        </li>
      </ul>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'users' && (selectedUser ? renderUserProfile() : renderUsers())}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default Dashboard;