import React from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import "../Style/PositionCard.css";

/**
 * ============================================================================
 * POSITION CARD - INVESTMENT POSITION DISPLAY
 * ============================================================================
 *
 * Shows individual investment with:
 * - Amount and expected return
 * - Maturity status
 * - Break/Claim buttons based on state
 * - 26-hour settlement countdown for broken investments
 *
 * Props (from parent InvestDashboard):
 * - position: Investment object with all data
 * - onBreakClick: Callback when "Break" button clicked
 * - onClaimClick: Callback when "Claim" button clicked
 */

const PositionCard = ({ position, onBreakClick, onClaimClick }) => {
  // ============================================================================
  // EXTRACT DATA
  // ============================================================================

  const investmentId = position?._id || position?.id;
  const maturityDate = new Date(position?.maturityDate);
  const today = new Date();

  // Investment status
  const isMatured = today >= maturityDate;
  const isBroken = !!position?.terminatedAt;

  // Display data
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

  // ============================================================================
  // BROKEN INVESTMENT SETTLEMENT LOGIC
  // ============================================================================

  let breakMessage = "";
  let isSettlementReady = false;

  if (isBroken) {
    const terminatedDate = new Date(position.terminatedAt);
    const releaseDate = new Date(
      terminatedDate.getTime() + 26 * 60 * 60 * 1000,
    );
    const diffMs = releaseDate.getTime() - today.getTime();

    if (diffMs > 0) {
      // Still in settlement period
      const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
      breakMessage = `Available in ${totalHours}h`;
      isSettlementReady = false;
    } else {
      // Settlement period complete - ready to claim
      breakMessage = "Ready For Settlement";
      isSettlementReady = true;
    }
  }

  // ============================================================================
  // BUTTON STATE LOGIC
  // ============================================================================

  // Can withdraw if:
  // 1. Investment is matured (and not broken)
  // 2. Investment is broken AND settlement period has passed
  const canWithdraw = isMatured || isSettlementReady;

  // Can break if:
  // 1. Investment is not yet matured
  // 2. Investment is not already broken
  const canBreak = !isMatured && !isBroken;

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleBreakClick = () => {
    if (!investmentId || !canBreak) return;
    console.log("🔘 Break button clicked for investment:", investmentId);
    onBreakClick?.(position);
  };

  const handleClaimClick = () => {
    if (!investmentId || !canWithdraw) return;
    console.log("🔘 Claim button clicked for investment:", investmentId);
    onClaimClick?.(position);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="position-product-card">
      {/* Top Row: Title and Risk Badge */}
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

      {/* Metadata Row: Expected Return and Maturity Date */}
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

      {/* Broken Investment Banner: Shows settlement status and countdown */}
      {isBroken && (
        <div className="position-card-termination-banner">
          ⚠️ Investment Terminated • {breakMessage}
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="position-card-action-row">
        {/* BREAK BUTTON: Only show for active, not-yet-matured investments */}
        {canBreak && (
          <button
            type="button"
            className="position-btn-action position-btn-white-solid"
            onClick={handleBreakClick}
            title="Liquidate this investment early (26-hour settlement)"
          >
            Break
          </button>
        )}

        {/* CLAIM/WITHDRAW BUTTON: Shows appropriate text based on state */}
        <button
          type="button"
          className={`position-btn-action ${
            canWithdraw ? "position-btn-gold-fill" : "position-btn-disabled"
          }`}
          disabled={!canWithdraw}
          onClick={handleClaimClick}
          title={
            isBroken
              ? isSettlementReady
                ? "Claim your funds from broken investment settlement"
                : "Cannot claim yet - still in settlement period"
              : isMatured
                ? "Claim your matured investment funds"
                : "Investment not yet matured"
          }
        >
          {/* Button text changes based on investment state */}
          {isBroken
            ? isSettlementReady
              ? "Claim Settlement"
              : breakMessage // Shows countdown
            : isMatured
              ? "Claim Investment"
              : "Not Matured"}
        </button>
      </div>
    </div>
  );
};

export default PositionCard;

/**
 * ============================================================================
 * COMPONENT DOCUMENTATION
 * ============================================================================
 *
 * Props:
 *
 * position (required)
 * - _id or id: Investment ID
 * - amount: Investment amount
 * - expectedReturn: Expected return amount
 * - maturityDate: ISO date string
 * - terminatedAt: ISO date string (null if not broken)
 * - investmentPlanId: Plan details object
 *   - investmentName: Name of investment
 *   - investmentType: Risk level (Low, Medium, High)
 *
 * onBreakClick(position)
 * - Called when user clicks "Break" button
 * - Receives full position object
 * - Opens break confirmation modal
 *
 * onClaimClick(position)
 * - Called when user clicks "Claim" button
 * - Receives full position object
 * - Handles withdrawal based on investment state
 *
 * ============================================================================
 * INVESTMENT STATES
 * ============================================================================
 *
 * State 1: ACTIVE (Not matured, not broken)
 * - Shows: Break and Claim (disabled) buttons
 * - User can break early
 *
 * State 2: ACTIVE + BROKEN (Liquidated early)
 * - Shows: Claim Settlement button (disabled during settlement)
 * - Shows countdown timer
 * - Becomes claimable after 26 hours
 *
 * State 3: MATURED (Reached maturity date, not broken)
 * - Shows: Claim Investment button (enabled)
 * - User can claim anytime after maturity
 *
 * State 4: MATURED + CLAIMED
 * - Investment no longer appears in positions
 *
 * ============================================================================
 * BUTTON STATE MATRIX
 * ============================================================================
 *
 * | State | Matured | Broken | Settlement Ready | Break Button | Claim Button |
 * |-------|---------|--------|------------------|--------------|--------------|
 * | 1     | No      | No     | -                | Enabled      | Disabled     |
 * | 2     | No      | Yes    | No               | Hidden       | Disabled     |
 * | 2b    | No      | Yes    | Yes              | Hidden       | Enabled      |
 * | 3     | Yes     | No     | -                | Hidden       | Enabled      |
 * | 4     | Yes     | No     | -                | Hidden       | Not shown    |
 *
 * ============================================================================
 */
