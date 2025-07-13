 import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Setting.css";
import logo from "../../../src/assets/images/Neta-Logo.png";
import BASE_URL from "../../../config";

const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setError("");

  try {
    const token = localStorage.getItem('token'); // get saved JWT token

    const response = await axios.post(
      `${BASE_URL}/user/resetPassword`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,  // pass token in headers
        },
      }
    );

    if (response.data.status === "true") {
      setMessage("Password updated successfully!");
    } else {
      setError(response.data.message || "Failed to update password.");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Server error occurred.");
  }
};


  return (
    <>
      <div className="container">
        <div className="container text-center ">
          <img src={logo} className="logo mt-5" alt="Logo" />
        </div>

        <div className="update-password-container mt-1 ">
          <h4 className="text-center fw-bold mb-4">Update Password</h4>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                name="oldPassword"
                placeholder="Current password"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                placeholder="New password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="plan-btn py-2 rounded text-white"
              >
                Update Password
              </button>

              <Link to="/chatbot" className="btn btn-light mt-2 border-dark">
                Back
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
