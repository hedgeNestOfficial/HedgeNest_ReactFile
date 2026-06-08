import React, { useState } from "react";
import whiteLogo from "../assets/white logo.png";
import Abayomi from "../assets/Abayomi.png";
import {
  FaGripHorizontal, // Dashboard
  FaWallet, // Wallet
  FaExchangeAlt, // Convert
  FaPiggyBank, // Smart Safe
  FaChartLine, // Invest
  FaUserCircle, // Profile
  FaSignOutAlt, // Sign Out
  FaBell, // Mobile Top Header Bell
} from "react-icons/fa";
import "../Css/Sidebar.css";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Smart Safe");

  const menuItems = [
    { name: "Dashboard", icon: FaGripHorizontal },
    { name: "Wallet", icon: FaWallet },
    { name: "Convert", icon: FaExchangeAlt },
    { name: "Smart Safe", icon: FaPiggyBank },
    { name: "Invest", icon: FaChartLine },
  ];

  return (
    <>
      {/* MOBILE TOP NAVBAR */}
      <header className="mobile-top-navbar">
        <div className="brand-group">
          <div className="brand-logo">
            <img src={whiteLogo} alt="HedgeNest Logo" />
          </div>
          <span className="brand-name">HedgeNest</span>
        </div>
        <div className="mobile-actions">
          <button className="action-btn" aria-label="Notifications">
            <FaBell size={22} />
          </button>
          <div className="user-avatar">
            <img src={Abayomi} alt="User Profile" />
          </div>
        </div>
      </header>

      {/* DESKTOP SIDEBAR */}
      <aside className="desktop-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <img src={whiteLogo} alt="HedgeNest Logo" />
          </div>
          <span className="brand-name">HedgeNest</span>
        </div>

        <nav className="sidebar-menu">
          <ul className="menu-list">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveItem(item.name)}
                    className={`menu-item ${isActive ? "active" : ""}`}
                  >
                    <Icon className="menu-icon" size={18} />
                    <span className="menu-text">{item.name}</span>
                  </button>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => setActiveItem("Profile")}
                className={`menu-item ${activeItem === "Profile" ? "active" : ""}`}
              >
                <FaUserCircle className="menu-icon" size={18} />
                <span className="menu-text">Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="menu-item logout-btn">
            <FaSignOutAlt className="menu-icon" size={18} />
            <span className="menu-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="mobile-bottom-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;
          return (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="bottom-nav-icon" size={20} />
              <span className="bottom-nav-text">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
