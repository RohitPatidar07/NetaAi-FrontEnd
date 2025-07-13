import React, { useState, useEffect } from "react";
import { TbTextSize } from "react-icons/tb";
import { Link } from "react-router-dom";
import NetaLogo from "../../assets/images/Neta-Logo.png"
import NetaLogosnmall from "../../assets/images/NetaSmallLogo.png"
import axios from "axios";
import BASE_URL from "../../../config";

const ChatHistory = () => {
  const chatData = [
    "2025-05-22T09:17:53",
    "2025-05-22T09:17:53",
    "2025-05-22T09:08:04",
    "2025-05-22T09:08:00",
    "2025-05-22T07:56:14",
    "2025-05-22T07:45:12",
    "2025-05-22T07:30:30",
    "2025-05-22T07:15:22",
    "2025-05-22T07:05:10",
  ];

  const [displayedChats, setDisplayedChats] = useState([]);
  const [loaded, setLoaded] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const perPage = 5;
  const [sessions, setSessions] = useState([]);
  const userId = localStorage.getItem("user_id") || "";

  useEffect(() => {
    const fetchSessions = async () => {
      setLoaded(1);
      try {
        const res = await axios.get(`${BASE_URL}/ai/sessions/${userId}`);
        setSessions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoaded(0);
      }
    };

    fetchSessions();
  }, [userId]);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // This will format the date in a readable way
  };

  // const loadChats = () => {
  //   const nextItems = sessions.slice(loaded, loaded + perPage);
  //   // const nextItems = chatData.slice(loaded, loaded + perPage);
  //   setDisplayedChats((prev) => [...prev, ...nextItems]);
  //   setLoaded((prev) => prev + perPage);
  // };

  const loadChats = () => {
    const nextItems = sessions.slice(loaded, loaded + perPage);
    setDisplayedChats((prev) => [...prev, ...nextItems]);
    setLoaded((prev) => prev + perPage);
  };



  const handleDeleteClick = (index) => {
    setChatToDelete(index);
    setShowDeleteModal(true);
  };

  // const confirmDelete = () => {
  //   if (chatToDelete !== null) {
  //     setDisplayedChats((prev) => prev.filter((_, i) => i !== chatToDelete));
  //   }
  //   setShowDeleteModal(false);
  //   setChatToDelete(null);
  // };

  const confirmDelete = async () => {
    if (chatToDelete !== null) {
      try {
        const chatId = displayedChats[chatToDelete]?.id;

        await axios.delete(`${BASE_URL}/ai/session/${chatId}`);
        setDisplayedChats((prev) => prev.filter((_, i) => i !== chatToDelete));
      } catch (error) {
        console.error("Failed to delete chat:", error);
      }
    }

    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  // Load initial chats when component mounts
  useEffect(() => {
    if (sessions.length > 0) {
      setDisplayedChats(sessions.slice(0, perPage));
      setLoaded(perPage);
    }
  }, [sessions]);

  // const hasMoreChats = loaded < chatData.length;
  const hasMoreChats = displayedChats.length < sessions.length;


  return (
    <>
      <div className="w-100 neta-princing-plans">
        <div className="container chat-history text-center mt-5">
          <img
            src={NetaLogo}
            alt="Logo"
            className="me-2 setting-logo"
            style={{ height: 60 }}
          />
        </div>

        <div className="container py-5">
          <div className="mb-4 mx-3 d-flex justify-content-between">
            <h2 className="mb-0">Your chat history</h2>
            <Link to="/chatbot"><button type="button" class="btn new-chat-btn"><i class="bi bi-plus-lg"></i> New Chat</button></Link>
          </div>
          <div className="p-4 rounded shadow">
            <div id="chatList">
              {displayedChats.map((data, index) => (
                <div
                  key={`${index}`}
                  className="chat-card d-flex align-items-center justify-content-between p-3 mb-3"
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={NetaLogosnmall}
                      alt="Chat Logo"
                      className="me-3"
                      style={{ width: 40, height: 40 }}
                    />
                    <div>
                      <div className="fw-bold">{data.title}</div>
                      <div className="text-muted small">
                        {formatDateTime(data.created_at)}
                      </div>
                    </div>
                  </div>
                  <i
                    className="bi bi-trash-fill trash-icon fs-5"
                    style={{ cursor: "pointer", color: "#dc3545" }}
                    onClick={() => handleDeleteClick(index)}
                    title="Delete chat"
                  ></i>
                </div>
              ))}
            </div>

            {hasMoreChats && (
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={loadChats}>
                  Load More
                </button>
              </div>
            )}

            {displayedChats.length === 0 && (
              <div className="text-center text-muted py-4">
                No chat history available
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className="modal d-block"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1050,
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: "12px" }}>
                <div className="modal-header border-0 pb-2">
                  <h5 className="modal-title text-dark fw-bold text-primary">
                    Confirm Delete
                  </h5>
                </div>
                <div className="modal-body pt-0">
                  <p className="mb-0" style={{ color: "#666" }}>
                    Are you sure you want to delete this chat session? This
                    action cannot be undone.
                  </p>
                </div>
                <div className="modal-footer border-0 pt-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={cancelDelete}
                    style={{ borderRadius: "8px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger px-4 ms-2"
                    onClick={confirmDelete}
                    style={{ borderRadius: "8px" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatHistory;
