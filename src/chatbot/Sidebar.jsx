import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import Profile from "./Profile";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NetaLogo from "../assets/images/Neta-Logo.png";
import axios from "axios";
import BASE_URL from "../../config";


const Sidebar = ({ collapsed, setCollapsed, darkMode, sessionId, setSessionId, setIsFirstMessageSent, setMessages }) => {
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
    }, [userId, sessionId]);

    const handleClick = () => {
        if (location.pathname === '/chatbot/chathistory') {
            navigate('/chatbot');
        } else {
            navigate('/chatbot/chathistory');
        }
        closeSidebarOnMobile(); // ✅ Auto-close on mobile
    };

    return (
        <>
            <div className={`chatbot-sidebar ${collapsed ? "chatbot-sidebar-collapsed" : ""}`}>
                {/* Header */}
                <div className="chatbot-sidebar-header">
                    <button
                        className="chatbot-sidebar-toggle"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {/* <div className="chatbot-sidebar-icon">
            <div className="chatbot-hamburger"></div>
          </div> */}
                        <div className="logo-icon" style={{ animationPlayState: "running" }}>
                            ⚡
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
                                {/* <button className="chatbot-new-chat-btn">
                <Plus size={16} />
                <span>New chat</span>
              </button> */}
                                <button class="new-chat-btn">
                                    <span>+</span>
                                    <span>New Chat</span>
                                </button>
                            </Link>

                            <button
                                // className="chatbot-chats-btn text-decoration-none"
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
                                                // className="chatbot-chat-item"
                                                className={`chat-history-item ${session.id === sessionId ? 'selected' : ''}`}
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

            <style>
                {`
         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        :root {
            --neta-blue: #2196F3;
            --neta-gray: #757575;
            --primary-gradient: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
            --secondary-gradient: linear-gradient(135deg, #757575 0%, #616161 100%);
            --bg-primary: #f8f9fa;
            --bg-secondary: #ffffff;
            --bg-tertiary: #fafafa;
            --text-primary: #212121;
            --text-secondary: #757575;
            --accent: #2196F3;
            --accent-hover: #1976D2;
            --border-color: #e0e0e0;
            --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            --glow: 0 0 20px rgba(33, 150, 243, 0.3);
        }


        /* Enhanced animated background */
        .bg-animation {
            position: fixed;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
            pointer-events: none;
        }

        .selected {
            background-color: #e0f7fa; /* Light blue background */
            font-weight: bold;
            border-left: 4px solid #007acc; /* Accent highlight */
        }


        .bg-particle {
            position: absolute;
            background: rgba(33, 150, 243, 0.08);
            border-radius: 50%;
            animation: float-particle linear infinite;
        }

        @keyframes float-particle {
            from {
                transform: translateY(100vh) rotate(0deg);
                opacity: 0;
            }

            10% {
                opacity: 1;
            }

            90% {
                opacity: 1;
            }

            to {
                transform: translateY(-100px) rotate(360deg);
                opacity: 0;
            }
        }

        .bg-wave {
            position: absolute;
            width: 200%;
            height: 200%;
            top: 50%;
            left: 50%;
            background: radial-gradient(circle at center, rgba(33, 150, 243, 0.03) 0%, transparent 50%);
            animation: wave 20s ease-in-out infinite;
            transform-origin: center center;
        }

        .bg-wave:nth-child(2) {
            animation-delay: -5s;
            background: radial-gradient(circle at center, rgba(117, 117, 117, 0.03) 0%, transparent 50%);
        }

        .bg-wave:nth-child(3) {
            animation-delay: -10s;
            background: radial-gradient(circle at center, rgba(33, 150, 243, 0.02) 0%, transparent 70%);
        }

        @keyframes wave {

            0%,
            100% {
                transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }

            33% {
                transform: translate(-50%, -50%) scale(1.1) rotate(120deg);
            }

            66% {
                transform: translate(-50%, -50%) scale(0.9) rotate(240deg);
            }
        }

        /* Sidebar */
        .sidebar {
            width: 280px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-right: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            position: relative;
        }

        .sidebar-header {
            padding: 24px;
            border-bottom: 1px solid var(--border-color);
            overflow: visible;
        }

        .logo {
            font-size: 24px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: var(--primary-gradient);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            animation: pulse-rotate 4s ease-in-out infinite;
            box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        }

        @keyframes pulse-rotate {

            0%,
            100% {
                transform: rotate(0deg) scale(1);
                box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
            }

            25% {
                transform: rotate(5deg) scale(1.05);
                box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
            }

            50% {
                transform: rotate(-5deg) scale(1.1);
                box-shadow: 0 8px 20px rgba(33, 150, 243, 0.5);
            }

            75% {
                transform: rotate(3deg) scale(1.05);
                box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
            }
        }

        .logo-text {
            font-size: 24px;
            font-weight: 600;
            letter-spacing: -0.5px;
        }

        .logo-blue {
            color: var(--neta-blue);
        }

        .logo-gray {
            color: var(--neta-gray);
        }

        .new-chat-btn {
            width: 100%;
            padding: 12px 20px;
            margin: 16px 0;
            background: var(--primary-gradient);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
            position: relative;
            overflow: visible;
            z-index: 1;
        }

        .new-chat-btn::before {
            content: '';
            position: absolute;
            inset: -4px;
            background: rgba(33, 150, 243, 0.3);
            border-radius: 16px;
            opacity: 0;
            transition: opacity 0.3s ease;
            filter: blur(8px);
            z-index: -1;
        }

        .new-chat-btn:hover {
            animation: swing-hover 0.6s ease-in-out;
            box-shadow: 0 6px 24px rgba(33, 150, 243, 0.5);
        }

        .new-chat-btn:hover::before {
            opacity: 1;
        }

        .chat-history {
            flex: 1;
            overflow-y: auto;
            overflow-x: visible;
            padding: 16px;
        }

        .sidebar-footer {
            padding: 16px;
            border-top: 1px solid var(--border-color);
            position: relative;
        }

        .profile-section {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .profile-section:hover {
            background: rgba(33, 150, 243, 0.05);
        }

        .profile-avatar {
            width: 32px;
            height: 32px;
            background: #616161;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: 600;
        }

        .profile-info {
            flex: 1;
        }

        .profile-label {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
            line-height: 1.2;
        }

        .profile-plan {
            font-size: 12px;
            color: var(--text-secondary);
            line-height: 1.2;
        }

        .profile-dropdown-btn {
            color: var(--text-secondary);
            font-size: 16px;
            transition: transform 0.3s ease;
        }

        .profile-dropdown-btn.active {
            transform: rotate(180deg);
        }

        .profile-dropdown {
            position: absolute;
            bottom: 100%;
            left: 8px;
            right: 8px;
            background: white;
            border: 1px solid var(--border-color);
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            padding: 8px 0;
            display: none;
            z-index: 1000;
            animation: slideUpFade 0.3s ease;
        }

        @keyframes slideUpFade {
            from {
                opacity: 0;
                transform: translateY(10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .profile-dropdown.active {
            display: block;
        }

        .dropdown-header {
            padding: 8px 16px;
            color: var(--text-secondary);
            font-size: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .dropdown-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 16px;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .dropdown-item:hover {
            background: rgba(33, 150, 243, 0.05);
        }

        .dropdown-item.selected {
            background: rgba(33, 150, 243, 0.08);
        }

        .dropdown-avatar {
            width: 24px;
            height: 24px;
            background: #616161;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: 600;
        }

        .dropdown-info {
            flex: 1;
        }

        .dropdown-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--text-primary);
            line-height: 1.2;
        }

        .dropdown-plan {
            font-size: 12px;
            color: var(--text-secondary);
            line-height: 1.2;
        }

        .dropdown-check {
            color: var(--accent);
            font-size: 16px;
            font-weight: 600;
        }

        .dropdown-divider {
            height: 1px;
            background: var(--border-color);
            margin: 8px 0;
        }

        .dropdown-link {
            padding: 8px 16px;
            color: var(--text-primary);
            font-size: 14px;
            cursor: pointer;
            transition: background 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .dropdown-link:hover {
            background: rgba(33, 150, 243, 0.05);
        }

        .dropdown-arrow {
            color: var(--text-secondary);
            font-size: 16px;
        }

        /* Main content */
        .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: transparent;
        }

        .chat-header {
            padding: 20px 32px 20px 80px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .chat-title {
            font-size: 18px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 12px;
            letter-spacing: -0.3px;
        }

        .status-indicator {
            width: 8px;
            height: 8px;
            background: #4CAF50;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
            }

            70% {
                box-shadow: 0 0 0 8px rgba(76, 175, 80, 0);
            }

            100% {
                box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
            }
        }

        .chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 32px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .welcome-screen {
            text-align: center;
            max-width: 600px;
            margin: auto;
            animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .welcome-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            // background: var(--primary-gradient);
            background: "white";
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: 900;
            color: white;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 8px 24px rgba(33, 150, 243, 0.3);
            animation: float-icon-enhanced 3s ease-in-out infinite;
        }

        @keyframes float-icon-enhanced {

            0%,
            100% {
                transform: translateY(0) rotate(0deg) scale(1);
                box-shadow: 0 8px 24px rgba(33, 150, 243, 0.3);
            }

            25% {
                transform: translateY(-15px) rotate(5deg) scale(1.1);
                box-shadow: 0 12px 32px rgba(33, 150, 243, 0.5);
            }

            50% {
                transform: translateY(-20px) rotate(-5deg) scale(1.15);
                box-shadow: 0 16px 40px rgba(33, 150, 243, 0.6);
            }

            75% {
                transform: translateY(-10px) rotate(3deg) scale(1.05);
                box-shadow: 0 10px 28px rgba(33, 150, 243, 0.4);
            }
        }

        .welcome-title {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 12px;
            color: var(--text-primary);
            letter-spacing: -0.5px;
        }

        .welcome-subtitle {
            font-size: 16px;
            color: var(--text-secondary);
            margin-bottom: 32px;
            line-height: 1.5;
        }

        /* Messages container */
        .messages-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
        }

        .message {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }

            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .message-avatar {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            flex-shrink: 0;
            transition: all 0.3s ease;
            cursor: default;
        }

        .message-avatar:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .user-avatar {
            background: var(--secondary-gradient);
            color: white;
        }

        .bot-avatar {
            background: var(--primary-gradient);
            color: white;
        }

        .message-content {
            flex: 1;
            background: rgba(255, 255, 255, 0.9);
            padding: 16px 20px;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            cursor: default;
        }

        .message-content:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            border-color: rgba(33, 150, 243, 0.3);
        }

        .message-content p {
            line-height: 1.6;
        }

        /* Input area */
        .input-container {
            padding: 24px 32px 32px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-top: 1px solid var(--border-color);
            box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
            overflow: visible;
        }

        .input-wrapper {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
            overflow: visible;
        }

        .input-field {
            width: 100%;
            padding: 16px 60px 16px 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            color: var(--text-primary);
            font-size: 16px;
            font-family: 'Inter', sans-serif;
            resize: none;
            outline: none;
            transition: all 0.3s ease;
            min-height: 56px;
            max-height: 120px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            position: relative;
            z-index: 1;
        }

        .input-field:focus {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
        }

        .input-field::placeholder {
            color: var(--text-secondary);
        }

        .send-btn {
            position: absolute;
            right: 8px;
            bottom: 8px;
            width: 40px;
            height: 40px;
            background: var(--primary-gradient);
            border: none;
            border-radius: 12px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 2;
        }

        .send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            animation: none !important;
            box-shadow: none !important;
        }

        /* Enhanced hover animation for all interactive elements */
        @keyframes swing-hover {

            0%,
            100% {
                transform: rotate(0deg) scale(1);
            }

            25% {
                transform: rotate(2deg) scale(1.02);
            }

            50% {
                transform: rotate(-2deg) scale(1.02);
            }

            75% {
                transform: rotate(1deg) scale(1.02);
            }
        }

        .input-field.interactive-hover:hover {
            animation: swing-hover 0.6s ease-in-out;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.15), 0 2px 16px rgba(33, 150, 243, 0.2);
        }

        .send-btn.interactive-hover:hover {
            animation: swing-hover 0.6s ease-in-out;
            box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.2), 0 4px 20px rgba(33, 150, 243, 0.4);
        }

        /* Quick prompts */
        .quick-prompts {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
            max-width: 800px;
            margin: 0 auto 16px;
            flex-wrap: wrap;
            padding: 0 4px;
        }

        .quick-prompt {
            padding: 8px 16px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
            position: relative;
            overflow: visible;
            z-index: 1;
        }

        .quick-prompt::before {
            content: '';
            position: absolute;
            inset: -4px;
            background: rgba(33, 150, 243, 0.2);
            border-radius: 24px;
            opacity: 0;
            transition: opacity 0.3s ease;
            filter: blur(8px);
            z-index: -1;
        }

        .quick-prompt:hover {
            background: rgba(33, 150, 243, 0.08);
            border-color: var(--accent);
            color: var(--accent);
            animation: swing-hover 0.6s ease-in-out;
            box-shadow: 0 4px 16px rgba(33, 150, 243, 0.3);
        }

        .quick-prompt:hover::before {
            opacity: 1;
        }

        /* Action prompts under input */
        .action-prompts {
            display: flex;
            gap: 8px;
            margin-top: 12px;
            justify-content: center;
            flex-wrap: wrap;
            overflow: visible;
            padding: 0 4px;
        }

        /* Typing indicator */
        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 12px;
            width: fit-content;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--accent);
            border-radius: 50%;
            animation: typing 1.4s ease-in-out infinite;
        }

        .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes typing {

            0%,
            60%,
            100% {
                transform: translateY(0);
            }

            30% {
                transform: translateY(-10px);
            }
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-tertiary);
        }

        ::-webkit-scrollbar-thumb {
            background: #bdbdbd;
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent);
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
            .sidebar {
                position: fixed;
                left: -280px;
                height: 100vh;
                z-index: 100;
                transition: left 0.3s ease;
            }

            .sidebar.open {
                left: 0;
            }

            .mobile-menu-btn {
                display: block;
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 101;
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                padding: 10px;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                overflow: visible;
            }

            .mobile-menu-btn:hover {
                animation: swing-hover 0.6s ease-in-out;
                box-shadow: 0 4px 16px rgba(33, 150, 243, 0.3);
                border-color: var(--accent);
            }

            .overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 99;
            }

            .overlay.active {
                display: block;
            }

            .chat-header {
                padding-left: 60px;
            }
        }

        /* Hide mobile elements on desktop */
        @media (min-width: 769px) {

            .mobile-menu-btn,
            .overlay {
                display: none;
            }
        }


        .chat-history-item {
            padding: 12px 16px;
            margin: 4px 0;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            color: var(--text-secondary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
            font-weight: 500;
            position: relative;
            z-index: 1;
        }

        .chat-history-item::before {
            content: '';
            position: absolute;
            inset: -4px;
            background: rgba(33, 150, 243, 0.15);
            border-radius: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
            filter: blur(8px);
            z-index: -1;
        }

        .chat-history-item:hover {
            background: rgba(33, 150, 243, 0.08);
            color: var(--text-primary);
            animation: swing-hover 0.6s ease-in-out;
            box-shadow: 0 2px 12px rgba(33, 150, 243, 0.2);
        }

        .chat-history-item:hover::before {
            opacity: 1;
        }

        .chat-history-item.active {
            background: rgba(33, 150, 243, 0.12);
            color: var(--accent);
            border-left: 3px solid var(--accent);
        }


        .chatbot-user-container {
            position: relative;
            z-index: 10;
            /* ensures it's above background and wave */
        }

        .chatbot-user-section {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            background: rgba(255, 255, 255, 0.95);
            /* Fix transparent look */
            backdrop-filter: blur(8px);
            transition: background 0.3s ease;
        }

        .chatbot-user-section:hover {
            background: rgba(255, 255, 255, 1);
        }

        .chatbot-user-avatar {
            width: 36px;
            height: 36px;
            background: var(--neta-gray);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            border-radius: 8px;
        }

        .chatbot-user-info {
            display: flex;
            flex-direction: column;
            line-height: 1.2;
        }

        .chatbot-username {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-primary);
        }

        .chatbot-user-plan {
            font-size: 12px;
            color: var(--text-secondary);
        }

        .chatbot-profile-dropup {
            position: absolute;
            bottom: 100%;
            left: 0;
            width: 250px;
            background: white;
            animation: slideUpFade 0.3s ease;
            z-index: 9999;
            /* ensure it overlays all other elements */
        }
        `}
            </style>

        </>
    );
};

export default Sidebar;
