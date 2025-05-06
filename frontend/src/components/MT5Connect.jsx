import React, { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import bgImage from "../assets/ak.jpg";// Path to your background image

const MT5Connect = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [server, setServer] = useState("");
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = async (e) => {
    e.preventDefault();
    setError(null);
    setIsConnected(false);

    if (!login || !password || !server) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://trade-techneow-com.onrender.com/api/mt5/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password, server }),
      });

      const data = await response.json();
      if (data.success) {
        setIsConnected(true);
      } else {
        setError(data.message || "Connection failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen min-w-screen bg-gray-100 px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl transition-all">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">🔐 Connect to MT5</h2>

        {error && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {isConnected && (
          <div className="flex items-center gap-2 mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            <CheckCircle className="w-5 h-5" />
            Connected to MT5 successfully!
          </div>
        )}

        <form onSubmit={handleConnect} className="space-y-5">
          <div>
            <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
              Login
            </label>
            <input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter MT5 Login"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter MT5 Password"
            />
          </div>

          <div>
            <label htmlFor="server" className="block text-sm font-medium text-gray-700 mb-1">
              Server
            </label>
            <input
              id="server"
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter MT5 Server"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white rounded-lg transition-all ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Connecting..." : "Connect"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MT5Connect;
