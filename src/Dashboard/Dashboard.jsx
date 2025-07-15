import React, { useEffect, useState } from 'react';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

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
import './Dashboard.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dashboard = () => {
  const [users, setUsers] = useState('');
  const [userList, setUserList] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [user,setUser] = useState(null);


  const [adminNote, setAdminNote] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [dashboardData , setdashboardData] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

 


  // Register Chart.js components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

   const fetchSelectedUser = async (id) => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/users/${id}`);
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

  useEffect(() => {
    if(selectedUser?.id){
      fetchSelectedUser(selectedUser.id)
    }

  },[])

  // Demo data for visualization
  // const demoAnalyticsData = {
  //   dau: 1245,
  //   wau: 8432,
  //   mau: 35678,
  //   activeChats: 342,
  //   avgSessionDuration: 8.5, // in minutes
  //   topQueries: [
  //     { text: "How to reset password", count: 142 },
  //     { text: "Account verification process", count: 98 },
  //     { text: "Subscription pricing plans", count: 76 },
  //     { text: "Feature availability", count: 65 },
  //     { text: "Troubleshooting guide", count: 54 }
  //   ],
  //   userGrowth: {
  //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  //     values: [12500, 14200, 16800, 19500, 22300, 25600]
  //   },
  //   feedbackDistribution: {
  //     positive: 68,
  //     negative: 12,
  //     neutral: 20
  //   }
  // };

  // Use demo data if real data isn't available
  // const data = analyticsData || demoAnalyticsData;



  const data = {
  dau: dashboardData?.data?.active_users?.daily,
  wau: dashboardData?.data?.active_users?.weekly,
  mau: dashboardData?.data?.active_users?.monthly,
  totalSessions: 5500,
  avgSessionDuration: 8.4,
  platformUsage: {
    web: dashboardData?.data?.platform_usage?.web,
    ios: dashboardData?.data?.platform_usage?.ios
,
    android: dashboardData?.data?.platform_usage?.android
  },
  conversion: {
    free: 1200,
    trial: 300,
    paid: 600
  },
  topTopics: [
    { text: 'How to reset password?', count: 102 },
    { text: 'NEC lookup guide', count: 87 },
    // up to 10
  ],
  userGrowth: {
    new: [120, 190, 170, 220, 260, 300, 350],
    active: [80, 120, 140, 160, 190, 220, 250]
  }
};



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

 { console.log("Selected User", selectedUser)}

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/getAllUsers`);
        setUsers(response?.data?.data.length);
        setUserList(response?.data?.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchFeedBacks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/ai/feedback`);

        // Sort feedbacks by created_at in descending order (latest first)
        const sortedFeedbacks = response?.data?.feedbacks.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setFeedbacks(sortedFeedbacks);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/analytics`);
        console.log("dashAPI !!", response.data)
        setdashboardData(response.data);

        // setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchUsers();
    fetchFeedBacks();
    fetchAnalytics();
  }, []);

  console.log("Dashboard !!!", dashboardData);


  const stats = [
    { title: 'Total Users', value: users, change: '+12%', icon: Users, color: 'primary' },
    { title: 'Active Chats', value: '0', change: '+5%', icon: MessageSquare, color: 'success' },
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
    } catch (error) {
      console.error('Error flagging user:', error);
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await axios.post(`${BASE_URL}/user/deactivate`, { userId });
      alert('User deactivated successfully');
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const renderUserTable = () => (
    <div className="card border-0 shadow-sm">
      <div className='mb-4'>
        <button className='btn btn-outline-secondary'
          onClick={() => setActiveTab('dashboard')}
        >
          Back To Dashboard
        </button>
      </div>

      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={() => window.history.back()}
              title="Go back to previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
              </svg>
            </button>
            <h5 className="card-title mb-0">All Users</h5>
          </div>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-2"
              onClick={() => exportToCSV(userList, 'users')}
            >
              <Download size={16} className="me-1" /> Export CSV
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => exportToPDF(userList, 'users', ['ID', 'Name', 'Email', 'Tier', 'Status', 'Tags', 'Device', 'Sessions', 'Last Active'])}
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
                <th>Tier</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Device</th>
                <th>Sessions</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.tier === 'Platinum' ? 'bg-primary' :
                        user.tier === 'Gold' ? 'bg-warning text-dark' :
                          user.tier === 'Silver' ? 'bg-secondary' :
                            'bg-light text-dark' // Default for Free tier
                      }`}>
                      {user.tier || 'Free'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.active ? 'bg-success' : 'bg-secondary'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {user.tags?.map((tag, i) => (
                      <span key={i} className={`badge ${tag === 'VIP' ? 'bg-warning text-dark' :
                          tag === 'Beta Tester' ? 'bg-info' :
                            tag === 'Abuser' ? 'bg-danger' : 'bg-secondary'
                        } me-1`}>
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td>{user.device || 'Unknown'}</td>
                  <td>{user.sessionCount || 0}</td>
                  <td>{formatTimeDifference(user.lastActive)}</td>
                  <td>
                    <div className="d-flex">
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className={`btn btn-sm ${user.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeactivateUser(user.id);
                        }}
                      >
                        {user.active ? (
                          <>
                            <Power size={14} className="me-1" /> Deactivate
                          </>
                        ) : (
                          <>
                            <Power size={14} className="me-1" /> Activate
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUserProfile = () => 
    
    
    (
    
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">User Profile: {selectedUser.full_name}</h5>
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
                <p><strong>Name:</strong> {selectedUser.full_name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                <p><strong>Status:</strong>
                  <span className={`badge ${selectedUser.status ? 'bg-success' : 'bg-secondary'} ms-2`}>
                    {selectedUser.status === "active" ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-3">
              <h6>Device Information</h6>
              <div className="p-3 bg-light rounded">
                <p><strong>Platform:</strong> {selectedUser.device_usage?.web > 0 || 'Unknown'}</p>
                <p><strong>First Used:</strong> {selectedUser.created_at ? formatTimeDifference(selectedUser.firstUsed) : 'Unknown'}</p>
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
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* <div>
          <button 
            className="btn btn-outline-secondary me-2"
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart2 size={16} className="me-1" /> Analytics
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} className="me-1" /> Users
          </button>
        </div> */}

      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Stats Cards */}
          <div className="row g-4 mb-4">

             <div>
          <h1 className="h2 mb-1">Dashboard Overview</h1>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your chatbot system.</p>
        </div>

            {stats.map((stat, index) => (
              <div key={index} className="col-xl-3 col-md-6">
                <div
                  className="card h-100 border-0 shadow-sm"
                  onClick={() => stat.title === 'Total Users' ? setActiveTab('users') : null}
                  style={{
                    cursor: stat.title === 'Total Users' ? 'pointer' : 'default',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseOver={(e) => stat.title === 'Total Users' ? e.currentTarget.style.transform = 'translateY(-2px)' : null}
                  onMouseOut={(e) => stat.title === 'Total Users' ? e.currentTarget.style.transform = '' : null}
                >
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


{/* system analytics  */}
        <div className="card border-0 shadow-sm">
  <div className="card-header bg-white border-bottom">
    <div className="d-flex justify-content-between align-items-center">
      <h5 className="card-title mb-0">System Usage Analytics</h5>
      <div className="btn-group">
        <button className="btn btn-sm btn-outline-secondary">
          <Download size={16} className="me-1" /> Export Report
        </button>
      </div>
    </div>
  </div>

  <div className="card-body">
    <div className="row">
      {/* DAU/WAU/MAU + Session Info */}
      <div className="col-md-6">
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">User Activity Summary</h6>
            <span className="badge bg-info">Last 30 Days</span>
          </div>
          <div className="card-body">
            <div className="row text-center">
              <div className="col-4">
                <h3>{data.dau}</h3>
                <small className="text-muted">Daily Active Users</small>
              </div>
              <div className="col-4">
                <h3>{data.wau}</h3>
                <small className="text-muted">Weekly Active Users</small>
              </div>
              <div className="col-4">
                <h3>{data.mau}</h3>
                <small className="text-muted">Monthly Active Users</small>
              </div>
            </div>
            {/* <hr /> */}
            {/* <div className="row text-center">
              <div className="col-6">
                <h3>{data.totalSessions}</h3>
                <small className="text-muted">Total Sessions</small>
              </div>
              <div className="col-6">
                <h3>{data.avgSessionDuration} min</h3>
                <small className="text-muted">Avg. Session Duration</small>
              </div>
            </div> */}
          </div>
        </div>

        {/* Platform Usage */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Platform Usage Breakdown</h6>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-around text-center">
              <div>
                <i className="bi bi-globe2 fs-4 text-primary"></i>
                <p className="mb-0 mt-1">{data.platformUsage.web} Users<br /><small className="text-muted">Web</small></p>
              </div>
              <div>
                <i className="bi bi-phone fs-4 text-success"></i>
                <p className="mb-0 mt-1">{data.platformUsage.ios} Users<br /><small className="text-muted">iOS</small></p>
              </div>
              <div>
                <i className="bi bi-android2 fs-4 text-warning"></i>
                <p className="mb-0 mt-1">{data.platformUsage.android} Users<br /><small className="text-muted">Android</small></p>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="mb-0">Conversion Funnel</h6>
          </div>
          <div className="card-body">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between">
                <span>Free Users</span>
                <span>{data.conversion.free}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Trial Users</span>
                <span>{data.conversion.trial}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Paid Users</span>
                <span>{data.conversion.paid}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Side Charts */}
      <div className="col-md-6">
        {/* Usage Heatmap Placeholder */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Usage Heatmap</h6>
            <span className="badge bg-secondary">By Day/Hour</span>
          </div>
          <div className="card-body">
            <div className="chart-placeholder text-center text-muted" style={{ height: '200px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <small>Heatmap visualization coming here</small>
            </div>
          </div>
        </div>

        {/* Top Questions */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">Top 10 Most Asked Topics</h6>
            <span className="badge bg-primary">Global</span>
          </div>
          <div className="card-body">
            <ul className="list-group">
              {data.topTopics.map((topic, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="text-truncate" style={{ maxWidth: '70%' }} title={topic.text}>
                    {topic.text}
                  </div>
                  <span className="badge bg-primary rounded-pill">{topic.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h6 className="mb-0">User Growth (Monthly)</h6>
          </div>
          <div className="card-body">
            <div style={{ height: '250px' }}>
              {/* Chart.js Line chart component (same as before) */}
              <Line
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                  datasets: [
                    {
                      label: 'New Users',
                      data: data.userGrowth.new,
                      borderColor: 'rgb(75, 192, 192)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      tension: 0.3,
                      fill: true
                    },
                    {
                      label: 'Active Users',
                      data: data.userGrowth.active,
                      borderColor: 'rgb(54, 162, 235)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      tension: 0.3,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: value => value.toLocaleString()
                      }
                    },
                    x: {
                      grid: { display: false }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
      )}

      {activeTab === 'users' && (selectedUser ? renderUserProfile() : renderUserTable())}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default Dashboard;