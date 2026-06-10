import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import Button from "../Components/Button";

import "../Style/Planform.css"

const PlanForm = ({
  formData,
  handleInputChange,
  isFlexibleMode,
  setIsFlexibleMode,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="modal-container" role="dialog" aria-modal="true">
      <h2 className="modal-title">Create a Savings Plan</h2>
      <form onSubmit={onSubmit} className="modal-form">
        <div className="form-group">
          <label htmlFor="plan-title" className="form-label">
            Title
          </label>
          <input
            id="plan-title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="School fees, Birthday, Rent etc."
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="plan-amount" className="form-label">
            Target Amount (NGN)
          </label>
          <input
            id="plan-amount"
            type="text"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleInputChange}
            placeholder="500,000"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="plan-type" className="form-label">
            Type
          </label>
          <input
            id="plan-type"
            type="text"
            readOnly
            value={
              isFlexibleMode ? "Flexible (10% p.a.)" : "Locked (14 - 17% p.a.)"
            }
            className="form-input read-only-input"
          />
        </div>

        <div className="form-group relative-group">
          {!isFlexibleMode ? (
            <>
              <label htmlFor="plan-duration" className="form-label">
                Duration (Days)
              </label>
              <input
                id="plan-duration"
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="7 - 1000 days"
                className="form-input"
                required
              />
            </>
          ) : (
            <>
              <label htmlFor="plan-frequency" className="form-label">
                Saving Frequency
              </label>
              <div className="select-wrapper">
                <select
                  id="plan-frequency"
                  name="savingFrequency"
                  value={formData.savingFrequency}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                <div className="select-arrow-icon">
                  <FaArrowLeft className="select-arrow-icon-style" />
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsFlexibleMode(!isFlexibleMode)}
            className="toggle-flexible-btn"
          >
            {isFlexibleMode ? "Enable Locked?" : "Enable Flexible?"}
          </button>
        </div>

        <div className="modal-actions-footer">
          <Button type="button" onClick={onCancel} className="btn-secondary" text="Cancel" />
           
          <Button type="submit" className="btn-primary"text="Create Plan " />
           
        </div>
      </form>
    </div>
  );
};

export default PlanForm;
