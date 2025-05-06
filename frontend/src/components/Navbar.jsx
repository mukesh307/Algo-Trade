import { useState } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const Navbar = ({ isLoggedIn, setIsLoggedIn, isMenuOpen, setIsMenuOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isTradingDropdownOpen, setIsTradingDropdownOpen] = useState(false);
  const [mobileChannelOpen, setMobileChannelOpen] = useState(false);
  const [mobileTradingOpen, setMobileTradingOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-6 py-3 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold text-indigo-600 hover:text-indigo-700 transition">
            AlgoTradeX
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 font-semibold text-gray-700 items-center">
            <li className="hover:text-indigo-600 transition">
              <Link to="/Homepage">Home</Link>
            </li>

            {/* Trading Platform Dropdown */}
            <li className="relative">
              <Link
                to="#"
                className="flex items-center gap-1 hover:text-indigo-600 transition"
                onClick={(e) => {
                  e.preventDefault();
                  setIsTradingDropdownOpen(!isTradingDropdownOpen);
                }}
              >
                Trading Platform
                <svg
                  className={`w-4 h-4 transition-transform ${isTradingDropdownOpen ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {isTradingDropdownOpen && (
                <ul className="absolute top-10 left-1/2 transform -translate-x-1/2 w-52 bg-white shadow-xl rounded-lg py-2 transition-all z-50">
                  <li className="block px-4 py-2 text-center text-black font-medium cursor-default">
                    Choose Platform
                  </li>
                  {[
                    { label: "MetaTrade 4 (MT4)", to: "/mt4" },
                    { label: "MetaTrade 5 (MT5)", to: "/MT5Connect" },
                    { label: "Ninja Trade", to: "/ninja-trade" },
                    { label: "Trading View", to: "/trading-view" },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <Link
                        to={item.to}
                        onClick={() => setIsTradingDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 text-center"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Channels Dropdown */}
            <li className="relative">
              <Link
                to="#"
                className="flex items-center gap-1 hover:text-indigo-600 transition"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                Channels
                <svg
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : "rotate-0"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {isDropdownOpen && (
                <ul className="absolute top-10 left-1/2 transform -translate-x-1/2 w-52 bg-white shadow-xl rounded-lg py-2 transition-all z-50">
                  <li className="block px-4 py-2 text-center text-black font-medium cursor-default">
                    Choose Channel
                  </li>
                  {[
                    { label: "Telegram", to: "/TelegramLogin" },
                    { label: "WhatsApp", to: "/whatsapp" },
                    { label: "Discord", to: "/discord" },
                    { label: "Slack", to: "/slack" },
                  ].map((item, idx) => (
                    <li key={idx}>
                      <Link
                        to={item.to}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600 text-center"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="hover:text-indigo-600 transition">
              <Link to="/dashboard">Trade-Dashboard</Link>
            </li>
            <li className="hover:text-indigo-600 transition">
              <Link to="/about">About</Link>
            </li>
            <li className="hover:text-indigo-600 transition">
              <Link to="/contact">Contact</Link>
            </li>
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <input
                type="text"
                placeholder="Search..."
                className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm shadow-sm"
              />
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold hover:bg-indigo-200 transition"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                U
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <LogoutButton setIsLoggedIn={setIsLoggedIn} />
                    </>
                  ) : (
                    <Link
                      to="/"
                      className="block px-4 py-2 hover:bg-indigo-50 hover:text-indigo-600"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger */}
            <div className="md:hidden">
              <button
                className="text-gray-600 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-6 transition-all overflow-y-auto">
          <ul className="flex flex-col space-y-4 text-lg font-semibold text-gray-700">
            <li>
              <Link to="/Homepage" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </li>

            {/* Mobile Trading Dropdown */}
            <li>
              <button
                className="w-full text-left flex justify-between items-center"
                onClick={() => setMobileTradingOpen(!mobileTradingOpen)}
              >
                Trading Platform
                <svg
                  className={`w-4 h-4 transition-transform ${mobileTradingOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileTradingOpen && (
                <ul className="pl-4 space-y-2 mt-2">
                  <li><Link to="/mt4" onClick={() => setIsMenuOpen(false)}>MetaTrade 4</Link></li>
                  <li><Link to="/MT5Connect" onClick={() => setIsMenuOpen(false)}>MetaTrade 5</Link></li>
                  <li><Link to="/ninja-trade" onClick={() => setIsMenuOpen(false)}>Ninja Trade</Link></li>
                  <li><Link to="/trading-view" onClick={() => setIsMenuOpen(false)}>Trading View</Link></li>
                </ul>
              )}
            </li>

            {/* Mobile Channels Dropdown */}
            <li>
              <button
                className="w-full text-left flex justify-between items-center"
                onClick={() => setMobileChannelOpen(!mobileChannelOpen)}
              >
                Channels
                <svg
                  className={`w-4 h-4 transition-transform ${mobileChannelOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileChannelOpen && (
                <ul className="pl-4 space-y-2 mt-2">
                  <li><Link to="/TelegramLogin" onClick={() => setIsMenuOpen(false)}>Telegram</Link></li>
                  <li><Link to="/whatsapp" onClick={() => setIsMenuOpen(false)}>WhatsApp</Link></li>
                  <li><Link to="/discord" onClick={() => setIsMenuOpen(false)}>Discord</Link></li>
                  <li><Link to="/slack" onClick={() => setIsMenuOpen(false)}>Slack</Link></li>
                </ul>
              )}
            </li>

            <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Trade-Dashboard</Link></li>
            <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
