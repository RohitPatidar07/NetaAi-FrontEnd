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