import React, { useRef, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Style/PlanPin.css";

const PlanPinScreen = ({
  pin,
  handlePinChange,
  onBack,
  onPinSubmitted, // Triggers parent handler containing confirmPin + createPlan orchestration
}) => {
  const inputRefs = useRef([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-focus management based on current input filling state
  useEffect(() => {
    const firstEmpty = pin.findIndex((val) => val === "");
    const targetIdx = firstEmpty !== -1 ? firstEmpty : 5;
    if (inputRefs.current[targetIdx]) inputRefs.current[targetIdx].focus();
  }, [pin]);

  const onInputChange = (value, idx) => {
    // Only accept numeric inputs
    const sanitized = value.replace(/[^0-9]/g, "");
    if (!sanitized) return;

    handlePinChange(sanitized, idx);

    // Shift focus to the next field forward if valid character input detected
    if (idx < 5 && inputRefs.current[idx + 1]) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const onInputKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      // Case A: Current box holds a digit value -> clear it out
      if (pin[idx]) {
        handlePinChange("", idx);
      }
      // Case B: Current box is empty -> shift focus backward and clear predecessor value
      else if (idx > 0) {
        handlePinChange("", idx - 1);
        if (inputRefs.current[idx - 1]) {
          inputRefs.current[idx - 1].focus();
        }
      }
    }
  };

  const handleSequenceSubmit = async () => {
    if (pin.includes("")) {
      return;
    }

    setIsProcessing(true);
    const pinString = pin.join("");

    try {
      // Handoff full verification execution sequence directly to parent container
      await onPinSubmitted(pinString);
    } catch (err) {
      console.error(
        "PIN transaction pipeline failed natively inside presentation wrapper.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="modal-container" role="dialog" aria-modal="true">
      <button
        className="back-arrow-btn"
        onClick={onBack}
        disabled={isProcessing}
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
            disabled={isProcessing}
            onChange={(e) => onInputChange(e.target.value, idx)}
            onKeyDown={(e) => onInputKeyDown(e, idx)}
            className="pin-box"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleSequenceSubmit}
        className="pin-submit-btn"
        disabled={pin.includes("") || isProcessing}
      >
        {isProcessing ? "Verifying..." : "Next"}
      </button>
    </div>
  );
};

export default PlanPinScreen;
