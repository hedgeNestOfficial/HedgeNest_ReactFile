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
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("Smart Safe");

  const menuItems = [
    { name: "dashboard", icon: FaGripHorizontal },
    { name: "wallet", icon: FaWallet },
    { name: "convert", icon: FaExchangeAlt },
    { name: "smart Safe", icon: FaPiggyBank },
    { name: "invest", icon: FaChartLine },
  ];
  const navigate = useNavigate();

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
                    onClick={() => {
                      setActiveItem(item.name);
                      navigate(`/${item.name}`);
                    }}
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
                onClick={() => {
                  setActiveItem("Profile");
                  navigate("/profile");
                }}
                className={`menu-item ${activeItem === "Profile" ? "active" : ""}`}
              >
                <FaUserCircle className="menu-icon" size={18} />
                <span className="menu-text">Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            className="menu-item logout-btn"
            onClick={() => navigate("/signout")}
          >
            <FaSignOutAlt className="menu-icon" size={18} />
            <span className="menu-text">Sign Out</span>
          </button>
        </div>
      </aside>

      <nav className="mobile-bottom-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;
          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveItem(item.name);
                navigate(`/${item.name.toLowerCase().replace(/\s/g, "-")}`);
              }}
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
