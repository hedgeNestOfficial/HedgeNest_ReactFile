import React from "react";
import HeroCard from "../static/HeroCard.jsx";
import { HeroCardData } from "../JS/HeroCrad.js";
import "../Style/HerocardComp.css";
import Button from "./Button.jsx";

const OurCore = () => {
  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2>Our Core Features</h2>
          <p>Everything you need to build wealth with confidence</p>
        </div>

        <div className="features-flex-deck">
          {HeroCardData.map((card, index) => (
            <div className="features-card-item-wrapper" key={index}>
              <HeroCard
                icon={card.icon}
                title={card.title}
                description={card.description}
              />
            </div>
          ))}
          <Button text="See all features" className="features-button" />
        </div>
      </div>
    </section>
  );
};

export default OurCore;
