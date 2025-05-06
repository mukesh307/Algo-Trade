import React from 'react';
import background from "../assets/pk.jpg"; // Import the image

const About = () => {
  return (
    <>
      <div 
        className="pt-20 px-4 pb-10 min-h-screen min-w-screen bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${background})` }} // Set the imported image as the background
      >
        <div className="max-w-5xl mx-auto bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl backdrop-blur-md">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-700 mb-10">
            About AlgoTradeX
          </h1>

          <div className="text-gray-800 text-lg md:text-xl space-y-8 leading-relaxed">
            <p>
              <span className="font-semibold text-indigo-600">Welcome to AlgoTradeX!</span> <br />
              Our algorithmic trading platform empowers traders with cutting-edge automation tools that analyze market trends, execute trades in real time, and manage risk—completely hands-free.
            </p>

            <p>
              <span className="font-semibold text-indigo-600">What is Algorithmic Trading?</span> <br />
              Algorithmic trading uses computer algorithms to automatically execute trades based on predefined strategies. It removes emotional decision-making, ensures faster execution, and allows round-the-clock trading.
            </p>

            <p>
              <span className="font-semibold text-indigo-600">How Does It Work?</span> <br />
              Our platform connects with top financial market APIs, monitors real-time data, and triggers trades using AI-powered logic. Users can customize strategies or choose from pre-built ones designed by market experts.
            </p>

            <div>
              <span className="font-semibold text-indigo-600">Key Features:</span>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Real-time Market Data:</strong> Instantly track live prices, sentiment, and trends.</li>
                <li><strong>Advanced Risk Management:</strong> Pre-set SL/TP, position sizing, and volatility filters.</li>
                <li><strong>Backtesting Engine:</strong> Simulate strategies against historical data.</li>
                <li><strong>One-Click Trade Execution:</strong> Lightning-fast, AI-based execution engine.</li>
                <li><strong>Portfolio Overview:</strong> Track performance, diversification, and exposure.</li>
              </ul>
            </div>

            <div>
              <span className="font-semibold text-indigo-600">Why Choose AlgoTradeX?</span>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li><strong>Speed:</strong> Execute trades in milliseconds, faster than any human could.</li>
                <li><strong>Emotionless Decisions:</strong> Algorithms stick to logic—no fear or greed.</li>
                <li><strong>24/7 Automation:</strong> Trade across global markets even while you sleep.</li>
                <li><strong>Efficiency:</strong> Lower transaction costs and improved accuracy.</li>
              </ul>
            </div>

            <p>
              <span className="font-semibold text-indigo-600">Built on Innovation</span> <br />
              At the core of AlgoTradeX lies a blend of data science, artificial intelligence, and deep learning. Our algorithms are continuously evolving to adapt to ever-changing markets.
            </p>

            <p>
              <span className="font-semibold text-indigo-600">Get Started Today</span> <br />
              Sign up, verify your account, and start exploring the power of smart trading with our intuitive dashboard. Whether you’re a beginner or a pro, AlgoTradeX is built for all.
            </p>

            <p>
              <span className="font-semibold text-indigo-600">The Future of Trading is Here</span> <br />
              Let your strategy work for you—fast, precise, and automatic. Experience the revolution in trading.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
