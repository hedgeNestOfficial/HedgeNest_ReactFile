import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import Button from "../Components/Button";
import "../Style/Planform.css";

const PlanForm = ({
  formData,
  handleInputChange,
  isFlexibleMode,
  setIsFlexibleMode,
  onCancel,
  onSubmit,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasSelectedType, setHasSelectedType] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [validationError, setValidationError] = useState("");

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
    setValidationError(""); // Reset errors on swap
  };

  // Intercept submit to run validation
  const handleLocalSubmit = (e) => {
    e.preventDefault();

    const targetAmt = parseFloat(formData.targetAmount) || 0;
    const initialAmt = parseFloat(formData.initialAmount) || 0;

    if (initialAmt > targetAmt) {
      setValidationError(
        "Input amount to get started cannot be greater than the target amount.",
      );
      return; // Stops submission
    }

    setValidationError(""); // Clear error if all looks good
    onSubmit(e);
  };

  return (
    <div className="modal-container" role="dialog" aria-modal="true">
      <h2 className="modal-title">Create a Savings Plan</h2>

      <form onSubmit={handleLocalSubmit} className="modal-form">
        {/* DROPDOWN */}
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

            {/* OPTIONS */}
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
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Amount</label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount || ""}
                onChange={(e) => {
                  setValidationError("");
                  handleInputChange(e);
                }}
                className="form-input"
                required
              />
            </div>

            <div className="form-group relative-group">
              {!isFlexibleMode ? (
                <>
                  <label className="form-label">Duration (Days)</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration || ""}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* IMPORTANT FIELD (API: amountPerFrequency) */}
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
                required
              />
            </div>
          </div>
        )}

        {/* Error Feedback Display */}
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
          <Button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            text="Cancel"
          />

          <Button
            type="submit"
            className="btn-primary"
            text="Create Plan"
            disabled={!hasSelectedType}
          />
        </div>
      </form>
    </div>
  );
};

export default PlanForm;
