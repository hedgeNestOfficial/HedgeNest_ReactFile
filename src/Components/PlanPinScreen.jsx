import React, { useRef, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Style/PlanPin.css"

const PlanPinScreen = ({
  pin,
  handlePinChange,
  handlePinKeyDown,
  onBack,
  onSubmit,
}) => {
  const inputRefs = useRef([]);

  useEffect(() => {
    const firstEmpty = pin.findIndex((val) => val === "");
    const targetIdx = firstEmpty !== -1 ? firstEmpty : 0;
    if (inputRefs.current[targetIdx]) inputRefs.current[targetIdx].focus();
  }, []);

  const onInputChange = (value, idx) => {
    if (isNaN(value)) return;
    handlePinChange(value, idx);
    if (value && idx < 5 && inputRefs.current[idx + 1]) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const onInputKeyDown = (e, idx) => {
    handlePinKeyDown(e, idx);
    if (
      e.key === "Backspace" &&
      !pin[idx] &&
      idx > 0 &&
      inputRefs.current[idx - 1]
    ) {
      inputRefs.current[idx - 1].focus();
    }
  };

  return (
    <div className="modal-container" role="dialog" aria-modal="true">
      <button
        className="back-arrow-btn"
        onClick={onBack}
        aria-label="Go back to summary"
      >
        <FaArrowLeft className="back-icon-style" />
      </button>

      <h2 className="pin-screen-title">Enter Your Transaction Pin</h2>

      <div className="pin-input-row">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onInputChange(e.target.value, idx)}
            onKeyDown={(e) => onInputKeyDown(e, idx)}
            className="pin-box"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="pin-submit-btn"
        disabled={pin.includes("")}
      >
        Next
      </button>
    </div>
  );
};

export default PlanPinScreen;
