import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import bgImage from "../assets/dj.jpg"; // ✅ Background image import

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "") {
        if (index < 5) {
          document.getElementById(`otp-${index + 1}`).focus();
        }
      }
    }
  };

  const handleVerify = async () => {
    const combinedOTP = otp.join("");
    if (combinedOTP.length !== 6) {
      toast.error("Please enter 6-digit OTP.");
      return;
    }

    const emailOTP = combinedOTP.slice(0, 3);
    const smsOTP = combinedOTP.slice(3);

    setLoading(true);

    try {
      await axios.post("https://trade-techneow-com.onrender.com/api/auth/verify-otp", {
        userId,
        emailOTP,
        smsOTP,
      });

      setLoading(false);
      toast.success("OTP Verified Successfully!");
      setTimeout(() => {
        navigate("/CreatePassword");
      }, 2000);
    } catch (err) {
      setLoading(false);
      toast.error("OTP verification failed. Please try again.");
      console.error("OTP verification failed:", err.response?.data || err.message);
    }
  };

  return (
    <div
      className="min-h-screen min-w-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🔐 Verify OTP</h2>

        <div className="mb-4 text-sm text-gray-700">
          <p>Step 1: Enter the 3-digit OTP sent to your <strong>Email</strong>.</p>
          <p>Step 2: After that, you'll enter the 3-digit OTP sent to your <strong>Phone (SMS)</strong>.</p>
        </div>

        <label className="block text-gray-600 font-medium text-sm mb-2">
          Enter 6-digit OTP (3 digits from Email, 3 from SMS)
        </label>

        <div className="flex justify-between mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              id={`otp-${index}`}
              className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-8 h-8 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        <button
          onClick={handleVerify}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300"
          disabled={loading}
        >
          {loading ? "Verifying..." : "✅ Verify & Proceed"}
        </button>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default VerifyOTP;
