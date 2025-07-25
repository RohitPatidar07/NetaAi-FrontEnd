

import React, { useEffect, useState } from "react";
import ChatbotMain from "./ChatBotMain";
import Sidebar from "./Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import './style.css'
import axios from "axios";
import BASE_URL from "../../config";

const Chatbot = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [isSecondPopup, setIsSecondPopup] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('chatbot-dark-mode');
    } else {
      document.body.classList.remove('chatbot-dark-mode');
    }
  }, [darkMode]);

  const isBaseChatbotRoute = location.pathname === "/chatbot";
  const loginCount = localStorage.getItem('login_count');

  const SHOW_POPUP = localStorage.getItem('SHOW_POPUP') !== "false";
  // this converts it back to true/false correctly

  const IsCorrect = SHOW_POPUP && loginCount <= 3;


  const handleNext = () => {
    if (!isSecondPopup) {
      setIsSecondPopup(true);
    } else {
      setShowPopup(false);
      localStorage.setItem("SHOW_POPUP", "false");
    }
  };


  // const handleCheckboxChange = async (e) => {
  //   const checked = e.target.checked;
  //   setDontShowAgain(checked);

  //   if (checked) {
  //     try {
  //       const userId = localStorage.getItem("user_id");
  //       const newFormData = new FormData();
  //       newFormData.append("login_count", 4);

  //       const response = await axios.patch(
  //         `${BASE_URL}/user/editProfile/${userId}`,
  //         newFormData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       // Set localStorage so popup doesn't appear again
  //       localStorage.setItem("login_count", "4");
  //     } catch (error) {
  //       console.error("Failed to update login_count:", error);
  //     }
  //   }
  // };

  const handleCheckboxChange = async (e) => {
    const checked = e.target.checked;
    setDontShowAgain(checked);

    if (checked) {
      try {
        const userId = localStorage.getItem("user_id");

        // Step 1: Fetch user data
        const { data } = await axios.get(`${BASE_URL}/user/getUserById/${userId}`);
        const user = data?.data; // Adjust if API response format is different


        // Step 2: Prepare formData for update
        const newFormData = new FormData();
        // Append form data
        newFormData.append("full_name", user.full_name);
        newFormData.append("email", user.email);
        newFormData.append("phone_number", user.phone_number);
        newFormData.append("address", user.address);
        newFormData.append("organizationName", user.organization_name);
        newFormData.append("licenseNumber", user.license_number);
        newFormData.append("login_count", 4); // ✅ Update only this field
        if (user.image) newFormData.append("image", user.image); // If image path or file needed

        // Step 3: Send update request
        const res = await axios.patch(
          `${BASE_URL}/user/editProfile/${userId}`,
          newFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res) {
          // Step 4: Set localStorage to prevent showing popup again
          localStorage.setItem("login_count", 4);
        }

      } catch (error) {
        console.error("Failed to update login_count:", error);
      }
    }
  };


  return (
    <div className={`chatbot-app ${darkMode ? 'chatbot-dark-mode' : 'chatbot-light-mode'}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        darkMode={darkMode}
        setSessionId={setSessionId}
        sessionId={sessionId}
        setIsFirstMessageSent={setIsFirstMessageSent}
        setMessages={setMessages}
      />
      {isBaseChatbotRoute ? (
        <ChatbotMain
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          inputValue={inputValue}
          setInputValue={setInputValue}
          sessionId={sessionId}
          setIsFirstMessageSent={setIsFirstMessageSent}
          isFirstMessageSent={isFirstMessageSent}
          setMessages={setMessages}
          messages={messages || []}
        />
      ) : (
        <Outlet />
      )}

      {/* Bootstrap Modal */}
      {(IsCorrect && showPopup) && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>

          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg">
              <div className="modal-header justify-content-center text-center">
                <h5 className="modal-title w-100">
                  {/* <img src="/gif/elctricianbot.gif" width={70} />{isSecondPopup ? "🌐 Language Options" : 'Welcome to NETA!'} */}
                  <img src="/images/netaDown.png" width={100} />{isSecondPopup ? "🌐 Language Options" : 'Welcome to NETA!'}
                </h5>
              </div>
              <div className="modal-body text-center">
                <p className="mb-0">
                  {isSecondPopup
                    ? "And you can Ask NETA in English or Spanish!"
                    : "Ask any electrical question in the chatbox below to begin."}
                </p>
                <span style={{ textAlign: 'center' }}>
                  {isSecondPopup
                    ? "Puedes hacer cualquier pregunta eléctrica en español y NETA te responderá en español!"
                    : "Haga cualquier pregunta eléctrica en el cuadro de chat a continuación para comenzar."}

                </span>
                <div className="bouncing-arrow mt-3">⬇️</div>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="checkbox"
                    id="dont-show"
                    checked={dontShowAgain}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="dont-show" className="pt-1">Do not show this again?</label>
                </div>
                <div>
                  <button className="btn btn-primary" onClick={handleNext}>
                    {isSecondPopup ? "Got it!" : "Next"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
