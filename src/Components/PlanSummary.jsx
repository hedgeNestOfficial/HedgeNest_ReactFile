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
  if (!formData) {
    return <div className="modal-container">Loading summary data...</div>;
  }

  const target = parseFloat(formData.targetAmount) || 0;
  const initialAmt = parseFloat(formData.initialAmount) || 0;
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

  const getPlanTypeLabel = () => {
    if (isPlanStealth) return "Stealth";
    if (isPlanFlexible) return "Flexible";
    return "Locked";
  };

  // --- FREQUENCY CONFIGURATION ---
  const frequency = (formData.savingFrequency || "DAILY").toUpperCase();

  // --- DURATION EXTRACTOR ---
  let derivedDuration = 0;

  if (isPlanFlexible) {
    if (target > 0 && initialAmt > 0) {
      derivedDuration = Math.ceil(target / initialAmt);
    } else {
      derivedDuration =
        frequency === "MONTHLY" ? 12 : frequency === "WEEKLY" ? 52 : 365;
    }
  } else {
    derivedDuration = parseInt(formData.duration, 10) || 0;
  }

  // 2. Dynamic Maturity Date Calculation
  const getCalculatedMaturityDate = () => {
    if (isPlanFlexible) {
      return "No lock-in (Withdraw anytime)";
    }

    if (!derivedDuration || isNaN(derivedDuration))
      return "Invalid duration entered";

    const date = new Date();
    date.setDate(date.getDate() + derivedDuration);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // --- INTEREST MATHEMATICS WITH THE CLEAR STEP DIVISION ---
  let estimatedInterest = 0;
  let mathSubtext = "";

  if (isPlanFlexible) {
    let timeInYears = 0;
    let baseDivider = 365;

    if (frequency === "DAILY") {
      timeInYears = derivedDuration / 365;
      baseDivider = 365;
    } else if (frequency === "WEEKLY") {
      timeInYears = derivedDuration / 52;
      baseDivider = 52;
    } else if (frequency === "MONTHLY") {
      timeInYears = derivedDuration / 12;
      baseDivider = 12;
    } else {
      timeInYears = derivedDuration / 365;
      baseDivider = 365;
    }

    // Step 2: Average Balance = Target / 2
    const averageBalance = target / 2;

    // Step 3: Simple Interest
    estimatedInterest = averageBalance * rateValue * timeInYears;
    const displayPercentage = rateValue * 100;

    mathSubtext = `(Average Bal: ₦${Number(averageBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })} * ${displayPercentage}% * ${derivedDuration} / ${baseDivider})`;
  } else {
    estimatedInterest = target * rateValue * (derivedDuration / 365);
    mathSubtext = `(${Number(target).toLocaleString()} * ${rateValue * 100}% * ${derivedDuration} / 365)`;
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
            {isPlanFlexible ? "Calculated Duration" : "Duration (Days)"}
          </span>
          <span className="summary-value text-dark">
            {derivedDuration}{" "}
            {isPlanFlexible
              ? frequency.toLowerCase() + (derivedDuration === 1 ? "" : "s")
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
