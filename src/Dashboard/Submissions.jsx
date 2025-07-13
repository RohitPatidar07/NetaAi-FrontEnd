import React, { useState } from 'react';
import {
  FileText,
  Eye,
  Download,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  RefreshCw,
  Archive
} from 'lucide-react';

const Submissions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('7d');

  const submissions = [
    {
      id: 'SUB-001',
      title: 'Chatbot Training Data Request',
      user: 'john.doe@example.com',
      type: 'Data Request',
      status: 'pending',
      priority: 'high',
      submittedAt: '2025-06-06 10:30 AM',
      description: 'Request for additional training data to improve chatbot responses in healthcare domain.',
      size: '2.3 MB',
      attachments: 3
    },
    {
      id: 'SUB-002',
      title: 'Bug Report - Chat Interface',
      user: 'sarah.wilson@example.com',
      type: 'Bug Report',
      status: 'approved',
      priority: 'medium',
      submittedAt: '2025-06-05 3:45 PM',
      description: 'Chat interface freezes when uploading files larger than 10MB.',
      size: '856 KB',
      attachments: 2
    },
    {
      id: 'SUB-003',
      title: 'Feature Enhancement Proposal',
      user: 'mike.johnson@example.com',
      type: 'Feature Request',
      status: 'rejected',
      priority: 'low',
      submittedAt: '2025-06-04 9:15 AM',
      description: 'Proposal to add voice recognition capabilities to the chatbot interface.',
      size: '1.7 MB',
      attachments: 5
    },
    {
      id: 'SUB-004',
      title: 'API Integration Documentation',
      user: 'emma.davis@example.com',
      type: 'Documentation',
      status: 'approved',
      priority: 'high',
      submittedAt: '2025-06-03 2:20 PM',
      description: 'Comprehensive documentation for third-party API integrations.',
      size: '4.1 MB',
      attachments: 8
    },
    {
      id: 'SUB-005',
      title: 'Performance Optimization Report',
      user: 'alex.brown@example.com',
      type: 'Report',
      status: 'pending',
      priority: 'medium',
      submittedAt: '2025-06-02 11:45 AM',
      description: 'Analysis and recommendations for improving chatbot response times.',
      size: '3.2 MB',
      attachments: 4
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'bg-warning-subtle text-warning', icon: AlertCircle, text: 'Pending' },
      approved: { class: 'bg-success-subtle text-success', icon: CheckCircle, text: 'Approved' },
      rejected: { class: 'bg-danger-subtle text-danger', icon: XCircle, text: 'Rejected' }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`badge ${config.class} d-flex align-items-center`}>
        <Icon size={12} className="me-1" />
        {config.text}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: 'bg-danger-subtle text-danger',
      medium: 'bg-warning-subtle text-warning',
      low: 'bg-secondary-subtle text-secondary'
    };
    
    return (
      <span className={`badge ${priorityConfig[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" 
        crossOrigin="anonymous" 
      />
      
      <div className="container-fluid p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">Submissions</h1>
            <p className="text-muted mb-0">Manage user submissions, requests, and reports</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary">
              <RefreshCw size={16} className="me-2" />
              Refresh
            </button>
            <button className="btn btn-outline-secondary">
              <Archive size={16} className="me-2" />
              Archive Selected
            </button>
            <button className="btn btn-primary">
              <Download size={16} className="me-2" />
              Export
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Search size={16} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search submissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <select 
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="col-md-2">
                <select 
                  className="form-select"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <div className="col-md-2">
                <select className="form-select">
                  <option value="all">All Types</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="data">Data Request</option>
                  <option value="documentation">Documentation</option>
                </select>
              </div>
              <div className="col-md-2">
                <button className="btn btn-outline-primary w-100">
                  <Filter size={16} className="me-2" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <FileText size={24} className="text-primary mb-2" />
                <h4 className="mb-1">{submissions.length}</h4>
                <small className="text-muted">Total Submissions</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <AlertCircle size={24} className="text-warning mb-2" />
                <h4 className="mb-1">{submissions.filter(s => s.status === 'pending').length}</h4>
                <small className="text-muted">Pending Review</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <CheckCircle size={24} className="text-success mb-2" />
                <h4 className="mb-1">{submissions.filter(s => s.status === 'approved').length}</h4>
                <small className="text-muted">Approved</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <XCircle size={24} className="text-danger mb-2" />
                <h4 className="mb-1">{submissions.filter(s => s.status === 'rejected').length}</h4>
                <small className="text-muted">Rejected</small>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">All Submissions</h5>
              <span className="badge bg-primary">GET /admin/submissions</span>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 fw-semibold">
                      <input type="checkbox" className="form-check-input" />
                    </th>
                    <th className="border-0 fw-semibold">ID</th>
                    <th className="border-0 fw-semibold">Title</th>
                    <th className="border-0 fw-semibold">User</th>
                    <th className="border-0 fw-semibold">Type</th>
                    <th className="border-0 fw-semibold">Status</th>
                    <th className="border-0 fw-semibold">Priority</th>
                    <th className="border-0 fw-semibold">Submitted</th>
                    <th className="border-0 fw-semibold">Size</th>
                    <th className="border-0 fw-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>
                        <input type="checkbox" className="form-check-input" />
                      </td>
                      <td className="fw-medium">{submission.id}</td>
                      <td>
                        <div>
                          <div className="fw-medium">{submission.title}</div>
                          <small className="text-muted">{submission.description}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <User size={16} className="text-muted me-2" />
                          <span className="text-muted">{submission.user}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary">
                          {submission.type}
                        </span>
                      </td>
                      <td>{getStatusBadge(submission.status)}</td>
                      <td>{getPriorityBadge(submission.priority)}</td>
                      <td>
                        <div className="d-flex align-items-center text-muted">
                          <Clock size={14} className="me-1" />
                          <small>{submission.submittedAt}</small>
                        </div>
                      </td>
                      <td className="text-muted">{submission.size}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" title="View">
                            <Eye size={14} />
                          </button>
                          <button className="btn btn-sm btn-outline-secondary" title="Download">
                            <Download size={14} />
                          </button>
                          <div className="dropdown">
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              data-bs-toggle="dropdown"
                              title="More actions"
                            >
                              <MoreVertical size={14} />
                            </button>
                            <ul className="dropdown-menu">
                              <li><a className="dropdown-item" href="#">Approve</a></li>
                              <li><a className="dropdown-item" href="#">Reject</a></li>
                              <li><hr className="dropdown-divider" /></li>
                              <li><a className="dropdown-item text-danger" href="#">Delete</a></li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-footer bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing {filteredSubmissions.length} of {submissions.length} submissions
              </small>
              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className="page-item disabled">
                    <span className="page-link">Previous</span>
                  </li>
                  <li className="page-item active">
                    <span className="page-link">1</span>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">2</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">3</a>
                  </li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap JS */}
      <script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" 
        crossOrigin="anonymous"
      ></script>
    </>
  );
};

export default Submissions;