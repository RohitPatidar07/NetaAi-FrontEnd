  import React, { useState, useEffect, useRef } from "react";
 import { ChevronLeft, ChevronRight, Plus, Send, Mic } from "lucide-react";
 import axios from "axios";
 import NetaLogosmall from "../assets/images/NetaSmallLogo.png";
 import BASE_URL from "../../config";
 
 const ChatbotMain = () => {
   const [inputValue, setInputValue] = useState("");
   const [isOpen, setIsOpen] = useState(false);
   const [selectedFile, setSelectedFile] = useState(null);
   const [filePreview, setFilePreview] = useState(null);
   const [isListening, setIsListening] = useState(false);
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(false);
 
   const [sessions, setSessions] = useState([]);
   const [activeSessionId, setActiveSessionId] = useState(null);
   const [sessionTitle, setSessionTitle] = useState("");
 
   const userId = localStorage.getItem("user_id") || "anonymous_user";
   const user_name = localStorage.getItem("user_name") || "Guest";
 
   const fileInputRef = useRef(null);
   const recognitionRef = useRef(null);
   const scrollRef = useRef(null);
   const sessionsScrollRef = useRef(null);
 
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
 
   // ALWAYS create new chat session on page load
   useEffect(() => {
     const createNewSession = async () => {
       try {
         const title = `Chat on ${new Date().toLocaleString()}`;
         const createRes = await axios.post(`${BASE_URL}/ai/sessions`, {
           userId,
           title,
         });
         setSessions([{ id: createRes.data.sessionId, title }]);
         setActiveSessionId(createRes.data.sessionId);
         setSessionTitle(title);
         setMessages([]); // clear old messages to start fresh
       } catch (error) {
         console.error("Failed to create new session:", error);
       }
     };
 
     createNewSession();
   }, [userId]);
 
   const scrollToBottom = () => {
     if (scrollRef.current) {
       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
     }
   };
 
   const sendMessage = async () => {
     if (!inputValue.trim()) return;
 
     setLoading(true);
 
     try {
       const userMsg = { role: "user", content: inputValue };
       setMessages((prev) => [...prev, userMsg]);
       setInputValue("");
 
       const chatRes = await axios.post(`${BASE_URL}/ai/chat`, {
         message: inputValue,
         userId,
         sessionId: activeSessionId,
       });
 
       const aiMsg = { role: "assistant", content: chatRes.data.reply };
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
   };
 
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
   const mostAskedQuestion = [
     { title: "What's the different between Afci breaker and a Gfci breaker" },
     { title: "What slice of wire do I need for a 50 amp oven" },
     { title: "⁠Can I use Romex wire in a commercial job" },
     { title: "NEC 210.10" },
     { title: "Do I need to install a fire rated recessed lights in ADU" },
   ];
 
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
           style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
         >
           {messages.length === 0 && <p>No conversation yet. Ask me anything!</p>}
           {messages.map((msg, idx) => (
             <div
               key={idx}
               style={{
                 textAlign: msg.role === "user" ? "right" : "left",
                 margin: "8px 0",
                 backgroundColor: msg.role === "user" ? "#d1e7dd" : "#f8d7da",
                 padding: "8px 12px",
                 borderRadius: 12,
                 maxWidth: "75%",
                 marginLeft: msg.role === "user" ? "auto" : "0",
                 marginRight: msg.role === "user" ? "0" : "auto",
                 whiteSpace: "pre-wrap",
               }}
             >
               <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
             </div>
           ))}
           {loading && <p>Loading...</p>}
         </div>
       </div>
 
       <div className="chat-scroll-container" style={{ marginTop: 15 }}>
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
       </div>
 
       <div className="chatbot-input-area" style={{ marginTop: 15 }}>
         <div className="chatbot-input-container ">
           {filePreview && (
             <div className="file-preview-container">
               <img src={filePreview} alt="Preview" className="file-preview-image" />
               <button className="file-remove-btn" onClick={removeFile}>
                 ×
               </button>
             </div>
           )}
 
           <textarea
             placeholder="Ask me anything in English or Spanish?"
             className="chatbot-input-textarea"
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             rows={3}
             style={{ width: "100%", padding: 8, resize: "none" }}
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
               <div className="file-upload-container">
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
               </div>
             </div>
             <div className="chatbot-input-right-actions" style={{ display: "flex", gap: 8 }}>
               <button
                 className={`chatbot-model-selector ${isListening ? "listening" : ""}`}
                 onClick={toggleListening}
                 title={isListening ? "Stop listening" : "Start voice input"}
               >
                 <Mic size={19} />
               </button>
               <button
                 className="chatbot-send-btn"
                 disabled={!inputValue.trim() || loading}
                 onClick={sendMessage}
                 title="Send message"
               >
                 <Send />
               </button>
             </div>
           </div>
         </div>
       </div>
 
       {/* Your existing CSS (keep as is) */}
       <style jsx>{`
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
       `}</style>
     </div>
   );
 };
 
 export default ChatbotMain;
 