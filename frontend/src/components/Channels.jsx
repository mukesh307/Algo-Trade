import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import bgImage from "../assets/op.jpg";
import { FaBell } from "react-icons/fa"; // Notification Icon
import { useLocation } from 'react-router-dom';

const Channels = () => {
  const location = useLocation();
  const phone = location.state?.phone;

  const [channelsAndGroups, setChannelsAndGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [connections, setConnections] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [notificationModal, setNotificationModal] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2); // Static for now

  useEffect(() => {
    const fetchChannelsAndGroups = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://trade-techneow-com.onrender.com/api/channels/${phone}/channels`);
        setChannelsAndGroups(response.data.channelsAndGroups || []);
      } catch (error) {
        console.error("Failed to fetch channels:", error);
        alert("Failed to fetch channels");
      } finally {
        setLoading(false);
      }
    };
    if (phone) fetchChannelsAndGroups();
  }, [phone]);

  const configureSelection = async () => {
    if (!selectedItem || !keyword.trim()) {
      alert("Please enter a keyword.");
      return;
    }

    try {
      await axios.post("https://trade-techneow-com.onrender.com/api/channels/select-channel", {
        userPhone: phone,
        channelId: selectedItem.id,
        channelName: selectedItem.title,
        keyword,
      });
      toast.success("✅ Keyword submitted to admin.");
    } catch (error) {
      console.error("Failed to configure:", error);
      toast.error(`❌ Failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setShowModal(false);
      setKeyword("");
      setSelectedItem(null);
    }
  };

  const toggleConnection = async (item) => {
    const isConnected = connections[item.id] || false;
    try {
      if (isConnected) {
        await axios.post("https://trade-techneow-com.onrender.com/api/channels/disconnect-channel", {
          userPhone: phone,
          channelId: item.id,
        });
        setConnections((prev) => ({ ...prev, [item.id]: false }));
      } else {
        await axios.post("https://trade-techneow-com.onrender.com/api/channels/connect-channel", {
          userPhone: phone,
          channelId: item.id,
        });
        setConnections((prev) => ({ ...prev, [item.id]: true }));
        setSelectedItem(item);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Toggle failed:", error);
      alert(`Failed to ${isConnected ? "disconnect" : "connect"}`);
    }
  };

  const handleCancelModal = async () => {
    setShowModal(false);
    if (selectedItem) {
      setConnections((prev) => ({ ...prev, [selectedItem.id]: false }));
      try {
        await axios.post("https://trade-techneow-com.onrender.com/api/channels/disconnect-channel", {
          userPhone: phone,
          channelId: selectedItem.id,
        });
      } catch (err) {
        console.error("Auto-disconnect failed:", err);
      }
    }
    setSelectedItem(null);
    setKeyword("");
  };

  const handleLogout = async () => {
    try {
      await axios.post("https://trade-techneow-com.onrender.com/api/auth/logout", { phone });
      toast.success("✅ Logout successful!");
      setTimeout(() => {
        window.location.href = "/TelegramLogin";
      }, 2000);
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("❌ Logout failed");
    }
  };

  const filteredItems = channelsAndGroups.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const connectedChannelsCount = Object.values(connections).filter(Boolean).length;

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen min-w-screen bg-gray-50 py-8 px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ToastContainer position="top-center" autoClose={3000} />
      <motion.div
        className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800">Select a Telegram Channel/Group</h2>

            <div className="flex items-center gap-4">
              {/* 🔔 Notification Icon */}
              <div
                className="relative cursor-pointer text-gray-600 hover:text-indigo-600"
                onClick={() => setNotificationModal(true)}
              >
                <FaBell size={24} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Telegram-Logout
              </button>
            </div>
          </div>

          <div className="text-lg text-gray-600 mb-4">
            <strong>{connectedChannelsCount}</strong> Channel(s) connected
          </div>

          <input
            type="text"
            placeholder="Search channel/group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 mb-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
          />

          <div className="overflow-y-auto max-h-72 min-h-[250px] border rounded-md mb-4">
            <ul>
              {loading ? (
                <p className="text-center text-gray-500 py-4">Loading channels...</p>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <li
                    key={item.id}
                    className={`p-3 border-b rounded-md hover:bg-indigo-50 cursor-pointer ${
                      selectedItem?.id === item.id ? "bg-indigo-100" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-gray-800">{item.title}</strong>{" "}
                        <span className="text-sm text-gray-500">({item.type})</span>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={connections[item.id] || false}
                          onChange={() => toggleConnection(item)}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition duration-300"></div>
                        <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition duration-300 peer-checked:translate-x-3"></div>
                      </label>
                    </div>
                    {connections[item.id] && (
                      <p className="text-green-600 text-sm mt-2">Connected</p>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No matching channels or groups found.
                </p>
              )}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Keyword Modal */}
      <AnimatePresence>
        {showModal && selectedItem && (
          <motion.div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              
            <h3 className="text-2xl mb-4 font-semibold">Set Keyword for {selectedItem.title}</h3>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
                  Enter a keyword to filter messages:
                </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. BTCUSD"
                className="w-full p-3 border rounded-md mb-4"
              />
              <div className="flex justify-end gap-30">
                <button
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                  onClick={handleCancelModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-indigo-600 px-4 py-2 rounded text-white"
                  onClick={configureSelection}
                >
                   Submit for Approval
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔔 Notification Modal */}
      <AnimatePresence>
        {notificationModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Notifications</h2>
                <button onClick={() => setNotificationModal(false)} className="text-gray-500">
                  ❌
                </button>
              </div>
              <ul className="space-y-2">
                <li className="p-3 bg-gray-100 rounded">🔔 Admin approved your BTCUSD keyword</li>
                <li className="p-3 bg-gray-100 rounded">📥 New message from Channel A</li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Channels;
