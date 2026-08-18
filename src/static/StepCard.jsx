import React from "react";
import "../Style/StepCard.css";

const StepCard = ({ icon: Icon, title, description }) => {
  return (
    <article className="step-card">
      <div className="step-card-icon-box">
        <img src={Icon} alt={title} />
      </div>
      <h3 className="step-card-title">{title}</h3>
      <p className="step-card-text">{description}</p>
    </article>
  );
};

export default StepCard;
