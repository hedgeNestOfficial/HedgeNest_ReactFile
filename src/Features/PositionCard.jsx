import React from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import "../Style/PositionCard.css";

const PositionCard = ({ position, onBreakClick, onWithdrawClick }) => {
  // Safe ID resolution (handles Mongo document schemas defensively)
  const investmentId = position?._id || position?.id;

  const maturityDate = new Date(position?.maturityDate);
  const today = new Date();

  // Condition checks
  const isMatured = today >= maturityDate;
  const isBroken = !!position?.terminatedAt;

  const investmentName =
    position?.investmentPlanId?.investmentName || "Investment";
  const amount = Number(position?.amount || 0);
  const expectedReturn = Number(position?.expectedReturn || 0);

  // Backend date formatter (e.g., 2026-09-15)
  const formattedMaturityDate = position?.maturityDate
    ? position.maturityDate.split("T")[0]
    : "N/A";

  let breakMessage = "";
  let isSettlementReady = false;

  if (isBroken) {
    const terminatedDate = new Date(position.terminatedAt);

    // ⏱️ UPDATED: 26-hour team approved cooling lock window
    const releaseDate = new Date(
      terminatedDate.getTime() + 26 * 60 * 60 * 1000,
    );
    const diffMs = releaseDate.getTime() - today.getTime();

    if (diffMs > 0) {
      const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;

      breakMessage =
        days > 0 ? `Available in ${days}d ${hours}h` : `Available in ${hours}h`;
      isSettlementReady = false;
    } else {
      breakMessage = "Ready For Settlement";
      isSettlementReady = true;
    }
  }

  // A user can ONLY withdraw if it's naturally matured OR broken and passed the 26h window
  const canWithdraw = isMatured || isSettlementReady;

  const handleBreakClick = () => {
    if (!investmentId) {
      console.error(
        "❌ Position Card Error: Missing investment ID object identifier",
        position,
      );
      return;
    }
    onBreakClick?.(position);
  };

  const handleWithdrawClick = () => {
    if (!investmentId) {
      console.error(
        "❌ Position Card Error: Missing investment ID object identifier",
        position,
      );
      return;
    }
    onWithdrawClick?.(position);
  };

  return (
    <div className="position-product-card">
      {/* Header Segment */}
      <div className="position-card-top-row">
        <div className="position-card-title-group">
          <span className="position-product-tag-name">
            {investmentName.toUpperCase()}
          </span>
          <h2 className="position-product-main-amount">
            {/* Render clear currency pricing layouts */}₦
            {amount.toLocaleString()}
          </h2>
        </div>

        <div className="position-trend-indicator-circle">
          <HiMiniArrowTrendingUp className="position-trend-arrow-svg" />
        </div>
      </div>

      {/* Metadata Metrics Segment */}
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

      {/* Early Termination Alert Notice (Maintained same countdown layout) */}
      {isBroken && (
        <div className="position-card-termination-banner">
          Investment Terminated • {breakMessage}
        </div>
      )}

      {/* Interactive Action Controls */}
      <div className="position-card-action-row">
        {/* 1. Break Button: Only shows if NOT matured and NOT already broken. Styled white/neutral to deprioritize. */}
        {!isMatured && !isBroken && (
          <button
            type="button"
            className="position-btn-action position-btn-white-solid"
            onClick={handleBreakClick}
          >
            Break
          </button>
        )}

        {/* 2. Primary/Secondary State Action Button:
            - If Not Matured: Stays visible, disabled, and colored in Premium Gold.
            - If Matured / Settled: Becomes an active, clickable Gold button to withdraw funds.
            - If Broken but Cooling: Shows the countdown notice inline, greyed out.
        */}
        <button
          type="button"
          className={`position-btn-action ${
            canWithdraw
              ? "position-btn-gold-fill"
              : !isBroken && !isMatured
                ? "position-btn-gold-fill position-btn-disabled-gold"
                : "position-btn-disabled"
          }`}
          disabled={!canWithdraw}
          onClick={handleWithdrawClick}
        >
          {isBroken
            ? isSettlementReady
              ? "Withdraw"
              : breakMessage
            : isMatured
              ? "Withdraw"
              : "Not Matured"}
        </button>
      </div>
    </div>
  );
};

export default PositionCard;
