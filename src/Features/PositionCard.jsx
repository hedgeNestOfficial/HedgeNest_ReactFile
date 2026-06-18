import React from "react";
import "../Style/PositionCard.css";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

const PositionCard = ({ position, onBreakClick, onWithdrawClick }) => {
  const maturityDate = new Date(position?.maturityDate);
  const today = new Date();

  const isMatured = today >= maturityDate;

  const investmentName =
    position?.investmentPlanId?.investmentName || "Investment";

  const amount = Number(position?.amount || 0);
  const expectedReturn = Number(position?.expectedReturn || 0);

  // Backend format: 2026-09-15
  const formattedMaturityDate = position?.maturityDate
    ? position.maturityDate.split("T")[0]
    : "N/A";

  /**
   * BROKEN INVESTMENT LOGIC
   */
  const isBroken = !!position?.terminatedAt;

  let breakMessage = "";

  if (isBroken) {
    const terminatedDate = new Date(position.terminatedAt);

    const releaseDate = new Date(
      terminatedDate.getTime() + 48 * 60 * 60 * 1000,
    );

    const diffMs = releaseDate.getTime() - today.getTime();

    if (diffMs > 0) {
      const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));

      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;

      breakMessage =
        days > 0 ? `Available in ${days}d ${hours}h` : `Available in ${hours}h`;
    } else {
      breakMessage = "Ready For Settlement";
    }
  }

  const handleBreakClick = () => {
    onBreakClick?.(position);
  };

  const handleWithdrawClick = () => {
    onWithdrawClick?.(position);
  };

  return (
    <div className="position-product-card">
      {/* Header */}
      <div className="position-card-top-row">
        <div className="position-card-title-group">
          <span className="position-product-tag-name">
            {investmentName.toUpperCase()}
          </span>

          <h2 className="position-product-main-amount">
            ₦{amount.toLocaleString()}
          </h2>
        </div>

        <div className="position-trend-indicator-circle">
          <HiMiniArrowTrendingUp className="position-trend-arrow-svg" />
        </div>
      </div>

      {/* Investment Details */}
      <div className="position-card-metadata-row">
        <div className="position-metadata-item">
          <span className="meta-label-text">Expected:</span>

          <span className="meta-value-text">
            ₦{expectedReturn.toLocaleString()}
          </span>
        </div>

        <div className="position-metadata-item">
          <span className="meta-label-text">Maturity Date:</span>

          <span className="meta-value-text">{formattedMaturityDate}</span>
        </div>
      </div>

      {/* Broken Investment Notice */}
      {isBroken && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px",
            borderRadius: "8px",
            background: "#fff7e6",
            color: "#b7791f",
            fontSize: "13px",
            fontWeight: "600",
            textAlign: "center",
            gap: "10px",
            marginBottom: "12px",
          }}
        >
          Investment Terminated • {breakMessage}
        </div>
      )}

      {/* Actions */}
      <div className="position-card-action-row">
        {!isBroken && (
          <button
            type="button"
            className="position-btn-action position-btn-gold-fill"
            onClick={handleBreakClick}
          >
            Break
          </button>
        )}

        <button
          type="button"
          className={`position-btn-action ${
            isMatured || isBroken
              ? "position-btn-white-solid"
              : "position-btn-disabled"
          }`}
          disabled={!isMatured && !isBroken}
          onClick={handleWithdrawClick}
        >
          {isBroken ? breakMessage : isMatured ? "Withdraw" : "Not Matured"}
        </button>
      </div>
    </div>
  );
};

export default PositionCard;
