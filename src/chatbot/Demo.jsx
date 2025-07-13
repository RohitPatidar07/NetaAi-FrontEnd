import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Star, Code, Plus, Edit, MessageSquare, Book, PanelRight, Circle } from 'lucide-react';

// Main App Component
export default function ClaudeInterface() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Apply dark mode to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('chatbot-dark-mode');
    } else {
      document.body.classList.remove('chatbot-dark-mode');
    }
  }, [darkMode]);

  return (
    <div className={`chatbot-app ${darkMode ? 'chatbot-dark-mode' : 'chatbot-light-mode'}`}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        darkMode={darkMode}
      />
      <MainContent 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    </div>
  );
}

// Sidebar Component
function Sidebar({ collapsed, setCollapsed, darkMode }) {
  const [starredExpanded, setStarredExpanded] = useState(true);
  const [recentsExpanded, setRecentsExpanded] = useState(true);

  // Starred chats
  const starredChats = [
    { title: "Code Optimization Without UI C..." }
  ];

  // Recent chats
  const recentChats = [
    { title: "Responsive Sidebar Navigation ..." },
    { title: "Responsive React Dashboard wit..." },
    { title: "Responsive React Dashboard wit..." },
    { title: "Audit Equipment Component Co..." },
    { title: "Clean React QA Submission Form" },
    { title: "Completing Unfinished Code" },
    { title: "Responsive React Hazard Report..." },
    { title: "Responsive React SWMS Form" },
    { title: "Modify Checklist Form to Match ..." },
    { title: "Improving Defect Tracking Comp..." }
  ];

  // Toggle sections
  const toggleStarred = () => setStarredExpanded(!starredExpanded);
  const toggleRecents = () => setRecentsExpanded(!recentsExpanded);

  return (
    <div className={`chatbot-sidebar ${collapsed ? 'chatbot-sidebar-collapsed' : ''}`}>
      <div className="chatbot-sidebar-header">
        <button className="chatbot-sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {/* Hamburger menu icon */}
          <div className="chatbot-sidebar-icon">
            <div className="chatbot-hamburger"></div>
          </div>
          {!collapsed && <span className="chatbot-logo-text">Claude</span>}
        </button>
      </div>

      {!collapsed && (
        <div className="chatbot-sidebar-content">
          <div className="chatbot-sidebar-actions">
            <button className="chatbot-new-chat-btn">
              <Plus size={16} />
              <span>New chat</span>
            </button>
            <button className="chatbot-chats-btn">
              <MessageSquare size={16} />
              <span>Chats</span>
            </button>
          </div>

          {/* Starred section */}
          <div className="chatbot-sidebar-section">
            <div className="chatbot-section-header" onClick={toggleStarred}>
              <span className="chatbot-section-title">Starred</span>
              {starredExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {starredExpanded && (
              <ul className="chatbot-chat-list">
                {starredChats.map((chat, index) => (
                  <li key={`starred-${index}`} className="chatbot-chat-item">
                    <Star size={16} className="chatbot-chat-icon" />
                    <span className="chatbot-chat-title">{chat.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recents section */}
          <div className="chatbot-sidebar-section">
            <div className="chatbot-section-header" onClick={toggleRecents}>
              <span className="chatbot-section-title">Recents</span>
              {recentsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {recentsExpanded && (
              <ul className="chatbot-chat-list">
                {recentChats.map((chat, index) => (
                  <li key={`recent-${index}`} className="chatbot-chat-item">
                    <span className="chatbot-chat-title">{chat.title}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* User section */}
          <div className="chatbot-user-section">
            <div className="chatbot-user-avatar">v</div>
            <div className="chatbot-user-info">
              <span className="chatbot-username">vis</span>
              <span className="chatbot-user-plan">Free plan</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      )}
    </div>
  );
}

// Main Content Component
function MainContent({ darkMode, setDarkMode, inputValue, setInputValue }) {
  return (
    <div className="chatbot-main-content">
      <div className="chatbot-header">
        <div className="chatbot-plan-info">
          <span>Free plan · </span>
          <a href="#" className="chatbot-upgrade-link">Upgrade</a>
        </div>
      </div>

      <div className="chatbot-conversation">
        <div className="chatbot-welcome">
          <div className="chatbot-welcome-icon">✴️</div>
          <h1 className="chatbot-welcome-message">Hi vis, how are you?</h1>
        </div>
        
        <div className="chatbot-message-container">
          {/* Messages would be rendered here */}
        </div>
      </div>

      <div className="chatbot-input-area">
        <div className="chatbot-input-container">
          <textarea 
            placeholder="How can I help you today?" 
            className="chatbot-input-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          ></textarea>
          <div className="chatbot-input-actions">
            <div className="chatbot-input-left-actions">
              <button className="chatbot-input-btn">
                <Plus size={16} />
              </button>
              <button className="chatbot-input-btn">
                <Edit size={16} />
              </button>
            </div>
            <div className="chatbot-input-right-actions">
              <div className="chatbot-model-selector">
                <span>Claude 3.7 Sonnet</span>
                <ChevronDown size={16} />
              </div>
              <button className="chatbot-send-btn" disabled={!inputValue}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 20V4M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="chatbot-button-row">
          <button className="chatbot-feature-btn">
            <Edit size={16} />
            <span>Write</span>
          </button>
          <button className="chatbot-feature-btn">
            <Book size={16} />
            <span>Learn</span>
          </button>
          <button className="chatbot-feature-btn">
            <Code size={16} />
            <span>Code</span>
          </button>
          <button className="chatbot-feature-btn">
            <PanelRight size={16} />
            <span>Life stuff</span>
          </button>
          <button className="chatbot-feature-btn">
            <Circle size={16} />
            <span>Claude's choice</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Add CSS styles with unique class names
// const styles = document.createElement('style');
// styles.textContent = `
//   /* Global styles */
//   * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }

//   /* Claude App Container */
//   .chatbot-app {
//     display: flex;
//     height: 100vh;
//     width: 100%;
//     overflow: hidden;
//     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//   }

//   /* Theme modes */
//   .chatbot-light-mode {
//     background-color: #ffffff;
//     color: #1a1a1a;
//   }

//   .chatbot-dark-mode {
//     background-color: #1a1a1a;
//     color: #f5f5f5;
//   }

//   /* Sidebar styles */
//   .chatbot-sidebar {
//     width: 260px;
//     height: 100vh;
//     border-right: 1px solid;
//     transition: width 0.2s ease;
//     display: flex;
//     flex-direction: column;
//     overflow: hidden;
//   }

//   .chatbot-light-mode .chatbot-sidebar {
//     background-color: #f7f7f7;
//     border-color: #e6e6e6;
//   }

//   .chatbot-dark-mode .chatbot-sidebar {
//     background-color: #1f1f1f;
//     border-color: #2a2a2a;
//   }

//   .chatbot-sidebar-collapsed {
//     width: 60px;
//   }

//   .chatbot-sidebar-header {
//     padding: 16px;
//     height: 60px;
//     display: flex;
//     align-items: center;
//   }

//   .chatbot-sidebar-toggle {
//     display: flex;
//     align-items: center;
//     background: transparent;
//     border: none;
//     cursor: pointer;
//     padding: 0;
//     gap: 12px;
//   }

//   .chatbot-logo-text {
//     font-size: 18px;
//     font-weight: 600;
//   }

//   .chatbot-light-mode .chatbot-logo-text {
//     color: #1a1a1a;
//   }

//   .chatbot-dark-mode .chatbot-logo-text {
//     color: #f5f5f5;
//   }

//   .chatbot-sidebar-icon {
//     width: 24px;
//     height: 24px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .chatbot-hamburger {
//     width: 18px;
//     height: 2px;
//     position: relative;
//     background-color: currentColor;
//     border-radius: 2px;
//   }

//   .chatbot-hamburger:before,
//   .chatbot-hamburger:after {
//     content: '';
//     position: absolute;
//     width: 18px;
//     height: 2px;
//     background-color: currentColor;
//     border-radius: 2px;
//   }

//   .chatbot-hamburger:before {
//     top: -6px;
//   }

//   .chatbot-hamburger:after {
//     bottom: -6px;
//   }

//   .chatbot-sidebar-content {
//     display: flex;
//     flex-direction: column;
//     height: 100%;
//     overflow-y: auto;
//     padding: 0 8px;
//   }

//   .chatbot-sidebar-actions {
//     display: flex;
//     flex-direction: column;
//     gap: 8px;
//     padding: 0 8px 16px;
//   }

//   .chatbot-new-chat-btn,
//   .chatbot-chats-btn {
//     border: none;
//     border-radius: 4px;
//     padding: 8px 12px;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     cursor: pointer;
//     font-size: 14px;
//     font-weight: 500;
//     width: 100%;
//     text-align: left;
//   }

//   .chatbot-light-mode .chatbot-new-chat-btn {
//     background-color: #e6e6e6;
//     color: #1a1a1a;
//   }

//   .chatbot-dark-mode .chatbot-new-chat-btn {
//     background-color: #2a2a2a;
//     color: #f5f5f5;
//   }

//   .chatbot-light-mode .chatbot-chats-btn {
//     background-color: transparent;
//     color: #1a1a1a;
//   }

//   .chatbot-dark-mode .chatbot-chats-btn {
//     background-color: transparent;
//     color: #f5f5f5;
//   }

//   .chatbot-sidebar-section {
//     margin-bottom: 16px;
//   }

//   .chatbot-section-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 8px;
//     cursor: pointer;
//     border-radius: 4px;
//   }

//   .chatbot-section-header:hover {
//     background-color: rgba(0, 0, 0, 0.05);
//   }

//   .chatbot-dark-mode .chatbot-section-header:hover {
//     background-color: rgba(255, 255, 255, 0.05);
//   }

//   .chatbot-section-title {
//     font-size: 14px;
//     font-weight: 500;
//   }

//   .chatbot-chat-list {
//     list-style: none;
//     margin-top: 4px;
//   }

//   .chatbot-chat-item {
//     padding: 8px 12px;
//     margin: 2px 0;
//     border-radius: 4px;
//     font-size: 14px;
//     white-space: nowrap;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }

//   .chatbot-chat-item:hover {
//     background-color: rgba(0, 0, 0, 0.05);
//   }

//   .chatbot-dark-mode .chatbot-chat-item:hover {
//     background-color: rgba(255, 255, 255, 0.05);
//   }

//   .chatbot-chat-icon {
//     color: #ffc107;
//   }

//   .chatbot-user-section {
//     margin-top: auto;
//     padding: 12px 8px;
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     margin-bottom: 16px;
//     cursor: pointer;
//     border-radius: 4px;
//   }

//   .chatbot-user-section:hover {
//     background-color: rgba(0, 0, 0, 0.05);
//   }

//   .chatbot-dark-mode .chatbot-user-section:hover {
//     background-color: rgba(255, 255, 255, 0.05);
//   }

//   .chatbot-user-avatar {
//     width: 32px;
//     height: 32px;
//     border-radius: 4px;
//     background-color: #6c6c6c;
//     color: white;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-weight: 500;
//   }

//   .chatbot-user-info {
//     display: flex;
//     flex-direction: column;
//     flex: 1;
//   }

//   .chatbot-username {
//     font-size: 14px;
//     font-weight: 500;
//   }

//   .chatbot-user-plan {
//     font-size: 12px;
//     opacity: 0.7;
//   }

//   /* Main content styles */
//   .chatbot-main-content {
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//     height: 100vh;
//     overflow: hidden;
//   }

//   .chatbot-header {
//     padding: 16px 20px;
//     height: 60px;
//     display: flex;
//     align-items: center;
//     justify-content: flex-end;
//     border-bottom: 1px solid transparent;
//   }

//   .chatbot-light-mode .chatbot-header {
//     border-color: #f0f0f0;
//   }

//   .chatbot-dark-mode .chatbot-header {
//     border-color: #2a2a2a;
//   }

//   .chatbot-plan-info {
//     font-size: 14px;
//   }

//   .chatbot-upgrade-link {
//     color: #FF7066;
//     text-decoration: none;
//     font-weight: 500;
//   }

//   .chatbot-conversation {
//     flex: 1;
//     overflow-y: auto;
//     padding: 32px 20px;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//   }

//   .chatbot-welcome {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     margin-top: 80px;
//     text-align: center;
//   }

//   .chatbot-welcome-icon {
//     font-size: 40px;
//     margin-bottom: 16px;
//   }

//   .chatbot-welcome-message {
//     font-size: 40px;
//     font-weight: 600;
//     margin-bottom: 32px;
//   }

//   .chatbot-input-area {
//     padding: 20px;
//     display: flex;
//     flex-direction: column;
//     gap: 16px;
//   }

//   .chatbot-input-container {
//     border: 1px solid;
//     border-radius: 8px;
//     overflow: hidden;
//   }

//   .chatbot-light-mode .chatbot-input-container {
//     border-color: #e0e0e0;
//     background-color: #ffffff;
//   }

//   .chatbot-dark-mode .chatbot-input-container {
//     border-color: #3a3a3a;
//     background-color: #2a2a2a;
//   }

//   .chatbot-input-textarea {
//     width: 100%;
//     min-height: 50px;
//     max-height: 200px;
//     padding: 16px;
//     border: none;
//     outline: none;
//     resize: none;
//     font-family: inherit;
//     font-size: 15px;
//     background: transparent;
//     color: inherit;
//   }

//   .chatbot-input-actions {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 8px 16px;
//     border-top: 1px solid;
//   }

//   .chatbot-light-mode .chatbot-input-actions {
//     border-color: #e0e0e0;
//   }

//   .chatbot-dark-mode .chatbot-input-actions {
//     border-color: #3a3a3a;
//   }

//   .chatbot-input-left-actions,
//   .chatbot-input-right-actions {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }

//   .chatbot-input-btn {
//     width: 28px;
//     height: 28px;
//     border-radius: 4px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background: transparent;
//     border: none;
//     cursor: pointer;
//     color: inherit;
//     opacity: 0.7;
//   }

//   .chatbot-input-btn:hover {
//     background-color: rgba(0, 0, 0, 0.05);
//     opacity: 1;
//   }

//   .chatbot-dark-mode .chatbot-input-btn:hover {
//     background-color: rgba(255, 255, 255, 0.05);
//   }

//   .chatbot-model-selector {
//     display: flex;
//     align-items: center;
//     gap: 4px;
//     font-size: 14px;
//     opacity: 0.8;
//     cursor: pointer;
//     padding: 4px 8px;
//     border-radius: 4px;
//   }

//   .chatbot-model-selector:hover {
//     background-color: rgba(0, 0, 0, 0.05);
//   }

//   .chatbot-dark-mode .chatbot-model-selector:hover {
//     background-color: rgba(255, 255, 255, 0.05);
//   }

//   .chatbot-send-btn {
//     width: 32px;
//     height: 32px;
//     border-radius: 4px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     background-color: #FF7066;
//     color: white;
//     border: none;
//     cursor: pointer;
//   }

//   .chatbot-send-btn:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }

//   .chatbot-button-row {
//     display: flex;
//     gap: 10px;
//     justify-content: center;
//     flex-wrap: wrap;
//   }

//   .chatbot-feature-btn {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//     padding: 6px 12px;
//     border-radius: 6px;
//     font-size: 14px;
//     font-weight: 500;
//     border: 1px solid;
//     cursor: pointer;
//     white-space: nowrap;
//     background: transparent;
//   }

//   .chatbot-light-mode .chatbot-feature-btn {
//     border-color: #e0e0e0;
//     color: #1a1a1a;
//   }

//   .chatbot-dark-mode .chatbot-feature-btn {
//     border-color: #3a3a3a;
//     color: #f5f5f5;
//   }

//   .chatbot-feature-btn:hover {
//     background-color: rgba(0, 0, 0, 0.05);
//   }

//   .chatbot-dark-mode .chatbot-feature-btn:hover {
//     background-color: rgba(255, 255, 255, 0.05);
//   }

//   /* Responsive styles */
//   @media (max-width: 768px) {
//     .chatbot-sidebar:not(.chatbot-sidebar-collapsed) {
//       position: fixed;
//       z-index: 10;
//       box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
//     }

//     .chatbot-welcome-message {
//       font-size: 32px;
//     }

//     .chatbot-button-row {
//       flex-wrap: wrap;
//     }
//   }

//   @media (max-width: 576px) {
//     .chatbot-welcome-message {
//       font-size: 28px;
//     }

//     .chatbot-feature-btn {
//       padding: 6px 8px;
//       font-size: 12px;
//     }

//     .chatbot-plan-info {
//       font-size: 12px;
//     }
//   }
// `;
// document.head.appendChild(styles);