import React from "react";
import SecurityCard from "../static/SecurityCard";
import "../Style/SecurityCompliance.css";
import { SecurityData } from "../JS/HeroCrad.js";

const SecurityCompliance = () => {
  return (
    <section className="security-section">
      <div className="security-container">
        <div className="security-header">
          <h2>Security & Compliance</h2>
        </div>

        <div className="security-flex-deck">
          {SecurityData.map((item, index) => (
            <div className="security-card-wrapper" key={index}>
              <SecurityCard icon={item.icon} title={item.title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;
