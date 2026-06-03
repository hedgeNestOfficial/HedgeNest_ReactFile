import React from "react";
import "../Style/SecurityCard.css";

const SecurityCard = ({ icon: Icon, title }) => {
  return (
    <article className="security-card">
      <div className="security-card-icon-box">
        <img src={Icon} alt={title} />
      </div>
      <h3 className="security-card-title">{title}</h3>
    </article>
  );
};

export default SecurityCard;
