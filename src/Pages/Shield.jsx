import React from "react";
import "../Css/Shield.css";
// Replace these paths with the actual location of your assets
import LeftCharacter from "../assets/man-usdt.png"; 
import RightCharacter from "../assets/woman-coin.png";

import { BiShieldQuarter } from "react-icons/bi";
import { IoMdTrendingUp } from "react-icons/io";
import { BsLightningCharge } from "react-icons/bs";

const Shield = () => {
  return (
    <section className="shield-container">
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
      <div className="why-usdt-wrapper">
        <h2 className="why-usdt-heading">Why protect with USDT?</h2>

        <div className="features-grid">
          
          <div className="feature-card">
            <div className="icon-container">
              <BiShieldQuarter  className="feature-icon" size={32} />
            </div>
            <h3>Stable Value</h3>
            <p>
              USDT is pegged to the US dollar, helping your money stay stable.
            </p>
          </div>

          
          <div className="feature-card">
            <div className="icon-container">
              <IoMdTrendingUp  className="feature-icon" size={32} />
            </div>
            <h3>Beats Inflation</h3>
            <p>
              While Naira loses value over time, USDT helps preserve your
              purchasing power.
            </p>
          </div>

          
          <div className="feature-card">
            <div className="icon-container">
              <BsLightningCharge  className="feature-icon" size={32} />
            </div>
            <h3>Global & Liquid</h3>
            <p>USDT is globally accepted and easy to convert anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shield;