import React, { useState, useRef, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useWalletRefresh } from "../../Hooks/useWalletRefresh";
import {
  getLinkedAccounts,
  confirmTransactionPin,
  withdrawFunds,
} from "../../Services/paymentService";
import "../../Style/WithdrawalModal.css";

const WithdrawalModal = ({
  isOpen,
  onClose,
  userId,
  token,
  amount: dashboardAmount,
  onWithdrawalSuccess,
  isPending = false,
  onWithdrawalCancel,
}) => {
  // Pull wallet slice from Redux
  const { wallet } = useSelector((state) => state.user);

  // Live Console Logger
  useEffect(() => {
    if (isOpen) {
      console.log("🗂️ [WithdrawalModal] Live Redux Wallet Slice:", wallet);
    }
  }, [isOpen, wallet]);

  const [step, setStep] = useState(isPending ? "PENDING" : "AMOUNT");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [linkedAccounts, setLinkedAccounts] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState("");
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  const [timeLeft, setTimeLeft] = useState(86390);
  const pinInputsRef = useRef([]);
  const refreshWallet = useWalletRefresh();

  const toastConfig = {
    style: {
      zIndex: 999999,
    },
  };

  // Fetch linked accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!isOpen || isPending) return;
      setIsLoadingAccounts(true);
      try {
        const res = await getLinkedAccounts(token);
        if (res.success && res.linkedAccounts?.length > 0) {
          setLinkedAccounts(res.linkedAccounts);
          setSelectedBankId(res.linkedAccounts[0]._id);
        } else {
          toast.error("No linked bank accounts discovered.", toastConfig);
        }
      } catch (err) {
        console.error("Error fetching bank accounts:", err);
        toast.error(
          "Failed to load linked accounts. Please reload.",
          toastConfig,
        );
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [isOpen, token, isPending]);

  // Sync inputs
  useEffect(() => {
    if (!isOpen) {
      setPin(new Array(6).fill(""));
      setIsSubmitting(false);
    } else {
      setStep(isPending ? "PENDING" : "AMOUNT");
      if (dashboardAmount) {
        setAmount(dashboardAmount);
      }
    }
  }, [isOpen, isPending, dashboardAmount]);

  // Countdown runner
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

  const getRawNumericAmount = (val) => {
    return Number(val.toString().replace(/[^0-9.]/g, "")) || 0;
  };

  const getSelectedBankDetails = () => {
    return linkedAccounts.find((acc) => acc._id === selectedBankId);
  };

  const formatCountdown = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (!selectedBankId) {
      toast.error("Please select a bank account to proceed.", toastConfig);
      return;
    }

    const numericAmount = getRawNumericAmount(amount);

    // 🟢 FIXED: Using availableBalance directly from Redux payload
    const numericAvailableBalance = Number(wallet?.availableBalance) || 0;

    // 🛑 1. Entire Account Balance Check
    if (numericAvailableBalance < 1500) {
      toast.error(
        `Your available balance (₦${numericAvailableBalance.toLocaleString()}) must be at least ₦1,500 to withdraw.`,
        toastConfig,
      );
      return;
    }

    // 🛑 2. Minimum Request Limit Check
    if (numericAmount < 1500) {
      toast.error(
        "The minimum amount you can withdraw is ₦1,500.",
        toastConfig,
      );
      return;
    }

    // 🛑 3. Insufficient Funds Check
    if (numericAmount > numericAvailableBalance) {
      toast.error(
        `Insufficient funds. You cannot withdraw more than your available balance of ₦${numericAvailableBalance.toLocaleString()}.`,
        toastConfig,
      );
      return;
    }

    setStep("LOADING");
    setTimeout(() => {
      setStep("BREAKDOWN");
    }, 800);
  };

  const handlePinChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue) return;

    const updatedPin = [...pin];
    updatedPin[index] = cleanValue.substring(cleanValue.length - 1);
    setPin(updatedPin);

    if (index < 5 && pinInputsRef.current[index + 1]) {
      pinInputsRef.current[index + 1].focus();
    }
  };

  const handlePinKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const updatedPin = [...pin];
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

  const handleFinalSubmit = async () => {
    setStep("LOADING");
    setIsSubmitting(true);

    const pinString = pin.join("");
    const finalNumericAmount = getRawNumericAmount(amount);

    try {
      await confirmTransactionPin(userId, pinString, token);
      await withdrawFunds(finalNumericAmount, selectedBankId, token);
      await refreshWallet();

      toast.success("Payout initiated successfully!", toastConfig);
      setStep("SUCCESS");
      if (onWithdrawalSuccess) onWithdrawalSuccess();
    } catch (error) {
      console.error("Security/Withdrawal transmission fault:", error);
      const backendErrorMessage =
        error.response?.data?.message ||
        "Transaction verification failed. Please try again.";

      toast.error(backendErrorMessage, toastConfig);
      setPin(new Array(6).fill(""));
      setStep("PIN");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelWithdrawal = async () => {
    setStep("CANCEL_LOADING");
    try {
      setTimeout(async () => {
        await refreshWallet();
        toast.success("Withdrawal canceled successfully.", toastConfig);
        setStep("CANCEL_SUCCESS");
        if (onWithdrawalCancel) onWithdrawalCancel();
      }, 1500);
    } catch (error) {
      console.error("Cancellation infrastructure fault:", error);
      toast.error(
        "Failed to cancel withdrawal. Please try again.",
        toastConfig,
      );
      setStep("PENDING");
    }
  };

  const chosenBank = getSelectedBankDetails();
  const numericAmountValue = getRawNumericAmount(amount);
  const processingFee = 50;
  const totalPayoutValue =
    numericAmountValue > processingFee ? numericAmountValue - processingFee : 0;

  return (
    <div className="hn-modal-overlay">
      <div className="hn-modal-card">
        {/* STEP 1: AMOUNT CONFIG */}
        {step === "AMOUNT" && (
          <form onSubmit={handleAmountSubmit} className="hn-step-container">
            <h3 className="hn-modal-title hn-text-left">
              Make Withdrawal Request
            </h3>

            <div className="hn-input-group hn-margin-top-md">
              <label className="hn-input-label">
                Select Destination Bank Account
              </label>
              {isLoadingAccounts ? (
                <div
                  className="hn-text-input"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#888",
                  }}
                >
                  Loading linked accounts...
                </div>
              ) : (
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="hn-text-input"
                  style={{ width: "100%", background: "transparent" }}
                  required
                >
                  {linkedAccounts.length === 0 ? (
                    <option value="">No verified accounts found</option>
                  ) : (
                    linkedAccounts.map((acc) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.bankName} — {acc.accountNumber} ({acc.accountName})
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>

            <div className="hn-input-group hn-margin-top-md">
              <label className="hn-input-label">
                How much do you want to Withdraw? (₦)
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
                onClick={onClose}
                className="hn-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="hn-btn-primary"
                disabled={isLoadingAccounts || !selectedBankId}
              >
                Make Request
              </button>
            </div>
          </form>
        )}

        {/* LOADING PROCESSING INTERMEDIATES */}
        {(step === "LOADING" || step === "CANCEL_LOADING") && (
          <div className="hn-step-container hn-align-center hn-justify-center hn-py-xl">
            <div className="hn-loading-spinner"></div>
          </div>
        )}

        {/* STEP 2: DETAILS BREAKDOWN REVIEW */}
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
                    {chosenBank ? chosenBank.bankName : "Selected Bank"}
                  </p>
                  <p className="hn-val-sub">
                    {chosenBank ? chosenBank.accountNumber : "0000000000"}
                  </p>
                  <p
                    className="hn-val-sub"
                    style={{ fontSize: "12px", color: "#828282" }}
                  >
                    {chosenBank ? chosenBank.accountName : ""}
                  </p>
                </div>
              </div>

              <div className="hn-breakdown-row">
                <span className="hn-row-label">Gross Request Amount</span>
                <span className="hn-val-main">
                  ₦{numericAmountValue.toLocaleString()}
                </span>
              </div>

              <div className="hn-breakdown-row">
                <span className="hn-row-label">Processing Fee</span>
                <span className="hn-val-main">₦{processingFee}</span>
              </div>

              <div className="hn-divider"></div>

              <div className="hn-breakdown-row hn-font-total">
                <span className="hn-row-label">Net Take-Home Payout</span>
                <span className="hn-val-total">
                  ₦{totalPayoutValue.toLocaleString()}
                </span>
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

        {/* STEP 3: TRANSACTION AUTHORIZATION SECURITY GATEWAY */}
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
              Authorize Withdrawal
            </button>
          </div>
        )}

        {/* STEP 4: SUCCESS LAYOUT VIEW */}
        {step === "SUCCESS" && (
          <div className="hn-step-container hn-text-center">
            <div className="hn-success-celebration-icon">🎉</div>
            <h3 className="hn-modal-title hn-margin-top-sm">Request Sent!</h3>
            <p className="hn-modal-desc">
              Your withdrawal request has been captured cleanly and is now
              pending execution review.
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

        {/* STEP 5: ON-LOAD PENDING WATCHER STATE */}
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
              Your withdrawal execution pipeline is active. You can initiate
              supplementary transactions once cleared.
            </p>

            <div
              className="hn-breakdown-list hn-margin-top-md"
              style={{ textAlign: "left" }}
            >
              <div className="hn-breakdown-row">
                <span className="hn-row-label">Amount</span>
                <span className="hn-val-main">
                  ₦{numericAmountValue.toLocaleString()}
                </span>
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
              Made a mistake?{" "}
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

        {/* STEP 6: CANCELLATION OVERLAY INTERACTION */}
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

        {/* STEP 7: CANCELLATION CLOSURE PANEL */}
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
