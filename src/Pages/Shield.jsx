import React from "react";
import "../Css/Shield.css";
import Button from "../Components/Button";
import LeftCharacter from "../assets/man-usdt.png";
import RightCharacter from "../assets/woman-coin.png";
import ShieldImage from "../assets/shieldImage.jpg";

import { BiShieldQuarter } from "react-icons/bi";
import { IoMdTrendingUp } from "react-icons/io";
import { BsLightningCharge } from "react-icons/bs";
import { FaNairaSign, FaCoins } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import { IoEyeOutline, IoHeadset, IoLockClosedSharp } from "react-icons/io5";



const Shield = () => {
  // Why Protect with USDT
  const featuresData = [
    {
      icon: <BiShieldQuarter className="feature-icon" size={32} />,
      title: "Stable Value",
      description:
        "USDT is pegged to the US dollar, helping your money stay stable.",
    },
    {
      icon: <IoMdTrendingUp className="feature-icon" size={32} />,
      title: "Beats Inflation",
      description:
        "While Naira loses value over time, USDT helps preserve your purchasing power.",
    },
    {
      icon: <BsLightningCharge className="feature-icon" size={32} />,
      title: "Global & Liquid",
      description: "USDT is globally accepted and easy to convert anytime.",
    },
  ];

  //  How it Works Steps
  const stepsData = [
    {
      icon: <FaNairaSign className="feature-icon" size={28} />,
      title: "Enter Amount",
      description: "Enter the amount in Naira you want to convert.",
    },
    {
      icon: <FaRegCheckCircle className="feature-icon" size={28} />,
      title: "Review & Confirm",
      description: "Check the rate, fees, and amount you'll receive.",
    },
    {
      icon: <FiShield className="feature-icon" size={28} />,
      title: "Secure Conversion",
      description: "We process your conversion securely and instantly.",
    },
    {
      icon: <FaCoins className="feature-icon" size={28} />,
      title: "Receive USDT",
      description: "Your USDT is added to your balance, ready to use.",
    },
  ];

  // Why Trust HedgeNest
  const trustData = [
    {
      icon: <FiShield size={28} className="feature-icon" />,
      title: "Bank-level Security",
      description: "Your funds are protected with top-notch security measures.",
    },
    {
      icon: <IoEyeOutline size={28} className="feature-icon" />,
      title: "Transparent Rates",
      description: "Live rates, no hidden fees, and full transparency always.",
    },
    {
      icon: <IoHeadset size={28} className="feature-icon" />,
      title: "24/7 Support",
      description: "Our support team is available round the clock to help you.",
    },
    {
      icon: <IoLockClosedSharp size={28} className="feature-icon" />,
      title: "You're in Control",
      description: "Convert anytime, anywhere. You're always in control.",
    },
  ];

  return (
    <section className="shield-container">
      

      <section className="shield-holder">
         {/* HERO BANNER SECTION   */}
        <div className="hero-wrapper">
          <article className="hero-content">
            <h1>
              Protect Your Money <br className="desktop-only" />
              From Inflation
            </h1>
            <h2>Hold Value In USDT.</h2>
            <p>
              Convert your Naira to USDT (a digital dollar) and preserve your
              money's value over time.
            </p>

            <div className="hero-cta-group">
              <Button className="btn-primary" text="Convert Now" />
              <Button className="btn-secondary" text="How it works" />
            </div>
          </article>

          <article className="hero-graphics">
            <div className="graphic-wrapper left-img">
              <img
                src={LeftCharacter}
                alt="Man holding USDT token illustration"
              />
            </div>
            <div className="graphic-wrapper right-img">
              <img src={RightCharacter} alt="Woman holding coin illustration" />
            </div>
          </article>
        </div>

        {/* FEATURES SECTION  */}
        <section className="features-section">
          <div className="why-usdt-wrapper">
            <h2 className="why-usdt-heading">Why protect with USDT?</h2>

            <div className="features-grid">
              {featuresData.map((item, index) => (
                <div key={index} className="feature-card">
                  <div className="icon-container">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

         {/* HOW IT WORKS SECTION  */}
        <section className="how-it-works-section">
          <div className="how-it-works-container">
            <h2 className="section-heading">How it works</h2>

            <div className="steps-grid">
              {stepsData.map((step, index) => (
                <div key={index} className="step-card">
                  <div className="step-icon-badge">{step.icon}</div>
                  <h3 className="step-card-title">{step.title}</h3>
                  <p className="step-card-description">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="cta-wrapper">
              <Button className="convert-now-btn" text="Convert Now" />
            </div>
          </div>
        </section>

         {/* HEDGENEST TRUST SECTION  */}
        <section className="hn-trust-section">
          <div className="hn-container">
            <h2 className="hn-title">
              Why Trust HedgeNest For Your Value Protection?
            </h2>

            <div className="hn-grid">
              {trustData.map((card, index) => (
                <div key={index} className="hn-card">
                  <div className="hn-icon-wrapper">
                    <span className="hn-icon">{card.icon}</span>
                  </div>
                  <h3 className="hn-card-title">{card.title}</h3>
                  <p className="hn-card-description">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INFLATION PROMO SECTION  */}
        <section className="inflation-promo-section">
          <div className="inflation-promo-container">
            <div className="inflation-promo-card">
              <div className="inflation-promo-image-side">
                <img
                  src={ShieldImage}
                  alt="Inflation Growth Market Chart Data Visualization"
                />
              </div>

              <div className="inflation-promo-content-side">
                <h3 className="inflation-promo-heading">
                  Don't Let Inflation Reduce Your Hard-Earned Money
                </h3>
                <p className="inflation-promo-subtext">
                  Protect it today. Convert to USDT in minutes.
                </p>
                <Button text="Convert Now" className="inflation-promo-btn" />
              </div>
            </div>
          </div>
        </section>
      </section>

      
    </section>
  );
};

export default Shield;
