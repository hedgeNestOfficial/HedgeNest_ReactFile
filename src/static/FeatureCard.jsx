import React from "react";
import "../Style/FeatureCard.css";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <article className="feature-card">
      <div className="feature-card-icon-box">
        {Icon &&
          (typeof Icon === "string" ? (
            <img src={Icon} alt={title} />
          ) : (
            <Icon />
          ))}
      </div>
      <div className="feature-card-info">
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-text">{description}</p>
      </div>
    </article>
  );
};

export default FeatureCard;
