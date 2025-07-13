// import React from "react";
// import { Link } from "react-router-dom";
// import netalogo from "../assets/images/Neta-Logo.png";

// const ForgotPassword = () => {
//   return (
//     <>
//       <div className="auth-container d-flex justify-content-center align-items-center min-vh-100">
//         <div
//           className="auth-card shadow-lg rounded p-4 bg-white w-100"
//           style={{ maxWidth: 400 }}
//         >
//           {/* Logo Area */}
//           <div className="logo-container mb-4">
//             <img
//               src={netalogo}
//               alt="NETA Logo"
//               className="img-fluid"
//               style={{ maxWidth: "100px" }}
//             />
//           </div>

//           <h4
//             className="text-center mb-4 fw-bold"
//             style={{ color: "#333" }}
//           ></h4>

//           <form>
//             <div className="mb-4">
//               <label className="form-label">Email</label>
//               <input
//                 type="email"
//                 className="form-control"
//                 placeholder="Enter Email"
//               />
//             </div>
//             {/* <div className="mb-4">
//               <label className="form-label">New password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 placeholder="New password"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="form-label">Confirm password</label>
//               <input
//                 type="password"
//                 className="form-control"
//                 placeholder="Confirm password"
//               />
//             </div> */}

//             <div className="mb-3 text-end me-2">
//               <Link to="/login">
//                 <button type="submit" className="btn ai-premium-btn ">
//                     Change Password
//                 </button>
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ForgotPassword;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import netalogo from "../assets/images/Neta-Logo.png";
import BASE_URL from "../../config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(`${BASE_URL}/user/forgotPassword`, {
        email,
      });

      // Success response
      setMessage({
        type: "success",
        text:
          response.data.message ||
          "Password reset link has been sent to your email.",
      });
    } catch (error) {
      // Handle known error like "Email not found"
      const errMsg =
        error.response?.data?.message || "Something went wrong. Please try again.";
      setMessage({
        type: "error",
        text: errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="auth-card shadow-lg rounded p-4 bg-white w-100"
        style={{ maxWidth: 400 }}
      >
        <div className="logo-container mb-4 text-center">
          <img
            src={netalogo}
            alt="NETA Logo"
            className="img-fluid"
            style={{ maxWidth: "100px" }}
          />
        </div>

        <h4 className="text-center mb-4 fw-bold" style={{ color: "#333" }}>
          Forgot Password
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && (
            <div
              className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"
                }`}
            >
              {message.text}
            </div>
          )}

          <div className="mb-3 text-end me-2">
            <button
              type="submit"
              className="btn ai-premium-btn"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-decoration-none">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
