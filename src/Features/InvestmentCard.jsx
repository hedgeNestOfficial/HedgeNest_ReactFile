// import "../Style/InvestmentCard.css";
// import { HiMiniArrowTrendingUp } from "react-icons/hi2";

// export const InvestmentCard = ({ product }) => {
//   return (
//     <div className="card">
//       <div className="card-header">
//         <div className="card-title-row">
//           <HiMiniArrowTrendingUp className="icon" />
//           <h3>{product.name}</h3>
//         </div>
//         <span className={`badge ${product.risk.toLowerCase()}`}>
//           {product.risk}
//         </span>
//       </div>

//       <p className="description">{product.description}</p>

//       <div className="metrics-row">
//         <div className="metric-box">
//           <span className="label">ROI</span>
//           <span className="value">{product.roi}</span>
//         </div>
//         <div className="metric-box">
//           <span className="label">Term</span>
//           <span className="value">{product.term}</span>
//         </div>
//         <div className="metric-box">
//           <span className="label">MIN Amount</span>
//           <span className="value">{product.minAmount}</span>
//         </div>
//       </div>

//       <button className="invest-btn">Invest</button>
//     </div>
//   );
// };

import React from "react";
import "../Style/InvestmentCard.css";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

export const InvestmentCard = ({ product, onInvestClick }) => {
  return (
    <div className="investment-product-card">
      <div className="card-header-row">
        <div className="card-title-group">
          {/* Theme Perfected Golden Circle Icon Frame */}
          <div className="premium-icon-container">
            <HiMiniArrowTrendingUp className="trending-growth-icon" />
          </div>
          <h3>{product.name}</h3>
        </div>
        <span className={`risk-badge-node ${product.risk?.toLowerCase()}`}>
          {product.risk}
        </span>
      </div>

      <p className="investment-product-description">{product.description}</p>

      <div className="metrics-dashboard-grid">
        <div className="metric-data-cell">
          <span className="metric-cell-label">ROI</span>
          <span className="metric-cell-value text-gold">{product.roi}</span>
        </div>
        <div className="metric-data-cell">
          <span className="metric-cell-label">Term</span>
          <span className="metric-cell-value">{product.term}</span>
        </div>
        <div className="metric-data-cell">
          <span className="metric-cell-label">MIN Amount</span>
          <span className="metric-cell-value">{product.minAmount}</span>
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
