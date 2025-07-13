import React from "react";
import "./PrivacyAndTrems.css";
import { Link } from "react-router-dom";
import netalogo from '../../assets/images/Neta-Logo.png';


const Privacy = () => {
  return (
    <>
      <>
        <header className="neta-header d-flex justify-content-between align-items-center px-4">
          {/* Logo Area */}
          <div className="logo-container mb-2">
            <img src={netalogo} alt="NETA Logo" className="img-fluid" style={{ maxWidth: '100px' }} />
          </div>

          <Link to="/chatbot">
            <button className="btn neta-btn-my-account neta-my-account-btn">
              My Account
            </button>
          </Link>
        </header>
        <main className="container py-5">
          <h1 className="mb-3">NETA AI Privacy Policy</h1>
          <p className="neta-text">
            <strong>Effective Date:</strong> February 2025
          </p>
          <h2 className="neta-heading-section">1. Introduction</h2>
          <p className="neta-text">
            Welcome to NETA AI. Your privacy is important to us, and we are
            committed to protecting the personal information you share with us
            when using our services.
          </p>
          <h2 className="neta-heading-section">2. Information We Collect</h2>
          <h5>2.1 Personal Data You Provide</h5>
          <ul className="neta-list">
            <li>
              <strong>Account Information:</strong> Name, email, password, and
              company details.
            </li>
            <li>
              <strong>User Content Information:</strong> Messages, documents,
              uploads, and interactions.
            </li>
            <li>
              <strong>Payment Information:</strong> Details you submit for
              purchases.
            </li>
            <li>
              <strong>Communication Data:</strong> Feedback, inquiries, emails.
            </li>
          </ul>
          <h5>2.2 Automatically Collected Information</h5>
          <ul className="neta-list">
            <li>
              <strong>Log Data:</strong> IP addresses, device data, browser
              info.
            </li>
            <li>
              <strong>Usage Data:</strong> Clicks, scrolls, time spent, errors.
            </li>
            <li>
              <strong>Device Information:</strong> OS, version, screen
              resolution.
            </li>
            <li>
              <strong>Location Data:</strong> Country, city, approximate
              location.
            </li>
          </ul>
          <h5>2.3 Cookies and Tracking Technologies</h5>
          <p className="neta-text">
            We use cookies and similar tools to improve our services. You can
            adjust your browser settings to manage preferences.
          </p>
          <h2 className="neta-heading-section">
            3. How We Use Your Information
          </h2>
          <ul className="neta-list">
            <li>To provide and improve our services.</li>
            <li>To personalize user experience.</li>
            <li>To communicate with you.</li>
            <li>To send product updates and support.</li>
            <li>To comply with legal obligations.</li>
          </ul>
          <h2 className="neta-heading-section">
            4. How We Share Your Information
          </h2>
          <p className="neta-text">We may share data with:</p>
          <ul className="neta-list">
            <li>
              <strong>Service Providers:</strong> Hosting, AI processing,
              support.
            </li>
            <li>
              <strong>Legal Authorities:</strong> If required by law.
            </li>
            <li>
              <strong>Business Transfers:</strong> In case of mergers or
              acquisitions.
            </li>
          </ul>
          <h2 className="neta-heading-section">5. Data Retention</h2>
          <p className="neta-text">
            We retain your data as long as necessary. You can request deletion
            at <a href="mailto:info@skneta.com">info@skneta.com</a>.
          </p>
          <h2 className="neta-heading-section">6. Your Rights</h2>
          <p className="neta-text">You may have rights to:</p>
          <ul className="neta-list">
            <li>Access or correct data</li>
            <li>Delete your information</li>
            <li>Object or restrict processing</li>
            <li>Withdraw consent</li>
          </ul>
          <p className="neta-text">
            Contact: <a href="mailto:info@skneta.com">info@skneta.com</a>
          </p>
          <h2 className="neta-heading-section">7. Data Security</h2>
          <p className="neta-text">
            We use security measures to protect your data, but no method is 100%
            secure. You are responsible for your password.
          </p>
          <h2 className="neta-heading-section">8. Children's Privacy</h2>
          <p className="neta-text">
            We do not knowingly collect data from children under 13. If found,
            we will delete it.
          </p>
          <h2 className="neta-heading-section">
            9. Changes to This Privacy Policy
          </h2>
          <p className="neta-text">
            We may update this policy. Please check back regularly for updates.
          </p>
          <h2 className="neta-heading-section">10. Contact Us</h2>
          <p className="neta-text">
            For any questions, contact us at:{" "}
            <a href="mailto:info@skneta.com">info@skneta.com</a>
          </p>
        </main>
        <footer className="neta-footer py-4">
          © 2025 NETA AI. All rights reserved.
        </footer>
      </>
    </>
  );
};

export default Privacy;
