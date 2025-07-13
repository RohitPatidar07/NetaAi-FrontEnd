import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Plus, Send, Mic, Bot } from "lucide-react";
import axios from "axios";
import NetaLogosmall from "../assets/images/NetaSmallLogo.png";
import BASE_URL from "../../config";
import { FaLink } from "react-icons/fa";
import { MdSmartToy } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaRegThumbsUp, FaRegThumbsDown, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import "./chatBotMain.css";
const ChatbotMain = ({ sessionId, isFirstMessageSent, setIsFirstMessageSent, setMessages,messages }) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);
  // const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sessionTitle, setSessionTitle] = useState("");
  // const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);
  const [guestMessageCount, setGuestMessageCount] = useState(0);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [suggestions,setSuggestions] = useState([ { title: "What's the different between Afci breaker and a Gfci breaker" },
    { title: "What slice of wire do I need for a 50 amp oven" },
    { title: "⁠Can I use Romex wire in a commercial job" },
    { title: "NEC 210.10" },
    { title: "Do I need to install a fire rated recessed lights in ADU" },]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id") || "anonymous_user";
  const user_name = localStorage.getItem("user_name") || "Guest";
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);
  const sendBtnRef = useRef(null);
  const bottomRef = useRef(null);
  const location = useLocation();
  const chatCount = location.state?.chat_count;

  const sendSound = new Audio("/sounds/send.mp3");

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setInputValue(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) recognitionRef.current.start();
      };
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [isListening]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  // Create new session on mount or page refresh
   // Create new session on first message
 const createNewSession = async (firstMessage) => {
  try {
    if (activeSessionId) return; // If session already exists, do nothing.

    const title = firstMessage.substring(0, 30);

    // API call to create session only if activeSessionId is null
    const createRes = await axios.post(`${BASE_URL}/ai/sessions`, {
      userId,
      title,
    });
     localStorage.setItem("activeSessionId", createRes.data.sessionId); // Store session ID in localStorage
    setActiveSessionId(createRes.data.sessionId);  // Set the active session ID
    setSessionTitle(title);
    setIsFirstMessageSent(true); // Mark that the first message has been sent
  } catch (error) {
    console.error("Failed to create new session:", error);
  }
};

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

   
 const sendMessage = useCallback(
  async (message) => {
    const msg = message || inputValue;
    if (!msg.trim()) return;

    // Limit check
    if (chatCount > 3) {
      setShowLimitPopup(true);
      return;
    }

    const isGuest = !localStorage.getItem("user_id");
    if (isGuest) {
      const ip = localStorage.getItem('ip');
      const response = await axios.post(`${BASE_URL}/ip/increase-chat`, { ip });
      const { chat_count } = response.data;

      if (isGuest && chat_count >= 3) {
        setShowLimitPopup(true);
        return;
      }
    }

    setLoading(true);

    try {
      const userMsg = { role: "user", content: msg };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      sendSound.play();

      if (isGuest) {
        setGuestMessageCount((prev) => prev + 1);
      }

      // Create a session if none exists
      if (!activeSessionId && !isFirstMessageSent) {
        await createNewSession(msg); // Create the session only if it doesn't already exist
      }

      // Check if session ID is set correctly

      const chatRes = await axios.post(`${BASE_URL}/ai/chat`, {
        message: msg,
        userId,
        sessionId: activeSessionId || localStorage.getItem("activeSessionId"),
      });

      const aiMsg = {
        role: "assistant",
        content: chatRes.data.response,
        videos: chatRes.data?.videos || [],
        necReferences: chatRes.data?.nec_references || [],
        steps: chatRes.data?.step_by_step || [],
        previousUserMsg: msg,
      };
   setSuggestions(chatRes?.data?.suggestions || []);
      setMessages((prev) => [...prev, aiMsg]);
      scrollToBottom();
    } catch (error) {
      console.error("AI response error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, AI service is unavailable right now." },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  },
  [
    inputValue,
    chatCount,
    setShowLimitPopup,
    setMessages,
    setInputValue,
    sendSound,
    setGuestMessageCount,
    isFirstMessageSent,
    createNewSession,
    userId,
    activeSessionId,
    scrollToBottom,
  ]
);



 
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in your browser");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Could not start recognition:", error);
      }
    }
  };

  // File upload handlers
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsOpen(false);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  // Scroll handlers for question pills
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };
  // Most asked questions
  // const mostAskedQuestion =  [
  //   { title: "What's the different between Afci breaker and a Gfci breaker" },
  //   { title: "What slice of wire do I need for a 50 amp oven" },
  //   { title: "⁠Can I use Romex wire in a commercial job" },
  //   { title: "NEC 210.10" },
  //   { title: "Do I need to install a fire rated recessed lights in ADU" },
  // ];

  const [feedback, setFeedback] = useState({});

  const handleFeedback = (idx, type) => {
    setFeedback((prev) => ({
      ...prev,
      [idx]: type,
    }));
  };

  useEffect(() => {
    const previousSession = async (sessionId) => {
      // Fetch messages for the selected session
      try {
        const res = await axios.get(`${BASE_URL}/ai/session/${sessionId}/messages`);
        setMessages(res.data || []);
        // activeSessionId(sessionId);
        setActiveSessionId(sessionId);
      } catch (err) {
        console.error("Failed to fetch session messages:", err);
      }
    };
    previousSession(sessionId)
    setActiveSessionId(sessionId);
  }, [sessionId])
 
  useEffect(() => {
    const storedQuery = localStorage.getItem("searchQuery");
    if (storedQuery?.trim()) {
      setSearchQuery(storedQuery);
      localStorage.removeItem("searchQuery"); // Clear from storage
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setInputValue(searchQuery);
      setSearchQuery("");
    }
  }, [searchQuery]);

  const submitFeedback = async ({ message, question, feedback, reason = "" }) => {
    try {
      // Send feedback to the backend API
      await axios.post(`${BASE_URL}/ai/submit-feedback`, {
        responseId: message,
        feedback,
        reason,
        user_id: userId,
        question
      });

      alert('Feedback submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback.');
    }
  };

  // const handleThumbsUp = (messageId) => {
  //   setFeedback("thumbs-up");
  //   submitFeedback(messageId, "thumbs-up");
  // };

  // const handleThumbsDown = (messageId) => {
  //   setFeedback("thumbs-down");
  //   const reason = prompt("Please explain why this chat is inappropriate:");
  //   submitFeedback(messageId, "thumbs-down", reason);
  // };
  const handleThumbsUp = (messageIndex) => {
    const aiMessage = messages[messageIndex];
    if (!aiMessage || aiMessage.role !== "assistant") return;

    const previousQuestion = aiMessage.previousUserMsg || "Unknown question";

    setFeedback((prev) => ({ ...prev, [messageIndex]: "thumbs-up" }));
    submitFeedback({
      message: messageIndex,
      question: previousQuestion,
      feedback: "thumbs-up",
    });
  };

  const handleThumbsDown = (messageIndex) => {
    const aiMessage = messages[messageIndex];
    if (!aiMessage || aiMessage.role !== "assistant") return;

    const previousQuestion = aiMessage.previousUserMsg || "Unknown question";
    const reason = prompt("Please explain why this chat is inappropriate:");

    setFeedback((prev) => ({ ...prev, [messageIndex]: "thumbs-down" }));
    submitFeedback({
      message: messageIndex,
      question: previousQuestion,
      feedback: "thumbs-down",
      reason,
    });
  };

  useEffect(() => {
    const handleGlobalEnter = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const activeElement = document.activeElement;
        const isTextareaFocused = textareaRef.current === activeElement;

        // If textarea is not focused
        if (!isTextareaFocused) {
          e.preventDefault();
          if (inputValue.trim() && !loading) {
            sendMessage();
          }
        }
      }
    };

    window.addEventListener("keydown", handleGlobalEnter);
    return () => window.removeEventListener("keydown", handleGlobalEnter);
  }, [inputValue, loading, sendMessage]);


  return (
    <div className="chatbot-main-content mt-2">
      <h1 className="chatbot-welcome-message text-center ">
        <img src={NetaLogosmall} alt="NETA AI LOGO" className="mb-3 me-2" height={"40px"} />
        Hey {user_name}
      </h1>
      <div className="chatbot-conversation">
        <div className="chatbot-welcome"></div>

        {/* Chat message container */}
        <div
          className="chatbot-message-container "
          ref={scrollRef}
          style={{ width: "100%", height: "auto", padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
        >
          {/* {messages.length === 0 && <p>No conversation yet. Ask me anything!</p>} */}
          {Array.isArray(messages) && messages.length === 0 && (
  <p>No conversation yet. Ask me anything!</p>
)}

          {messages?.map((msg, idx) => (
            <div
              key={idx}
              style={{
                textAlign: msg.role === "user" ? "right" : "left",
                margin: "8px 0",
                // backgroundColor: msg.role === "user" ? "#d1e7dd" : "#f8d7da",
                backgroundColor: msg.role === "user" ? "#0066FFFF" : "#D7D7D7FF",
                padding: "8px 12px",
                borderRadius: 12,
                maxWidth: "75%",
                marginLeft: msg.role === "user" ? "auto" : "0",
                marginRight: msg.role === "user" ? "0" : "auto",
                whiteSpace: "pre-wrap",
                width: "auto"
              }}
            >
              {/* <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content} */}
              {msg.role === "user" ? (
                <b style={{ color: 'white' }}> {msg.content}</b>
              ) : (
                <div
                  style={{
                    backgroundColor:
                      feedback[idx] === "like"
                        ? "#ffe5e5"
                        : feedback[idx] === "dislike"
                          ? "#ffe5e5"
                          : "inherit",
                    borderRadius: 12,
                    // padding: 8,
                    transition: "background 0.2s",
                  }}
                >
                  {/* <b>AI:</b><br /> */}
                  {/* <i class="bi bi-robot" style={{ fontSize: "20px" }}></i><br /> */}
                  {/* <Bot size={18} /><br /> */}
                  {/* <img src="/public/images/NetaSmallLogo.png" alt="NETA" width={40} /><br /> */}
                  <img src="/images/netaDown.png" alt="NETA" width={100} /><br />
                  {/* <strong>Summary : </strong> */}
                  {msg.content}

                </div>
              )}

              {msg.necReferences && msg?.necReferences?.length > 0 && (
                <div style={{ marginTop: 12, backgroundColor: 'transparent' }}>
                  <b>Relevant NEC Codes</b>
                  <ul style={{ marginTop: 6, paddingLeft: 20 }}>
                    {msg.necReferences.map((ref, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>
                        {/* <a href={ref.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007acc' }}>
                          {ref.code}
                        </a> */}
                        <p><b>{ref.code}:</b> {ref.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {msg.steps && msg?.steps?.length > 0 && (
                <div style={{ marginTop: 12, backgroundColor: 'transparent' }}>
                  <b>Step-by-Step Breakdown</b>
                  <ul style={{ marginTop: 6, paddingLeft: 20 }}>
                    {msg.steps.map((step, i) => (
                      <>
                        <div key={i} style={{ marginBottom: 4 }}>
                          <p>{step}</p>
                        </div>
                      </>
                    ))}
                  </ul>
                </div>
              )}

              {/* Render NEC References if any */}
              {msg.necReferences && msg?.necReferences?.length > 0 && (
                <div style={{ marginTop: 12, padding: 8, border: '1px solid #ccc', borderRadius: 8, backgroundColor: '#eef2f7' }}>
                  <b>NEC References:</b>
                  <ul style={{ marginTop: 6, paddingLeft: 20 }}>
                    {msg.necReferences.map((ref, i) => (
                      <li key={i} style={{ marginBottom: 4 }}>
                        <a href={ref.link} target="_blank" rel="noopener noreferrer" style={{ color: '#007acc' }}>
                          <FaLink color="grey" /> {ref.code}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Render YouTube videos if any */}
              {msg.videos && msg.videos.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ margin: 0, fontWeight: "bold" }}>Releted Youtube Videos </div>
                  {msg.videos.map((video, vIdx) => (
                    <div key={vIdx} style={{ marginBottom: 12 }}>
                      {/* <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#000" }}
                      >

                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          style={{ width: 160, height: 90, borderRadius: 8 }}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: "bold" }}>{video.title}</p>
                        </div>
                      </a> */}
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-link"
                      >
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="video-thumbnail"
                        />
                        <div className="video-details">
                          <p className="video-title">{video.title}</p>
                        </div>
                      </a>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}

              {msg.role !== "user" && <div style={{ marginTop: 8, display: "flex", gap: 10 }}>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 22,
                    color: feedback[idx] === "like" ? "red" : "#888",
                    transition: "color 0.2s",
                  }}
                  onClick={() => handleThumbsUp(idx)}
                  title="Like"
                >
                  {feedback[idx] === "like" ? <FaThumbsUp /> : <FaRegThumbsUp />}
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 22,
                    color: feedback[idx] === "dislike" ? "red" : "#888",
                    transition: "color 0.2s",
                  }}
                  onClick={() => handleThumbsDown(idx)}
                  title="Dislike"
                >
                  {feedback[idx] === "dislike" ? <FaThumbsDown /> : <FaRegThumbsDown />}
                </button>
              </div>}
            </div>
          ))}

          {/* {loading && <p>Loading...</p>} */}
          {loading && (
            <div style={{ fontSize: '18px', display: 'inline-flex', alignItems: 'center' }}>
              {/* <i class="bi bi-robot"></i> */}
              {/* <img src="/images/netaDown.png" alt="NETA" width={100} /> */}
              {/* <img src="/images/NetaSmallLogo.png" alt="NETA" width={50} /> */}
              <span className="ms-2" style={{ fontWeight: "bold" }}></span>
              <div
                style={{
                  display: 'flex',
                  marginLeft: '8px',
                }}
              >
                <span className="dot" style={{ fontSize: '45px' }}> <img src={NetaLogosmall} alt="NETA AI LOGO" className="mb-3 me-2" height={"40px"} /></span>
                <span className="dot" style={{ fontSize: '45px' }}> <img src={NetaLogosmall} alt="NETA AI LOGO" className="mb-3 me-2" height={"40px"} /></span>
                <span className="dot" style={{ fontSize: '45px' }}> <img src={NetaLogosmall} alt="NETA AI LOGO" className="mb-3 me-2" height={"40px"} /></span>
                {/* <span className="dot" style={{ fontSize: '45px' }}>.</span>
                <span className="dot" style={{ fontSize: '45px' }}>.</span>
                <span className="dot" style={{ fontSize: '45px' }}>.</span> */}
              </div>
            </div>
          )}
        </div>
      </div>
      {
        showLimitPopup && (
          <div className="popup-overlay animated-popup">
            <div className="popup-content">
              <h2 className="popup-title">🚀 Message Limit Reached</h2>
              <p className="popup-subtitle">Get started for free and keep asking <strong>NETA</strong> anything!</p>
              <button
                className="popup-button"
                onClick={() => navigate("/login")}
              >
                Get Started Free
              </button>
            </div>
          </div>
        )
      }


      {/* <div className="chat-scroll-container">
        <button className="chat-scroll-arrow" onClick={scrollLeft}>
          <ChevronLeft size={20} />
        </button>
        <div
          className="chat-scroll-list"
          ref={scrollRef}
          style={{ display: "flex", overflowX: "auto", gap: 8, padding: "0 10px" }}
        >
          {mostAskedQuestion.map((question, index) => (
            <button
              key={index}
              className="chatbot-question-pill"
              onClick={() => {
                setInputValue(question.title);
                setTimeout(() => textareaRef.current?.focus(), 0);
                sendSound.play();
              }}
              style={{ whiteSpace: "nowrap" }}
            >
              {question.title}
            </button>
          ))}
        </div>
        <button className="chat-scroll-arrow" onClick={scrollRight}>
          <ChevronRight size={20} />
        </button>
      </div> */}

      <div className="chat-scroll-container">
        <button className="chat-scroll-arrow" onClick={scrollLeft}>
          <ChevronLeft size={20} />
        </button>
        <div
          className="chat-scroll-list"
          ref={scrollRef}
          style={{ display: "flex", overflowX: "auto", gap: 8, padding: "0 10px" }}
        >
          {suggestions.map((question, index) => (
            <button
              key={index}
              className="chatbot-question-pill"
              onClick={() => {
                setInputValue(question.title);
                setTimeout(() => textareaRef.current?.focus(), 0);
                sendSound.play();
                sendMessage(question.title);
              }}
              style={{
                whiteSpace: "nowrap",
                background: "linear-gradient(135deg, #6a11cb, #2575fc)", // Gradient background
                border: "none",
                borderRadius: "20px",
                color: "#fff",
                padding: "10px 20px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Shadow effect
                transition: "transform 0.3s, box-shadow 0.3s", // Animation
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"; // Scale effect on hover
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0, 0, 0, 0.3)"; // Enhanced shadow on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"; // Reset scale
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)"; // Reset shadow
              }}
            >
              {question.title}
            </button>
          ))}
        </div>
        <button className="chat-scroll-arrow" onClick={scrollRight}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="chatbot-input-area">
        <div className="chatbot-input-container ">
          {filePreview && (
            <div className="file-preview-container">
              <img src={filePreview} alt="Preview" className="file-preview-image" />
              <button className="file-remove-btn" onClick={removeFile}>
                ×
              </button>
            </div>
          )}

          {/* <textarea
            placeholder="Ask me anything in English or Spanish?"
            className="chatbot-input-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 8, resize: "none" }}
          ></textarea> */}
          <textarea
            ref={textareaRef}
            placeholder="Ask me anything in English or Spanish"
            className="chatbot-input-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 8, resize: "none" }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent new line
                if (inputValue.trim() && !loading) {
                  sendMessage(); // Call your send function
                }
              }
            }}
          ></textarea>

          {selectedFile && !filePreview && (
            <div className="file-info-container">
              <span className="file-icon">📎</span>
              <span className="file-name">{selectedFile.name}</span>
              <button className="file-remove-btn" onClick={removeFile}>
                ×
              </button>
            </div>
          )}

          <div
            className="chatbot-input-actions mb-3"
            style={{ height: "8px", marginTop: 10, display: "flex", justifyContent: "space-between" }}
          >
            <div className="chatbot-input-left-actions">
              {/* <div className="file-upload-container">
                <button className="chatbot-input-btn" onClick={() => setIsOpen(!isOpen)}>
                  <Plus size={16} />
                </button>
                {isOpen && (
                  <div className="file-upload-dropdown">
                    <ul>
                      <li onClick={handleFileUploadClick}>
                        📎 Upload a file
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="file-input-hidden"
                          onChange={handleFileChange}
                        />
                      </li>
                    </ul>
                  </div>
                )}
              </div> */}
            </div>
            <div className="chatbot-input-right-actions" style={{ display: "flex", gap: 8 }}>
              <button
                className={`chatbot-model-selector ${isListening ? "listening" : ""}`}
                onClick={toggleListening}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                <Mic size={19} />
              </button>
              {/*<button
                className="chatbot-send-btn"
                disabled={!inputValue.trim() || loading}
                onClick={sendMessage}
                title="Send message"
              >
                <Send />
              </button>*/}
              <button
                className="chatbot-send-btn"
                disabled={!inputValue.trim() || loading}
                onClick={() => sendMessage()}
                title="Send message"
                ref={sendBtnRef}
              >
                <Send />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Your existing CSS (keep as is) */}
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-in-out;
        }

        .popup-content {
          background: #ffffff;
          padding: 30px 25px;
          border-radius: 16px;
          text-align: center;
          max-width: 420px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          transform: scale(0.9);
          animation: popupBounce 0.4s ease forwards;
        }

        .popup-title {
          font-size: 24px;
          margin-bottom: 10px;
          font-weight: 600;
          color: #333;
        }

        .popup-subtitle {
          font-size: 16px;
          margin-bottom: 25px;
          color: #666;
        }

        .popup-button {
          background-color: #2c8ef4;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .popup-button:hover {
          background-color: #1c7ed6;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes popupBounce {
          0% { transform: scale(0.7); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }


        .file-preview-container {
          position: relative;
          margin-bottom: 10px;
          border-radius: 8px;
          overflow: hidden;
          max-width: 200px;
        }

        .file-preview-image {
          width: 100%;
          height: auto;
          display: block;
        }

        .file-remove-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .file-info-container {
          display: flex;
          align-items: center;
          background: #f5f5f5;
          padding: 8px 12px;
          border-radius: 20px;
          margin-bottom: 10px;
          max-width: fit-content;
        }

        .file-icon {
          margin-right: 8px;
        }

        .file-name {
          margin-right: 8px;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-upload-container {
          position: relative;
        }

        .file-upload-dropdown {
          position: absolute;
          bottom: 100%;
          left: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 8px 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .file-upload-dropdown ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .file-upload-dropdown li {
          padding: 8px 16px;
          cursor: pointer;
          white-space: nowrap;
        }

        .file-upload-dropdown li:hover {
          background: #f5f5f5;
        }

        .file-input-hidden {
          display: none;
        }

        .chatbot-model-selector.listening {
          color: red;
        }
        
        .dot {
          font-weight: bold;
          font-size: 24px;
          margin: 0 4px;
          color: #333;
          display: inline-block;
          animation-name: bounce;
          animation-duration: 1.4s;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        /* Delay each dot's animation to make sequential bounce */
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }

      `}</style>
    </div >
  );
};

export default ChatbotMain;
