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

  // ✅ FIXED: sync BOTH UI + parent formData
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
  };

  return (
    <div className="modal-container" role="dialog" aria-modal="true">
      <h2 className="modal-title">Create a Savings Plan</h2>

      <form onSubmit={onSubmit} className="modal-form">
        {/* DROPDOWN */}
        <div className="form-group relative-group">
          <label className="form-label">Savings Type</label>

          <div className="select-wrapper cursor-pointer">
            {/* trigger ONLY here (prevents toggle bug) */}
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
                type="text"
                name="targetAmount"
                value={formData.targetAmount || ""}
                onChange={handleInputChange}
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
                type="text"
                name="initialAmount"
                value={formData.initialAmount || ""}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>
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
