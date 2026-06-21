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
  const isPlanFlexible = isFlexibleMode || formData.planType === "FLEXIBLE";
  const isPlanStealth = formData.planType === "STEALTH";

  // 1. Determine Interest Rate p.a. Based on Selected Type & Duration
  const getInterestRate = () => {
    if (isPlanFlexible) return 0.1; // 10% p.a.

    const daysInput = parseInt(formData.duration, 10) || 0;
    if (daysInput >= 7 && daysInput <= 90) return 0.14;
    if (daysInput >= 91 && daysInput <= 180) return 0.15;
    if (daysInput >= 181 && daysInput <= 364) return 0.16;
    if (daysInput >= 365) return 0.17;
    return 0.14; // Base fallback
  };

  const rateValue = getInterestRate();

  // Helper function to resolve exact Type labels cleanly
  const getPlanTypeLabel = () => {
    if (isPlanStealth) return "Stealth";
    if (isPlanFlexible) return "Flexible";
    return "Locked";
  };

  // 2. Dynamic Maturity Date Calculation
  const getCalculatedMaturityDate = () => {
    if (isPlanFlexible) {
      return "No lock-in (Withdraw anytime)";
    }

    const daysInput = parseInt(formData.duration, 10);
    if (!daysInput || isNaN(daysInput)) return "Invalid duration entered";

    const date = new Date();
    date.setDate(date.getDate() + daysInput);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // --- INTEREST MATHEMATICS MATCHING YOUR EXACT EXAMPLES ---
  let estimatedInterest = 0;
  let mathSubtext = "";

  if (isPlanFlexible) {
    const durationCycles = parseFloat(formData.duration) || 0;
    const frequency = (
      formData.savingFrequency ||
      formData.frequency ||
      "DAILY"
    ).toUpperCase();

    let timeInYears = 0;
    let frequencyLabel = "";

    if (frequency === "DAILY") {
      timeInYears = durationCycles / 365;
      frequencyLabel = "days";
    } else if (frequency === "WEEKLY") {
      timeInYears = durationCycles / 52;
      frequencyLabel = "weeks";
    } else if (frequency === "MONTHLY") {
      timeInYears = durationCycles / 12;
      frequencyLabel = "months";
    } else {
      timeInYears = durationCycles / 365;
      frequencyLabel = "days";
    }

    const averageBalance = target / 2;
    // SI = Average Balance * Rate * TimeInYears
    estimatedInterest = averageBalance * rateValue * timeInYears;

    // Cleanly formats the percentage without trailing zeroes (e.g., 10% instead of 10.0000%)
    const displayPercentage = rateValue * 100;

    mathSubtext = `(Average Bal: ₦${Number(averageBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} * ${displayPercentage}% * Time: ${durationCycles} ${frequencyLabel} [${timeInYears.toFixed(4)} yrs])`;
  } else {
    const days = parseInt(formData.duration, 10) || 0;
    estimatedInterest = target * rateValue * (days / 365);
    mathSubtext = `(${Number(target).toLocaleString()} * ${rateValue * 100}% * ${days} / 365)`;
  }

  const tax = parseFloat((estimatedInterest * 0.1).toFixed(2));
  const finalInterest = parseFloat((estimatedInterest - tax).toFixed(2));
  const totalPayback = parseFloat((target + finalInterest).toFixed(2));
  const formattedEstimatedInterest = parseFloat(estimatedInterest).toFixed(2);

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
            ₦{" "}
            {Number(target).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Savings Type</span>
          <span className="summary-value text-dark">{getPlanTypeLabel()}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">
            {isPlanFlexible ? "Savings Duration" : "Duration (Days)"}
          </span>
          <span className="summary-value text-dark">
            {formData.duration}{" "}
            {isPlanFlexible && formData.savingFrequency
              ? formData.savingFrequency.toLowerCase() + "s"
              : ""}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Maturity Date</span>
          <span className="summary-value text-dark">
            {getCalculatedMaturityDate()}
          </span>
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
          <div className="summary-value-stack">
            <span className="summary-value text-gold">
              ₦{" "}
              {Number(formattedEstimatedInterest).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <span className="calculation-subtext">{mathSubtext}</span>
        </div>

        <div className="summary-row items-start">
          <span className="summary-label">Withholding Tax (10%)</span>
          <div className="summary-value-stack">
            <span className="summary-value text-gold">
              ₦{" "}
              {Number(tax).toLocaleString(undefined, {
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
            {Number(finalInterest).toLocaleString(undefined, {
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
              {Number(totalPayback).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="calculation-subtext">
              (
              {Number(target).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{" "}
              +{" "}
              {Number(finalInterest).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
              )
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
