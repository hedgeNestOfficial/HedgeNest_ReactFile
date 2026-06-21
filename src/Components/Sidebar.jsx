import React, { useState } from "react"; // 🟢 Added useState for layout control
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

// 🟢 Import your existing components (adjust paths if your folder setup differs slightly)
import SignOutModal from "./KycModals/SignoutModal";
import SplashScreen from "../Components/SplashScreen"; // 💡 Using your existing splash component

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // 🟢 Modal and Splash Visibility States
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

  // 🟢 Handles the high-polished confirmation sequence
  const handleConfirmLogout = () => {
    setIsSignOutOpen(false);
    setShowSplash(true); // Mounts your splash screen layout

    // Holds view for 2 seconds to showcase the animation before state wiping and routing
    setTimeout(() => {
      dispatch(logout());
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/");
    }, 2000);
  };

  return (
    <>
      {/* 🟢 Render splash overlay at root level if active */}
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
            <FaBell size={22} />
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
          {/* 🟢 Updated click listener to safely intercept and open the confirmation block */}
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

      {/* 🟢 Sign Out Confirmation Modal Portal Layer */}
      <SignOutModal
        isOpen={isSignOutOpen}
        onClose={() => setIsSignOutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Sidebar;
