import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Chatbot from "./chatbot/Chatbot";
import ClaudeInterface from "./chatbot/Demo.jsx";
import Home from "./Website/LandingPages/Home.jsx";
import ContactUs from "./Website/LandingPages/ContactUs.jsx";
import Login from "./Auth/Login.jsx";
import EditProfile from "./chatbot/Setting/EditProfile.jsx";
import UpdatePassword from "./chatbot/Setting/UpdatePassword.jsx";
import OpenRequest from "./chatbot/Setting/OpenRequest.jsx";
import Viewplans from "./chatbot/Setting/Viewplans.jsx";
import ChatHistory from "./chatbot/Setting/ChatHistory.jsx";
import ChatbotMain from "./chatbot/ChatBotMain.jsx";
import Trems from "./Website/PrivacyAndTerms/Trems.jsx";
import Privacy from "./Website/PrivacyAndTerms/Privacy.jsx";
import SettingsPage from "./chatbot/Setting/SettingsPage.jsx";
import ForgotPassword from "./Auth/ForgotPassword.jsx";
import SignUp from "./Auth/SignUp.jsx";
import DashboardLayout from "./Dashboard/DashboardLayout.jsx";
import Dashboard from "./Dashboard/Dashboard.jsx";
import AllUsers from "./Dashboard/Users.jsx";
import AdminProfile from "./Dashboard/AdminProfile.jsx";
import UpdateProfile from "./Dashboard/UpdateProfile.jsx";
import Submissions from "./Dashboard/Submissions.jsx";
import SystemReports from "./Dashboard/SystemReports.jsx";
import Plans from "./Dashboard/Plans.jsx";
import ResetPassword from "./Auth/ResetPassword.jsx";
import Unauthorized from "./Dashboard/Unauthorized.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {

  const [ip, setIP] = useState('');

  useEffect(() => {
    const getUserIP = async () => {
      try {
        const res = await axios.get('https://api.ipify.org?format=json');
        setIP(res.data.ip);
        localStorage.setItem('ip', res.data.ip);

      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    };

    getUserIP();
  }, []);


  return (
    <>
      <Router>
        <Routes>
          {/* Auth Routes Start */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Auth Routes End */}

          {/* Setting Routes Start */}
          {/* <Route path="/editprofile" element={<EditProfile />} /> */}
          {/* <Route path="/updatepassword" element={<UpdatePassword />} />
          <Route path="/chathistory" element={<ChatHistory />} />
          <Route path="/openrequest" element={<OpenRequest />} />
          <Route path="/viewplans" element={<Viewplans/>} /> */}
          {/* Setting Routes End */}

          {/* Website Routes Start */}
          <Route path="/" element={<Home />} />
          <Route path="/website/contactus" element={<ContactUs />} />
          <Route path="/website/terms" element={<Trems />} />
          <Route path="/website/terms" element={<Trems />} />
          <Route path="/website/privacy" element={<Privacy />} />
          <Route path="/viewplans" element={<Viewplans />} />
          <Route path="/settingspage" element={<SettingsPage />} />


          {/* Website Routes End */}

          <Route path="/chatbot" element={<Chatbot />}>
            <Route index element={<ChatbotMain />} />
            <Route path="editprofile" element={<EditProfile />} />
            <Route path="updatepassword" element={<UpdatePassword />} />
            <Route path="chathistory" element={<ChatHistory />} />
            <Route path="openrequest" element={<OpenRequest />} />

          </Route>

          <Route element={<ProtectedRoute allowedPermissions={[13]} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="allusers" element={<AllUsers />} />
              <Route path="adminprofile" element={<AdminProfile />} />
              <Route path="updateprofile" element={<UpdateProfile />} />
              <Route path="plans" element={<Plans />} />
            </Route>
          </Route>

          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/demo" element={<ClaudeInterface />} />
          {/* handle all  */}
          {/* <Route path="*" element={ <div>No Page exists</div>} /> */}
        </Routes>
      </Router>

      {/* <div className="App">
        <CollapsibleSidebar />
      </div> */}
    </>
  );
}

export default App;
