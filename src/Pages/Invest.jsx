import React from "react";
import "../Css/Invest.css";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
import investIMG1 from "../assets/investIMG1.png";
import investIMG2 from "../assets/investIMG2.jpg";
import investIMG3 from "../assets/investIMG3.jpg";
import investIMG4 from "../assets/investIMG4.jpg";
import lowrisk from "../assets/lowrisk.jpg";
import mediumrisk from "../assets/mediumrisk.jpg";
import { IoSpeedometerOutline } from "react-icons/io5";
import { LuTrendingUp } from "react-icons/lu";
import { TbTargetArrow } from "react-icons/tb";
import { IoEyeOutline } from "react-icons/io5";
import { FaPeopleCarry } from "react-icons/fa";

const Invest = () => {
  return (
    <div className="invest-page-wrapper">
      <Header />

      <section className="inv-hero">
        <div className="inv-container">
          <div className="inv-content">
            <h1 className="inv-title">
              Invest In Opportunities <br />
              <span className="inv-gold-text">That Grow Your Wealth</span>
            </h1>
            <p className="inv-subtitle">
              Choose from carefully created low and medium risk investment
              options that match your risk appetite.
            </p>
            <ul className="inv-list">
              <li>
                <span className="inv-check">✓</span> Transparent and secure
              </li>
              <li>
                <span className="inv-check">✓</span> Low and medium risk options
              </li>
              <li>
                <span className="inv-check">✓</span> Track performance in real
                time
              </li>
              <li>
                <span className="inv-check">✓</span> Start investing from as low
                as ₦5,000
              </li>
            </ul>
            <div className="inv-actions">
              <button className="inv-btn-solid" type="button">
                Start Investing
              </button>
              <button className="inv-btn-outline" type="button">
                Explore Options
              </button>
            </div>
          </div>
          <div className="inv-graphic-wrapper">
            <div className="inv-image-placeholder">
              <img src={investIMG1} alt="Investment Option 1" />
            </div>
          </div>
        </div>
      </section>

      <section className="nti-section">
        <div className="nti-container">
          <div className="nti-block">
            <div className="nti-text-wrapper">
              <h2 className="nti-heading">New to Investing?</h2>
              <p className="nti-subtext">
                We guide you every step of the way, from understanding risk to
                making your first investment.
              </p>
            </div>
            <div className="nti-img-placeholder">
              <img src={investIMG2} alt="New to investing illustration" />
            </div>
          </div>
          <div className="nti-block nti-reverse-mobile">
            <div className="nti-img-placeholder">
              <img src={investIMG3} alt="New to investing illustration" />
            </div>
            <div className="nti-text-wrapper nti-padding-top">
              <h2 className="nti-heading">
                Know exactly what you're investing in
              </h2>
              <p className="nti-subtext">
                We break down every investment in simple terms, so you
                understand the risks, returns, and how your money works.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw-section">
        <div className="hiw-container">
          <div className="hiw-header">
            <h2 className="hiw-heading">How it Works</h2>
            <p className="hiw-subheading">
              Simple 3-step process to grow your wealth
            </p>
          </div>
          <div className="hiw-grid">
            <div className="hiw-card">
              <div className="hiw-icon-placeholder">
                <IoSpeedometerOutline className="icon" />
              </div>
              <h3 className="hiw-card-title">Choose your risk level</h3>
              <p className="hiw-card-text">
                Pick from low or medium options based on your comfort.
              </p>
            </div>
            <div className="hiw-card">
              <div className="hiw-icon-placeholder">
                <LuTrendingUp className="icon" />
              </div>
              <h3 className="hiw-card-title">Select an investment</h3>
              <p className="hiw-card-text">
                View clear details: expected returns, risks, and how it works.
              </p>
            </div>
            <div className="hiw-card">
              <div className="hiw-icon-placeholder">
                <TbTargetArrow className="icon" />
              </div>
              <h3 className="hiw-card-title">Invest and track</h3>
              <p className="hiw-card-text">
                Start with as low as ₦5,000 and monitor your growth in real
                time.
              </p>
            </div>
          </div>
          <div className="hiw-action">
            <button className="hiw-btn" type="button">
              Start Investing
            </button>
          </div>
        </div>
      </section>

      <section className="ic-section">
        <div className="ic-container">
          <div className="ic-header">
            <h2 className="ic-heading">Investment Categories</h2>
            <p className="ic-subheading">Choose what fits your style</p>
          </div>
          <div className="ic-grid">
            <div className="ic-card">
              <span className="ic-risk-badge">Low Risk</span>
              <div className="ic-image-placeholder">
                <img src={lowrisk} alt="Low risk investment" />
              </div>
              <h3 className="ic-card-title">Stable Growth</h3>
              <p className="ic-card-text">
                Lower-risk options designed to preserve your capital while
                earning steady returns.
              </p>
            </div>
            <div className="ic-card">
              <span className="ic-risk-badge">Medium Risk</span>
              <div className="ic-image-placeholder">
                <img src={mediumrisk} alt="Medium risk investment" />
              </div>
              <h3 className="ic-card-title">Balanced Growth</h3>
              <p className="ic-card-text">
                A mix of stability and growth. Ideal if you can counter returns
                without high risk.
              </p>
            </div>
          </div>
          <div className="ic-action">
            <button className="ic-btn" type="button">
              Start Investing
            </button>
          </div>
        </div>
      </section>

      <section className="wi-section">
        <div className="wi-container">
          <h2 className="wi-heading">Why Invest with HedgeNest?</h2>
          <div className="wi-grid">
            <div className="wi-card">
              <div className="wi-icon-badge">
                <FaPeopleCarry className="icon" />
              </div>
              <h3 className="wi-card-title">Simple and beginner-friendly</h3>
              <p className="wi-card-text">No complex financial jargon</p>
            </div>
            <div className="wi-card">
              <div className="wi-icon-badge">
                <LuTrendingUp className="icon" />
              </div>
              <h3 className="wi-card-title">Clear risk levels</h3>
              <p className="wi-card-text">
                Know exactly what you're getting into
              </p>
            </div>
            <div className="wi-card">
              <div className="wi-icon-badge">
                <IoEyeOutline className="icon" />
              </div>
              <h3 className="wi-card-title">Transparent returns</h3>
              <p className="wi-card-text">No hidden surprises</p>
            </div>
            <div className="wi-card">
              <div className="wi-icon-badge">
                <TbTargetArrow className="icon" />
              </div>
              <h3 className="wi-card-title">Track performance easily</h3>
              <p className="wi-card-text">Stay in control at all times</p>
            </div>
          </div>
        </div>
      </section>

      <section className="wfy-section">
        <div className="wfy-card">
          <div className="wfy-image-panel">
            <img src={investIMG4} alt="Your Money Working For You" />
          </div>
          <div className="wfy-content-panel">
            <h2 className="wfy-heading">Your Money Should Work For You</h2>
            <p className="wfy-subtext">
              Start small, stay consistent, and watch your money grow over time.
            </p>
            <button className="wfy-action-btn" type="button">
              Start Investing
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Invest;
