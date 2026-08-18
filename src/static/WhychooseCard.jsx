import React from "react";
import "../Style/WhychooseCard.css";

const WhychooseCard = ({ icon: Icon, title, description }) => {
  return (
    <article className="whychoose-card">
      <div className="whychoose-card-header">
        <div className="whychoose-card-icon-box">
          <img src={Icon} alt={title} />
        </div>
        <h3 className="whychoose-card-title">{title}</h3>
      </div>

      <p className="whychoose-card-text">{description}</p>
    </article>
  );
};

export default WhychooseCard;
