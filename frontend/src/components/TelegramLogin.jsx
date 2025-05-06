import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from "../assets/dj.jpg";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate

const countryCodes = [
  { name: "India", code: "+91" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Australia", code: "+61" },
  { name: "Canada", code: "+1" },
  { name: "Pakistan", code: "+92" },
  { name: "Bangladesh", code: "+880" },
  { name: "Nepal", code: "+977" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "Japan", code: "+81" },
  { name: "China", code: "+86" },
  { name: "Russia", code: "+7" },
  { name: "Brazil", code: "+55" },
  { name: "South Africa", code: "+27" },
  { name: "Indonesia", code: "+62" },
  { name: "Malaysia", code: "+60" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "United Arab Emirates", code: "+971" },
];

const TelegramLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step to manage UI flow
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");

  const navigate = useNavigate(); // ✅ Hook initialization

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const fullPhone = `${selectedCountryCode}${phone}`;
      const response = await axios.post("https://trade-techneow-com.onrender.com/api/auth/send-otp", { phone: fullPhone });
      toast.success(response.data.message); // Notify OTP sent
      setStep(2); // Go to OTP verification step
    } catch (error) {
      toast.error("Country code and phone number do not match! Please enter a valid number.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    // Check if OTP is valid (For example purposes, we're just showing a success message)
    if (otp.length !== 5) {
      toast.error("Please enter a valid 5-digit OTP.");
      return;
    }
    
    toast.success("OTP verified successfully!");
    const fullPhone = `${selectedCountryCode}${phone}`;
    navigate("/channels", { state: { phone: fullPhone } }); // Redirect after successful verification
  };

  return (
    <div 
      className="min-h-screen min-w-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 mt-10 mb-10">
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">Login with Telegram</h2>

          {error && <p className="mb-4 text-red-500 text-center text-sm">{error}</p>}

          {step === 1 ? (
            <>
              <label className="block mb-1 text-sm text-gray-700 font-medium">Select Country</label>
              <select
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {countryCodes.map((country, index) => (
                  <option key={index} value={country.code}>
                    {country.name} ({country.code})
                  </option>
                ))}
              </select>

              <label className="block mb-1 text-sm text-gray-700 font-medium">Phone Number</label>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setPhone(value);
                  }
                }}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400"
              />

              <button
                onClick={() => {
                  if (phone.length !== 10) {
                    toast.error("Please enter a valid 10-digit mobile number.");
                    return;
                  }
                  sendOtp();
                }}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <label className="block mb-1 text-sm text-gray-700 font-medium">Enter OTP</label>
              <input
                type="text"
                placeholder="12345"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,6}$/.test(value)) {
                    setOtp(value);
                  }
                }}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <button
                onClick={verifyOtp} // Call verifyOtp directly
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Verify OTP
              </button>
            </>
          )}
        </div>
      </div>

      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default TelegramLogin;
