import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Download, PieChart } from 'react-feather';
import Heatmap from 'react-heatmap-grid';

const SystemAnalytics = ({ data, userData = null }) => {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            {userData ? `${userData.name}'s Usage Analytics` : 'System Analytics'}
          </h5>
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-secondary">
              <Download size={16} className="me-1" /> Export Report
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            {/* User Metrics */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  {userData ? 'User Metrics' : 'Global User Metrics'}
                </h6>
                <span className="badge bg-info">Last 30 Days</span>
              </div>
              <div className="card-body">
                {userData ? (
                  <div className="row text-center">
                    <div className="col-4">
                      <h3>{userData.sessions}</h3>
                      <small className="text-muted">Total Sessions</small>
                    </div>
                    <div className="col-4">
                      <h3>{userData.avgSessionDuration}m</h3>
                      <small className="text-muted">Avg Session Duration</small>
                    </div>
                    <div className="col-4">
                      <h3>{userData.platformUsage.main}</h3>
                      <small className="text-muted">Primary Platform</small>
                    </div>
                    {userData.usageAnomalies && (
                      <>
                        <hr className="mt-3" />
                        <div className="col-12 text-start">
                          <h6>Usage Flags:</h6>
                          <ul>
                            {userData.usageAnomalies.map((flag, i) => (
                              <li key={i} className="text-warning">{flag}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="row text-center">
                      <div className="col-4">
                        <h3>{data.dau.toLocaleString()}</h3>
                        <small className="text-muted">Daily Active Users</small>
                      </div>
                      <div className="col-4">
                        <h3>{data.wau.toLocaleString()}</h3>
                        <small className="text-muted">Weekly Active Users</small>
                      </div>
                      <div className="col-4">
                        <h3>{data.mau.toLocaleString()}</h3>
                        <small className="text-muted">Monthly Active Users</small>
                      </div>
                    </div>
                    <hr />
                    <div className="row text-center">
                      <div className="col-6">
                        <h3>{data.activeChats}</h3>
                        <small className="text-muted">Active Chats</small>
                      </div>
                      <div className="col-6">
                        <h3>{data.avgSessionDuration}m</h3>
                        <small className="text-muted">Avg Session Duration</small>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* User Growth Chart or User Topics */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  {userData ? 'Most Common Topics' : 'User Growth Trend'}
                </h6>
                {!userData && (
                  <div className="btn-group">
                    <button className="btn btn-sm btn-outline-secondary">Last 30 Days</button>
                    <button className="btn btn-sm btn-outline-secondary">Last 90 Days</button>
                  </div>
                )}
              </div>
              <div className="card-body">
                <div style={{ height: '300px' }}>
                  {userData ? (
                    <ul className="list-group">
                      {userData.commonTopics.map((topic, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          <div className="text-truncate" style={{ maxWidth: '70%' }} title={topic.text}>
                            {topic.text}
                          </div>
                          <span className="badge bg-primary rounded-pill">{topic.count}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Line
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                        datasets: [
                          {
                            label: 'New Users',
                            data: [120, 190, 170, 220, 260, 300, 350],
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.3,
                            fill: true
                          },
                          {
                            label: 'Active Users',
                            data: [80, 120, 140, 160, 190, 220, 250],
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
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            mode: 'index',
                            intersect: false,
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              drawBorder: false
                            },
                            ticks: {
                              callback: function (value) {
                                return value.toLocaleString();
                              }
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            }
                          }
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Usage Heatmap */}
            {!userData && (
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">Usage Heatmap</h6>
                </div>
                <div className="card-body">
                  <div style={{ height: '250px' }}>
                    <Heatmap
                      xLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
                      yLabels={Array.from({length: 24}, (_, i) => `${i}:00`)}
                      data={data.usageHeatmap}
                      height={30}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-md-6">
            {/* Top Queries or Platform Usage */}
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  {userData ? 'Platform Usage' : 'Top Queries'}
                </h6>
                {!userData && <span className="badge bg-primary">Last 7 Days</span>}
              </div>
              <div className="card-body">
                {userData ? (
                  <div className="row">
                    <div className="col-md-6">
                      <Doughnut
                        data={{
                          labels: ['Web', 'iOS', 'Android'],
                          datasets: [{
                            data: [
                              userData.platformUsage.web,
                              userData.platformUsage.ios,
                              userData.platformUsage.android
                            ],
                            backgroundColor: [
                              'rgba(54, 162, 235, 0.7)',
                              'rgba(255, 99, 132, 0.7)',
                              'rgba(75, 192, 192, 0.7)'
                            ],
                            borderWidth: 1
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex flex-column justify-content-center h-100">
                        {Object.entries(userData.platformUsage).map(([platform, value]) => (
                          platform !== 'main' && (
                            <div key={platform} className="mb-2">
                              <div className="d-flex justify-content-between">
                                <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                                <span>{value}%</span>
                              </div>
                              <div className="progress" style={{ height: '8px' }}>
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ 
                                    width: `${value}%`,
                                    backgroundColor: [
                                      'rgba(54, 162, 235, 0.7)',
                                      'rgba(255, 99, 132, 0.7)',
                                      'rgba(75, 192, 192, 0.7)'
                                    ][['web', 'ios', 'android'].indexOf(platform)]
                                  }} 
                                />
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <ul className="list-group">
                    {data.topQueries.map((query, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="text-truncate" style={{ maxWidth: '70%' }} title={query.text}>
                          {query.text}
                        </div>
                        <span className="badge bg-primary rounded-pill">{query.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Conversion Funnel or Feedback Distribution */}
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  {userData ? 'Activity Breakdown' : 'Conversion Funnel'}
                </h6>
              </div>
              <div className="card-body">
                {userData ? (
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="display-4 text-primary">{userData.activity.messages}</div>
                      <small className="text-muted">Messages Sent</small>
                    </div>
                    <div className="col-4">
                      <div className="display-4 text-info">{userData.activity.logins}</div>
                      <small className="text-muted">Logins</small>
                    </div>
                    <div className="col-4">
                      <div className="display-4 text-success">{userData.activity.featuresUsed}</div>
                      <small className="text-muted">Features Used</small>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ height: '200px' }}>
                      <Bar
                        data={{
                          labels: ['Free Users', 'Trial Users', 'Paid Users'],
                          datasets: [{
                            label: 'Conversion',
                            data: data.conversionFunnel,
                            backgroundColor: [
                              'rgba(54, 162, 235, 0.7)',
                              'rgba(255, 206, 86, 0.7)',
                              'rgba(75, 192, 192, 0.7)'
                            ],
                            borderWidth: 1
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="row text-center mt-3">
                      <div className="col-4">
                        <div className="text-success">
                          {((data.conversionFunnel[2] / data.conversionFunnel[0]) * 100).toFixed(1)}%
                        </div>
                        <small className="text-muted">Overall Conversion</small>
                      </div>
                      <div className="col-4">
                        <div className="text-warning">
                          {((data.conversionFunnel[1] / data.conversionFunnel[0]) * 100).toFixed(1)}%
                        </div>
                        <small className="text-muted">Trial Conversion</small>
                      </div>
                      <div className="col-4">
                        <div className="text-info">
                          {((data.conversionFunnel[2] / data.conversionFunnel[1]) * 100).toFixed(1)}%
                        </div>
                        <small className="text-muted">Paid Conversion</small>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalytics;