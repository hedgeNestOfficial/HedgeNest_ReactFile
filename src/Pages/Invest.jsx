import React from "react";
import "../Css/Invest.css";
import Header from "../Components/Header.jsx";
import Footer from "../Components/Footer.jsx";
// import investIMG1 from "../assets/investIMG1.png";
import investIMG2 from "../assets/investIMG2.jpg";
import investIMG3 from "../assets/investIMG3.jpg";
import investIMG4 from "../assets/investIMG4.jpg";
import lowrisk from "../assets/lowrisk.jpg";
import mediumrisk from "../assets/mediumrisk.jpg";
import { IoSpeedometerOutline, IoEyeOutline } from "react-icons/io5";
import { LuTrendingUp } from "react-icons/lu";
import { TbTargetArrow } from "react-icons/tb";
import { FaPeopleCarry } from "react-icons/fa";
import Button from "../Components/Button";
import investIMG1 from "../assets/currencypic.jpg";

import { useNavigate } from "react-router-dom";
const Invest = () => {
  const howItWorksData = [
    {
      id: 1,
      icon: <IoSpeedometerOutline className="icon" />,
      title: "Choose your risk level",
      text: "Pick from low or medium options based on your comfort.",
    },
    {
      id: 2,
      icon: <LuTrendingUp className="icon" />,
      title: "Select an investment",
      text: "View clear details: expected returns, risks, and how it works.",
    },
    {
      id: 3,
      icon: <TbTargetArrow className="icon" />,
      title: "Invest and track",
      text: "Start with as low as ₦5,000 and monitor your growth in real time.",
    },
  ];

  const investmentCategoriesData = [
    {
      id: 1,
      badge: "Low Risk",
      img: lowrisk,
      title: "Stable Growth",
      text: "Lower-risk options designed to preserve your capital while earning steady returns.",
    },
    {
      id: 2,
      badge: "Medium Risk",
      img: mediumrisk,
      title: "Balanced Growth",
      text: "A mix of stability and growth. Ideal if you can counter returns without high risk.",
    },
  ];

  const whyInvestData = [
    {
      id: 1,
      icon: <FaPeopleCarry className="icon" />,
      title: "Simple and beginner-friendly",
      text: "No complex financial jargon",
    },
    {
      id: 2,
      icon: <LuTrendingUp className="icon" />,
      title: "Clear risk levels",
      text: "Know exactly what you're getting into",
    },
    {
      id: 3,
      icon: <IoEyeOutline className="icon" />,
      title: "Transparent returns",
      text: "No hidden surprises",
    },
    {
      id: 4,
      icon: <TbTargetArrow className="icon" />,
      title: "Track performance easily",
      text: "Stay in control at all times",
    },
  ];

  const navigate = useNavigate();
  return (
    <div className="invest-page-wrapper">
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
              <Button
                className="inv-btn-solid"
                text="Start Investing"
                onClick={() => navigate("/signup")}
              />

              <Button
                className="inv-btn-outline"
                text="Explore Options"
                onClick={() => navigate("/signup")}
              />
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
            {howItWorksData.map((item) => (
              <div className="hiw-card" key={item.id}>
                <div className="hiw-icon-placeholder">{item.icon}</div>
                <h3 className="hiw-card-title">{item.title}</h3>
                <p className="hiw-card-text">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="hiw-action">
            <button
              className="hiw-btn"
              type="button"
              onClick={() => navigate("/signup")}
            >
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
            {investmentCategoriesData.map((item) => (
              <div className="ic-card" key={item.id}>
                <span className="ic-risk-badge">{item.badge}</span>
                <div className="ic-image-placeholder">
                  <img src={item.img} alt={item.title} />
                </div>
                <h3 className="ic-card-title">{item.title}</h3>
                <p className="ic-card-text">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="ic-action">
            <button
              className="ic-btn"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Start Investing
            </button>
          </div>
        </div>
      </section>

      <section className="wi-section">
        <div className="wi-container">
          <h2 className="wi-heading">Why Invest with HedgeNest?</h2>
          <div className="wi-grid">
            {whyInvestData.map((item) => (
              <div className="wi-card" key={item.id}>
                <div className="wi-icon-badge">{item.icon}</div>
                <h3 className="wi-card-title">{item.title}</h3>
                <p className="wi-card-text">{item.text}</p>
              </div>
            ))}
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
            <button
              className="wfy-action-btn"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Start Investing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Invest;
