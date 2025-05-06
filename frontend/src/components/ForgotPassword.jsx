import { useState } from "react";
import axios from "axios";
import bgImage from "../assets/ak.jpg"; // <-- Apna image import karo
import { FaEye, FaEyeSlash } from "react-icons/fa"; // <-- Importing the eye icons
import { ToastContainer, toast } from "react-toastify"; // <-- Import Toastify
import "react-toastify/dist/ReactToastify.css"; // <-- Import styles for Toastify
import { validateEmail, validateOtp, validatePassword } from "../utils/ForgotPasswordvalidation"; // <-- Import validation functions

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]); // 6 OTP digits
  const [newPassword, setNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [loading, setLoading] = useState(false); // State to handle loading on OTP send button

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Set loading to true when sending OTP
    try {
      const res = await axios.post("https://trade-techneow-com.onrender.com/api/auth/forgot-password", { email });
      setUserId(res.data.userId);
      setStep(2);
      toast.success("OTP sent successfully! Please check your email."); // Success Toast
    } catch (error) {
      toast.error("Error sending OTP. Please try again."); // Error Toast
    } finally {
      setLoading(false); // Reset loading state once the request is finished
    }
  };

  const handleVerifyOtp = async () => {
    const otp = emailOtp.join("");
    if (!validateOtp(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await axios.post("https://trade-techneow-com.onrender.com/api/auth/verify-forgot-otp", { userId, emailOtp: otp });
      setStep(3);
      toast.success("OTP verified successfully! You can now reset your password.");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword(newPassword)) {
      toast.error("Password must be at least 6 characters long and contain both letters and numbers.");
      return;
    }

    try {
      await axios.post("https://trade-techneow-com.onrender.com/api/auth/reset-password", { userId, newPassword });
      toast.success("Password reset successful! You can now login.");
      window.location.href = "/"; // Redirect to the login page after success
    } catch (error) {
      toast.error("Error resetting password. Please try again.");
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Allow only numbers

    const updatedOtp = [...emailOtp];
    updatedOtp[index] = value;
    setEmailOtp(updatedOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible); // Toggle password visibility

  return (
    <div
      className="min-h-screen min-w-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="p-6 max-w-md w-full bg-white bg-opacity-90 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSendOtp}
              className={`w-full py-2 rounded font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} text-white`}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex space-x-2 mb-4 justify-center">
              {emailOtp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-medium"
            >
              Verify & Proceed
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="relative mb-4">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-1 top-11 transform -translate-y-1/2"
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              onClick={handleResetPassword}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-medium"
            >
              Change Password
            </button>
          </>
        )}
      </div>
      <ToastContainer /> {/* <-- Add this line to display the toasts */}
    </div>
  );
};

export default ForgotPassword;
