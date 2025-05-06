import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgImage from "../assets/dj.jpg";

// ✅ Custom validation functions import
import {
  isValidName,
  isValidEmail,
  isValidPhone,
} from "../utils/Registervalidation";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidName(form.name)) {
      toast.error("Name must be at least 3 characters");
      return;
    }

    if (!isValidEmail(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!isValidPhone(form.phone)) {
      toast.error("Enter a valid 10-digit Indian phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      localStorage.setItem("userId", res.data.userId);
      toast.success("Registration Successful!");
      setTimeout(() => {
        setLoading(false);
        navigate("/verify");
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast.error("Registration failed. Please try again.");
      console.error("Registration failed", error);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen min-w-screen bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-md bg-white bg-opacity-90 shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
            <input
              type="text"
              placeholder="Enter your phone"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              maxLength={10}
            />
          </div>

          {/* Loader */}
          {loading && (
            <p className="text-sm text-gray-500 text-center mt-2 animate-pulse">
              Please wait... sending OTP to your phone/email 📱
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Register;
