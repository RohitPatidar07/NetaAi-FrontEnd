import React, { useEffect, useState } from 'react';
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
  const [adminNote, setAdminNote] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const navigate = useNavigate();

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
        const response = await axios.get(`${BASE_URL}/analytics`);
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchUsers();
    fetchFeedBacks();
    fetchAnalytics();
  }, []);

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
      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">All Users</h5>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => exportToCSV(userList, 'users')}
          >
            <Download size={16} className="me-1" /> Export CSV
          </button>
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
                    <button className="btn btn-sm btn-outline-primary">
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

  const renderAnalytics = () => (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <h5 className="card-title mb-0">System Analytics</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h6>User Growth</h6>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-around text-center">
                  <div>
                    <h3>{analyticsData?.dau || '0'}</h3>
                    <small className="text-muted">DAU</small>
                  </div>
                  <div>
                    <h3>{analyticsData?.wau || '0'}</h3>
                    <small className="text-muted">WAU</small>
                  </div>
                  <div>
                    <h3>{analyticsData?.mau || '0'}</h3>
                    <small className="text-muted">MAU</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-header">
                <h6>Top Queries</h6>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {analyticsData?.topQueries?.map((query, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {query.text}
                      <span className="badge bg-primary rounded-pill">{query.count}</span>
                    </li>
                  ))}
                </ul>
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
        <div>
          <h1 className="h2 mb-1">Dashboard Overview</h1>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your chatbot system.</p>
        </div>
        <div>
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
        </div>
      </div>

      {activeTab === 'dashboard' && (
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
      )}

      {activeTab === 'users' && (selectedUser ? renderUserProfile() : renderUserTable())}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default Dashboard;