const axios = require("axios");

const MT5_API_BASE_URL = process.env.MT5_API_BASE_URL;

// ✅ Market Price
exports.getMarketPrice = async (req, res) => {
  try {
    const { symbol } = req.query;
    const response = await axios.get(`${MT5_API_BASE_URL}/market-price/${symbol}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch market price" });
  }
};

// ✅ Place Order
exports.placeOrder = async (req, res) => {
  try {
    const { symbol, action } = req.body;

    const response = await axios.post(`${MT5_API_BASE_URL}/place-order`, {
      messages: [
        {
          symbol,
          action,
        },
      ],
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to place order" });
  }
};


// ✅ Trade History
exports.getTradeHistory = async (req, res) => {
    try {
      const response = await axios.get(`${MT5_API_BASE_URL}/trade-history`);
      res.json(response.data);
    } catch (error) {
      console.error("Trade History Error:", error.message);
      res.status(500).json({ error: "Failed to fetch trade history" });
    }
  };
  

  exports.getPendingOrders = async (req, res) => {
    try {
      const url = `${MT5_API_BASE_URL}/pending-orders`;
      console.log("Request URL:", url); // Debugging the URL
  
      const response = await axios.get(url);
      // console.log("MT5 API response:", response.data); // Debugging the response data
  
      // Assuming the response has an 'orders' key
      if (response.data && Array.isArray(response.data.orders)) {
        res.json({ orders: response.data.orders });
      } else {
        res.status(400).json({ error: "Invalid response format" });
      }
    } catch (error) {
      console.error("Pending Orders Error:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "Failed to fetch pending orders" });
    }
  };

// ✅ Cancel Pending Order
exports.cancelOrder = async (req, res) => {
  const { orderId } = req.body;
  try {
    const response = await axios.post(`${MT5_API_BASE_URL}/cancel-order`, {
      order_id: orderId,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Cancel Order Error:", error.message);
    res.status(500).json({ error: "Failed to cancel order" });
  }
};

const { exec } = require("child_process");
const path = require("path");

exports.connectToMT5 = async (req, res) => {
  const { login, password, server } = req.body;

  if (!login || !password || !server) {
    return res.status(400).json({ success: false, message: "Missing credentials" });
  }

  // Cross-platform python command
  const pythonCmd = process.platform === "win32" ? "python" : "python3";
  const scriptPath = path.join(__dirname, "../services/mt5Service.py");

  const command = `${pythonCmd} "${scriptPath}" ${login} ${password} "${server}"`;

  console.log("Executing:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", stderr || stdout);
      return res.status(500).json({ success: false, message: stderr || stdout });
    }

    return res.status(200).json({ success: true, message: stdout });
  });
};


  
  


  
