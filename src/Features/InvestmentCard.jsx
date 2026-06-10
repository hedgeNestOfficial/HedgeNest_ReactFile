import "../Style/InvestmentCard.css";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

export const InvestmentCard = ({ product }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-row">
          <HiMiniArrowTrendingUp className="icon" />
          <h3>{product.name}</h3>
        </div>
        <span className={`badge ${product.risk.toLowerCase()}`}>
          {product.risk}
        </span>
      </div>

      <p className="description">{product.description}</p>

      <div className="metrics-row">
        <div className="metric-box">
          <span className="label">ROI</span>
          <span className="value">{product.roi}</span>
        </div>
        <div className="metric-box">
          <span className="label">Term</span>
          <span className="value">{product.term}</span>
        </div>
        <div className="metric-box">
          <span className="label">MIN Amount</span>
          <span className="value">{product.minAmount}</span>
        </div>
      </div>

      <button className="invest-btn">Invest</button>
    </div>
  );
};
