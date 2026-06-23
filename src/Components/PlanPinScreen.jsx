import React, { useRef, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import "../Style/PlanPin.css";

const PlanPinScreen = ({
  pin: rawPin, // Rename it locally so we can safely normalize it below
  handlePinChange,
  onBack,
  onPinSubmitted,
}) => {
  const inputRefs = useRef([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🛡️ BULLETPROOF NORMALIZATION:
  // If parent passes null, undefined, a string, or an empty array, always force a 6-slot array.
  const pin =
    Array.isArray(rawPin) && rawPin.length === 6
      ? rawPin
      : ["", "", "", "", "", ""];

  // Focus the first empty box exactly once when the component mounts
  useEffect(() => {
    const firstEmpty = pin.findIndex((val) => val === "");
    const targetIdx = firstEmpty !== -1 ? firstEmpty : 0;
    if (inputRefs.current[targetIdx]) {
      inputRefs.current[targetIdx].focus();
    }
    // Empty dependency array stops the focus-stealing re-render bug
  }, []);

  const onInputChange = (value, idx) => {
    if (value === "") {
      handlePinChange?.("", idx);
      return;
    }

    // Only allow numbers
    const sanitized = value.replace(/[^0-9]/g, "");
    if (!sanitized) return;

    // Grab the last character typed
    const lastChar = sanitized.slice(-1);
    handlePinChange?.(lastChar, idx);

    // Explicitly move focus to next box manually
    if (idx < 5 && inputRefs.current[idx + 1]) {
      setTimeout(() => {
        inputRefs.current[idx + 1].focus();
      }, 10);
    }
  };

  const onInputKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      if (pin[idx]) {
        // Clear current box content
        handlePinChange?.("", idx);
      } else if (idx > 0) {
        // Clear previous box content and shift focus back
        handlePinChange?.("", idx - 1);
        if (inputRefs.current[idx - 1]) {
          inputRefs.current[idx - 1].focus();
        }
      }
    }
  };

  const handleSequenceSubmit = async () => {
    if (pin.includes("")) return;

    setIsProcessing(true);
    const pinString = pin.join("");

    try {
      await onPinSubmitted?.(pinString);
    } catch (err) {
      console.error(
        "PIN transaction pipeline failed inside presentation wrapper.",
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
