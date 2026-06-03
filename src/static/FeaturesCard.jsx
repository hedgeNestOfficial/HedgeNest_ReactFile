import React from "react";

const FeaturesCard = () => {
  return (
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
      </div>
    </div>
  );
};

export default FeaturesCard;
