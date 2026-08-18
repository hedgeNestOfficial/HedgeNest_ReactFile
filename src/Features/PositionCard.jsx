import React, { useState } from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { HiExclamationTriangle } from "react-icons/hi2";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import "../Style/PositionCard.css";

const PositionCard = ({ position, onBreakClick, onClaimClick }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimingId, setClaimingId] = useState(null);

  const investmentId = position?._id || position?.id;
  const maturityDate = new Date(position?.maturityDate);
  const today = new Date();

  const isMatured = today >= maturityDate;
  const isBroken = !!position?.terminatedAt;
  const isClaimed = position?.status === "claimed" || !!position?.claimedAt;

  const investmentName =
    position?.investmentPlanId?.investmentName ||
    position?.investmentType ||
    "Investment";
  const amount = Number(position?.amount || 0);
  const expectedReturn = Number(position?.expectedReturn || 0);
  const typeStatus = (
    position?.investmentPlanId?.investmentType ||
    position?.investmentType ||
    "Low"
  ).toLowerCase();
  const formattedMaturityDate = position?.maturityDate
    ? position.maturityDate.split("T")[0]
    : "N/A";

  let breakMessage = "";
  let isSettlementReady = false;

  if (isBroken && !isClaimed) {
    const terminatedDate = new Date(position.terminatedAt);
    const releaseDate = new Date(
      terminatedDate.getTime() + 26 * 60 * 60 * 1000,
    );
    const diffMs = releaseDate.getTime() - today.getTime();

    if (diffMs > 0) {
      const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
      breakMessage = `Available in ${totalHours}h`;
      isSettlementReady = false;
    } else {
      breakMessage = "Ready For Settlement";
      isSettlementReady = true;
    }
  }

  const canWithdraw = (isMatured || isSettlementReady) && !isClaimed;
  const canBreak = !isMatured && !isBroken && !isClaimed;
  const isCurrentlyClaiming = isClaiming && claimingId === investmentId;

  const handleBreakClick = () => {
    if (!investmentId || !canBreak) return;
    onBreakClick?.(position);
  };

  const handleClaimClick = async () => {
    if (!investmentId || !canWithdraw || isCurrentlyClaiming) return;

    try {
      setIsClaiming(true);
      setClaimingId(investmentId);
      await onClaimClick?.(position);
    } catch (error) {
      toast.error("Failed to claim investment");
    } finally {
      setIsClaiming(false);
      setClaimingId(null);
    }
  };

  const getButtonText = () => {
    if (isClaimed) return "Claimed";
    if (isCurrentlyClaiming) return "Claiming...";
    if (isBroken) {
      return isSettlementReady ? "Claim Settlement" : breakMessage;
    }
    if (isMatured) return "Claim Investment";
    return "Not Matured";
  };

  const isButtonDisabled = () => {
    if (isClaimed) return true;
    if (isCurrentlyClaiming) return true;
    if (!canWithdraw) return true;
    return false;
  };

  return (
    <div className="position-product-card">
      <div className="position-card-top-row">
        <div className="position-card-title-group">
          <span className="position-product-tag-name">
            {investmentName.toUpperCase()}
          </span>
          <h2 className="position-product-main-amount">
            ₦{amount.toLocaleString()}
          </h2>
        </div>

        <div className="position-card-right-group">
          <span className={`position-risk-badge ${typeStatus}`}>
            {typeStatus.charAt(0).toUpperCase() + typeStatus.slice(1)}
          </span>
          <div className="position-trend-indicator-circle">
            <HiMiniArrowTrendingUp className="position-trend-arrow-svg" />
          </div>
        </div>
      </div>

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

      {isBroken && !isClaimed && (
        <div className="position-card-termination-banner">
          {/* <HiExclamationTriangle
            style={{ marginRight: "6px", fontSize: "1rem", flexShrink: 0 }}
          /> */}
          Investment Terminated • {breakMessage}
        </div>
      )}

      {isClaimed && (
        <div
          className="position-card-termination-banner"
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            color: "#22c55e",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          Investment Claimed Successfully
        </div>
      )}

      <div className="position-card-action-row">
        {canBreak && (
          <button
            type="button"
            className="position-btn-action position-btn-white-solid"
            onClick={handleBreakClick}
            disabled={isCurrentlyClaiming}
            title="Liquidate this investment early (26-hour settlement)"
          >
            Break
          </button>
        )}

        <button
          type="button"
          className={`position-btn-action ${
            isButtonDisabled()
              ? "position-btn-disabled"
              : "position-btn-gold-fill"
          }`}
          disabled={isButtonDisabled()}
          onClick={handleClaimClick}
          title={
            isClaimed
              ? "Investment has been claimed"
              : isCurrentlyClaiming
                ? "Claim in progress..."
                : isBroken
                  ? isSettlementReady
                    ? "Claim your funds from broken investment settlement"
                    : "Cannot claim yet - still in settlement period"
                  : isMatured
                    ? "Claim your matured investment funds"
                    : "Investment not yet matured"
          }
        >
          {isCurrentlyClaiming ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <ClipLoader color="#6b7280" size={16} />
              Claiming...
            </span>
          ) : (
            getButtonText()
          )}
        </button>
      </div>
    </div>
  );
};

export default PositionCard;
