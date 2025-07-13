import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Activity,
  Users,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const SystemReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [reportType, setReportType] = useState('overview');

  const reportMetrics = [
    {
      title: 'Total API Calls',
      value: '45,891',
      change: '+12.5%',
      trend: 'up',
      icon: Activity,
      color: 'primary'
    },
    {
      title: 'Response Time Avg',
      value: '142ms',
      change: '-8.2%',
      trend: 'down',
      icon: Clock,
      color: 'success'
    },
    {
      title: 'Error Rate',
      value: '0.32%',
      change: '+0.1%',
      trend: 'up',
      icon: AlertCircle,
      color: 'warning'
    },
    {
      title: 'Success Rate',
      value: '99.68%',
      change: '+0.2%',
      trend: 'up',
      icon: CheckCircle,
      color: 'success'
    }
  ];

  const recentReports = [
    {
      name: 'Weekly Performance Report',
      type: 'Performance',
      date: '2025-06-06',
      status: 'Generated',
      size: '2.4 MB'
    },
    {
      name: 'User Activity Analysis',
      type: 'Analytics',
      date: '2025-06-05',
      status: 'Generated',
      size: '1.8 MB'
    },
    {
      name: 'System Health Check',
      type: 'System',
      date: '2025-06-04',
      status: 'Generated',
      size: '892 KB'
    },
    {
      name: 'API Usage Summary',
      type: 'API',
      date: '2025-06-03',
      status: 'Generated',
      size: '1.2 MB'
    }
  ];

  const systemAlerts = [
    {
      type: 'warning',
      message: 'High memory usage detected on server-02',
      time: '2 hours ago'
    },
    {
      type: 'info',
      message: 'Database backup completed successfully',
      time: '6 hours ago'
    },
    {
      type: 'success',
      message: 'All services running optimally',
      time: '1 day ago'
    }
  ];

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
            <h1 className="h2 mb-1">System Reports</h1>
            <p className="text-muted mb-0">Monitor system performance and generate detailed reports</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary">
              <RefreshCw size={16} className="me-2" />
              Refresh
            </button>
            <button className="btn btn-primary">
              <Download size={16} className="me-2" />
              Export All
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Time Period</label>
                <select
                  className="form-select"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Report Type</label>
                <select
                  className="form-select"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="overview">Overview</option>
                  <option value="performance">Performance</option>
                  <option value="security">Security</option>
                  <option value="usage">Usage Analytics</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Format</label>
                <select className="form-select">
                  <option value="pdf">PDF Report</option>
                  <option value="csv">CSV Data</option>
                  <option value="json">JSON Export</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">&nbsp;</label>
                <button className="btn btn-primary w-100">
                  <Filter size={16} className="me-2" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="row g-4 mb-4">
          {reportMetrics.map((metric, index) => (
            <div key={index} className="col-xl-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="card-subtitle mb-2 text-muted">{metric.title}</h6>
                      <h3 className="card-title mb-1">{metric.value}</h3>
                      <small className={`text-${metric.trend === 'up' ? (metric.color === 'warning' ? 'warning' : 'success') : 'success'}`}>
                        {metric.change} from last period
                      </small>
                    </div>
                    <div className={`bg-${metric.color} rounded-3 p-3`}>
                      <metric.icon size={24} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Recent Reports */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">Recent Reports</h5>
                  <span className="badge bg-primary">GET /admin/reports</span>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 fw-semibold">Report Name</th>
                        <th className="border-0 fw-semibold">Type</th>
                        <th className="border-0 fw-semibold">Generated</th>
                        <th className="border-0 fw-semibold">Status</th>
                        <th className="border-0 fw-semibold">Size</th>
                        <th className="border-0 fw-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReports.map((report, index) => (
                        <tr key={index}>
                          <td className="fw-medium">{report.name}</td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary">
                              {report.type}
                            </span>
                          </td>
                          <td className="text-muted">{report.date}</td>
                          <td>
                            <span className="badge bg-success-subtle text-success">
                              {report.status}
                            </span>
                          </td>
                          <td className="text-muted">{report.size}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-2">
                              <Download size={14} />
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom">
                <h5 className="card-title mb-0">System Alerts</h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="list-group-item px-0 py-3 border-0">
                      <div className="d-flex align-items-start">
                        <div className={`rounded-circle me-3 mt-1 ${alert.type === 'warning' ? 'bg-warning' :
                            alert.type === 'success' ? 'bg-success' : 'bg-info'
                          }`} style={{ width: '8px', height: '8px' }}></div>
                        <div className="flex-grow-1">
                          <p className="mb-1 small">{alert.message}</p>
                          <small className="text-muted">{alert.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-3">
                  <button className="btn btn-outline-primary btn-sm">
                    View All Alerts
                  </button>
                </div>
              </div>
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

export default SystemReports;