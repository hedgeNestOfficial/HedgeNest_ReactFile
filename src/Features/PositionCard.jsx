import React from "react";
import "../Style/PositionCard.css";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

export const PositionCard = ({ position, onTopUpClick, onWithdrawClick }) => {
  const maturityDate = new Date(position?.maturityDate);
  const today = new Date();

  const isMatured = today >= maturityDate;

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (maturityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <div className="position-product-card">
      {/* Top Section */}
      <div className="position-card-top-row">
        <div className="position-card-title-group">
          <span className="position-product-tag-name">
            {position?.investmentPlanId?.investmentName?.toUpperCase()}
          </span>

          <h2 className="position-product-main-amount">
            ₦{Number(position?.amount || 0).toLocaleString()}
          </h2>
        </div>

        <div className="position-trend-indicator-circle">
          <HiMiniArrowTrendingUp className="position-trend-arrow-svg" />
        </div>
      </div>

      {/* Center Metadata Row */}
      <div className="position-card-metadata-row">
        <div className="position-metadata-item">
          <span className="meta-label-text">Expected:</span>

          <span className="meta-value-text">
            ₦{Number(position?.expectedReturn || 0).toLocaleString()}
          </span>
        </div>

        <div className="position-metadata-item">
          <span className="meta-label-text">
            {isMatured ? "Status:" : "Matures:"}
          </span>

          <span className="meta-value-text">
            {isMatured
              ? "Ready For Withdrawal"
              : `${daysRemaining} Day${daysRemaining !== 1 ? "s" : ""} Left`}
          </span>
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
          className={`position-btn-action ${
            isMatured ? "position-btn-white-solid" : "position-btn-disabled"
          }`}
          disabled={!isMatured}
          onClick={() => onWithdrawClick?.(position)}
        >
          {isMatured ? "Withdraw" : "Not Matured"}
        </button>
      </div>
    </div>
  );
};

export default PositionCard;
