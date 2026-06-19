import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { HiOutlineShieldCheck } from "react-icons/hi";
import toast from "react-hot-toast";
import {
  initiateInvestment,
  confirmTransactionPin,
} from "../../Services/investmentService";
import { useWalletRefresh } from "../../hooks/useWalletRefresh";
import "../../Style/InvestModal.css";
import investAni from "../../assets/investAni.gif";

const InvestModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const pinRefs = useRef([]);
  const modalRef = useRef(null);

  const { user, token } = useSelector((state) => state.user);
  const refreshWallet = useWalletRefresh();

  /*
  |--------------------------------------------------------------------------
  | Reset Modal State
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount("");
      setPin(["", "", "", "", "", ""]);
      setIsLoading(false);
    }
  }, [isOpen]);

  /*
  |--------------------------------------------------------------------------
  | Close Modal On Outside Click
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  /*
  |--------------------------------------------------------------------------
  | 🧠 10X DATA NORMALIZATION LAYER
  |--------------------------------------------------------------------------
  | We explicitly detect if the incoming object is a user position or a raw plan,
  | ensuring the correct ID is sent to the backend every single time.
  */
  const isPositionObject = !!product?.investmentPlanId;

  let investmentPlanId = "";
  if (isPositionObject) {
    // If investmentPlanId is a populated object, grab its inner ID string
    if (
      typeof product.investmentPlanId === "object" &&
      product.investmentPlanId !== null
    ) {
      investmentPlanId =
        product.investmentPlanId._id || product.investmentPlanId.id;
    } else {
      // If it's already a plain string ID
      investmentPlanId = product.investmentPlanId;
    }
  } else {
    // Standard plan object fallback
    investmentPlanId = product?._id || product?.id;
  }

  // Safely map display data based on object structural origin
  const investmentName = isPositionObject
    ? product?.investmentPlanId?.investmentName || "Investment Plan"
    : product?.investmentName || "Investment Plan";

  const roi = isPositionObject
    ? product?.investmentPlanId?.roi || product?.roi || 0
    : product?.roi || 0;

  const term = isPositionObject
    ? product?.investmentPlanId?.term || product?.term || 0
    : product?.term || 0;

  const minAmount = isPositionObject
    ? product?.investmentPlanId?.minAmount || product?.minAmount || 0
    : product?.minAmount || 0;

  const expectedReturn =
    amount && Number(amount) > 0
      ? (
          Number(amount) +
          Number(amount) * (Number(roi) / 100) * (Number(term) / 365)
        ).toFixed(2)
      : "0.00";

  /*
  |--------------------------------------------------------------------------
  | Amount Step Submit
  |--------------------------------------------------------------------------
  */
  const handleAmountSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    if (Number(amount) < Number(minAmount)) {
      toast.error(
        `Minimum investment is ₦${Number(minAmount).toLocaleString()}`,
      );
      return;
    }

    setStep(2);
  };

  /*
  |--------------------------------------------------------------------------
  | PIN Inputs
  |--------------------------------------------------------------------------
  */
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

  /*
  |--------------------------------------------------------------------------
  | Confirm PIN + Create Investment
  |--------------------------------------------------------------------------
  */
  const handlePinSubmit = async () => {
    const enteredPin = pin.join("");

    if (enteredPin.length !== 6) {
      toast.error("Please enter your 6-digit transaction PIN");
      return;
    }

    if (!user?._id) {
      toast.error("User profile session context missing. Please login again.");
      return;
    }

    if (!token) {
      toast.error("Authentication session expired. Please login again.");
      return;
    }

    // 🚨 HARD RUNTIME GUARD: Block the API call if the ID extraction failed
    if (!investmentPlanId) {
      console.error(
        "❌ CRITICAL: Could not resolve investmentPlanId. Raw product context:",
        product,
      );
      toast.error("System error: Missing investment plan identifier.");
      return;
    }

    try {
      setIsLoading(true);
      setStep(3);

      /*
      |--------------------------------------------------------------------------
      | STEP 1: Confirm Transaction PIN
      |--------------------------------------------------------------------------
      */
      await confirmTransactionPin(user._id, enteredPin, token);

      /*
      |--------------------------------------------------------------------------
      | STEP 2: Create Investment Operation
      |--------------------------------------------------------------------------
      */
      const payload = {
        investmentPlanId: investmentPlanId,
        amount: Number(amount),
      };

      console.log("🚀 EXECUTING INITIATE INVESTMENT. PAYLOAD:", payload);

      const response = await initiateInvestment(payload, token);

      /*
      |--------------------------------------------------------------------------
      | STEP 3: Refresh Wallet Profiles
      |--------------------------------------------------------------------------
      */
      await refreshWallet();

      toast.success(response?.message || "Investment created successfully");
      onSuccess?.();
      setStep(4);
    } catch (error) {
      console.error("❌ INVESTMENT PIPELINE FAILURE:", error);
      toast.error(
        error?.response?.data?.message ||
          "Unable to complete investment execution",
      );

      // Rollback gracefully to pin sequence on failure
      setPin(["", "", "", "", "", ""]);
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const isPinComplete = pin.join("").length === 6;

  return (
    <div className="invest-modal-overlay">
      <div className="invest-modal-card" ref={modalRef}>
        {/* STEP 1: AMOUNT ENTRY */}
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
              Your money is invested in Treasury Bills, FGN Savings Bonds, Fixed
              Deposits, and Money Market Mutual Funds with a 100% guarantee on
              safe investment returns.
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

        {/* STEP 2: PIN ENTRY */}
        {step === 2 && (
          <div className="invest-modal-step-wrapper">
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
                  inputMode="numeric"
                  className="invest-square-box-input"
                  value={digit}
                  ref={(el) => (pinRefs.current[index] = el)}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handlePinBackspace(e, index)}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={!isPinComplete || isLoading}
              onClick={handlePinSubmit}
              className={`invest-btn-block-action margin-top-xl ${
                !isPinComplete || isLoading ? "disabled-btn" : ""
              }`}
            >
              {isLoading ? "Processing..." : "Next"}
            </button>
          </div>
        )}

        {/* STEP 3: LOADING TRACK */}
        {step === 3 && (
          <div className="invest-modal-step-wrapper text-center align-center padding-vertical-lg">
            <div className="invest-processing-image-wrapper">
              <img
                src={investAni}
                alt="Processing investment"
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
                  Securing your transaction...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
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
              We'll confirm and process your investment within 1–2 days
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
