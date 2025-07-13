import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import netalogo from "../assets/images/Neta-Logo.png";
import BASE_URL from "../../config";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `${BASE_URL}/user/resetPasswordFromToken`,
                { resetToken: token, newPassword: newPassword }
            );

            setMessage({ type: "success", text: res.data.message || "Password reset successfully." });
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Reset failed. Try again.",
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
                    Reset Your Password
                </h4>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                    <div className="text-end">
                        <button
                            type="submit"
                            className="btn ai-premium-btn"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Reset Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
