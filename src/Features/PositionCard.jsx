import React from "react";
import "../Style/PositionCard.css";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

export const PositionCard = ({ position, onTopUpClick, onWithdrawClick }) => {
  return (
    <div className="position-product-card">
      {/* Top Section containing Title and Trend Circle Indicator */}
      <div className="position-card-top-row">
        <div className="position-card-title-group">
          <span className="position-product-tag-name">
            {position.name?.toUpperCase()}
          </span>
          <h2 className="position-product-main-amount">
            ₦{Number(position.amount).toLocaleString()}
          </h2>
        </div>

        <div className="position-trend-indicator-circle">
          <HiMiniArrowTrendingUp className="position-trend-arrow-svg" />
        </div>
      </div>

      {/* Center Metadata Row (Expected & Maturity tracking details) */}
      <div className="position-card-metadata-row">
        <div className="position-metadata-item">
          <span className="meta-label-text">Expected:</span>
          <span className="meta-value-text">
            ₦{Number(position.expected).toLocaleString()}
          </span>
        </div>
        <div className="position-metadata-item">
          <span className="meta-label-text">Matures:</span>
          <span className="meta-value-text">{position.maturityDate}</span>
        </div>
      </div>

      {/* Bottom Action Footer Row */}
      <div className="position-card-action-row">
        <button
          className="position-btn-action position-btn-gold-fill"
          onClick={() => onTopUpClick?.(position)}
        >
          Top Up
        </button>
        <button
          className="position-btn-action position-btn-white-solid"
          onClick={() => onWithdrawClick?.(position)}
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default PositionCard;
