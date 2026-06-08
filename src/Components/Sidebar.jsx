import { NavLink } from "react-router-dom";
import whiteLogo from "../assets/white logo.png";
import Abayomi from "../assets/Abayomi.png";
import {
  FaGripHorizontal, // Dashboard
  FaWallet, // Wallet
  FaExchangeAlt, // Convert
  FaUserCircle, // Profile
  FaSignOutAlt, // Sign Out
  FaBell, // Mobile Top Header Bell
} from "react-icons/fa";
import "../Css/Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: FaGripHorizontal, path: "/dashboard" },
    { name: "Wallet", icon: FaWallet, path: "/wallet" },
    { name: "Convert", icon: FaExchangeAlt, path: "/convert" },
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
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive: routeIsActive }) =>
                      `menu-item ${routeIsActive ? "active" : ""}`
                    }
                  >
                    <Icon className="menu-icon" size={18} />
                    <span className="menu-text">{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
            <li>
              <button className="menu-item">
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
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive: routeIsActive }) =>
                `bottom-nav-item ${routeIsActive ? "active" : ""}`
              }
            >
              <Icon className="bottom-nav-icon" size={20} />
              <span className="bottom-nav-text">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
