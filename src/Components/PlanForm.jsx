import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import "../Style/Planform.css";

const PlanForm = ({
  formData,
  handleInputChange,
  isFlexibleMode,
  setIsFlexibleMode,
  onCancel,
  onFormPreviewRequested,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasSelectedType, setHasSelectedType] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectPlanType = (type, label) => {
    setIsFlexibleMode(type === "FLEXIBLE");

    handleInputChange({
      target: {
        name: "planType",
        value: type,
      },
    });

    setSelectedLabel(label);
    setIsDropdownOpen(false);
    setHasSelectedType(true);
    setValidationError("");
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

    if (!formData.title) {
      setValidationError("Please enter a savings title.");
      return;
    }
    if (!formData.targetAmount || Number(formData.targetAmount) <= 0) {
      setValidationError("Please enter a valid target amount.");
      return;
    }
    if (
      formData.planType !== "FLEXIBLE" &&
      (!formData.duration || Number(formData.duration) <= 0)
    ) {
      setValidationError("Please enter a valid duration in days.");
      return;
    }

    const targetAmt = Number(formData.targetAmount || 0);
    const initialAmt = Number(formData.initialAmount || 0);

    if (formData.planType === "FLEXIBLE") {
      if (initialAmt <= 0) {
        setValidationError("Please enter an initial starting amount.");
        return;
      }
      if (initialAmt > targetAmt) {
        setValidationError("Input amount cannot exceed target amount.");
        return;
      }
    }

    setValidationError("");
    setIsSubmitting(true);

    try {
      const payload = buildPayload();
      await onFormPreviewRequested(payload);
    } catch (err) {
      console.error("Form live calculations error:", err.message);
      setValidationError(
        err?.message || "An unexpected processing error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-container" role="dialog" aria-modal="true">
      <h2 className="modal-title">Create a Savings Plan</h2>

      <form onSubmit={handleLocalSubmit} className="modal-form" noValidate>
        {/* SAVINGS TYPE */}
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
                className={`select-arrow-icon-style ${
                  isDropdownOpen ? "rotate-icon" : ""
                }`}
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

        {/* FIELDS */}
        {hasSelectedType && (
          <div className="reveal-fields-wrapper animate-fade">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={(e) => {
                  setValidationError("");
                  handleInputChange(e);
                }}
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
                onChange={(e) => {
                  setValidationError("");
                  handleInputChange(e);
                }}
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
                  onChange={(e) => {
                    setValidationError("");
                    handleInputChange(e);
                  }}
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
                    onChange={(e) => {
                      setValidationError("");
                      handleInputChange(e);
                    }}
                    className="form-input"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ERROR */}
        {validationError && (
          <div
            className="error-message-text"
            style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}
          >
            {validationError}
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
