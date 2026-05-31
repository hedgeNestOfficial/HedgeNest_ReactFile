import React from "react";
import "../Css/Header.css";
import logo from "../assets/HedgeNest.png";


import Button from "./Button";

const Header = () => {
  return (
    <header className="header-container">
      <section className="header-wrapper">
        <img src={logo} alt="" className="logo" />

        <ul className="navigation">
          <li>Shield</li>
          <li> Save</li>
          <li> Invest </li>
        </ul>

        <div className="logs">
          <Button text="Log in" className="login" />
          <Button text="Create an account" className="create" />
        </div>
      </section>
    </header>
  );
};

export default Header;
