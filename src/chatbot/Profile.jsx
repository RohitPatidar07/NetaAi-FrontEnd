import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showLearnMoreDropdown, setShowLearnMoreDropdown] = useState(false);

  const userid = localStorage.getItem('user_id');

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
    setShowLearnMoreDropdown(false);
  };

  const toggleLearnMoreDropdown = () => {
    setShowLearnMoreDropdown(!showLearnMoreDropdown);
    setShowLanguageDropdown(false);
  };

  const languages = [
    "English (United States)",
    "Spanish",
  ];

  const learnMoreOptions = [
    {
      label: "Privacy & Policy", path: "/website/privacy"
    },
    {
      label: "Terms & Condition", path: "/website/terms"
    }


  ];
  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }
  const user_name = localStorage.getItem("user_name") || "Guest";

  return (
    <div className="card mx-auto border shadow-sm w-100" style={{ maxWidth: "24rem" }}>
      {/* Email */}
      <div className="card-body pb-2">
        <p className="text-muted small mb-3">{user_name}</p>

        {/* Profile */}
        <div className="d-flex align-items-center">
          <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
            <span className="text-white fw-semibold small"> {user_name.charAt(0)}</span>
          </div>
          <div className="ms-3 flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-0 fw-semibold text-dark">Personal</p>
                <small className="text-muted">Free plan</small>
              </div>
              <i className="bi bi-check2 text-primary fs-5"></i>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-0" />

      {/* Menu List */}
      <div className="card-body pt-2 position-relative">
        {userid == 13 && <Link to="/dashboard" className="d-block py-2 text-dark text-decoration-none border-bottom">Dashboard</Link>}
        <Link to="/settingspage" className="d-block py-2 text-dark text-decoration-none border-bottom">Settings</Link>

        {/* Language Dropdown Trigger */}
        <div className="position-relative">
          {/* <div
            className="d-flex justify-content-between align-items-center py-2 border-bottom"
            role="button"
            onClick={toggleLanguageDropdown}
          >
            <span className="text-dark">Language</span>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-light text-muted small">BETA</span>
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
          </div> */}

          {/* Language Dropdown Positioned to Right */}
          {/* {showLanguageDropdown && (
            <div className="bg-white border rounded p-2 shadow-sm position-absolute top-100 start-50 translate-middle-x mt-0 ms-1 w-auto" style={{ minWidth: "238px", maxHeight: "300px", overflowY: "auto", zIndex: 1000, scrollbarWidth: "none" }}>
              {languages.map((lang, index) => (
                <div
                  key={index}
                  className="py-1 px-2 d-flex justify-content-between align-items-center hover-bg-light"
                  role="button"
                >
                  <span>{lang}</span>
                  {lang === "English (United States)" && (
                    <i className="bi bi-check2 text-primary"></i>
                  )}
                </div>
              ))}
            </div>
          )} */}
        </div>
        <Link to="/viewplans" className="d-block py-2 text-dark text-decoration-none border-bottom">View all plans</Link>

        {/* Learn More Dropdown Trigger */}
        <div className="position-relative">
          <div
            className="d-flex justify-content-between align-items-center py-2 border-bottom"
            role="button"
            onClick={toggleLearnMoreDropdown}
          >
            <span className="text-dark">Learn more</span>
            <i className="bi bi-chevron-right text-muted"></i>
          </div>

          {/* Learn More Dropdown Positioned to Right */}
          {showLearnMoreDropdown && (
            <div className="bg-white border rounded p-2 shadow-sm position-absolute top-100 start-50 translate-middle-x mt-0 ms-1 w-auto" style={{ minWidth: "200px", zIndex: 1000 }}>
              {learnMoreOptions.map((option, index) => (
                <div
                  key={index}
                  className="py-1 px-2 d-flex justify-content-between align-items-center hover-bg-light"
                  role="button"
                  onClick={() => navigate(option.path)}
                >
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="btn btn-secondary bg-white d-block py-2 text-dark text-decoration-none" style={{ border: "none" }} onClick={handleLogout}> Log out</button>
        {/* <Link to="/login" className="d-block py-2 text-dark text-decoration-none">Log out</Link>                  */}
      </div>


    </div>
  );
};

export default Profile;