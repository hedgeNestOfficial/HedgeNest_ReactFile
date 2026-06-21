// import React from "react";
// import "../Style/InvestmentCard.css";
// import { HiMiniArrowTrendingUp } from "react-icons/hi2";

// export const InvestmentCard = ({ product, onInvestClick }) => {
//   // Safely fallback or read risk value (e.g., 'low', 'medium', 'high')
//   const riskStatus = product.risk?.toLowerCase() || "low";
//   const productName = product.investmentName?.toUpperCase();
//   return (
//     <div className="investment-product-card">
//       <div className="card-header-row">
//         <div className="card-title-group">
//           <div className="premium-icon-container">
//             <HiMiniArrowTrendingUp className="trending-growth-icon" />
//           </div>
//           <h3>{productName}</h3>
//         </div>

//         {/* Added the missing risk badge node seen in image_9f86c1.png */}
//         <span className={`risk-badge-node ${riskStatus}`}>{riskStatus}</span>
//       </div>

//       <p className="investment-product-description">
//         {product.description ||
//           `Earn ${product.roi}% ROI over a ${product.term}-day investment period.`}
//       </p>

//       {/* Styled using a structured flex container layout to make individual boxes */}
//       <div className="metrics-dashboard-flex-row">
//         <div className="metric-data-box">
//           <span className="metric-cell-label">ROI</span>
//           <span className="metric-cell-value">{product.roi}%</span>
//         </div>

//         <div className="metric-data-box">
//           <span className="metric-cell-label">Term</span>
//           <span className="metric-cell-value">{product.term}days</span>
//         </div>

//         <div className="metric-data-box">
//           <span className="metric-cell-label">MIN Amount</span>
//           <span className="metric-cell-value">
//             ₦{Number(product.minAmount).toLocaleString()}
//           </span>
//         </div>
//       </div>

//       <button
//         className="invest-action-trigger-btn"
//         onClick={() => onInvestClick(product)}
//       >
//         Invest
//       </button>
//     </div>
//   );
// };

// export default InvestmentCard;

import React from "react";
import "../Style/InvestmentCard.css";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

export const InvestmentCard = ({ product, onInvestClick }) => {
  // 🟢 Dynamically parse the investmentType from the API payload (low / medium)
  const typeStatus = product?.investmentType?.toLowerCase() || "low";
  const productName = product?.investmentName?.toUpperCase();

  return (
    /* 🟢 Inject dynamic tier class onto the container for conditional coloring */
    <div className={`investment-product-card ${typeStatus}-tierC`}>
      <div className="card-header-row">
        <div className="card-title-group">
          <div className="premium-icon-container">
            <HiMiniArrowTrendingUp className="trending-growth-icon" />
          </div>
          <h3>{productName}</h3>
        </div>

        {/* 🟢 Cleaned badge component node rendering target type text */}
        <span className={`risk-badge-node ${typeStatus}`}>{typeStatus}</span>
      </div>

      <p className="investment-product-description">
        {product?.description ||
          `Earn ${product?.roi}% ROI over a ${product?.term}-day investment period.`}
      </p>

      {/* Balanced 3-Column Metric Blocks Row */}
      <div className="metrics-dashboard-flex-row">
        <div className="metric-data-box">
          <span className="metric-cell-label">ROI</span>
          <span className="metric-cell-value">{product?.roi}%</span>
        </div>

        <div className="metric-data-box">
          <span className="metric-cell-label">Term</span>
          <span className="metric-cell-value">{product?.term} days</span>
        </div>

        <div className="metric-data-box">
          <span className="metric-cell-label">MIN Amount</span>
          <span className="metric-cell-value">
            ₦{Number(product?.minAmount || 0).toLocaleString()}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="invest-action-trigger-btn"
        onClick={() => onInvestClick?.(product)}
      >
        Invest
      </button>
    </div>
  );
};

export default InvestmentCard;
