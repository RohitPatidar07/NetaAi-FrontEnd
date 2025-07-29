import React, { useEffect, useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Lock,
    Camera,
    Save,
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    X,
    ShieldCheck,
    BadgeCheck,
    Smartphone,
    Monitor,
    Globe,
    Calendar,
    Crown,
    Gift,
    Activity,
    UserCheck, UserX, Settings, Flag, Power,
    UserPlus
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import BASE_URL from '../../config';
import axios from 'axios';


const UpdateProfile = () => {
    const location = useLocation();
    const userData = location.state?.userData || {};
    const [usageStartDate, setUsageStartDate] = useState('');
    const [usageEndDate, setUsageEndDate] = useState('');
    const [usageFilter, setUsageFilter] = useState('custom'); // 'today', 'week', 'month', 'custom'
    const [totalUsage, setTotalUsage] = useState(null);


    const token = localStorage.getItem('token');
    const is_admin = localStorage.getItem('is_admin');
    const role = is_admin === 1 ? "admin" : "user";

    // console.log("locUSER Data", userData);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        organization_name: '',
        license_number: '',
        status: '',
        plan: '',
        comped_until: ''
    });


    const [comedpedData, setCompedData] = useState({
        compedplan: "",
        duration: "",

    });

    const [adminNote, setAdminNote] = useState('');
    const [flagReason, setFlagReason] = useState('');

    // console.log('User Data:', formData)
    // const [deviceUsage] = useState({
    //     web: userData?.device_usage?.includes('web') || false,
    //     ios: userData?.device_usage?.includes('ios') || false,
    //     android: userData?.device_usage?.includes('android') || false,
    //         platform_started: userData?.platform_started || 'web'
    // });

    const deviceUsageList = Object.entries(userData?.device_usage || {})
        .filter(([platform, count]) => count > 0);



    useEffect(() => {
        setFormData({
            full_name: userData.full_name || '',
            email: userData.email || '',
            phone_number: userData.phone_number || '',
            address: userData.address || '',
            organization_name: userData.organization_name || '',
            license_number: userData.license_number || '',
            status: userData.status || 'active',
            plan: userData.plan || 'Free Tier',
            comped_until: userData.comped_until || ''
        });

        setProfileImage(userData?.image || null);
    }, [userData]);



    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [profileImage, setProfileImage] = useState(userData?.image || null);
    const [analyticsData, setAnalyticsData] = useState({});

    // Helper functions
    const getDeviceIcon = (platform) => {
        switch (platform) {
            case 'web':
                return <Globe size={16} className="text-primary" />;
            case 'ios':
                return <Smartphone size={16} className="text-success" />;
            case 'android':
                return <Monitor size={16} className="text-warning" />;
            default:
                return <Globe size={16} className="text-muted" />;
        }
    };

    const getTierBadge = (planId) => {
        if (!plans || !planId) {
            return <span className="badge bg-light text-dark">Free</span>;
        }

        const plan = plans.find(p => p.id === parseInt(planId));
        const planName = plan?.plan_name || 'Free';

        switch (planName.toLowerCase()) {
            case 'free':
            case 'free tier':
                return <span className="badge bg-light text-dark">Free</span>;
            case 'gold':
                return <span className="badge bg-warning text-dark">Gold</span>;
            case 'silver':
                return <span className="badge bg-secondary">Silver</span>;
            case 'platinum':
                return <span className="badge bg-primary">Platinum</span>;
            default:
                return <span className="badge bg-info text-dark">{planName}</span>;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <span className="badge bg-success-subtle text-success">Active</span>;
            case 'inactive':
                return <span className="badge bg-warning-subtle text-warning">Inactive</span>;
            case 'banned':
                return <span className="badge bg-danger-subtle text-danger">Banned</span>;
            default:
                return <span className="badge bg-secondary-subtle text-secondary">Unknown</span>;
        }
    };

    const [selectedCompPlan, setSelectedCompPlan] = useState(formData.plan || '');
    const handleCompUser = async (plan, duration) => {
        try {
            const compEndDate = new Date();
            compEndDate.setMonth(compEndDate.getMonth() + duration);

            const response = await axios.post(`${BASE_URL}/admin/users/${userData.id}/comp-access`, {
                plan: plan,
                comped_until: compEndDate.toISOString().split('T')[0]
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                setFormData(prev => ({
                    ...prev,
                    plan: plan,
                    comped_until: compEndDate.toISOString().split('T')[0]
                }));
                setSubmitStatus('success');
            }
        } catch (error) {
            console.error('Error comping user:', error);
            setSubmitStatus('error');
        }
    };


    useEffect(() => {
        const fetchAnalyticData = async (id) => {
            const response = await axios.get(`${BASE_URL}/admin/analytics/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log("analytics response", response.data.data);
            setAnalyticsData(response?.data?.data);
        }

        fetchAnalyticData(userData.id);
    }, [userData, userData.id])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear validation error when user starts typing
        if (validationErrors[field]) {
            setValidationErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
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

    const validateForm = () => {
        const errors = {};

        if (!formData.full_name.trim()) errors.full_name = 'First name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';


        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const [plans, setPlans] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/plan/subscription-plans`);
                setPlans(response.data);
            } catch (error) {
                console.error('Error fetching plans:', error);
            }
        };

        fetchPlans();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus(null);

        const newformData = new FormData();
        const userId = userData.id;

        // Append form data
        newformData.append("full_name", formData.full_name);
        newformData.append("email", formData.email);
        newformData.append("phone_number", formData.phone_number);
        newformData.append("address", formData.address);
        newformData.append("organizationName", formData.organization_name);
        newformData.append("licenseNumber", formData.license_number);
        newformData.append("status", formData.status);
        newformData.append("plan", formData.plan); // Send plan ID

        if (formData.comped_until) {
            newformData.append("comped_until", formData.comped_until);
        }

        // If there's a profile image, append it
        const fileInput = document.getElementById('profileImageInput');
        if (fileInput?.files[0]) {
            newformData.append("image", fileInput.files[0]);
        }

        try {
            const response = await axios.patch(
                `${BASE_URL}/admin/users/${userId}`,
                newformData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
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
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleComp = async (e) => {
        e.preventDefault();



    }


    const handleFilterChange = (filter) => {
        setUsageFilter(filter);
        if (filter !== 'custom') {
            setUsageStartDate('');
            setUsageEndDate('');
        }
    };
    const currentPlanName = plans?.find(p => p.id === parseInt(formData.plan))?.plan_name || userData.tier || 'Plan';


    return (
        <>
            {/* Bootstrap CSS */}
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
                crossOrigin="anonymous"
            />

            <div className="container-fluid py-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="h2 mb-1">  {userData?.full_name || 'Profile'}</h1>
                        {/* <p className="text-muted mb-0">Update your personal information and security settings</p> */}
                    </div>
                    {/* Submit Button */}
                    <div className="text-end mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary px-4 py-2"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={16} className="me-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                    {/* <code className="badge bg-light text-dark fs-6">PUT /admin/profile/update</code> */}
                </div>

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

                <form>
                    <div className="row g-4">
                        {/* Profile Picture Section */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-bottom">
                                    <h5 className="card-title mb-0">Profile Picture</h5>
                                </div>
                                <div className="card-body text-center">
                                    <div className="position-relative d-inline-block mb-3">
                                        {profileImage && profileImage !== "0" ? (
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
                                                    {userData.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                                                </span>
                                            </div>
                                        )}

                                        {userData?.is_admin !== 1 ? ("") :
                                            (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-10"
                                                    onClick={() => document.getElementById('profileImageInput').click()}
                                                >
                                                    <Camera size={16} />
                                                </button>
                                            )
                                        }

                                        <input
                                            id="profileImageInput"
                                            type="file"
                                            accept="image/*"
                                            className="d-none"
                                            onChange={handleImageUpload}
                                        />

                                    </div>
                                    {userData?.is_admin !== 1 ? ("") : (
                                        <p className="text-muted small mb-0">
                                            Click the camera icon to upload a new photo
                                        </p>
                                    )
                                    }
                                    {/* <p className="text-muted small">
                                        JPG, PNG or GIF (max. 5MB)
                                    </p> */}


                                    {/* {profileImage && is_admin !== 1 && (
                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm mt-2"
                                            onClick={() => setProfileImage(null)}
                                        >
                                            <X size={16} className="me-1" />
                                            Remove Photo
                                        </button>
                                    )} */}
                                </div>
                            </div>

                            {/* User Analytics Card */}
                            <div className="card border-0 shadow-sm mt-4">
                                <div className="card-header bg-white border-bottom">
                                    <h5 className="card-title mb-0">
                                        <Activity size={20} className="me-2" />
                                        User Analytics
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <Calendar size={16} className="text-muted me-2" />
                                        <div>
                                            <small className="text-muted d-block">Date Joined</small>
                                            <span className="fw-medium">
                                                {new Date(userData.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center mb-3">
                                        <UserPlus size={16} className="text-muted me-2" />
                                        <div>
                                            <small className="text-muted d-block">Referral</small>
                                            <span className="fw-medium">
                                                {/* {new Date(userData.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })} */}


                                                {userData?.referral || userData?.referredBy || "N/A"}

                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center mb-3">
                                        <UserPlus size={16} className="text-muted me-2" />
                                        <div>
                                            <small className="text-muted d-block">Platform Started</small>
                                            <span className="fw-medium">
                                                {/* {new Date(userData.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })} */}


                                                {userData?.platform_started || "N/A"}

                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center mb-3">
                                        <UserCheck size={16} className="text-muted me-2" />
                                        <div>
                                            <small className="text-muted d-block">Last Active</small>
                                            <span className="fw-medium">
                                                {userData.last_active
                                                    ? new Date(userData?.last_active).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })
                                                    : 'Never'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <small className="text-muted d-block mb-2">Device Usage</small>
                                        <div className="d-flex flex-wrap gap-2">
                                            {deviceUsageList.length === 0 ? (
                                                <span className="text-muted">No device usage data</span>
                                            ) : (
                                                deviceUsageList.map(([platform, count]) => (
                                                    <div key={platform} className="badge bg-primary-subtle text-primary d-flex align-items-center">
                                                        {getDeviceIcon(platform)}
                                                        {platform.charAt(0).toUpperCase() + platform.slice(1)}: {count}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted d-block mb-2">Average Message Per Session</small>
                                        <span className="d-flex flex-wrap text-black">
                                            {analyticsData?.avg_messages_per_session || 0}
                                        </span>
                                    </div>

                                    {/* {userData.login_count && ( */}
                                    <div className="d-flex align-items-center">
                                        <Settings size={16} className="text-muted me-2" />
                                        <div>
                                            <small className="text-muted d-block">Total Logins</small>
                                            <span className="fw-medium">{userData?.login_count}</span>
                                        </div>
                                    </div>
                                    {/* )} */}
                                </div>
                            </div>
                            {/* User Analytics Card */}


                        </div>





                        {/* Personal Information */}
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-bottom">
                                    <h5 className="card-title mb-0">Personal Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                <User size={16} className="me-2" />
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${validationErrors.full_name ? 'is-invalid' : ''}`}
                                                value={formData.full_name}
                                                onChange={(e) => handleInputChange('full_name', e.target.value)}
                                                placeholder="Enter first name"
                                            />
                                            {validationErrors.full_name && (
                                                <div className="invalid-feedback">{validationErrors.full_name}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                <Mail size={16} className="me-2" />
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="Enter email address"
                                            />
                                            {validationErrors.email && (
                                                <div className="invalid-feedback">{validationErrors.email}</div>
                                            )}
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                <Phone size={16} className="me-2" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                value={formData.phone_number}
                                                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                                placeholder="Enter phone number"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                <MapPin size={16} className="me-2" />
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                placeholder="Enter location"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                <BadgeCheck size={16} className="me-2" />
                                                License Number
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.license_number}
                                                onChange={(e) => handleInputChange('license_number', e.target.value)}
                                                placeholder="Enter license number"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                <ShieldCheck size={16} className="me-2" />
                                                Organization Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.organization_name}
                                                onChange={(e) => handleInputChange('organization_name', e.target.value)}
                                                placeholder="Enter organization name"
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {/* <div className="card mb-4 col-lg-8">
  <div className="card-header">
    <h6 className="mb-2">Total Usage</h6>
    <div className="d-flex flex-wrap align-items-center gap-2">
      <button
        className={`btn btn-sm ${usageFilter === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => handleFilterChange('today')}
      >
        Today
      </button>
      <button
        className={`btn btn-sm ${usageFilter === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => handleFilterChange('week')}
      >
        This Week
      </button>
      <button
        className={`btn btn-sm ${usageFilter === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => handleFilterChange('month')}
      >
        This Month
      </button>
      <span className="mx-2 small">or</span>
      <input
        type="date"
        value={usageStartDate || ''}
        onChange={(e) => {
          setUsageStartDate(e.target.value);
          setUsageFilter('custom');
        }}
        className="form-control form-control-sm"
        style={{ maxWidth: '160px' }}
      />
      <span className="small">to</span>
      <input
        type="date"
        value={usageEndDate || ''}
        onChange={(e) => {
          setUsageEndDate(e.target.value);
          setUsageFilter('custom');
        }}
        className="form-control form-control-sm"
        style={{ maxWidth: '160px' }}
      />
    </div>
  </div>

  <div className="card-body">
    {totalUsage ? (
      <div className="row text-center">
        <div className="col-md-4 col-12 mb-3 mb-md-0">
          <h3 className="fw-bold mb-1">{totalUsage.total_sessions ?? 0}</h3>
          <small className="text-muted">Total Sessions</small>
        </div>
        <div className="col-md-4 col-12 mb-3 mb-md-0">
          <h3 className="fw-bold mb-1">{totalUsage.total_messages ?? 0}</h3>
          <small className="text-muted">Total Messages</small>
        </div>
        <div className="col-md-4 col-12">
          <h3 className="fw-bold mb-1">{totalUsage.active_users ?? 0}</h3>
          <small className="text-muted">Active Users</small>
        </div>
      </div>
    ) : (
      <div className="text-center text-muted py-3">
        <small>No data for selected period.</small>
      </div>
    )}
  </div>
</div> */}

                            {/* Admin Controls */}
                            <div className="card border-0 shadow-sm mt-4">
                                <div className="card-header bg-white border-bottom">
                                    <h5 className="card-title mb-0">
                                        <Settings size={20} className="me-2" />
                                        Admin Controls
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        {/* Current Status */}
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">
                                                <UserCheck size={16} className="me-2" />
                                                User Status
                                            </label>
                                            <div className="d-flex align-items-center mb-2">
                                                <span className="me-2">Current:</span>
                                                {getStatusBadge(formData.status)}
                                            </div>
                                            <select
                                                className="form-select"
                                                value={formData.status}
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="banned">Banned</option>
                                            </select>
                                        </div>

                                        {/* Current Tier */}
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">
                                                <Crown size={16} className="me-2" />
                                                Subscription Tier
                                            </label>
                                            <div className="d-flex align-items-center mb-2">
                                                <span className="me-2">Current:</span>
                                                {getTierBadge(formData.plan)}
                                            </div>
                                            <select
                                                className="form-select"
                                                value={formData.plan}
                                                onChange={(e) => handleInputChange('plan', e.target.value)}
                                            >
                                                <option value="" disabled>Select a plan</option>
                                                {
                                                    plans && plans.map((plan) => (
                                                        <option key={plan.name} value={plan.id} defaultValue={formData.plan}>
                                                            {plan.plan_name}
                                                        </option>
                                                    ))
                                                }

                                            </select>
                                        </div>

                                        {/* Comp Access */}
                                        <div className="col-12">
                                            <label className="form-label fw-semibold">
                                                <Gift size={16} className="me-2" />
                                                Complimentary Access
                                            </label>
                                            {formData.comped_until && (
                                                <div className="alert alert-info mb-2">
                                                    <small>
                                                        <Gift size={14} className="me-1" />
                                                        Comped until: {new Date(formData.comped_until).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            )}
                                            <div className="mb-2">
                                                <label className="form-label fw-semibold">Select Plan for Complimentary Access</label>
                                                <select
                                                    className="form-select"
                                                    value={selectedCompPlan}
                                                    onChange={e => setSelectedCompPlan(e.target.value)}
                                                >
                                                    <option value="" disabled>Select a plan</option>
                                                    {plans && plans.map(plan => (
                                                        <option key={plan.id} value={plan.id}>
                                                            {plan.plan_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="d-flex gap-2 flex-wrap">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-warning btn-sm"
                                                    onClick={() => handleCompUser(selectedCompPlan, 30)}
                                                    disabled={!selectedCompPlan}
                                                >
                                                    {plans?.find(p => p.id === parseInt(selectedCompPlan))?.plan_name || 'Plan'}  for (1 month)
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleCompUser(selectedCompPlan, 365)}
                                                    disabled={!selectedCompPlan}
                                                >
                                                    {plans?.find(p => p.id === parseInt(selectedCompPlan))?.plan_name || 'Plan'} for (1 year)
                                                </button>
                                            </div>
                                            <small className="text-muted">
                                                Give free access to premium features
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 
                            <div className="mb-3 ">
              <h6>Admin Actions</h6>
              <div className="p-3 bg-light rounded">
                <div className="mb-2">
                  <label className="form-label">Add Note</label>
                  <div className="d-flex">
                    <input
                      type="textarea"
                      className="form-control"
                      value={adminNote}
                      row={2}
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
            </div> */}
                        </div>


                    </div>





                </form>
            </div>
        </>
    );
};

export default UpdateProfile;

{/* Password Section */ }
{/* <div className="row g-4 mt-2">
                        <div className="col-12">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-bottom">
                                    <h5 className="card-title mb-0">
                                        <Lock size={20} className="me-2" />
                                        Change Password
                                    </h5>
                                    <small className="text-muted">Leave blank if you don't want to change your password</small>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Current Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPasswords.current ? "text" : "password"}
                                                    className={`form-control ${validationErrors.currentPassword ? 'is-invalid' : ''}`}
                                                    value={formData.currentPassword}
                                                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                                                    placeholder="Enter current password"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => togglePasswordVisibility('current')}
                                                >
                                                    {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                                {validationErrors.currentPassword && (
                                                    <div className="invalid-feedback">{validationErrors.currentPassword}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">New Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPasswords.new ? "text" : "password"}
                                                    className={`form-control ${validationErrors.newPassword ? 'is-invalid' : ''}`}
                                                    value={formData.newPassword}
                                                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => togglePasswordVisibility('new')}
                                                >
                                                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                                {validationErrors.newPassword && (
                                                    <div className="invalid-feedback">{validationErrors.newPassword}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">Confirm New Password</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPasswords.confirm ? "text" : "password"}
                                                    className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => togglePasswordVisibility('confirm')}
                                                >
                                                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                                {validationErrors.confirmPassword && (
                                                    <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

{/* Submit Button */ }
{/* <div className="text-end mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary px-4 py-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save size={16} className="me-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div> */}