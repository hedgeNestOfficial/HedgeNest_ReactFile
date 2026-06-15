import React from "react";
import "../Style/InvestmentCard.css";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

export const InvestmentCard = ({ product, onInvestClick }) => {
  return (
    <div className="investment-product-card">
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="premium-icon-container">
            <HiMiniArrowTrendingUp className="trending-growth-icon" />
          </div>

          <h3>{product.investmentName}</h3>
        </div>
      </div>

      <p className="investment-product-description">
        Earn {product.roi}% ROI over a {product.term}-day investment period.
      </p>

      <div className="metrics-dashboard-grid">
        <div className="metric-data-cell">
          <span className="metric-cell-label">ROI</span>
          <span className="metric-cell-value text-gold">{product.roi}%</span>
        </div>

        <div className="metric-data-cell">
          <span className="metric-cell-label">Term</span>
          <span className="metric-cell-value">{product.term} Days</span>
        </div>

        <div className="metric-data-cell">
          <span className="metric-cell-label">MIN Amount</span>
          <span className="metric-cell-value">
            ₦{Number(product.minAmount).toLocaleString()}
          </span>
        </div>
      </div>

      <button
        className="invest-action-trigger-btn"
        onClick={() => onInvestClick(product)}
      >
        Invest
      </button>
    </div>
  );
};

export default InvestmentCard;
