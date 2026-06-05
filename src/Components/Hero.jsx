import React from "react";
import "../Style/Hero.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-wrap">
        <div className="hero-content">
          <h1 className="hero-title">
            Protect Your Money, <br />
            <span className="highlight-text">Grow Confidently,</span> <br />
            Save Smarter.
          </h1>
          <p className="hero-description">
            HedgeNest helps everyday Nigerians protect their money from
            inflation, build better saving habits, and grow their wealth
            securely.
          </p>
          <Button
            text="Get Started"
            className="hero-button"
            onClick={() => navigate("/signup")}
          />
        </div>

        {/* Image Container (Right Side) */}
        <div className="hero-image-container">
          <img
            src="https://i.postimg.cc/vH7WpFyt/Landing-Hero.png"
            alt="HedgeNest Mockups"
            className="hero-display-img"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
