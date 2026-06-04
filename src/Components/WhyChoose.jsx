import React from "react";
import FeatureCard from "../static/FeatureCard";
import "../Style/WhyChoose.css";
import { WhyChooseData } from "../JS/HeroCrad";

const WhyChoose = () => {
  return (
    <section className="why-section">
      <div className="why-container">
        <div className="why-header">
          <h2>Why Choose HedgeNest?</h2>
        </div>

        <div className="why-flex-deck">
          {WhyChooseData.map((item, index) => (
            <div className="why-card-wrapper" key={index}>
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
