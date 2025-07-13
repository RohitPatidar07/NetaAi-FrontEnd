import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  User, Mail, Phone, MapPin, Calendar, Shield, Edit3, Save,
  X, Camera, Settings, Bell, Lock
} from 'lucide-react';
import BASE_URL from '../../config';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/getUserById/13`
      );
      const user = res.data.data;

      // Map API response to profile fields
      setProfileData({
        id: user.id || '',
        name: user.full_name || '',
        email: user.email || '',
        phone: user.phone_number || '',
        location: user.address || '',
        role: 'Admin',
        joinDate: user?.created_at.split('T')[0],
        department: 'IT',
        employeeId: `EMP${user.id}`,
      });

      setProfileImage(user?.image);
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    setSubmitStatus(null);

    const newformData = new FormData();
    const userId = profileData.id;

    newformData.append("full_name", profileData.name);
    newformData.append("email", profileData.email);
    newformData.append("phone_number", profileData.phone);
    newformData.append("address", profileData.location);

    // If there's a profile image, append it
    if (profileImage) {
      const blob = await fetch(profileImage).then(r => r.blob());
      newformData.append("image", blob, "profile.jpg");
    }

    try {
      const response = await axios.patch(
        `${BASE_URL}/user/editProfile/${userId}`,
        newformData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.status === 200) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error updating profile:', error);
    }

  };


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleCancel = () => {
    setIsEditing(false);
    fetchUserData(); // Re-fetch to reset to saved values
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!profileData) return <div className="text-center py-5">No profile data found.</div>;

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
        crossOrigin="anonymous"
      />

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
          <CheckCircle size={20} className="me-2" />
          Profile updated successfully!
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <AlertCircle size={20} className="me-2" />
          Failed to update profile. Please try again.
        </div>
      )}

      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-1">Admin Profile</h1>
            <p className="text-muted mb-0">Manage your personal information and settings</p>
          </div>
        </div>

        <div className="row g-4">
          {/* Profile Card */}
          {/* <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="position-relative d-inline-block mb-3">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '120px', height: '120px' }}>
                    <User size={48} className="text-white" />
                  </div>
                  <button className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0">
                    <Camera size={16} />
                  </button>
                </div>

                <h4 className="card-title mb-1">{profileData.name}</h4>
                <p className="text-muted mb-3">{profileData.role}</p>

                <div className="d-flex justify-content-center gap-2 mb-3">
                  <span className="badge bg-success-subtle text-success">
                    <Shield size={14} className="me-1" />
                    Active
                  </span>
                  <span className="badge bg-primary-subtle text-primary">
                    Admin
                  </span>
                </div>

                <div className="border-top pt-3">
                  <div className="row text-center">
                    <div className="col-4">
                      <div className="fw-bold">156</div>
                      <small className="text-muted">Actions</small>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold">23</div>
                      <small className="text-muted">Reports</small>
                    </div>
                    <div className="col-4">
                      <div className="fw-bold">98%</div>
                      <small className="text-muted">Uptime</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <h5 className="card-title mb-0">Profile Picture</h5>
              </div>
              <div className="card-body text-center">
                <div className="position-relative d-inline-block mb-3">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="rounded-circle"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{ width: '120px', height: '120px' }}>
                      <span className="text-white fw-bold" style={{ fontSize: 24 }}>
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-10"
                    onClick={() => document.getElementById('profileImageInput').click()}
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleImageUpload}
                  />
                </div>
                <p className="text-muted small mb-0">
                  Click the camera icon to upload a new photo
                </p>
                <p className="text-muted small">
                  JPG, PNG or GIF (max. 5MB)
                </p>
                {profileImage && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mt-2"
                    onClick={() => setProfileImage(null)}
                  >
                    <X size={16} className="me-1" />
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Profile Information</h5>
                <div className="btn-group">
                  {!isEditing ? (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 size={16} className="me-1" />
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleSave}
                      >
                        <Save size={16} className="me-1" />
                        Save
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleCancel}
                      >
                        <X size={16} className="me-1" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <User size={16} className="me-2" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext">{profileData.name}</p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Mail size={16} className="me-2" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        className="form-control"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext">{profileData.email}</p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Phone size={16} className="me-2" />
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        className="form-control"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext">{profileData.phone}</p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <MapPin size={16} className="me-2" />
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={profileData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext">{profileData.location}</p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Shield size={16} className="me-2" />
                      Role
                    </label>
                    <p className="form-control-plaintext">{profileData.role}</p>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Calendar size={16} className="me-2" />
                      Join Date
                    </label>
                    <p className="form-control-plaintext">{profileData.joinDate}</p>
                  </div>

                  {/* <div className="col-md-6">
                    <label className="form-label fw-semibold">Department</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        value={profileData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext">{profileData.department}</p>
                    )}
                  </div> */}

                  {/* <div className="col-md-6">
                    <label className="form-label fw-semibold">Employee ID</label>
                    <p className="form-control-plaintext">{profileData.employeeId}</p>
                  </div> */}

                  {/* <div className="col-12">
                    <label className="form-label fw-semibold">Bio</label>
                    {isEditing ? (
                      <textarea
                        className="form-control"
                        rows="3"
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                      />
                    ) : (
                      <p className="form-control-plaintext">{profileData.bio}</p>
                    )}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Preferences */}
        {/* <div className="row g-4 mt-2">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <h5 className="card-title mb-0">
                  <Lock size={20} className="me-2" />
                  Security Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">Password</div>
                      <small className="text-muted">Last updated 30 days ago</small>
                    </div>
                    <button className="btn btn-outline-primary btn-sm">Change</button>
                  </div>
                  <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">Two-Factor Authentication</div>
                      <small className="text-success">Enabled</small>
                    </div>
                    <button className="btn btn-outline-secondary btn-sm">Manage</button>
                  </div>
                  <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">Login Sessions</div>
                      <small className="text-muted">3 active sessions</small>
                    </div>
                    <button className="btn btn-outline-danger btn-sm">View</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom">
                <h5 className="card-title mb-0">
                  <Bell size={20} className="me-2" />
                  Preferences
                </h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">Email Notifications</div>
                      <small className="text-muted">System alerts and updates</small>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" defaultChecked />
                    </div>
                  </div>
                  <div className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">Push Notifications</div>
                      <small className="text-muted">Real-time alerts</small>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" defaultChecked />
                    </div>
                  </div>
                </div>
              </div >
            </div >
          </div >
        </div > */}
      </div >

      {/* Bootstrap JS */}
      <script script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
        crossOrigin="anonymous"
      ></script >
    </>
  );
};

export default AdminProfile;