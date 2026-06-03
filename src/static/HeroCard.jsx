import React from "react";
import "../Style/HeroCard.css";

const HeroCard = ({ icon: Icon, title, description }) => {
  return (
    <article className="HeroCard-wrapper">
      <div className="HeroCard-icon-container">
        <img src={Icon} alt={title} className="HeroCard-icon" />
      </div>
      <div className="HeroCard-content">
        <h2 className="HeroCard-title">{title}</h2>
        <p className="HeroCard-text">{description}</p>
      </div>
    </article>
  );
};

export default HeroCard;
