import React from "react";
import "../Css/Footer.css";
import WhiteLogo from "../assets/white logo.png";
import {
  FaRegCopyright,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container">
      <section className="footer-holder">
        <article className="footer-up">
          <div className="Footer-logo-con">
            <div className="footer-logo">
              <img src={WhiteLogo} alt="HedgeNestlogo" />
              <h3>HedgeNest</h3>
            </div>
            <p>
              HedgeNest helps you protect, save and grow your money with
              confidence. Convert Naira to USDT at transparent rates, build
              disciplined savings habits, and access simple investments options;
              all in one secure platform.
            </p>
            <div className="socials">
              <FaFacebook />
              <FaXTwitter />
              <FaInstagram />
              <FaLinkedinIn />
            </div>
          </div>
          <div className="footer-box">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Savings</li>
              <li>Investments</li>
              <li>Currency Conversion</li>
            </ul>
          </div>
          <div className="footer-box">
            <h4>Business</h4>
            <ul>
              <li>Stable Coin</li>
              <li>Savings Vault</li>
              <li>Tired Investments</li>
            </ul>
          </div>
          <div className="footer-box">
            <h4>Legal</h4>
            <ul>
              <li>Privacy Policy</li>
              <li>Terms Of Service</li>
              <li>Compliance</li>
            </ul>
          </div>
          <div className="footer-box">
            <h4>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </article>
        <hr />
        <article className="footer-down">
          <div className="down-con">
            <p>
              HedgeNest works with trusted partners to deliver secure financial
              services. Investments outcomes may vary, always review details
              before proceeding
            </p>

            <div className="copyright">
              <FaRegCopyright style={{ fontSize: "17px", color: "white" }} />
              <p>2026 HedgeNest. All Rights Reserved</p>
            </div>
          </div>
        </article>
      </section>
    </footer>
  );
};

export default Footer;
