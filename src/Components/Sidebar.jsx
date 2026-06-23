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
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Store/UserSlice";
import SignOutModal from "./KycModals/SignoutModal";
import SplashScreen from "../Components/SplashScreen";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const userInitial = `${user?.firstName?.charAt(0) || ""}${
    user?.lastName?.charAt(0) || ""
  }`.toUpperCase();
  const profileImage = user?.profilePicture?.url;
  const currentPath = location.pathname;

  const menuItems = [
    { name: "Dashboard", icon: FaGripHorizontal },
    { name: "Wallet", icon: FaWallet },
    { name: "Convert", icon: FaExchangeAlt },
    { name: "SmartSafe", icon: FaPiggyBank },
    { name: "Invest", icon: FaChartLine },
  ];

  const handleConfirmLogout = () => {
    setIsSignOutOpen(false);
    setShowSplash(true);

    setTimeout(() => {
      dispatch(logout());
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/");
    }, 2000);
  };

  return (
    <>
      {showSplash && <SplashScreen />}

      {/* MOBILE TOP NAVBAR */}
      <header className="mobile-top-navbar">
        <div className="brand-group" onClick={() => navigate("/")}>
          <div className="brand-logo">
            <img src={whiteLogo} alt="HedgeNest Logo" />
          </div>
          <span className="brand-name">HedgeNest</span>
        </div>

        <div className="mobile-actions">
          <button className="action-btn" aria-label="Notifications">
            <FaBell size={22} onClick={() => navigate("/notification")} />
          </button>

          <div className="user-avatar" onClick={() => navigate("/profile")}>
            {profileImage ? (
              <img
                src={profileImage}
                alt="User Profile"
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">{userInitial}</div>
            )}
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
              const targetRoute = `/${item.name.toLowerCase()}`;
              const isActive = currentPath === targetRoute;

              return (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(targetRoute)}
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
                onClick={() => navigate("/profile")}
                className={`menu-item ${
                  currentPath === "/profile" ? "active" : ""
                }`}
              >
                <FaUserCircle className="menu-icon" size={18} />
                <span className="menu-text">Profile</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* LOGOUT */}
        <div className="sidebar-footer">
          <button
            className="menu-item logout-btn"
            onClick={() => setIsSignOutOpen(true)}
          >
            <FaSignOutAlt className="menu-icon" size={18} />
            <span className="menu-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const targetRoute = `/${item.name.toLowerCase()}`;
          const isActive = currentPath === targetRoute;

          return (
            <button
              key={item.name}
              onClick={() => navigate(targetRoute)}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
            >
              <Icon className="bottom-nav-icon" size={20} />
              <span className="bottom-nav-text">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <SignOutModal
        isOpen={isSignOutOpen}
        onClose={() => setIsSignOutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;
