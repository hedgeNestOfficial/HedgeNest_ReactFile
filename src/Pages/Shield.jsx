import React from "react";
import "../Css/Shield.css";

import LeftCharacter from "../assets/man-usdt.png"; 
import RightCharacter from "../assets/woman-coin.png";

import { BiShieldQuarter } from "react-icons/bi";
import { IoMdTrendingUp } from "react-icons/io";
import { BsLightningCharge } from "react-icons/bs";
import { FaNairaSign } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { FiShield } from "react-icons/fi";

import Header from "../Components/Header";
import Footer from "../Components/Footer";

const Shield = () => {
  return (
    <section className="shield-container">
      <Header />
      <section className="shield-holder">
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
              <button className="btn-primary">Convert Now</button>
              <button className="btn-secondary">How it works</button>
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
        <section className="features-section">
          <div className="why-usdt-wrapper">
            <h2 className="why-usdt-heading">Why protect with USDT?</h2>

            <div className="features-grid">
              <div className="feature-card">
                <div className="icon-container">
                  <BiShieldQuarter className="feature-icon" size={32} />
                </div>
                <h3>Stable Value</h3>
                <p>
                  USDT is pegged to the US dollar, helping your money stay
                  stable.
                </p>
              </div>

              <div className="feature-card">
                <div className="icon-container">
                  <IoMdTrendingUp className="feature-icon" size={32} />
                </div>
                <h3>Beats Inflation</h3>
                <p>
                  While Naira loses value over time, USDT helps preserve your
                  purchasing power.
                </p>
              </div>

              <div className="feature-card">
                <div className="icon-container">
                  <BsLightningCharge className="feature-icon" size={32} />
                </div>
                <h3>Global & Liquid</h3>
                <p>USDT is globally accepted and easy to convert anytime.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="how-it-works-section">
          <div className="how-it-works-container">
            <h2 className="section-heading">How it works</h2>

            <div className="steps-grid">
              {/* Step 1 */}
              <div className="step-card">
                <div className="step-icon-badge">
                  <FaNairaSign  className="feature-icon" size={28} />
                </div>
                <h3 className="step-card-title">Enter Amount</h3>
                <p className="step-card-description">
                  Enter the amount in Naira you want to convert.
                </p>
              </div>

              {/* Step 2 */}
              <div className="step-card">
                <div className="step-icon-badge">
                  < FaRegCheckCircle  className="feature-icon" size={28} />
                </div>
                <h3 className="step-card-title">Review & Confirm</h3>
                <p className="step-card-description">
                  Check the rate, fees, and amount you'll receive.
                </p>
              </div>

              {/* Step 3 */}
              <div className="step-card">
                <div className="step-icon-badge">
                  <FiShield  className="feature-icon" size={28} />
                </div>
                <h3 className="step-card-title">Secure Conversion</h3>
                <p className="step-card-description">
                  We process your conversion securely and instantly.
                </p>
              </div>
              <div className="step-card">
                <div className="step-icon-badge">
                  {/* <Coins className="feature-icon" size={28} /> */}
                </div>
                <h3 className="step-card-title">Receive USDT</h3>
                <p className="step-card-description">
                  Your USDT is added to your balance, ready to use.
                </p>
              </div>
            </div>

            <div className="cta-wrapper">
              <button className="convert-now-btn">Convert Now</button>
            </div>
          </div>
        </section>
        

    <section className="hn-trust-section">
      <div className="hn-container">
        <h2 className="hn-title">Why Trust HedgeNest For Your Value Protection?</h2>
        
        <div className="hn-grid">
          
          <div className="hn-card">
            <div className="hn-icon-wrapper">
              <span className="hn-icon" role="img" aria-label="Shield">🛡️</span>
            </div>
            <h3 className="hn-card-title">Bank-level Security</h3>
            <p className="hn-card-description">
              Your funds are protected with top-notch security measures.
            </p>
          </div>

          
          <div className="hn-card">
            <div className="hn-icon-wrapper">
              <span className="hn-icon" role="img" aria-label="Eye">👁️</span>
            </div>
            <h3 className="hn-card-title">Transparent Rates</h3>
            <p className="hn-card-description">
              Live rates, no hidden fees, and full transparency always.
            </p>
          </div>

        
          <div className="hn-card">
            <div className="hn-icon-wrapper">
              <span className="hn-icon" role="img" aria-label="Headset">🎧</span>
            </div>
            <h3 className="hn-card-title">24/7 Support</h3>
            <p className="hn-card-description">
              Our support team is available round the clock to help you.
            </p>
          </div>

          
          <div className="hn-card">
            <div className="hn-icon-wrapper">
              <span className="hn-icon" role="img" aria-label="Lock">🔒</span>
            </div>
            <h3 className="hn-card-title">You’re in Control</h3>
            <p className="hn-card-description">
              Convert anytime, anywhere. You’re always in control.
            </p>
          </div>
        </div>
      </div>
    </section>
 
    <section className="inflation-section">
      <div className="inflation-card">
        
        <div className="inflation-image-side">
          {/* Replace background-image path or insert <img> tag here */}
        </div>

  
        <div className="inflation-content-side">
          <h2 className="inflation-heading">
            Don't Let Inflation Reduce Your Hard-Earned Money
          </h2>
          <p className="inflation-subtext">
            Protect it today. Convert to USDT in minutes.
          </p>
          <button className="inflation-btn" type="button">
            Convert Now
          </button>
        </div>
      </div>
    </section>
  


      </section>
      <Footer />
    </section>
  );
};

export default Shield;