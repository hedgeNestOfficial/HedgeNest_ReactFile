import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { HiOutlineShieldCheck } from "react-icons/hi";
import toast from "react-hot-toast";
import {
  initiateInvestment,
  confirmTransactionPin,
// } from "../../Services/investmentService"; /* 👈 Imported confirmTransactionPin service */
// // import { useWalletRefresh } from "../../Hooks/useWalletRefresh.js";
import "../../Style/InvestModal.css";
import investAni from "../../assets/investAni.gif";

const InvestModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(Array(6).fill(""));
  const [apiLoading, setApiLoading] =
    useState(false); /* 👈 Synced loading naming conventions */

  const pinRefs = useRef([]);

  // 👈 Extract both user and token to make sure user._id is accessible for security checks
  const { user, token } = useSelector((state) => state.user);

  // Initialize the wallet state refresher hook
  const refreshWallet = useWalletRefresh();

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount("");
      setPin(Array(6).fill(""));
      setApiLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const { investmentName, roi, term, minAmount } = product;

  // Exact compound matching expected calculation formula
  const expectedReturn =
    amount && Number(amount) > 0
      ? (
          Number(amount) +
          Number(amount) * (Number(roi) / 100) * (Number(term) / 365)
        ).toFixed(2)
      : "0.00";

  // Step 1 Submission: Validating minimum tier bounds
  const handleAmountSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    if (Number(amount) < Number(minAmount)) {
      toast.error(
        `Minimum investment threshold is ₦${Number(minAmount).toLocaleString()}`,
      );
      return;
    }

    setStep(2);
  };

  // Safe auto-focus indexing handlers across individual PIN fields
  const handlePinChange = (value, index) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updatedPin = [...pin];
    updatedPin[index] = digit;
    setPin(updatedPin);

    if (digit && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinBackspace = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  // Step 2 & 3 Dispatch Trigger: Sends transaction payload securely after PIN approval
  const handleInvestmentExecution = async (e) => {
    e.preventDefault();

    const enteredPin = pin.join("");
    if (enteredPin.length < 6) {
      toast.error("Please enter your complete 6-digit transaction PIN");
      return;
    }

    // Move to Step 3 visually to render your "investAni" loading wrapper screen
    setStep(3);
    setApiLoading(true);

    if (!user?._id) {
      toast.error("User information not available");
      return;
    }

    if (!token) {
      toast.error("Authentication token missing");
      return;
    }

    try {
      // Step 1: Verify transaction authorization PIN via backend microservice parameters
      await confirmTransactionPin(user?._id, enteredPin, token);

      const payload = {
        investmentPlanId: product._id,
        amount: Number(amount),
      };

      // Step 2: Create investment profile only after successful authorization verification matching
      const response = await initiateInvestment(payload, token);

      // Step 3: Refresh local user account financial values layout updates smoothly
      await refreshWallet();

      toast.success(response?.message || "Investment created successfully");

      // Step 4: Display final completion screen accent container panels smoothly
      setStep(4);
      onSuccess?.();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to create investment",
      );
      // Kick them back to Pin entry state securely if execution authorization parameters fail
      setStep(2);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div className="invest-modal-overlay">
      <div
        className={`invest-modal-card ${step === 3 ? "invest-loader-card-dims" : ""}`}
      >
        {/* STEP 1: AMOUNT SPECIFICATION ENTRY SCREEN */}
        {step === 1 && (
          <form
            onSubmit={handleAmountSubmit}
            className="invest-modal-step-wrapper"
          >
            <h2 className="invest-modal-title">{investmentName}</h2>
            <p className="invest-modal-description">
              Capital-protected {term}-day fixed income note. Ideal for
              first-time investors.
            </p>

            <p className="invest-modal-description">
              Your money is been invested in Treasury Bills,FGN, saving Bonds ,
              Fixed Deposits, Money Market Mutual Funds with a 100% Guarantee in
              safe investment returns
            </p>

            <div className="invest-lock-notification-banner">
              <HiOutlineShieldCheck className="invest-shield-icon" />
              <p className="invest-lock-banner-text">
                Funds locked for {term} days at {roi}% p.a.
              </p>
            </div>

            <div className="invest-input-field-container">
              <label className="invest-input-field-label">Amount (NGN)</label>
              <div className="invest-input-box-wrapper">
                <input
                  type="number"
                  className="invest-numeric-text-input"
                  value={amount}
                  placeholder={Number(minAmount).toString()}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="invest-returns-summary-row">
              <span className="invest-summary-label">Expected Return</span>
              <span className="invest-summary-value-highlight">
                ₦
                {Number(expectedReturn).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
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

        {/* STEP 2: SECURITY VERIFICATION PIN SUBMISSION */}
        {step === 2 && (
          <form
            onSubmit={handleInvestmentExecution}
            className="invest-modal-step-wrapper"
          >
            <button
              type="button"
              className="invest-modal-back-navigation-arrow"
              onClick={() => setStep(1)}
            >
              <FiArrowLeft />
            </button>

            <h2 className="invest-modal-title margin-top-xs">
              Enter Your Transaction Pin
            </h2>

            <div className="invest-pin-box-grid-row">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  className="invest-square-box-input"
                  value={digit}
                  ref={(el) => (pinRefs.current[index] = el)}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handlePinBackspace(e, index)}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={pin.includes("")}
              className={`invest-btn-block-action margin-top-xl ${pin.includes("") ? "disabled-btn" : ""}`}
            >
              Next
            </button>
          </form>
        )}

        {/* STEP 3: TRANSACTION PIPELINE PROCESSING LOADER */}
        {step === 3 && (
          <div className="invest-modal-step-wrapper text-center align-center padding-vertical-lg">
            <div className="invest-processing-image-wrapper">
              <img
                src={investAni}
                alt="Investing Pipeline Processing illustration"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                style={{ width: "120px", marginBottom: "20px" }}
              />
            </div>

            <h2 className="invest-modal-title text-center-forced">
              Investing In Your Future
            </h2>
            <p className="invest-modal-processing-subtext margin-top-xs">
              Please wait...
            </p>

            <div className="invest-processing-button-loader-banner">
              <div className="invest-full-card-spinner-centered">
                <p className="invest-lock-banner-text">
                  Securing transaction pipeline channels...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: ACCOUNT ACTIVATION CONFIRMATION SUCCESS ACCENT VIEW */}
        {step === 4 && (
          <div className="invest-modal-step-wrapper text-center align-center padding-vertical-lg">
            <div className="invest-success-checkmark-animated-badge">
              <div className="invest-checkmark-inner-circle">
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  ✓
                </span>
              </div>
            </div>

            <h2 className="invest-modal-title text-center-forced margin-top-md">
              Investment Activated!
            </h2>
            <p className="invest-modal-description text-center-forced max-width-text margin-top-xs">
              We'll confirm and process your Investment within 1-2 days
            </p>

            <button
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
