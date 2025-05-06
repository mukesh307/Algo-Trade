import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaBars,
  FaUserCircle,
  FaRegChartBar,
  FaCogs, // Icon for Channel Configure
} from "react-icons/fa";

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("requests");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "",
    id: "",
    name: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [channelRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/channels/admin/requests"),
          axios.get("http://localhost:5000/api/users/pending"),
        ]);
        setRequests(channelRes.data);
        setPendingUsers(usersRes.data);
        setLoading(false);
      } catch (error) {
        alert("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleConfirm = async () => {
    const { type, id } = confirmModal;
    try {
      if (type === "approveRequest") {
        await axios.put(`http://localhost:5000/api/channels/admin/approve/${id}`);
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } else if (type === "rejectRequest") {
        await axios.delete(`http://localhost:5000/api/channels/admin/reject/${id}`);
        setRequests((prev) => prev.filter((req) => req._id !== id));
      } else if (type === "approveUser") {
        await axios.post("http://localhost:5000/api/users/approve", { userId: id });
        setPendingUsers((prev) => prev.filter((u) => u._id !== id));
      } else if (type === "rejectUser") {
        await axios.delete(`http://localhost:5000/api/users/reject/${id}`);
        setPendingUsers((prev) => prev.filter((u) => u._id !== id));
      }
      alert("Action completed successfully!");
    } catch (error) {
      alert("Action failed!");
    } finally {
      setConfirmModal({ open: false, type: "", id: "", name: "" });
    }
  };

  const filteredRequests = requests.filter((req) =>
    req.channelName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col sm:flex-row min-h-screen min-w-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-64 bg-indigo-600 text-white shadow-xl p-6 absolute sm:static transition-transform duration-300 z-10 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <ul className="space-y-6">
          <li
            onClick={() => setActiveTab("requests")}
            className={`cursor-pointer transition font-medium ${
              activeTab === "requests"
                ? "text-indigo-300"
                : "text-white hover:text-indigo-300"
            }`}
          >
            <FaRegChartBar className="inline mr-2" />
            Symbol Requests
          </li>
          <li
            onClick={() => setActiveTab("users")}
            className={`cursor-pointer transition font-medium ${
              activeTab === "users"
                ? "text-indigo-300"
                : "text-white hover:text-indigo-300"
            }`}
          >
            <FaUserCircle className="inline mr-2" />
            User Requests
          </li>
          <li
            onClick={() => setActiveTab("configure")}
            className={`cursor-pointer transition font-medium ${
              activeTab === "configure"
                ? "text-indigo-300"
                : "text-white hover:text-indigo-300"
            }`}
          >
            <FaCogs className="inline mr-2" />
            Channel Configure
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            className="sm:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars size={20} />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Approval Dashboard</h2>
          <FaUserCircle size={28} className="text-gray-600" />
        </div>

        {activeTab === "requests" && (
          <input
            type="text"
            placeholder="Search channel..."
            className="w-full sm:max-w-sm px-4 py-2 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}

        {/* Channel Requests */}
        {activeTab === "requests" && (
          <div className="bg-white shadow-md rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Pending Channel Requests</h3>
              <span className="text-sm text-gray-500">Total: {filteredRequests.length}</span>
            </div>

            {loading ? (
              <p className="text-center py-10 text-indigo-500 font-medium animate-pulse">Loading...</p>
            ) : filteredRequests.length === 0 ? (
              <p className="text-center py-10 text-gray-500">No pending requests 🎉</p>
            ) : (
              <div className="overflow-y-auto max-h-[400px] divide-y">
                {filteredRequests.map((req) => (
                  <div key={req._id} className="flex justify-between items-start py-4">
                    <div>
                      <p className="text-lg font-semibold">{req.channelName}</p>
                      <p className="text-sm text-gray-500">
                        Keyword:{" "}
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {req.keyword}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        Requested at: {new Date(req.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            type: "approveRequest",
                            id: req._id,
                            name: req.channelName,
                          })
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            type: "rejectRequest",
                            id: req._id,
                            name: req.channelName,
                          })
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pending Users */}
        {activeTab === "users" && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Pending Users Requests</h3>
              <span className="text-sm text-gray-500">Total: {pendingUsers.length}</span>
            </div>

            {loading ? (
              <p className="text-center py-10 text-indigo-500 font-medium animate-pulse">Loading...</p>
            ) : pendingUsers.length === 0 ? (
              <p className="text-center py-10 text-gray-500">No users awaiting approval 🎉</p>
            ) : (
              <div className="overflow-y-auto max-h-[400px] divide-y">
                {pendingUsers.map((user) => (
                  <div key={user._id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 py-3 items-center">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-base font-medium text-gray-800">{user.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-base font-medium text-gray-800">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-base font-medium text-gray-800">{user.phone || "N/A"}</p>
                    </div>
                    <div className="flex justify-end gap-2 items-start sm:items-center">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            type: "approveUser",
                            id: user._id,
                            name: user.email,
                          })
                        }
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            type: "rejectUser",
                            id: user._id,
                            name: user.email,
                          })
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Reject
                      </button>
                    </div>
                    <div className="col-span-full">
                      <p className="text-xs text-gray-400">
                        Registered: {new Date(user.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <p className="text-xl font-semibold">Are you sure you want to {confirmModal.type === 'approveRequest' ? 'approve' : confirmModal.type === 'rejectRequest' ? 'reject' : confirmModal.type === 'approveUser' ? 'approve' : 'reject'} this {confirmModal.type === 'approveRequest' || confirmModal.type === 'rejectRequest' ? 'request' : 'user'}?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmModal({ open: false, type: "", id: "", name: "" })}
                className="px-4 py-2 text-sm text-gray-500 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
