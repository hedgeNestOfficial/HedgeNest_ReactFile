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
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer-container">
      <section className="footer-holder">
        <article className="footer-up">
          <div className="Footer-logo-con">
            <div className="footer-logo">
              <img src={WhiteLogo} alt="HedgeNest logo" />
              <h3>HedgeNest</h3>
            </div>
            <p>
              HedgeNest helps you protect, save and grow your money with
              confidence. Convert Naira to USDT at transparent rates, build
              disciplined savings habits, and access simple investments options;
              all in one secure platform.
            </p>
            <div className="socials">
              <FaFacebook aria-label="Facebook" />
              <FaXTwitter aria-label="X (Twitter)" />
              <FaInstagram aria-label="Instagram" />
              <FaLinkedinIn aria-label="LinkedIn" />
            </div>
          </div>

          <div className="footer-box">
            <h4>Company</h4>
            <ul>
              <li onClick={() => navigate("/contact")}>Contact Us</li>
              <li onClick={() => navigate("/about")}>About Us</li>
              <li>Savings</li>
              <li>Investments</li>
              <li>Currency Conversion</li>
            </ul>
          </div>

          <div className="footer-box">
            <h4>Business</h4>
            <ul>
              <li onClick={() => navigate("/policy")}>Stable Coin</li>
              <li onClick={() => navigate("/save")}>Savings Vault</li>
              <li onClick={() => navigate("/invest")}>Tiered Investments</li>
            </ul>
          </div>

          <div className="footer-box">
            <h4>Legal</h4>
            <ul>
              <li onClick={() => navigate("/policy")}>Privacy Policy</li>
              <li onClick={() => navigate("/policy")}>Terms Of Service</li>
              <li onClick={() => navigate("/policy")}>Cookie Policy</li>
              <li onClick={() => navigate("/policy")}>Compliance</li>
            </ul>
          </div>

          <div className="footer-box">
            <h4>Support</h4>
            <ul>
              <li onClick={() => navigate("/contact")}>Help Center</li>
              <li onClick={() => navigate("/contact")}>Contact Us</li>
            </ul>
          </div>
        </article>

        <hr className="footer-divider" />
        <article className="footer-down">
          <p className="down-disclaimer">
            HedgeNest works with trusted partners to deliver secure financial
            services. Investments outcomes may vary, always review details
            before proceeding
          </p>

          <div className="copyright">
            <FaRegCopyright style={{ fontSize: "16px", color: "white" }} />
            <p>2026 HedgeNest. All Rights Reserved</p>
          </div>
        </article>
      </section>
    </footer>
  );
};

export default Footer;
