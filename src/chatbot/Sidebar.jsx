import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import Profile from "./Profile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NetaLogo from "../assets/images/Neta-Logo.png";
import axios from "axios";
import BASE_URL from "../../config";

const Sidebar = ({ collapsed, setCollapsed, darkMode, setSessionId,setIsFirstMessageSent,setMessages }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [sessionsExpanded, setSessionsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("user_id") || "";

  const location = useLocation();
  const navigate = useNavigate();

  const toggleProfile = () => setProfileOpen(!profileOpen);
  const toggleSessionsExpanded = () => setSessionsExpanded(!sessionsExpanded);

  // Close sidebar on mobile
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 768 && !collapsed) {
      setCollapsed(true);
    }
  };

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/ai/sessions/${userId}`);
        setSessions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [userId]);

  const handleClick = () => {
    if (location.pathname === '/chatbot/chathistory') {
      navigate('/chatbot');
    } else {
      navigate('/chatbot/chathistory');
    }
    closeSidebarOnMobile(); // ✅ Auto-close on mobile
  };

  return (
    <div className={`chatbot-sidebar ${collapsed ? "chatbot-sidebar-collapsed" : ""}`}>
      {/* Header */}
      <div className="chatbot-sidebar-header">
        <button
          className="chatbot-sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="chatbot-sidebar-icon">
            <div className="chatbot-hamburger"></div>
          </div>
          {!collapsed && <img src={NetaLogo} alt="Neta Logo" height={"35px"} />}
        </button>
      </div>

      {!collapsed && (
        <div className="chatbot-sidebar-content mt-3">
          {/* New Chat & Chats Button */}
          <div className="chatbot-sidebar-actions">
            <Link
              to="/chatbot"
              className="text-decoration-none"
              onClick={() => {
                setSessionId(null);
                setIsFirstMessageSent(false); // Reset first message state
                // localStorage.removeItem("activeSessionId")
                localStorage.setItem("activeSessionId", null);
                setMessages([]); // Reset messages state

                closeSidebarOnMobile(); // ✅ Close sidebar on mobile
              }}// ✅ Close sidebar on mobile
            >
              <button className="chatbot-new-chat-btn">
                <Plus size={16} />
                <span>New chat</span>
              </button>
            </Link>

            <button
              className="chatbot-chats-btn text-decoration-none"
              onClick={handleClick} // ✅ Close sidebar inside handleClick
            >
              <span>Chats</span>
            </button>
          </div>

          {/* Previous Chats Section */}
          <div className="chatbot-sidebar-section">
            <div
              className="chatbot-section-header"
              onClick={toggleSessionsExpanded}
              style={{ cursor: "pointer" }}
            >
              <span className="chatbot-section-title">Previous Chats</span>
              {sessionsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {sessionsExpanded && (
              <ul className="chatbot-chat-list" style={{ maxHeight: 500, overflowY: "auto" }}>
                {loading && <li>Loading sessions...</li>}
                {!loading && sessions.length === 0 && (
                  <li>No previous chat sessions.</li>
                )}
                {!loading &&
                  sessions.map((session) => (
                    <li
                      key={session.id}
                      className="chatbot-chat-item"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSessionId(session.id);
                        closeSidebarOnMobile(); // ✅ Close sidebar on mobile
                      }}
                    >
                      {session.title || `Chat #${session.id}`}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Profile Section (Does NOT close sidebar) */}
          <div className="chatbot-user-container">
            <div
              className="chatbot-user-section"
              onClick={toggleProfile} // ❌ No sidebar close here
            >
              <div className="chatbot-user-avatar">J</div>
              <div className="chatbot-user-info">
                <span className="chatbot-username">Profile</span>
                <span className="chatbot-user-plan">Free plan</span>
              </div>
              {profileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {profileOpen && (
              <div className="chatbot-profile-dropup">
                <Profile closeSidebar={closeSidebarOnMobile} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
