import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaChevronDown } from "react-icons/fa6";
import toast from "react-hot-toast";
import "../Style/Planform.css";

const PlanForm = ({
  formData,
  handleInputChange,
  isFlexibleMode,
  setIsFlexibleMode,
  onCancel,
  onFormPreviewRequested,
}) => {
  // CORRECTED: Fetching 'availableBalance' matching your Redux console log
  const walletBalance = useSelector(
    (state) => state.user?.wallet?.availableBalance || 0,
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasSelectedType, setHasSelectedType] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectPlanType = (type, label) => {
    setIsFlexibleMode(type === "FLEXIBLE");
    handleInputChange({ target: { name: "planType", value: type } });
    setSelectedLabel(label);
    setIsDropdownOpen(false);
    setHasSelectedType(true);
  };

  const buildPayload = () => {
    const isFlexible = formData.planType === "FLEXIBLE";
    const duration =
      formData.duration && Number(formData.duration) > 0
        ? Number(formData.duration)
        : isFlexible
          ? 30
          : 1;

    return {
      title: formData.title,
      targetAmount: Number(formData.targetAmount),
      planType: formData.planType,
      duration,
      savingFrequency: isFlexible ? formData.savingFrequency : "DAILY",
      amountPerFrequency: isFlexible
        ? Number(formData.initialAmount || 0)
        : Number(formData.targetAmount || 0),
    };
  };

  const handleLocalSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isSubmitting) return;

    // 1. Basic Validation
    if (!formData.title) return toast.error("Please enter a savings title.");
    if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
      return toast.error("Please enter a valid target amount.");
    }

    const targetAmt = Number(formData.targetAmount || 0);
    const initialAmt = Number(formData.initialAmount || 0);
    const amountRequired =
      formData.planType === "FLEXIBLE" ? initialAmt : targetAmt;

    // 2. Strict Wallet Balance Validation
    if (amountRequired > walletBalance) {
      return toast.error(
        `Insufficient funds. Your wallet balance is ₦${walletBalance.toLocaleString()}`,
      );
    }

    if (formData.planType === "FLEXIBLE") {
      if (initialAmt <= 0)
        return toast.error("Please enter an initial starting amount.");
      if (initialAmt > targetAmt)
        return toast.error("Input amount cannot exceed target amount.");
    } else if (!formData.duration || Number(formData.duration) <= 0) {
      return toast.error("Please enter a valid duration in days.");
    }

    // 3. Lock button and proceed
    setIsSubmitting(true);

    // We use toast.promise for a beautiful UI state while fetching the preview
    try {
      const payload = buildPayload();
      await toast.promise(onFormPreviewRequested(payload), {
        loading: "Generating your plan preview...",
        success: "Preview generated!",
        error: (err) => err?.message || "Failed to generate preview.",
      });
    } catch (err) {
      console.error("Form live calculations error:", err.message);
    } finally {
      setIsSubmitting(false); // Unlock button
    }
  };

  return (
    <div className="modal-container" role="dialog" aria-modal="true">
      <h2 className="modal-title">Create a Savings Plan</h2>

      <form onSubmit={handleLocalSubmit} className="modal-form" noValidate>
        {/* SAVINGS TYPE DROPDOWN */}
        <div className="form-group relative-group">
          <label className="form-label">Savings Type</label>
          <div className="select-wrapper cursor-pointer">
            <div
              className="form-input custom-dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {!hasSelectedType ? "Select a Savings Type..." : selectedLabel}
            </div>
            <div className="select-arrow-icon">
              <FaChevronDown
                className={`select-arrow-icon-style ${isDropdownOpen ? "rotate-icon" : ""}`}
              />
            </div>

            {isDropdownOpen && (
              <div className="custom-dropdown-options animate-fade">
                <div
                  className="dropdown-option-item"
                  onClick={() =>
                    selectPlanType("FLEXIBLE", "Flexible (10% p.a.)")
                  }
                >
                  Flexible (10% p.a.)
                </div>
                <div
                  className="dropdown-option-item"
                  onClick={() =>
                    selectPlanType("LOCKED", "Locked (14 - 17% p.a.)")
                  }
                >
                  Locked (14 - 17% p.a.)
                </div>
                <div
                  className="dropdown-option-item"
                  onClick={() =>
                    selectPlanType("STEALTH", "Stealth (14 - 17% p.a.)")
                  }
                >
                  Stealth (14 - 17% p.a.)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DYNAMIC INPUT FIELDS */}
        {hasSelectedType && (
          <div className="reveal-fields-wrapper animate-fade">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {formData.planType === "FLEXIBLE" ? "Target Amount" : "Amount"}
              </label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount || ""}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            {formData.planType !== "FLEXIBLE" ? (
              <div className="form-group">
                <label className="form-label">Duration (Days)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration || ""}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            ) : (
              <>
                <div className="form-group relative-group">
                  <label className="form-label">Saving Frequency</label>
                  <select
                    name="savingFrequency"
                    value={formData.savingFrequency || "DAILY"}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Input Amount (To get started)
                  </label>
                  <input
                    type="number"
                    name="initialAmount"
                    value={formData.initialAmount || ""}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <div className="modal-actions-footer">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!hasSelectedType || isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Create Plan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanForm;
