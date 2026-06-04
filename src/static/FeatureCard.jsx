import React from "react";
import "../Style/FeatureCard.css";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <article className="feature-card">
      {/* FIXED: Header row to place icon and title side-by-side */}
      <div className="feature-card-header">
        <div className="feature-card-icon-box">
          <img src={Icon} alt={title} />
        </div>
        <h3 className="feature-card-title">{title}</h3>
      </div>

      <p className="feature-card-text">{description}</p>
    </article>
  );
};

export default FeatureCard;
