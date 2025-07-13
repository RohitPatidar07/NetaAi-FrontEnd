import React, { useEffect } from "react";
import "./LandingPages.css";
import { Link } from "react-router-dom";

const ContactUs = () => {
  // Mobile menu functionality moved to useEffect hook
  useEffect(() => {
    const mobileMenuBtn = document.querySelector(".uil-mobile-menu");
    const closeMenuBtn = document.querySelector(".uil-close-menu");
    const mobileNav = document.querySelector(".uil-mobile-nav");

    if (mobileMenuBtn && closeMenuBtn && mobileNav) {
      const openMobileMenu = () => {
        mobileNav.style.display = "flex";
      };

      const closeMobileMenu = () => {
        mobileNav.style.display = "none";
      };

      mobileMenuBtn.addEventListener("click", openMobileMenu);
      closeMenuBtn.addEventListener("click", closeMobileMenu);

      // Close mobile menu when clicking on a link
      const mobileLinks = mobileNav.querySelectorAll("a");
      mobileLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
      });

      // Clean up event listeners when component unmounts
      return () => {
        mobileMenuBtn.removeEventListener("click", openMobileMenu);
        closeMenuBtn.removeEventListener("click", closeMobileMenu);
        mobileLinks.forEach((link) => {
          link.removeEventListener("click", closeMobileMenu);
        });
      };
    }
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <>
      {/* Hero Section */}
      <section className="uil-hero-section">
        <div className="container">
          {/* Navigation Bar */}
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <nav className="uil-navbar d-flex justify-content-between align-items-center">
                <Link to="/" className="text-decoration-none">
                  {" "}
                  <h1 className="uil-logo">AskNeta.AI</h1>{" "}
                </Link>
                <div className="d-none d-md-flex">
                  <Link to="/" className="uil-nav-link">
                    Home
                  </Link>
                  <Link to="/" className="uil-nav-link">
                    Features
                  </Link>
                  <Link to="/" className="uil-nav-link">
                    Works
                  </Link>
                  <Link to="/" className="uil-nav-link">
                    Pricing
                  </Link>
                  <Link to="/website/contactus" className="uil-nav-link">
                    Contact
                  </Link>
                </div>
                <div className="d-none d-md-block">
                  <Link to="/login">
                    <button className="uil-login-btn">Login</button>
                  </Link>
                </div>
                <button className="uil-mobile-menu d-md-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1={3} y1={12} x2={21} y2={12} />
                    <line x1={3} y1={6} x2={21} y2={6} />
                    <line x1={3} y1={18} x2={21} y2={18} />
                  </svg>
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="uil-mobile-nav">
            <button className="uil-close-menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
            <Link to="/">Home</Link>
            <Link to="/">Features</Link>
            <Link to="/">Works</Link>
            <Link to="/">Pricing</Link>
            <Link to="/website/contactus"> Contact</Link>
            <Link to="/login">
              <button className="uil-login-btn mt-4">Login</button>
            </Link>
          </div>

          {/* Hero Content */}
          <div className="row">
            <div className="col-lg-7">
              <div className="uil-hero-content">
                <h2 className="uil-hero-title">
                  The AI Assistant for Electricians – Find NEC Codes in Seconds!
                </h2>
                <h1 className="uil-hero-subtitle">
                  Fast Solutions with
                  <br className="d-none d-sm-block" />
                  Our Chatbot!
                </h1>
                <p className="uil-hero-text">
                  At AskNeta.ai, we’re here to make your decision-making smarter, faster, and more transparent. <br /> Whether you're a citizen, researcher, policymaker, or developer, we’d love to hear from you. <br /> Have questions, feedback, or partnership ideas? Let’s connect!
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/login">
                    <button className="uil-cta-btn uil-get-started">
                      Get Started
                    </button>
                  </Link>
                  <Link to="/">
                    <button className="uil-cta-btn uil-get-premium ms-2">
                      Get Premium
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-flex justify-content-center">
              {/* Corrected robot image path */}
              <img
                src="../.././src/assets/gif/elctricianbot.gif"
                alt="AI Chatbot Robot"
                className="uil-robot-image d-block"
                style={{ height: "600px" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section>
        <div className="container my-5">
          <div className="handyman-contact-section rounded shadow-sm">
            <div className="handyman-decorative-line" />
            <div className="row">
              <div className="col-12 position-relative z-index-1">
                <h2 className="handyman-contact-heading">Contact us</h2>
                <p className="handyman-contact-subtext">
                  We’re here to help! Whether you have questions, need support, or just want to say hello — we’d love to hear from you.
                </p>
                <div className="handyman-contact-info">
                  <div className="handyman-contact-email">
                    <span className="handyman-contact-label">Email: </span>
                    <span className="handyman-contact-value">
                      support@askneta.com
                    </span>
                  </div>
                  <div className="handyman-contact-phone">
                    <span className="handyman-contact-label">Call us: </span>
                    <span className="handyman-contact-value">
                      (800) 555-NETA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container handyman-contact-container rounded shadow-sm mb-4">
          <div className="row">
            {/* Contact Form Section */}
            <div className="col-md-7">
              <div className="handyman-form-section">
                <form>
                  <div className="row">
                    {/* First Name */}
                    <div className="col-md-6">
                      <label
                        htmlFor="firstName"
                        className="handyman-form-label"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control handyman-form-input"
                        id="firstName"
                        placeholder="e.g. Jane"
                      />
                    </div>
                    {/* Last Name */}
                    <div className="col-md-6">
                      <label htmlFor="lastName" className="handyman-form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control handyman-form-input"
                        id="lastName"
                        placeholder="e.g. Doe"
                      />
                    </div>
                  </div>
                  <div className="row">
                    {/* Email */}
                    <div className="col-md-6">
                      <label htmlFor="email" className="handyman-form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control handyman-form-input"
                        id="email"
                        placeholder="support@askneta.com"
                      />
                    </div>
                    {/* Phone */}
                    <div className="col-md-6">
                      <label htmlFor="phone" className="handyman-form-label">
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="form-control handyman-form-input"
                        id="phone"
                        placeholder="(123) 456-789"
                      />
                    </div>
                  </div>
                  {/* Message */}
                  <div className="row">
                    <div className="col-12">
                      <label htmlFor="message" className="handyman-form-label">
                        Message
                      </label>
                      <textarea
                        className="form-control handyman-form-input handyman-form-textarea"
                        id="message"
                        placeholder="Leave us a message..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div>
                    <button className="btn ai-premium-btn">Sumbit</button>
                  </div>
                </form>
              </div>
            </div>

            {/* Handyman Image Section */}
            <div className="col-md-5 mb-4 mb-md-0">
              <div className="handyman-image-wrapper">
                <div className="handyman-image-background" />
                <img
                  src="../.././src/assets/gif/elctricianbot.gif"
                  alt="Handyman with yellow helmet and drill"
                  className="handyman-profile-image position-relative"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ContactUs;
