import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa"; // Import eye icons and check-circle

const CreatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false); // State for password match status
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Function to toggle password visibility
  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  // Function for password strength validation
  const validatePasswordStrength = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValid = regex.test(password);
    setIsPasswordValid(isValid); // Set password validation state
    return isValid;
  };

  // Function to handle password match status
  const handlePasswordMatch = () => {
    if (password === confirmPassword) {
      setIsPasswordMatch(true);
    } else {
      setIsPasswordMatch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if passwords match
    if (!password || !confirmPassword) {
      toast.error("Both password fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Validate password strength
    if (!validatePasswordStrength(password)) {
      toast.error(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/set-password", {
        userId,
        password,
      });

      setLoading(false);
      toast.success("Password Created Successfully!");
      navigate("/"); // Redirect to login page after password creation
    } catch (err) {
      setLoading(false);
      toast.error("Password creation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-300 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🔑 Create Password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-600 font-medium text-sm mb-2">Password</label>
          <div className="relative mb-4">
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePasswordStrength(e.target.value); // Validate as user types
              }}
              className="w-full p-3 border-2 border-gray-300 rounded-xl"
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-1 top-11 transform -translate-y-1/2"
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {!isPasswordValid && password && (
            <p className="text-red-500 text-sm">
              Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.
            </p>
          )}

          <label className="block text-gray-600 font-medium text-sm mb-2">Confirm Password</label>
          <div className="relative mb-6">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                handlePasswordMatch(); // Check if passwords match as user types
              }}
              className={`w-full p-3 border-2 border-gray-300 rounded-xl ${
                isPasswordMatch ? "border-green-500" : ""
              }`}
              required
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-1 top-11 transform -translate-y-1/2"
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {isPasswordMatch && confirmPassword && (
            <p className="text-green-500 text-sm flex items-center">
              <FaCheckCircle className="mr-1" />
              Passwords match!
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition duration-300"
            disabled={loading}
          >
            {loading ? "Creating..." : "✅ Create Password"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default CreatePassword;
