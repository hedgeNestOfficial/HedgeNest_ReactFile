import React from "react";
import StepCard from "../static/StepCard.jsx";
import Button from "./Button.jsx";
import "../Style/HowItWorks.css";
import { HowItWorksData } from "../JS/HeroCrad.js";
import { useNavigate } from "react-router-dom";
const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="how-section">
      <div className="how-container">
        <div className="how-header">
          <h2>How HedgeNest Works</h2>
          <p>Simple 4-step process to get started</p>
        </div>

        <div className="how-flex-deck">
          {HowItWorksData.map((step, index) => (
            <div className="how-card-wrapper" key={index}>
              <StepCard
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </div>
          ))}
        </div>

        <div className="how-action-container">
          <Button
            text="Get Started"
            className="how-button"
            onClick={() => navigate("/signup")}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
