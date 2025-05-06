import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../assets/pk.jpg";

// ✅ Custom validation functions
import { isValidEmail, isValidPhone } from "../utils/Loginvalidation";

const Login = ({ setIsLoggedIn }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate input
    const isEmail = emailOrPhone.includes("@");

    if (isEmail && !isValidEmail(emailOrPhone)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!isEmail && !isValidPhone(emailOrPhone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (password.trim().length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        emailOrPhone,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsLoggedIn(true);

      toast.success("Login successful!", {
        position: "top-center",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/Homepage"), 3000);
    } catch (error) {
      toast.error("Login failed. Account not approved by admin", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      className="min-h-screen min-w-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <ToastContainer />
      <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
            <input
              type="text"
              placeholder="Enter your email or phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-right">
          <Link to="/forgetpassword" className="text-sm text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
