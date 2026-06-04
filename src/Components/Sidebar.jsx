import React from "react";
import "../Css/Sidebar.css";
import logo from "../assets/white logo.png"; // Your HedgeNest shield logo asset
import { 
  IoGridOutline, 
  IoWalletOutline, 
  IoSwapHorizontalOutline, 
  IoTrendingUpOutline, 
  IoPersonOutline, 
  IoLogOutOutline 
} from "react-icons/io5";
import { FaPiggyBank } from "react-icons/fa6"; // Standard outline piggy bank for Smart Safe

const Sidebar = () => {
  return (
    <aside className="sidebar-wrapper">
      {/* Brand Header Unit */}
      <div className="sb-brand-header">
        <div className="sb-logo-container">
          <img src={logo} alt="HedgeNest Logo" />
        </div>
        <span className="sb-brand-name">HedgeNest</span>
      </div>

      {/* Main Navigation Link Links */}
      <nav className="sb-nav-menu">
        <ul className="sb-nav-list">
          <li className="sb-nav-item">
            <a href="/dashboard" className="sb-nav-link active">
              <span className="sb-icon-wrapper">
                <IoGridOutline className="sb-icon" />
              </span>
              <span className="sb-link-label">Dashboard</span>
            </a>
          </li>

          <li className="sb-nav-item">
            <a href="/wallet" className="sb-nav-link">
              <span className="sb-icon-wrapper">
                <IoWalletOutline className="sb-icon" />
              </span>
              <span className="sb-link-label">Wallet</span>
            </a>
          </li>

          <li className="sb-nav-item">
            <a href="/convert" className="sb-nav-link">
              <span className="sb-icon-wrapper">
                <IoSwapHorizontalOutline className="sb-icon" />
              </span>
              <span className="sb-link-label">Convert</span>
            </a>
          </li>

          <li className="sb-nav-item">
            <a href="/smart-safe" className="sb-nav-link">
              <span className="sb-icon-wrapper">
                <FaPiggyBank className="sb-icon" />
              </span>
              <span className="sb-link-label">Smart Safe</span>
            </a>
          </li>

          <li className="sb-nav-item">
            <a href="/invest" className="sb-nav-link">
              <span className="sb-icon-wrapper">
                <IoTrendingUpOutline className="sb-icon" />
              </span>
              <span className="sb-link-label">Invest</span>
            </a>
          </li>

          <li className="sb-nav-item">
            <a href="/profile" className="sb-nav-link">
              <span className="sb-icon-wrapper">
                <IoPersonOutline className="sb-icon" />
              </span>
              <span className="sb-link-label">Profile</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Footer Utility Actions */}
      <div className="sb-footer">
        <button className="sb-logout-btn" type="button">
          <span className="sb-icon-wrapper">
            <IoLogOutOutline className="sb-icon" />
          </span>
          <span className="sb-link-label">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;