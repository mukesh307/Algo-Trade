import React, { useState } from "react";
import { BellIcon, XIcon } from "lucide-react";

const notifications = [
  {
    id: 1,
    message: "BTCUSD signal aaya hai",
    time: "2 minutes ago",
  },
  {
    id: 2,
    message: "ETHUSD order placed",
    time: "10 minutes ago",
  },
  {
    id: 3,
    message: "Admin ne aapka request approve kiya",
    time: "1 hour ago",
  },
];

const NotificationPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Notification Icon */}
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <BellIcon className="h-6 w-6 text-gray-700" />
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
          {notifications.length}
        </span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white w-96 rounded-2xl shadow-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Notifications</h2>
              <button onClick={() => setOpen(false)}>
                <XIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 bg-gray-100 rounded-xl shadow-sm"
                >
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  <span className="text-xs text-gray-500">{notif.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
