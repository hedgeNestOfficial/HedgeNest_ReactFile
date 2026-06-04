import React, { useState } from "react";
import "../Css/Header.css";
import logo from "../assets/HedgeNest.png";
import { CiMenuBurger } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import Button from "./Button";

const Header = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("");

  const handleNavigation = (tab, route) => {
    setActiveTab(tab);
    navigate(route);
  };

  return (
    <header className="header-container">
      <section className="header-wrapper">
        <img src={logo} alt="HedgeNest Logo" className="logo" />

        <ul className="navigation">
          <li
            onClick={() => handleNavigation("shield", "/shield")}
            style={{
              color: activeTab === "shield" ? "#c9922a" : "",
            }}
          >
            Shield
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
        </ul>

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

        <CiMenuBurger className="menu" />
      </section>
    </header>
  );
};

export default Header;
