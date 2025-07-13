import React from "react";
import "./PrivacyAndTrems.css";
import { Link } from "react-router-dom";
import netalogo from '../../assets/images/Neta-Logo.png';

const Trems = () => {
  return (
    <>
      <header className="neta-terms-header d-flex justify-content-between align-items-center px-4">
        {/* Logo Area */}
        <div className="neta-terms-logo-container mb-2">
          <img src={netalogo} alt="NETA Logo" className="img-fluid" style={{ maxWidth: '100px' }} />
        </div>
        <Link to="/chatbot">
          <button className="btn neta-terms-my-account-btn">
            My Account
          </button>
        </Link>
      </header>

      <div className="container neta-terms-wrapper">
        <div>
          <h1 className="fw-bold">NETA AI Terms of Use</h1>
          <p><strong>Effective Date:</strong> 4/12/2025</p>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">1. Introduction</div>
          <div className="neta-terms-section-content">
            Welcome to NETA! These Terms govern your access and use of the
            NETA mobile application, website, and related services. Contact:{" "}
            <a href="mailto:info@netaxn.com">info@netaxn.com</a>
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">2. Eligibility and Account Registration</div>
          <div className="neta-terms-section-content">
            - You must be at least 13 years old and, if under 18, must have
            parental or legal guardian consent.<br />
            - Provide accurate and updated information during registration.<br />
            - You're responsible for safeguarding your account.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">3. Use of Services</div>
          <div className="neta-terms-section-content">
            <strong>What You Can Do:</strong><br />
            - Access tools, content, and APIs in compliance with these Terms.<br />
            <strong>What You Cannot Do:</strong><br />
            - Misuse, reverse-engineer, copy, or violate applicable laws.<br />
            - Use for illegal, harmful, or fraudulent activities.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">4. Content Ownership and Usage</div>
          <div className="neta-terms-section-content">
            - Input and Output: You retain rights to your inputs and outputs.<br />
            - NETA may use anonymized data to improve services.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">5. Accuracy and Limitations</div>
          <div className="neta-terms-section-content">
            - Outputs should not be solely relied upon for legal, medical, or financial decisions.<br />
            - Services are not guaranteed to be error-free.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">6. Payment and Subscription</div>
          <div className="neta-terms-section-content">
            - Services may require payment on a recurring basis.<br />
            - You authorize automatic billing unless canceled.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">7. Account Termination and Suspension</div>
          <div className="neta-terms-section-content">
            - NETA may suspend or terminate accounts violating terms.<br />
            - Inactive accounts (12+ months) may be suspended.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">8. Third-Party Services</div>
          <div className="neta-terms-section-content">
            - NETA is not responsible for third-party integrations or services.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">9. Disclaimer of Warranties</div>
          <div className="neta-terms-section-content">
            - Services are provided "as is" without warranties.<br />
            - NETA disclaims all implied warranties.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">10. Limitation of Liability</div>
          <div className="neta-terms-section-content">
            - NETA's total liability is limited to $100 in the past 12 months.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">11. Dispute Resolution</div>
          <div className="neta-terms-section-content">
            - Disputes will be resolved through binding arbitration.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">12. Copyright and Intellectual Property</div>
          <div className="neta-terms-section-content">
            - NETA retains all rights to services, models, and trademarks.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">13. Changes to these Terms</div>
          <div className="neta-terms-section-content">
            - Users will be notified 30 days in advance of significant changes.
          </div>
        </div>

        <div className="neta-terms-section">
          <div className="neta-terms-section-title">14. Contact Information</div>
          <div className="neta-terms-section-content">
            For questions, contact: <a href="mailto:info@netaxn.com">info@netaxn.com</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trems;
