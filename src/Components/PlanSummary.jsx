import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Style/PlanSummary.css";

const PlanSummary = ({ previewSummaryData, onBack, onCancel, onConfirm }) => {
  // Wait for the data to arrive from the parent component
  if (!previewSummaryData) {
    return (
      <div
        className="modal-container layout-centered"
        role="dialog"
        aria-modal="true"
      >
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const title = previewSummaryData.title || "";
  const planType = previewSummaryData.planType || "";
  const amount = Number(previewSummaryData.amount || 0);
  const duration = previewSummaryData.duration || 0;
  const savingFrequency = previewSummaryData.savingFrequency || "";
  const breakingFeePercentage = previewSummaryData.breakingFeePercentage ?? 0;

  const interestBeforeTax = Number(previewSummaryData.interestBeforeTax || 0);
  const withholdingTax = Number(previewSummaryData.withholdingTax || 0);
  const totalPayback = Number(previewSummaryData.totalPayback || 0);
  const interestAfterTax = Math.max(0, interestBeforeTax - withholdingTax);

  const getFormattedMaturityDate = () => {
    if (planType.toUpperCase() === "FLEXIBLE") {
      return "No lock-in (Withdraw anytime)";
    }
    if (previewSummaryData.maturityDate) {
      return new Date(previewSummaryData.maturityDate).toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      );
    }
    return "N/A";
  };

  const isFlexible = planType.toUpperCase() === "FLEXIBLE";

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
            {isFlexible ? "Target Amount" : "Amount"}
          </span>
          <span className="summary-value text-dark">
            ₦{" "}
            {amount.toLocaleString(undefined, {
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

        {isFlexible ? (
          <div className="summary-row">
            <span className="summary-label">Saving Frequency</span>
            <span
              className="summary-value text-dark"
              style={{ textTransform: "capitalize" }}
            >
              {savingFrequency.toLowerCase()}
            </span>
          </div>
        ) : (
          <div className="summary-row">
            <span className="summary-label">Duration (Days)</span>
            <span className="summary-value text-dark">{duration} days</span>
          </div>
        )}

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
          <span className="summary-value text-gold">
            ₦{" "}
            {interestBeforeTax.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="summary-row items-start">
          <span className="summary-label">Withholding Tax (10%)</span>
          <span className="summary-value text-gold">
            ₦{" "}
            {withholdingTax.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
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
          <span className="summary-value text-gold font-bold">
            ₦{" "}
            {totalPayback.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
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
