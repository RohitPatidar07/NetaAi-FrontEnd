 import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import netalogo from "../assets/images/Neta-Logo.png";
import BASE_URL from "../../config";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    referredBy: "",
    phone_number: ""
  });

  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const { full_name, email, password, confirmPassword, phone_number } = formData;

    if (!full_name || full_name.length < 2) return "Full name must be at least 2 characters.";
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
    if (!phone_number || !/^\d{10,15}$/.test(phone_number)) return "Phone number must be 10-15 digits.";
    if (!password || password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setAlert({ type: "warning", message: validationError });
      return;
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const response = await axios.post(`${BASE_URL}/user/signUp`, formData);
      const data = response.data;

      if (data?.status === "true") {
        setAlert({ type: "success", message: "Sign up successful! Redirecting..." });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setAlert({ type: "warning", message: data.message || "Sign-up failed." });
      }
    } catch (err) {
      setAlert({
        type: "danger",
        message: err.response?.data?.message || "Server error or network issue."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="auth-card shadow-lg rounded p-4 bg-white w-100" style={{ maxWidth: 500 }}>
        <div className="logo-container mb-4">
          <Link to="/">
            <img src={netalogo} alt="NETA Logo" className="img-fluid" style={{ maxWidth: "100px" }} />
          </Link>
        </div>

        <h4 className="text-center mb-4 fw-bold" style={{ color: "#333" }}>
          Create Account
        </h4>

        {alert.message && (
          <div className={`alert alert-${alert.type} d-flex align-items-center`} role="alert">
            <i className={`me-2 bi ${
              alert.type === "success" ? "bi-check-circle-fill"
              : alert.type === "warning" ? "bi-exclamation-triangle-fill"
              : "bi-x-circle-fill"
            }`}></i>
            <div>{alert.message}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="full_name"
              className="form-control"
              placeholder="Your Name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              className="form-control"
              placeholder="Enter Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Referred By</label>
            <input
              type="text"
              name="referredBy"
              className="form-control"
              placeholder="Referred By"
              value={formData.referredBy}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn ai-premium-btn w-100"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-3 small">
          Already have an account?
          <Link to="/login">
            <button className="btn btn-link p-0 ms-1 text-decoration-none">
              Login
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
 