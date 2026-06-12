import React, { useState, useEffect, useRef } from "react";
import "../../Style/InvestModal.css";
import { FiArrowLeft } from "react-icons/fi";
import { OrbitProgress } from "react-loading-indicators";
import toast from "react-hot-toast";

const InvestModal = ({ isOpen, onClose, product }) => {
  // If no open trigger or product is selected, do not render
  if (!isOpen || !product) return null;

  // Flow step management according to Figma prototype specifications:
  // 1: Product Overview & Amount Entry Form (image_d8ed09.png)
  // 2: Screen Transitions Loader (image_d8ed49.png)
  // 3: 6-Digit Transaction PIN Validation Screen (image_d8ed83.png & image_d8ed8c.png)
  // 4: Final Investment Processing Sequence (image_d8edc1.png)
  // 5: Investment Success Completion Screen (image_d8f16a.png)
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [expectedReturn, setExpectedReturn] = useState(0);
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [isPinSubmitting, setIsPinSubmitting] = useState(false);

  const pinRefs = useRef([]);

  // Destructure product parameters passed from the dashboard card view
  const { title, description, roi, term, minAmount } = product;

  // Auto-calculate expected returns dynamically based on input amount changes
  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0) {
      // Formula: Principal + (Principal * (ROI / 100) * (Days / 365))
      const rate = parseFloat(roi) / 100;
      const days = parseInt(term);
      const interest = numericAmount * rate * (days / 365);
      setExpectedReturn(numericAmount + interest);
    } else {
      setExpectedReturn(0);
    }
  }, [amount, roi, term]);

  // Reset modal state flags cleanly when toggled closed or opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount("");
      setPin(new Array(6).fill(""));
      setIsPinSubmitting(false);
    }
  }, [isOpen]);

  // Handle Form Submission for Step 1
  const handleAmountSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    const numericMin = parseFloat(minAmount.replace(/[^0-9.-]+/g, ""));

    if (isNaN(numericAmount) || numericAmount < numericMin) {
      toast.error(
        `Minimum investment amount for this product is ₦${numericMin.toLocaleString()}`,
      );
      return;
    }

    // Advance to screen transition loader (image_d8ed49.png)
    setStep(2);
    setTimeout(() => {
      setStep(3); // Automatically advance to PIN verification
    }, 1200);
  };

  // 6-Box Grid input tracking utilities
  const handlePinChange = (value, index) => {
    const sanitized = value.replace(/\D/g, "");
    if (!sanitized) return;

    let updatedPin = [...pin];
    updatedPin[index] = sanitized.substring(sanitized.length - 1);
    setPin(updatedPin);

    // Auto-focus next input field layout box
    if (index < 5) {
      pinRefs.current[index + 1].focus();
    }
  };

  const handlePinKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      let updatedPin = [...pin];
      updatedPin[index] = "";
      setPin(updatedPin);

      // Auto-focus back step input box
      if (index > 0) {
        pinRefs.current[index - 1].focus();
      }
    }
  };

  // Handle PIN Form Submission for Step 3
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin.join("").length !== 6) {
      toast.error("Please enter your complete 6-digit transaction PIN");
      return;
    }

    // Trigger internal inline button loading animations (image_d8ed8c.png)
    setIsPinSubmitting(true);

    setTimeout(() => {
      setIsPinSubmitting(false);
      // Advance to full-screen processing page (image_d8edc1.png)
      setStep(4);

      // Keep processing step active for realistic backend API state persistence simulation
      setTimeout(() => {
        setStep(5); // Show success view (image_d8f16a.png)
      }, 2500);
    }, 1500);
  };

  return (
    <div className="invest-modal-overlay" onClick={onClose}>
      <div
        className={`invest-modal-card ${step === 2 ? "invest-loader-card-dims" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* STEP 1: PRODUCT DETAILS & AMOUNT SELECTION (image_d8ed09.png) */}
        {step === 1 && (
          <form
            onSubmit={handleAmountSubmit}
            className="invest-modal-step-wrapper"
          >
            <h2 className="invest-modal-title">{title}</h2>
            <p className="invest-modal-description">{description}</p>

            <div className="invest-lock-notification-banner">
              <span className="invest-shield-icon">🛡️</span>
              <p className="invest-lock-banner-text">
                Funds locked for {term} at {roi} p.a.
              </p>
            </div>

            <div className="invest-input-field-container">
              <label className="invest-input-field-label">Amount (NGN)</label>
              <div className="invest-input-box-wrapper">
                <input
                  type="number"
                  required
                  placeholder="5,000"
                  className="invest-numeric-text-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="invest-returns-summary-row">
              <span className="invest-summary-label">Expected Return</span>
              <span className="invest-summary-value-highlight">
                ₦
                {expectedReturn > 0
                  ? expectedReturn.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </span>
            </div>

            <div className="invest-modal-action-buttons-container">
              <button
                type="button"
                className="invest-btn-secondary-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="invest-btn-primary-solid">
                Continue
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: TRANSITIONS LOADER LAYOUT (image_d8ed49.png) */}
        {step === 2 && (
          <div className="invest-full-card-spinner-centered">
            <OrbitProgress color="#f2bf5e" size="medium" />
          </div>
        )}

        {/* STEP 3: TRANSACTION PIN VERIFICATION GRID SCREEN (image_d8ed83.png & image_d8ed8c.png) */}
        {step === 3 && (
          <form
            onSubmit={handlePinSubmit}
            className="invest-modal-step-wrapper"
          >
            <button
              type="button"
              className="invest-modal-back-navigation-arrow"
              onClick={() => setStep(1)}
            >
              <FiArrowLeft />
            </button>

            <h2 className="invest-modal-title margin-top-md">
              Enter Your Transaction Pin
            </h2>

            <div className="invest-pin-box-grid-row">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  type="password"
                  maxLength={1}
                  ref={(el) => (pinRefs.current[idx] = el)}
                  className="invest-square-box-input"
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, idx)}
                  onKeyDown={(e) => handlePinKeyDown(e, idx)}
                />
              ))}
            </div>

            <button
              type="submit"
              className="invest-btn-block-action margin-top-xl display-flex-center"
              disabled={isPinSubmitting}
            >
              {isPinSubmitting ? (
                <OrbitProgress color="#ffffff" size="small" />
              ) : (
                "Next"
              )}
            </button>
          </form>
        )}

        {/* STEP 4: INVESTING PROCESSING FRAME (image_d8edc1.png) */}
        {step === 4 && (
          <div className="invest-modal-step-wrapper text-center align-center padding-vertical-lg">
            <div className="invest-processing-illustration-placeholder">
              {/* Clean custom SVG illustration representing growth analytics asset distribution */}
              <svg
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f2bf5e"
                strokeWidth="1.5"
              >
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>

            <h2 className="invest-modal-title margin-top-md">
              Investing In Your Future
            </h2>
            <p className="invest-modal-processing-subtext">Please wait...</p>

            <div className="invest-processing-button-loader-banner">
              <OrbitProgress color="#ffffff" size="small" />
            </div>
          </div>
        )}

        {/* STEP 5: INVESTMENT ACTIVATED SUCCESS BANNER VIEW (image_d8f16a.png) */}
        {step === 5 && (
          <div className="invest-modal-step-wrapper text-center align-center padding-vertical-lg">
            <div className="invest-success-checkmark-animated-badge">
              <div className="invest-checkmark-inner-circle">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            <h2 className="invest-modal-title margin-top-lg font-size-xl">
              Investment Activated!
            </h2>
            <p className="invest-modal-description margin-top-xs text-center-forced max-width-text">
              We'll confirm and process your Investment within 1-2 days
            </p>

            <button
              type="button"
              className="invest-btn-block-action margin-top-xl"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestModal;
