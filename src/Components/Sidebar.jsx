import React, { useState } from "react";

import whiteLogo from "../assets/white logo.png";
import Abayomi from "../assets/Abayomi.png";

import {
  FaGripHorizontal,
  FaWallet,
  FaExchangeAlt,
  FaPiggyBank,
  FaChartLine,
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

import "../Css/Sidebar.css";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../Store/UserSlice";

const Sidebar = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [activeItem, setActiveItem] = useState("dashboard");

  // GET USER FROM REDUX
  const { user } = useSelector((state) => state.user);

  const menuItems = [
    { name: "dashboard", icon: FaGripHorizontal },
    { name: "wallet", icon: FaWallet },
    { name: "convert", icon: FaExchangeAlt },
    { name: "smart-safe", icon: FaPiggyBank },
    { name: "invest", icon: FaChartLine },
  ];

  const handleLogout = () => {
    dispatch(logout());

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <header className="mobile-top-navbar">
        <div className="brand-group" onClick={() => navigate("/")}>
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
            <img
              src={user?.profilePicture?.url || Abayomi}
              alt="User Profile"
            />
          </div>
        </div>
      </header>

      <aside className="desktop-sidebar">
        <div
          className="sidebar-brand"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
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

                    <span className="menu-text">
                      {item.name.replace("-", " ")}
                    </span>
                  </button>
                </li>
              );
            })}

            <li>
              <button
                onClick={() => {
                  setActiveItem("profile");

                  navigate("/profile");
                }}
                className={`menu-item ${
                  activeItem === "profile" ? "active" : ""
                }`}
              >
                <FaUserCircle
                  className="menu-icon"
                  onClick={() => navigate("/profile")}
                  size={18}
                />

                <span className="menu-text">Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="menu-item logout-btn" onClick={handleLogout}>
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

                navigate(`/${item.name}`);
              }}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="bottom-nav-icon" size={20} />

              <span className="bottom-nav-text">
                {item.name.replace("-", " ")}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
