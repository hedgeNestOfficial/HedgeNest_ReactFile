import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { HiOutlineArrowLeft } from "react-icons/hi";
import breakIllustration from "../../assets/investAni.gif";
import "../../Style/BreakModal.css";

const STEPS = {
  WARNING: 1,
  CONFIRM_DETAILS: 2,
  ENTER_PIN: 3,
  LOADING: 4,
  SUCCESS: 5,
};

const BreakInvestmentModalManager = ({
  isOpen,
  onClose,
  position,
  onConfirmBreak,
}) => {
  const [currentStep, setCurrentStep] = useState(STEPS.WARNING);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const pinRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(STEPS.WARNING);
      setPin(["", "", "", "", "", ""]);
    }
  }, [isOpen]);

  if (!isOpen || !position) return null;

  const investmentName =
    position?.investmentPlanId?.investmentName || "Investment";
  const amount = Number(position?.amount || 0);

  const handlePinChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedPin = [...pin];
    updatedPin[index] = value;
    setPin(updatedPin);

    if (value && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmitPin = async () => {
    const transactionPin = pin.join("");

    if (transactionPin.length !== 6) return;

    try {
      setCurrentStep(STEPS.LOADING);

      // PIN verification + break investment both happen in the dashboard handler.
      // The modal is only responsible for collecting the PIN and reporting the result.
      await onConfirmBreak(position._id, transactionPin);

      setCurrentStep(STEPS.SUCCESS);
    } catch (error) {
      console.error("Break investment failed:", error);
      setPin(["", "", "", "", "", ""]);
      setCurrentStep(STEPS.ENTER_PIN);
    }
  };

  const isPinComplete = pin.join("").length === 6;

  return (
    <div className="break-modal-overlay">
      <div className="break-modal-container">
        <div className="break-modal-header">
          {[STEPS.CONFIRM_DETAILS, STEPS.ENTER_PIN].includes(currentStep) ? (
            <button className="break-modal-back-btn" onClick={prevStep}>
              <HiOutlineArrowLeft size={20} />
            </button>
          ) : (
            <div />
          )}

          {[STEPS.WARNING, STEPS.CONFIRM_DETAILS, STEPS.ENTER_PIN].includes(
            currentStep,
          ) && (
            <button className="break-modal-close-btn" onClick={onClose}>
              <IoClose size={24} />
            </button>
          )}
        </div>

        {/* STEP 1: WARNING */}
        {currentStep === STEPS.WARNING && (
          <div className="break-modal-step-content text-center">
            <h2 className="break-modal-title">
              Are you sure you want to withdraw?
            </h2>
            <p className="break-modal-subtitle text-muted">
              Early withdrawal will not earn full interest
            </p>
            <div className="break-modal-actions-stacked">
              <button className="break-btn-gold" onClick={nextStep}>
                Continue
              </button>
              <button className="break-btn-outline" onClick={onClose}>
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CONFIRM DETAILS */}
        {currentStep === STEPS.CONFIRM_DETAILS && (
          <div className="break-modal-step-content">
            <h2 className="break-modal-title text-center">
              Withdraw From {investmentName}
            </h2>
            <p className="break-input-label text-center">
              How much do you want to withdraw
            </p>

            <div className="break-input-wrapper">
              <span className="break-currency-prefix">₦</span>
              <input
                type="text"
                className="break-disabled-input"
                value={amount.toLocaleString()}
                disabled
              />
            </div>

            <div className="break-modal-actions-row">
              <button
                className="break-btn-outline half-width"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="break-btn-gold half-width" onClick={nextStep}>
                Withdraw
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ENTER PIN */}
        {currentStep === STEPS.ENTER_PIN && (
          <div className="break-modal-step-content text-center">
            <h2 className="break-modal-title">Enter Your Transaction Pin</h2>
            <div className="break-pin-container">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (pinRefs.current[index] = el)}
                  type="password"
                  maxLength="1"
                  className="break-pin-input-box"
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button
              className="break-btn-gold mt-4"
              onClick={handleSubmitPin}
              disabled={!isPinComplete}
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 4: LOADING */}
        {currentStep === STEPS.LOADING && (
          <div className="break-modal-step-content text-center py-4">
            <img
              src={breakIllustration}
              alt="Processing"
              className="break-loading-illustration"
            />
            <h2 className="break-modal-title mt-3">Investing In Your Future</h2>
            <p className="break-modal-subtitle">Please wait...</p>
            <div className="break-spinner-circle" />
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {currentStep === STEPS.SUCCESS && (
          <div className="break-modal-step-content text-center py-4">
            <div className="break-success-icon-wrapper">
              <div className="break-success-circle-checkmark">✓</div>
            </div>
            <h2 className="break-modal-title mt-4">Investment Terminated!</h2>
            <p className="break-modal-subtitle px-2">
              We'll confirm and process your investment settlement within 1–2
              days
            </p>
            <button className="break-btn-gold mt-4" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakInvestmentModalManager;
