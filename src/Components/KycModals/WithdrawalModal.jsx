import React, { useState, useRef, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import "../../Style/WithdrawalModal.css";

const WithdrawalModal = ({
  isOpen,
  onClose,
  bankDetails,
  token,
  onWithdrawalSuccess,
  isPending = false, // Set true when a withdrawal is already processing
  onWithdrawalCancel, // Callback for when cancellation finishes successfully
}) => {
  // Steps: "AML" -> "AMOUNT" -> "LOADING" -> "BREAKDOWN" -> "PIN" -> "SUCCESS"
  // New Steps: "PENDING" -> "CANCEL_CONFIRM" -> "CANCEL_LOADING" -> "CANCEL_SUCCESS"
  const [step, setStep] = useState(isPending ? "PENDING" : "AML");
  const [amount, setAmount] = useState("1,000");
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time ticking state for the 24-hour review window (23:59:50 -> 86390 seconds)
  const [timeLeft, setTimeLeft] = useState(86390);

  const pinInputsRef = useRef([]);

  // Sync initial step & reset state whenever modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setPin(new Array(6).fill(""));
      setIsSubmitting(false);
    } else {
      setStep(isPending ? "PENDING" : "AML");
    }
  }, [isOpen, isPending]);

  // Live countdown timer hook for the pending view
  useEffect(() => {
    let interval = null;
    if (isOpen && step === "PENDING") {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, step]);

  if (!isOpen) return null;

  // Format seconds into HH : MM : SS string representation
  const formatCountdown = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
  };

  // Handle transitions with intermediate loading screens
  const handleAmountSubmit = (e) => {
    e.preventDefault();
    setStep("LOADING");

    setTimeout(() => {
      setStep("BREAKDOWN");
    }, 1000);
  };

  // Handle 6-Digit PIN sequential focus shift
  const handlePinChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue) return;

    const updatedPin = [...pin];
    updatedPin[index] = cleanValue.substring(cleanValue.length - 1);
    setPin(updatedPin);

    // Auto-focus next input field box
    if (index < 5 && pinInputsRef.current[index + 1]) {
      pinInputsRef.current[index + 1].focus();
    }
  };

  const handlePinKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const updatedPin = [...pin];

      // If the current box has a value, clear it. If empty, clear the previous box.
      if (pin[index] !== "") {
        updatedPin[index] = "";
        setPin(updatedPin);
      } else if (index > 0) {
        updatedPin[index - 1] = "";
        setPin(updatedPin);
        if (pinInputsRef.current[index - 1]) {
          pinInputsRef.current[index - 1].focus();
        }
      }
    }
  };

  // Process finalized payload execution
  const handleFinalSubmit = async () => {
    setStep("LOADING");
    setIsSubmitting(true);

    try {
      // Simulate backend response payload execution
      setTimeout(() => {
        setStep("SUCCESS");
        setIsSubmitting(false);
        if (onWithdrawalSuccess) onWithdrawalSuccess();
      }, 1500);
    } catch (error) {
      console.error("Withdrawal processing error:", error);
      setStep("PIN");
      setIsSubmitting(false);
    }
  };

  // Process Cancellation execution
  const handleCancelWithdrawal = async () => {
    setStep("CANCEL_LOADING");

    try {
      // Simulate backend API cancellation response payload
      setTimeout(() => {
        setStep("CANCEL_SUCCESS");
        if (onWithdrawalCancel) onWithdrawalCancel();
      }, 1500);
    } catch (error) {
      console.error("Cancellation handling error:", error);
      setStep("PENDING");
    }
  };

  return (
    <div className="hn-modal-overlay">
      <div className="hn-modal-card">
        {/* STEP 1: QUICK ONE (AML Disclaimer) */}
        {step === "AML" && (
          <div className="hn-step-container hn-text-center">
            <h3 className="hn-modal-title">Quick One!</h3>
            <p className="hn-modal-desc">
              Withdrawals are processed after 24hours in alignment with
              Anti-Money Laundering and fraud detection processes. This is to
              enhance security of your funds.
            </p>
            <p className="hn-modal-desc hn-margin-top-md">
              Withdrawals can be only be initiated one at a time.
            </p>

            <div className="hn-button-grid">
              <button
                type="button"
                onClick={onClose}
                className="hn-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep("AMOUNT")}
                className="hn-btn-primary"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REQUEST AMOUNT INPUT */}
        {step === "AMOUNT" && (
          <form onSubmit={handleAmountSubmit} className="hn-step-container">
            <h3 className="hn-modal-title hn-text-left">
              Make Withdrawal Request
            </h3>

            <div className="hn-input-group">
              <label className="hn-input-label">
                How much do you want to Withdraw
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="hn-text-input"
                placeholder="0.00"
                required
              />
            </div>

            <div className="hn-button-grid hn-margin-top-lg">
              <button
                type="button"
                onClick={() => setStep("AML")}
                className="hn-btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="hn-btn-primary">
                Make Request
              </button>
            </div>
          </form>
        )}

        {/* STEP 3 & NEW: LOADER SCREENS */}
        {(step === "LOADING" || step === "CANCEL_LOADING") && (
          <div className="hn-step-container hn-align-center hn-justify-center hn-py-xl">
            <div className="hn-loading-spinner"></div>
          </div>
        )}

        {/* STEP 4: WITHDRAWAL BREAKDOWN */}
        {step === "BREAKDOWN" && (
          <div className="hn-step-container">
            <h3 className="hn-modal-title hn-text-left">
              Withdrawal Breakdown
            </h3>

            <div className="hn-breakdown-list">
              <div className="hn-breakdown-row">
                <span className="hn-row-label">Withdrawal To</span>
                <div className="hn-row-value-block">
                  <p className="hn-val-main">
                    {bankDetails?.name || "Sterling Bank"}
                  </p>
                  <p className="hn-val-sub">
                    {bankDetails?.accountNumber || "75825379802"}
                  </p>
                </div>
              </div>

              <div className="hn-breakdown-row">
                <span className="hn-row-label">Amount</span>
                <span className="hn-val-main">₦{amount}</span>
              </div>

              <div className="hn-breakdown-row">
                <span className="hn-row-label">Processing Fee</span>
                <span className="hn-val-main">₦50</span>
              </div>

              <div className="hn-divider"></div>

              <div className="hn-breakdown-row hn-font-total">
                <span className="hn-row-label">Total</span>
                <span className="hn-val-total">₦950</span>
              </div>
            </div>

            <div className="hn-button-grid hn-margin-top-lg">
              <button
                type="button"
                onClick={() => setStep("AMOUNT")}
                className="hn-btn-secondary"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep("PIN")}
                className="hn-btn-primary"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: SIX-DIGIT TRANSACTION PIN */}
        {step === "PIN" && (
          <div className="hn-step-container hn-relative">
            <button
              type="button"
              onClick={() => setStep("BREAKDOWN")}
              className="hn-back-arrow"
            >
              <FiArrowLeft size={20} />
            </button>

            <div className="hn-pin-wrapper">
              <h3 className="hn-modal-title hn-text-left hn-pin-title-spacing">
                Enter Your Transaction Pin
              </h3>

              <div className="hn-pin-box-row">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    type="password"
                    maxLength={1}
                    ref={(el) => (pinInputsRef.current[index] = el)}
                    value={digit}
                    onChange={(e) => handlePinChange(e.target.value, index)}
                    onKeyDown={(e) => handlePinKeyDown(e, index)}
                    className="hn-pin-input-box"
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={pin.includes("") || isSubmitting}
              className={`hn-btn-primary hn-full-width hn-margin-top-md ${pin.includes("") ? "hn-disabled" : ""}`}
            >
              Next
            </button>
          </div>
        )}

        {/* STEP 6: SUCCESS SCREEN */}
        {step === "SUCCESS" && (
          <div className="hn-step-container hn-text-center">
            <div className="hn-success-celebration-icon">🎉</div>
            <h3 className="hn-modal-title hn-margin-top-sm">Request Sent!</h3>
            <p className="hn-modal-desc">
              Your withdrawal request is now in review.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="hn-btn-primary hn-full-width hn-margin-top-lg"
            >
              Close
            </button>
          </div>
        )}

        {/* NEW FLOW STEP 7: PENDING OVERVIEW ("We're Working On It...") */}
        {step === "PENDING" && (
          <div className="hn-step-container hn-text-center">
            <div
              className="hn-pending-hourglass-icon"
              style={{ fontSize: "40px" }}
            >
              ⏳
            </div>
            <h3 className="hn-modal-title hn-margin-top-sm">
              We’re Working On It...
            </h3>
            <p className="hn-modal-desc">
              Your withdrawal is being processed. You can only initiate another
              after this is complete
            </p>

            <div
              className="hn-breakdown-list hn-margin-top-md"
              style={{ textAlign: "left" }}
            >
              <div className="hn-breakdown-row">
                <span className="hn-row-label">Withdrawal To</span>
                <div className="hn-row-value-block">
                  <p className="hn-val-main">
                    {bankDetails?.name || "Sterling Bank"}
                  </p>
                  <p className="hn-val-sub">
                    {bankDetails?.accountNumber || "75825379802"}
                  </p>
                </div>
              </div>

              <div className="hn-breakdown-row">
                <span className="hn-row-label">Amount</span>
                <span className="hn-val-main">₦{amount}</span>
              </div>

              <div className="hn-breakdown-row">
                <span className="hn-row-label">Processing Fee</span>
                <span className="hn-val-main">₦50</span>
              </div>

              <div className="hn-breakdown-row">
                <span className="hn-row-label">Time Left</span>
                <span
                  className="hn-val-main"
                  style={{ fontWeight: "600", letterSpacing: "1px" }}
                >
                  {formatCountdown(timeLeft)}
                </span>
              </div>
            </div>

            <p
              className="hn-modal-desc hn-margin-top-md"
              style={{ fontSize: "14px" }}
            >
              Not sure about this?{" "}
              <span
                onClick={() => setStep("CANCEL_CONFIRM")}
                style={{
                  color: "#EB5757",
                  cursor: "pointer",
                  fontWeight: "600",
                  textDecoration: "underline",
                }}
              >
                Cancel Withdrawal
              </span>
            </p>

            <button
              type="button"
              onClick={onClose}
              className="hn-btn-secondary hn-full-width hn-margin-top-md"
            >
              Close
            </button>
          </div>
        )}

        {/* NEW FLOW STEP 8: CANCELLATION CONFIRMATION DIALOG */}
        {step === "CANCEL_CONFIRM" && (
          <div className="hn-step-container hn-text-center hn-py-md">
            <h3 className="hn-modal-title hn-margin-bottom-lg">
              Are you sure you want to cancel withdrawal?
            </h3>

            <div className="hn-button-grid">
              <button
                type="button"
                onClick={handleCancelWithdrawal}
                className="hn-btn-secondary"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setStep("PENDING")}
                className="hn-btn-primary"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* NEW FLOW STEP 9: CANCELLATION TERMINATION SUCCESS VIEW */}
        {step === "CANCEL_SUCCESS" && (
          <div className="hn-step-container hn-text-center">
            <div
              className="hn-cancel-error-icon"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#EB5757",
                color: "#FFFFFF",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              ✕
            </div>
            <h3 className="hn-modal-title hn-margin-top-md">
              Withdrawal Canceled!
            </h3>

            <button
              type="button"
              onClick={onClose}
              className="hn-btn-primary hn-full-width hn-margin-top-xl"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalModal;
