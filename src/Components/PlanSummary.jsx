import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Style/PlanSummary.css";

const PlanSummary = ({ summaryData, onBack, onCancel, onConfirm }) => {
  // If the parent hasn't populated the summary yet, show a clean, native boundary fallback
  if (!summaryData) {
    return (
      <div className="modal-container text-center">
        <p>No preview data available. Please go back and try again.</p>
        <button type="button" onClick={onBack} className="btn-secondary mt-4">
          Go Back
        </button>
      </div>
    );
  }

  // --- STRICT MAP TO BACKEND VALUES ONLY ---
  const title = summaryData.title || "Savings Plan";
  const planType = summaryData.planType || "LOCKED";
  const targetAmount = Number(summaryData.targetAmount || 0);
  const duration = summaryData.duration || 0;
  const savingFrequency = summaryData.savingFrequency
    ? summaryData.savingFrequency.toLowerCase()
    : "";
  const interestRate = summaryData.interestRate || 0;
  const breakingFeePercentage = summaryData.breakingFeePercentage ?? 0;

  // Financial metrics calculated strictly on the server side
  const interestBeforeTax = Number(
    summaryData.estimatedInterestRateBeforeTax || 0,
  );
  const withholdingTax = Number(summaryData.estimatedWithholdingTax || 0);
  const interestAfterTax = Number(
    summaryData.estimatedInterestRateAfterTax || 0,
  );
  const totalPayback = Number(summaryData.estimatedTotalPayback || 0);

  const getFormattedMaturityDate = () => {
    if (planType.toUpperCase() === "FLEXIBLE") {
      return "No lock-in (Withdraw anytime)";
    }
    if (summaryData.maturityDate) {
      return new Date(summaryData.maturityDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    return "N/A";
  };

  return (
    <div className="modal-container" role="dialog" aria-modal="true">
      <button className="back-arrow-btn" onClick={onBack} aria-label="Go back">
        <FaArrowLeft className="back-icon-style" />
      </button>

      <h2 className="summary-title">Savings Plan Overview/Summary</h2>

      <div className="summary-details-list">
        <div className="summary-row">
          <span className="summary-label">Savings Name</span>
          <span className="summary-value text-dark">{title}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">
            {planType.toUpperCase() === "FLEXIBLE" ? "Target Amount" : "Amount"}
          </span>
          <span className="summary-value text-dark">
            ₦{" "}
            {targetAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Savings Type</span>
          <span
            className="summary-value text-dark"
            style={{ textTransform: "capitalize" }}
          >
            {planType.toLowerCase()}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">
            {planType.toUpperCase() === "FLEXIBLE"
              ? "Calculated Duration"
              : "Duration (Days)"}
          </span>
          <span className="summary-value text-dark">
            {duration}{" "}
            {planType.toUpperCase() === "FLEXIBLE" ? savingFrequency : ""}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Maturity Date</span>
          <span className="summary-value text-dark">
            {getFormattedMaturityDate()}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">
            Breaking Fee For Early Withdrawal
          </span>
          <span className="summary-value text-dark">
            {breakingFeePercentage}%
          </span>
        </div>

        <div className="summary-row items-start">
          <span className="summary-label">Interest (before tax)</span>
          <div className="summary-value-stack">
            <span className="summary-value text-gold">
              ₦{" "}
              {interestBeforeTax.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <span className="calculation-subtext">
            ({interestRate}% p.a. base interest rate)
          </span>
        </div>

        <div className="summary-row items-start">
          <span className="summary-label">Withholding Tax (10%)</span>
          <div className="summary-value-stack">
            <span className="summary-value text-gold">
              ₦{" "}
              {withholdingTax.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="summary-row items-start">
          <span className="summary-label">Interest (after tax)</span>
          <span className="summary-value text-gold">
            ₦{" "}
            {interestAfterTax.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="summary-row items-start">
          <span className="summary-label">Total Payback</span>
          <div className="summary-value-stack">
            <span className="summary-value text-gold font-bold">
              ₦{" "}
              {totalPayback.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="modal-actions-footer">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} className="btn-primary">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PlanSummary;
