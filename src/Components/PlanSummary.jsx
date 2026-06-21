import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Style/PlanSummary.css";

const PlanSummary = ({
  formData,
  isFlexibleMode,
  onBack,
  onCancel,
  onConfirm,
}) => {
  console.log("formData from plan summary:", formData);

  if (!formData) {
    return <div className="modal-container">Loading summary data...</div>;
  }

  const target = parseFloat(formData.targetAmount) || 0;
  const days = parseInt(formData.duration) || 0;
  const isPlanFlexible = isFlexibleMode || formData.planType === "FLEXIBLE";

  // Helper function to resolve exact Type labels cleanly
  const getPlanTypeLabel = () => {
    if (formData.planType === "STEALTH") return "Stealth";
    if (isPlanFlexible) return "Flexible";
    return "Locked";
  };

  // INTEREST
  const estimatedInterest = (target * 0.16 * (days / 365)).toFixed(2);
  const tax = (estimatedInterest * 0.1).toFixed(2);
  const finalInterest = (estimatedInterest - tax).toFixed(2);
  const totalPayback = (target + parseFloat(finalInterest)).toFixed(2);

  return (
    <div className="modal-container" role="dialog" aria-modal="true">
      <button className="back-arrow-btn" onClick={onBack} aria-label="Go back">
        <FaArrowLeft className="back-icon-style" />
      </button>

      <h2 className="summary-title">Savings Plan Overview/Summary</h2>

      <div className="summary-details-list">
        <div className="summary-row">
          <span className="summary-label">Savings Name</span>
          <span className="summary-value text-dark">{formData.title}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Target Amount</span>
          <span className="summary-value text-dark">
            N
            {Number(target).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Savings Type</span>
          <span className="summary-value text-dark">{getPlanTypeLabel()}</span>
        </div>

        {!isPlanFlexible && (
          <div className="summary-row">
            <span className="summary-label">Duration (Days)</span>
            <span className="summary-value text-dark">{days}</span>
          </div>
        )}

        <div className="summary-row">
          <span className="summary-label">Maturity Date</span>
          <span className="summary-value text-dark">25 Apr, 2027</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">
            Breaking Fee For Early Withdrawal
          </span>
          <span className="summary-value text-dark">
            {isPlanFlexible ? "0%" : "1.5%"}
          </span>
        </div>

        <div className="summary-row items-start">
          <span className="summary-label">Interest (before tax)</span>
          <div className="summary-value-stack ">
            <span className="summary-value text-gold">
              N
              {Number(estimatedInterest).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <span className="calculation-subtext">
            ({Number(target).toLocaleString()} * 16% * {days}/365)
          </span>
        </div>

        {/* Withholding Tax */}
        <div className="summary-row items-start">
          <span className="summary-label">Withholding Tax</span>
          <div className="summary-value-stack">
            <span className="summary-value text-gold">
              N
              {Number(tax).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Interest After Tax */}
        <div className="summary-row items-start">
          <span className="summary-label">Interest (after tax)</span>
          <span className="summary-value text-gold">
            N
            {Number(finalInterest).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Total Payback */}
        <div className="summary-row items-start">
          <span className="summary-label">Total Payback</span>
          <div className="summary-value-stack">
            <span className="summary-value text-gold font-bold">
              N
              {Number(totalPayback).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="calculation-subtext">
              ({Number(target).toLocaleString()} +{" "}
              {Number(finalInterest).toLocaleString()})
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
