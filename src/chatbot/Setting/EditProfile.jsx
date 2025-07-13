 import React, { useState, useRef, useEffect } from "react";
import "./Setting.css";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../config";

const EditProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form fields state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [website, setWebsite] = useState("");
  const [numberOfElectricians, setNumberOfElectricians] = useState("");
  const [suppliesSource, setSuppliesSource] = useState("");
  const [address, setAddress] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [referral, setReferral] = useState("");

  const userId = localStorage.getItem("user_id");

  const previewImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setShowPreview(true);
    }
  };

  const removeProfile = () => {
    setProfileImage(null);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProfileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    axios.get(`${BASE_URL}/user/getUserById/${userId}`)
      .then(response => {
        if (response.data.status === "true") {
          const user = response.data.data;

          setFullName(user.full_name || "");
          setEmail(user.email || "");
          setOrganizationName(user.organization_name || "");
          setWebsite(user.website || "");
          setNumberOfElectricians(
            user.number_of_electricians != null
              ? String(user.number_of_electricians)
              : ""
          );
          setSuppliesSource(user.supplies_source || "");
          setAddress(user.address || "");
          setLicenseNumber(user.license_number || "");
          setReferral(user.referral || "");

          if (user.image) {
            setProfileImage(user.image);
            setShowPreview(true);
          } else {
            setShowPreview(false);
          }
        } else {
          setError(response.data.message || "Failed to fetch user");
        }
      })
      .catch(err => {
        setError(err.message || "Error fetching user");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();

      formData.append("full_name", fullName);
      formData.append("email", email);
      formData.append("organizationName", organizationName);
      formData.append("website", website);
      formData.append("numberOfElectricians", numberOfElectricians);
      formData.append("suppliesSource", suppliesSource);
      formData.append("address", address);
      formData.append("licenseNumber", licenseNumber);
      formData.append("referral", referral);

      if (fileInputRef.current && fileInputRef.current.files.length > 0) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      const response = await axios.patch(
        `${BASE_URL}/user/editProfile/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data.status === "true") {
        alert("Profile updated successfully!");
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <>
      <div className="container py-5 neta-princing-plans">
        <div className="form-container">
          <div className="text-center mb-4">
            <div
              className="profile-img"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            >
              {!showPreview ? (
                <i className="bi bi-person-plus" id="profile-icon" />
              ) : (
                <img
                  src={profileImage}
                  id="profile-preview"
                  alt="Profile Preview"
                  style={{
                    borderRadius: "50%",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
            <div className="profile-actions">
              <button
                type="button"
                className="plan-btn py-1 px-2 rounded"
                onClick={handleProfileClick}
              >
                Update Profile
              </button>
              <button
                type="button"
                className="plan-btn py-1 px-2 rounded"
                onClick={removeProfile}
              >
                Remove Profile
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={previewImage}
              style={{ display: "none" }}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Your Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Organization Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Organization Name"
                value={organizationName}
                onChange={e => setOrganizationName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Website</label>
              <input
                type="url"
                className="form-control"
                placeholder="Website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Number of Electricians</label>
              <input
                type="number"
                className="form-control"
                placeholder="Number of Electricians"
                value={numberOfElectricians}
                onChange={e => setNumberOfElectricians(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Where do you get your supplies?</label>
              <input
                type="text"
                className="form-control"
                placeholder="Where do you get your supplies?"
                value={suppliesSource}
                onChange={e => setSuppliesSource(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">License Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="License Number"
                value={licenseNumber}
                onChange={e => setLicenseNumber(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Referral</label>
              <input
                type="text"
                className="form-control"
                placeholder="Referral"
                value={referral}
                onChange={e => setReferral(e.target.value)}
              />
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn plan-btn text-white"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <Link to="/chatbot" className="btn btn-light mt-2 border-dark">
                Back
              </Link>
            </div>
            {error && <p className="text-danger mt-3">{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
