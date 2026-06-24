import React, { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Style/PlanSummary.css";

const PlanSummary = ({
  previewSummaryData,
  onRefreshSummary,
  onBack,
  onCancel,
  onConfirm,
}) => {
  // Trigger the preview breakdown automatically on component mount
  useEffect(() => {
    onRefreshSummary?.();
  }, [onRefreshSummary]);

  // Show a neutral container during mounting while waiting for parent data population
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

  // --- SAFE NORMALIZATION (MATCHED TO RECENT CONTRACT BUILD) ---
  const title = previewSummaryData.title || "Savings Plan";
  const planType = previewSummaryData.planType || "LOCKED";

  const targetAmount = Number(
    previewSummaryData.targetAmount || previewSummaryData.amount || 0,
  );

  const duration = previewSummaryData.duration || 0;

  const savingFrequency = previewSummaryData.savingFrequency
    ? previewSummaryData.savingFrequency.toLowerCase()
    : "";

  const interestRate = previewSummaryData.interestRate || 0;
  const breakingFeePercentage = previewSummaryData.breakingFeePercentage ?? 0;

  // Extract numerical attributes directly matching schema layout variables
  const interestBeforeTax = Number(previewSummaryData.interestBeforeTax || 0);
  const withholdingTax = Number(
    previewSummaryData.withholdingTax || previewSummaryData.taxAmount || 0,
  );

  // Calculate directly via provided data elements to insulate against floating-point precision drops
  const interestAfterTax = Math.max(0, interestBeforeTax - withholdingTax);
  const totalPayback = Number(previewSummaryData.totalPayback || 0);

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
