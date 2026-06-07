import React, { useState } from "react";
import "../Css/Header.css";

import logo from "../assets/HedgeNest.png";

import { CiMenuBurger } from "react-icons/ci";

import { IoClose } from "react-icons/io5";

import { useNavigate } from "react-router-dom";

import Button from "./Button";

const Header = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (tab, route) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    navigate(route);
  };

  return (
    <header className="header-container">
      <section className="header-wrapper">
        <img
          src={logo}
          alt="HedgeNest Logo"
          className="logo"
          onClick={() => navigate("/")}
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
            onClick={() => handleNavigation("invest", "/invest")}
            style={{
              color: activeTab === "invest" ? "#c9922a" : "",
            }}
          >
            Invest
          </li>

          {/* MOBILE BUTTONS */}

          <li className="mobile-dropdown-logs">
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
          </li>
        </ul>

        {/* DESKTOP BUTTONS */}

        <div className="logs">
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
        </div>

        {/* MENU ICON */}

        <div className="menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <IoClose /> : <CiMenuBurger />}
        </div>
      </section>
    </header>
  );
};

export default Header;
