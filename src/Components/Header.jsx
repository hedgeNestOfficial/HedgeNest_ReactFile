import React from "react";
import "../Css/Header.css";
import logo from "../assets/Headgenestlogo.png";
import { headerButton, headerLogBtn } from "../JS/HeaderButton";
import Button from "./Button";

const Header = () => {
  return (
    <header>
      <section className="header-wrapper">
        <div className="logo-Container">
          <img src={logo} alt="" />
        </div>
        <div className="navigation">
          {headerButton.map((btn, index) => (
            <Button className="nav-btn" key={index}>
              {btn}
            </Button>
          ))}
        </div>
        <div className="logs">
          {headerLogBtn.map((button, index) => (
            <Button className="log-btn" key={index}>
              {button}
            </Button>
          ))}
        </div>
      </section>
    </header>
  );
};

export default Header;
