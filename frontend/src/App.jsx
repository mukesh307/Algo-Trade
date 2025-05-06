import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

// Import components and pages    MT5Connect
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import VerifyOTP from "./components/VerifyOTP";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import Dashboard from "./pages/Dashboard";
import About from './components/About';
import ContactUs from './components/ContactUs';
import ForgotPassword from './components/ForgotPassword';
import CreatePassword from './components/CreatePassword';
import Homepage from "./components/Homepage";
import NotificationPage from "./components/NotificationPage";
//
import RoleForm from './components/RoleForm';
import RoleList from './components/RoleList';
import RolePermission from './components/RolePermission';

import TelegramLogin from "./components/TelegramLogin";
import Channels from "./components/Channels";

import MT5Connect from "./components/MT5Connect";

function AppWrapper() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ Login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("user"); // Check if user is logged in
  });

  // ✅ Hide navbar on login/register pages
  const hideNavbar = ["/", "/register", "/verify","/forgetpassword"].includes(location.pathname);

  return (
    <>
      {/* Display Navbar only if the user is not on login/register/verify pages */}
      {!hideNavbar && (
        <Navbar
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}

      {/* Define Routes   */}
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyOTP />} />
        <Route path="/CreatePassword" element={<CreatePassword />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/TelegramLogin" element={<TelegramLogin />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/forgetpassword" element={<ForgotPassword />} />

        <Route path="/MT5Connect" element={<MT5Connect />} />
        
        <Route path="/roleslist" element={<RoleList />} />
        <Route path="/roles/new" element={<RoleForm />} />
        <Route path="/roles/:id/permissions" element={<RolePermission />} />
      </Routes>

      {/* Toast notifications container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
