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
    BadgeCheck
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import BASE_URL from '../../config';
import axios from 'axios';


const UpdateProfile = () => {
    const location = useLocation();
    const userData = location.state?.userData || {};

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        organization_name: '',
        license_number: '',
        // currentPassword: '',
        // newPassword: '',
        // confirmPassword: ''
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
        })

        // fetchUserData(userData);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        } finally {
            setIsSubmitting(false);
        }
    };



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
                                                    {userData.full_name.split(' ').map(n => n[0]).join('')}
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