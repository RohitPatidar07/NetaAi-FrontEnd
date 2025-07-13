import React from "react";
import { Link } from "react-router-dom";
import logo from '../../../src/assets/images/Neta-Logo.png'

const OpenRequest = () => {
  return (
    <>
      <div className="container text-center mt-0 py-0">
        {/* Logo */}
        <img
          src={logo }
          className="logo mt-5"
          alt="Logo"
        />
        <h4 className="fw-bold">Request Data Deletion</h4>
        <p className="text-muted mb-4">
          Please fill out this form to request permanent deletion of your
          account and data.
        </p>
        <div className="deletion-form-container text-start mt-1">
          <form>
            {/* Email Input */}
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope" />
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter Your Email Address..."
                  required=""
                />
              </div>
            </div>
            {/* Reason Input */}
            <div className="mb-4">
              <label className="form-label">Reason for Deletion</label>
              <div className="input-group">
                <span className="input-group-text align-items-start pt-2">
                  <i className="bi bi-chat-left-text" />
                </span>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Please provide a reason for your deletion request..."
                  required=""
                  defaultValue={""}
                />
              </div>
            </div>
            {/* Submit Button */}
            <div className="d-grid">
              <button type="submit" className="plan-btn py-2 rounded">
                Submit Deletion Request
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

export default OpenRequest;
