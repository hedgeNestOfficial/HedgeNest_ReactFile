import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Style/PlanSummary.css"

const PlanSummary = ({
  formData,
  isFlexibleMode,
  onBack,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="modal-container" role="dialog" aria-modal="true">
      <button className="back-arrow-btn" onClick={onBack} aria-label="Go back">
        <FaArrowLeft className="back-icon-style" />
      </button>

      <h2 className="summary-title">Savings Plan Overview/Summary</h2>

      <div className="summary-details-list">
        <div className="summary-row">
          <span className="summary-label">Savings Name</span>
          <span className="summary-value text-dark">
            {formData.title || "Vacation"}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Target Amount</span>
          <span className="summary-value text-dark">
            N{formData.targetAmount || "500,000"}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Savings Type</span>
          <span className="summary-value text-dark">
            {isFlexibleMode ? "Flexible" : "Locked"}
          </span>
        </div>
        {!isFlexibleMode && (
          <div className="summary-row">
            <span className="summary-label">Duration (Days)</span>
            <span className="summary-value text-dark">
              {formData.duration || "340"}
            </span>
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
            {isFlexibleMode ? "0%" : "1.5%"}
          </span>
        </div>
        <div className="summary-row items-start">
          <span className="summary-label">Interest (before tax)</span>
          <span className="summary-value text-gold">N74,520.55</span>
        </div>
        <div className="summary-row items-start">
          <span className="summary-label">Withholding Tax</span>
          <div className="summary-value-stack">
            <span className="summary-value text-gold">N7,452.05</span>
            <span className="calculation-subtext">
              ({formData.targetAmount || "500,000"} * 16% *{" "}
              {formData.duration || "340"}/365)
            </span>
          </div>
        </div>
        <div className="summary-row items-start">
          <span className="summary-label">Interest (after tax)</span>
          <span className="summary-value text-gold">N67,068.50</span>
        </div>
        <div className="summary-row items-start">
          <span className="summary-label">Total Payback</span>
          <div className="summary-value-stack">
            <span className="summary-value text-gold font-bold">
              N567,068.50
            </span>
            <span className="calculation-subtext">
              ({formData.targetAmount || "500,000"} + 67,068.50)
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
