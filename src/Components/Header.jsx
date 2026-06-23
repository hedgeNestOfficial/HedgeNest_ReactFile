import React, { useState } from "react";
import "../Css/Header.css";
import logo from "../assets/Hedge.png";
import { CiMenuBurger } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Store/UserSlice";
import Button from "./Button";
import toast from "react-hot-toast";

// Imported to synchronize premium checkout/animation layouts across landing pages
import SignoutModal from "./KycModals/SignoutModal";
import SplashScreen from "../Components/SplashScreen";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, user } = useSelector((state) => state.user);

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const isAuthenticated = !!token;

  const handleNavigation = (tab, route) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    navigate(route);
  };

  const handleLogoutConfirm = () => {
    setIsMenuOpen(false);
    setIsLogoutOpen(false);
    setShowSplash(true);

    setTimeout(() => {
      dispatch(logout());
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      sessionStorage.clear();
      toast.success("Logged out successfully");
      navigate("/");
      setShowSplash(false);
    }, 2000);
  };

  return (
    <>
      {showSplash && <SplashScreen />}

      <header className="header-container">
        <section className="header-wrapper">
          <img
            src={logo}
            alt="HedgeNest Logo"
            className="logo"
            onClick={() => handleNavigation("home", "/")}
          />

          <ul className={`navigation ${isMenuOpen ? "open" : ""}`}>
            <li
              onClick={() => handleNavigation("protect", "/protect")}
              style={{
                color: activeTab === "protect" ? "#c9922a" : "",
              }}
            >
              Protect
            </li>

            <li
              onClick={() => handleNavigation("save", "/save")}
              style={{
                color: activeTab === "save" ? "#c9922a" : "",
              }}
            >
              Save
            </li>

            <li
              onClick={() => handleNavigation("invest", "/investPage")}
              style={{
                color: activeTab === "invest" ? "#c9922a" : "",
              }}
            >
              Invest
            </li>

            {/* MOBILE BUTTONS */}
            <li className="mobile-dropdown-logs">
              {!isAuthenticated ? (
                <>
                  <Button
                    text="Log in"
                    className="login"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/login");
                    }}
                  />

                  <Button
                    text="Create an account"
                    className="create"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/signup");
                    }}
                  />
                </>
              ) : (
                <>
                  <Button
                    text="Dashboard"
                    className="create"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/dashboard");
                    }}
                  />
                  <button
                    onClick={() => setIsLogoutOpen(true)}
                    style={{
                      width: "100%",
                      padding: "10px 16px",
                      marginTop: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      background: "transparent",
                      cursor: "pointer",
                      color: "#d32f2f",
                      fontWeight: "500",
                      fontSize: "14px",
                    }}
                  >
                    Sign Out
                  </button>
                </>
              )}
            </li>
          </ul>

          {/* DESKTOP BUTTONS */}
          <div className="logs">
            {!isAuthenticated ? (
              <>
                <Button
                  text="Log in"
                  className="login"
                  onClick={() => navigate("/login")}
                />

                <Button
                  text="Create an account"
                  className="create"
                  onClick={() => navigate("/signup")}
                />
              </>
            ) : (
              <div className="desktop-user-section">
                <Button
                  text="Dashboard"
                  className="create"
                  onClick={() => navigate("/dashboard")}
                />
                <div
                  className="user-avatar-container"
                  onClick={() => setIsLogoutOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  {user?.profilePicture?.url ? (
                    <img
                      src={user.profilePicture.url}
                      alt="Profile"
                      className="user-avatar-img"
                    />
                  ) : (
                    <FaUserCircle size={28} className="user-avatar-icon" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* MENU ICON */}
          <div className="menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <IoClose /> : <CiMenuBurger />}
          </div>
        </section>
      </header>

      <SignoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Header;
