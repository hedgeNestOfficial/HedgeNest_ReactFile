import React, { useEffect, useState } from "react";
import goldLogo from "../assets/logoG.png";
import "../Style/SplashScreen.css";

const SplashScreen = ({ onLoadingComplete }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // 1. First milestone: Reveal the text after the logo animation runs (1.2 seconds)
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1200);

    // 2. Second milestone: Notify parent component (Dashboard) to display actual content (3 seconds)
    const completeTimer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, 3000);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onLoadingComplete]);

  return (
    <div className="splash-screen-overlay">
      <div className="splash-content-wrapper">
        {/* LOGO CONTAINER WITH ANIMATION */}
        <div className="splash-logo-container">
          <img
            src={goldLogo}
            alt="HedgeNest Gold Shield Logo"
            className="splash-logo-image"
          />
        </div>

        {/* BRAND TEXT WITH DELAYED DROP-DOWN REVEAL */}
        <div className={`splash-text-container ${showText ? "reveal" : ""}`}>
          <h3 className="splash-brand-name">HedgeNest</h3>
        </div>

        {/* NATIVE INTEGRATED LOADING SKELETON STRIP */}
        <div className="splash-skeleton-loader">
          <div className="skeleton-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
