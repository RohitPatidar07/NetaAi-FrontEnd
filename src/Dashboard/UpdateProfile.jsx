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
    UserCheck,
    UserX,
    Settings
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import BASE_URL from '../../config';
import axios from 'axios';


const UpdateProfile = () => {
    const location = useLocation();
    const userData = location.state?.userData || {};
     const token = localStorage.getItem('token');

     console.log("locUSER Data", userData);

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


    const [ comedpedData, setCompedData] = useState({
        compedplan: "",
        duration: "",
            
    });

     const [adminNote, setAdminNote] = useState('');
      const [flagReason, setFlagReason] = useState('');

console.log('User Data:', formData)
    const [deviceUsage] = useState({
        web: userData?.device_usage?.includes('web') || false,
        ios: userData?.device_usage?.includes('ios') || false,
        android: userData?.device_usage?.includes('android') || false,
        platform_started: userData?.platform_started || 'web'
    });

    // const fetchUserData = async (userData) => {
    //     try {
    //         const res = await axios.get(
    //             `https://s9687mmz-5008.inc1.devtunnels.ms/api/user/getUserById/${userData?.id}`
    //         );
    //         const user = res.data.data;

    //         // Map API response to profile fields
    //         setFormData({
    //             full_name: user.full_name || '',
    //             email: user.email || '',
    //             phone_number: user.phone_number || '',
    //             address: user.address || '',
    //             organization_name: user.organization_name || '',
    //             license_number: user.license_number || '',
    //         });

    //         setProfileImage(user.image);

    //     } catch (err) {
    //         console.error('Error fetching user data:', err);
    //     }
    // };

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

    const [selectedCompPlan, setSelectedCompPlan] = useState(formData.plan || '');


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
                        <h1 className="h2 mb-1">Update Profile</h1>
                        <p className="text-muted mb-0">Update your personal information and security settings</p>
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
                                                    {userData.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
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
                                    {profileImage && userData.is_admin !== 1 && (
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

                            {/* User Analytics Card */}
                            <div className="card border-0 shadow-sm mt-4">
                                <div className="card-header bg-white border-bottom">
                                    <h5 className="card-title mb-0">
                                        <Activity size={20} className="me-2" />
                                        User Analytics
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {/* Date Joined */}
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

                                    {/* Last Active */}
                                    <div className="d-flex align-items-center mb-3">
                                        <UserCheck size={16} className="text-muted me-2" />
                                        <div>
                                            <small className="text-muted d-block">Last Active</small>
                                            <span className="fw-medium">
                                                {userData.last_active 
                                                    ? new Date(userData.last_active).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })
                                                    : 'Never'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Device Usage */}
                                    <div className="mb-3">
                                        <small className="text-muted d-block mb-2">Device Usage</small>
                                        <div className="d-flex flex-wrap gap-2">
                                            {deviceUsage.web && (
                                                <div className={`badge bg-primary-subtle text-primary d-flex align-items-center ${deviceUsage.platform_started === 'web' ? 'border border-primary' : ''}`}>
                                                    <Globe size={14} className="me-1" />
                                                    Web
                                                    {deviceUsage.platform_started === 'web' && (
                                                        <span className="ms-1" title="Started here">⭐</span>
                                                    )}
                                                </div>
                                            )}
                                            {deviceUsage.ios && (
                                                <div className={`badge bg-success-subtle text-success d-flex align-items-center ${deviceUsage.platform_started === 'ios' ? 'border border-success' : ''}`}>
                                                    <Smartphone size={14} className="me-1" />
                                                    iOS
                                                    {deviceUsage.platform_started === 'ios' && (
                                                        <span className="ms-1" title="Started here">⭐</span>
                                                    )}
                                                </div>
                                            )}
                                            {deviceUsage.android && (
                                                <div className={`badge bg-warning-subtle text-warning d-flex align-items-center ${deviceUsage.platform_started === 'android' ? 'border border-warning' : ''}`}>
                                                    <Monitor size={14} className="me-1" />
                                                    Android
                                                    {deviceUsage.platform_started === 'android' && (
                                                        <span className="ms-1" title="Started here">⭐</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <small className="text-muted">⭐ Platform where user started</small>
                                    </div>

                                    {/* Login Count */}
                                    {userData.login_count && (
                                        <div className="d-flex align-items-center">
                                            <Settings size={16} className="text-muted me-2" />
                                            <div>
                                                <small className="text-muted d-block">Total Logins</small>
                                                <span className="fw-medium">{userData.login_count}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
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
                                                    Comp {plans?.find(p => p.id === parseInt(selectedCompPlan))?.plan_name || 'Plan'} (1 month)
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleCompUser(selectedCompPlan, 365)}
                                                    disabled={!selectedCompPlan}
                                                >
                                                    Comp {plans?.find(p => p.id === parseInt(selectedCompPlan))?.plan_name || 'Plan'} (1 year)
                                                </button>
                                            </div>
                                            <small className="text-muted">
                                                Give free access to premium features
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
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