import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar';
import {
  FaChartLine,
  FaShoppingCart,
  FaHistory,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaClipboardList,
  FaPlayCircle,
  FaBan,
} from "react-icons/fa";

const Dashboard = () => {
  const [symbol, setSymbol] = useState("BTCUSD");
  const [marketPrice, setMarketPrice] = useState(null);
  const [action, setAction] = useState("buy");
  const [orderResponse, setOrderResponse] = useState(null);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("price");
  const [filter, setFilter] = useState("all");

  const formatIST = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  const isWithinDays = (timestamp, days) => {
    const now = new Date();
    const target = new Date(timestamp);
    const diffTime = now - target;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= days;
  };

  const fetchMarketPrice = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/mt5/price?symbol=${symbol}`);
      const data = await res.json();
      setMarketPrice(data);
    } catch {
      setMarketPrice({ status: "error", message: "Failed to fetch" });
    }
  };

  const fetchTradeHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/mt5/trade-history");
      const data = await res.json();
      setTradeHistory(Array.isArray(data.history) ? data.history : []);
    } catch {
      setTradeHistory([]);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/mt5/pending-orders");
      const data = await res.json();
      setPendingOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch {
      setPendingOrders([]);
    }
  };

  const cancelOrder = async (ticket) => {
    try {
      const res = await fetch("http://localhost:5000/api/mt5/cancel-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setPendingOrders((prev) => prev.filter((order) => order.ticket !== ticket));
        alert("Order Cancelled");
      } else {
        alert(data.message);
      }
    } catch {
      alert("Failed to cancel order");
    }
  };

  const placeOrder = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/mt5/place-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, action }),
      });
      const data = await res.json();
      setOrderResponse(data);
      fetchTradeHistory();
      fetchPendingOrders();
    } catch {
      setOrderResponse({ status: "error", message: "Order failed" });
    }
  };

  useEffect(() => {
    if (activeTab === "price") {
      fetchMarketPrice();
      const interval = setInterval(fetchMarketPrice, 1000);
      return () => clearInterval(interval);
    }
  }, [symbol, activeTab]);

  useEffect(() => {
    if (activeTab === "history" || activeTab === "order") {
      fetchTradeHistory();
      fetchPendingOrders();
    }
  }, [activeTab]);

  const filteredHistory = tradeHistory.filter((item) => {
    if (filter === "today") return isWithinDays(item.time, 1);
    if (filter === "7days") return isWithinDays(item.time, 7);
    if (filter === "30days") return isWithinDays(item.time, 30);
    return true;
  });

  const totalOrders = tradeHistory.length + pendingOrders.length;
  const executedOrders = tradeHistory.length;
  const cancelledOrders = totalOrders - executedOrders;

  return (
    <>
 
    <div className="flex flex-col lg:flex-row min-h-screen min-w-screen bg-gray-900 mt-15 text-white">
      {/* Sidebar */}
      <div className="lg:w-64 w-full bg-gray-800 p-6 space-y-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-cyan-300 mb-4">📊 Dashboard</h1>
        <button
          className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === "price" ? "bg-cyan-700" : "bg-cyan-600"}`}
          onClick={() => setActiveTab("price")}
        >
          <FaChartLine /> Live Price
        </button>
        <button
          className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === "order" ? "bg-green-700" : "bg-green-600"}`}
          onClick={() => setActiveTab("order")}
        >
          <FaShoppingCart /> Place Order
        </button>
        <button
          className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === "history" ? "bg-yellow-700" : "bg-yellow-600"}`}
          onClick={() => setActiveTab("history")}
        >
          <FaHistory /> Trade History
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-2xl flex items-center gap-4 shadow-xl">
            <FaClipboardList className="text-3xl text-blue-400" />
            <div>
              <h2 className="text-lg">Total Orders</h2>
              <p className="text-xl font-bold">{totalOrders}</p>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl flex items-center gap-4 shadow-xl">
            <FaPlayCircle className="text-3xl text-green-400" />
            <div>
              <h2 className="text-lg">Executed</h2>
              <p className="text-xl font-bold">{executedOrders}</p>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl flex items-center gap-4 shadow-xl">
            <FaBan className="text-3xl text-red-400" />
            <div>
              <h2 className="text-lg">Cancelled</h2>
              <p className="text-xl font-bold">{cancelledOrders}</p>
            </div>
          </div>
        </div>

        {/* Symbol Input */}
        {activeTab === "price" && (
          <div>
            <label className="block mb-2 text-lg font-semibold">Enter Symbol:</label>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full max-w-sm p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., BTCUSD"
            />
            <div className="mt-4">
              {marketPrice ? (
                <div className="text-xl">
                  {marketPrice.status === "error" ? (
                    <span className="text-red-500">{marketPrice.message}</span>
                  ) : (
                    <>
                      <span>Bid: {marketPrice.bid}</span> | <span>Ask: {marketPrice.ask}</span>
                    </>
                  )}
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        )}

        {/* Place Order */}
        {activeTab === "order" && (
          <div className="space-y-4 max-w-xl">
            <label className="block text-lg font-semibold">Enter Symbol:</label>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 text-white"
              placeholder="e.g., BTCUSD"
            />
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="buy"
                  checked={action === "buy"}
                  onChange={() => setAction("buy")}
                />
                Buy
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="sell"
                  checked={action === "sell"}
                  onChange={() => setAction("sell")}
                />
                Sell
              </label>
            </div>
            <button
              onClick={placeOrder}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Place Order
            </button>
            {orderResponse && (
              <p className={`mt-2 ${orderResponse.status === "success" ? "text-green-500" : "text-red-500"}`}>
                {orderResponse.message}
              </p>
            )}
          </div>
        )}

    {/* Trade History */}
{activeTab === "history" && (
  <div className="space-y-4">
    {/* Filter Buttons */}
    <div className="flex gap-3 mb-4">
      <button onClick={() => setFilter("all")} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition duration-300">
        All
      </button>
      <button onClick={() => setFilter("today")} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition duration-300">
        Today
      </button>
      <button onClick={() => setFilter("7days")} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition duration-300">
        Last 7 Days
      </button>
      <button onClick={() => setFilter("30days")} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition duration-300">
        Last 30 Days
      </button>
    </div>

    {/* Table View */}
    <div className="overflow-x-auto rounded-lg shadow-md max-h-96 overflow-y-auto">
      <table className="min-w-full text-sm text-left text-gray-400 bg-gray-800">
        <thead className="text-xs uppercase bg-gray-700 text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3">Order ID</th>
            <th scope="col" className="px-6 py-3">Symbol</th>
            <th scope="col" className="px-6 py-3">Action</th>
            <th scope="col" className="px-6 py-3">Profit</th>
            <th scope="col" className="px-6 py-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredHistory.length > 0 ? (
            filteredHistory.map((trade, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition">
                {/* 🔥 FIX: Change orderId if your field is different */}
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{trade.ticket}</td>
                <td className="px-6 py-4">{trade.symbol}</td>
                <td className="px-6 py-4 capitalize">{trade.type}</td>
                <td className="px-6 py-4 text-green-400">{trade.profit}</td>
                <td className="px-6 py-4 text-sm">{formatIST(trade.time)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-400">No trades found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}




        {/* Pending Orders */}
        {activeTab === "order" && pendingOrders.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-bold">Pending Orders</h2>
            <ul className="space-y-2">
              {pendingOrders.map((order, index) => (
                <li key={index} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p>{order.symbol}</p>
                    <p className="text-sm text-gray-400">Ticket: {order.ticket}</p>
                  </div>
                  <button
                    onClick={() => cancelOrder(order.ticket)}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Dashboard;
