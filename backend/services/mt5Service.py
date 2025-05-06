import sys
import MetaTrader5 as mt5
from fastapi import FastAPI
import uvicorn
from datetime import datetime, timedelta
import pytz
# from python-mt5 import mt5_server.py
# Read command-line arguments
app = FastAPI()
try:
    login = int(sys.argv[1])
    password = sys.argv[2]
    server = sys.argv[3]
except:
    print("Invalid arguments passed")
    sys.exit(1)

# Initialize connection
if not mt5.initialize(login=login, password=password, server=server):
    print(f"Connection failed: {mt5.last_error()}")
    mt5.shutdown()
    sys.exit(1)

print("Connected successfully to MT5!")
# mt5.shutdown()
# sys.exit(0)
def get_indian_time():
    ist = pytz.timezone("Asia/Kolkata")
    return datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S")

# 1️⃣ Market Price API
@app.get("/market-price/{symbol}")
def get_market_price(symbol: str):
    symbol_info = mt5.symbol_info_tick(symbol)
    if symbol_info is None:
        return {"status": "error", "message": f"Symbol '{symbol}' not found"}
    
    return {
        "status": "success",
        "symbol": symbol,
        "bid": symbol_info.bid,  # BID = Current price at which you can sell the symbol
        "ask": symbol_info.ask,  # ASK = Current price at which you can buy the symbol
        "timestamp": get_indian_time()
    }

@app.post("/place-order")
def place_order(data: dict):
    try:
        message = data.get("messages", [])[0]
        symbol = message["symbol"]
        action = message["action"].lower()
        volume = 0.01  # Volume = 0.01 lot size

        symbol_info = mt5.symbol_info(symbol)
        tick_info = mt5.symbol_info_tick(symbol)

        if symbol_info is None or tick_info is None:
            return {"status": "error", "message": f"Symbol '{symbol}' not found"}

        ask_price = tick_info.ask
        bid_price = tick_info.bid
        stop_level = getattr(symbol_info, "trade_stops_level", 10)
        min_distance = stop_level * symbol_info.point

        # Stop Loss & Take Profit Calculation
        if action == "buy":
            entry_price = ask_price
            sl = entry_price - max(50, min_distance)
            tp1 = entry_price + max(10, min_distance)
        else:
            entry_price = bid_price
            sl = entry_price + max(50, min_distance)
            tp1 = entry_price - max(10, min_distance)

        order_types = {"buy": mt5.ORDER_TYPE_BUY, "sell": mt5.ORDER_TYPE_SELL}
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": symbol,
            "volume": volume,
            "type": order_types[action],
            "price": entry_price,
            "sl": round(sl, 5),
            "tp": round(tp1, 5),
            "deviation": 10,
            "magic": 0,
            "comment": "Trade via Telegram",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC
        }

        order_result = mt5.order_send(request)

        if order_result.retcode == mt5.TRADE_RETCODE_DONE:
            return {"status": "success", "message": "Order placed successfully", "order_id": order_result.order, "timestamp": get_indian_time()}
        else:
            error_code, error_msg = mt5.last_error()
            return {"status": "error", "message": f"Order failed: {error_msg} (Error Code: {error_code})", "timestamp": get_indian_time()}
    
    except Exception as e:
        return {"status": "error", "message": str(e), "timestamp": get_indian_time()}

@app.get("/trade-history")
def get_trade_history():
    try:
        from_date = datetime.now() - timedelta(days=30)
        to_date = datetime.now()

        history = mt5.history_deals_get(from_date, to_date)
        if history is None or len(history) == 0:
            return {"status": "error", "message": "No trade history found"}

        deals = []
        for deal in history:
            deals.append({
                "ticket": deal.ticket,
                "symbol": deal.symbol,
                "type": deal.type,
                "price": deal.price,
                "volume": deal.volume,
                "profit": deal.profit,
                "time": datetime.fromtimestamp(deal.time).strftime("%Y-%m-%d %H:%M:%S")
            })

        return {"status": "success", "history": deals}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/pending-orders")
def get_pending_orders():
    try:
        orders = mt5.orders_get()
        if orders is None or len(orders) == 0:
            return {"status": "error", "message": "No pending orders found"}

        pending_orders = []
        for order in orders:
            pending_orders.append({
                "ticket": order.ticket,
                "symbol": order.symbol,
                "type": order.type,
                "volume": order.volume_current,
                "price": order.price_open,
                "time": datetime.fromtimestamp(order.time_setup).strftime("%Y-%m-%d %H:%M:%S")
            })

        return {"status": "success", "orders": pending_orders}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/cancel-order")
def cancel_order(data: dict):
    try:
        ticket = data.get("ticket")
        if not ticket:
            return {"status": "error", "message": "Order ticket is required"}

        cancel_request = {
            "action": mt5.TRADE_ACTION_REMOVE,
            "order": ticket,
            "comment": "Cancel from API"
        }

        result = mt5.order_send(cancel_request)

        if result.retcode == mt5.TRADE_RETCODE_DONE:
            return {"status": "success", "message": f"Order {ticket} cancelled successfully"}
        else:
            return {"status": "error", "message": f"Failed to cancel order: {result.retcode}"}
    except Exception as e:
        return {"status": "error", "message": str(e)}




# Ensure proper MT5 shutdown on app exit
import atexit
atexit.register(mt5.shutdown)

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8002)

