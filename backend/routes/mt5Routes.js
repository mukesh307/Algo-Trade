const express = require("express");
const router = express.Router();
const {
  getMarketPrice,
  placeOrder,
  getTradeHistory,
  getPendingOrders,
  cancelOrder,
  connectToMT5 
} = require("../controllers/mt5Controller");

router.get("/price", getMarketPrice);

// ✅ Place a market/pending order
router.post("/place-order", placeOrder);

// ✅ Get trade history
router.get("/trade-history", getTradeHistory);

// ✅ Get all pending orders
router.get("/pending-orders", getPendingOrders);

// ✅ Cancel a specific pending order
router.post("/cancel-order", cancelOrder);

router.post("/connect", connectToMT5);

module.exports = router;
