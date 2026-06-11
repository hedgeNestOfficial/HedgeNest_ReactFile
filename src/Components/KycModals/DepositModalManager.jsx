import React, { useState, useEffect } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import "../../Style/DepositModals.css";

const DepositModalManager = ({ isOpen, onClose, amount }) => {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  // Account Information State Holder
  const [virtualAccount, setVirtualAccount] = useState({
    bankName: "Korapay Virtual Account",
    accountName: "Abayomi Jeremiah Elijah",
    accountNumber: "8742349789",
    processingFee: 75,
  });

  // Calculate transaction numbers safely
  const numericAmount = parseFloat(amount) || 0;
  const totalCharge = numericAmount + virtualAccount.processingFee;

  // Step 1: Simulate backend API initialization for the Virtual Account details
  useEffect(() => {
    if (isOpen && step === 1) {
      const initTimer = setTimeout(() => {
        setStep(2); // Automatically advance to account payload presentation
      }, 1800);
      return () => clearTimeout(initTimer);
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  // Handle Clipboard Interactions
  const handleCopy = () => {
    navigator.clipboard.writeText(virtualAccount.accountNumber);
    setCopied(true);
    toast.success("Account number copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Step 3: Trigger payment confirmation verification lookup
  const handleConfirmPayment = () => {
    setStep(3);
    // Simulate your settlement webhook ping delay
    setTimeout(() => {
      setStep(4);
    }, 3500);
  };

  const handleResetAndClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="deposit-modal-overlay">
      <div className="deposit-modal-content">
        {/* STEP 1: INITIAL LOADING CARRIER */}
        {step === 1 && (
          <div className="deposit-spinner-wrapper">
            <div className="deposit-ring-loader"></div>
            <p className="deposit-modal-subtitle" style={{ margin: 0 }}>
              Generating your secure deposit routing details...
            </p>
          </div>
        )}

        {/* STEP 2: DISPLAY PAYMENT ROUTING CREDENTIALS */}
        {step === 2 && (
          <>
            <h2 className="deposit-modal-title">Make A Transfer To...</h2>
            <p className="deposit-modal-subtitle">
              Transfer funds exactly into the allocated temporary virtual layout
              node listed below.
            </p>

            <div className="deposit-details-list">
              <div className="deposit-detail-row">
                <span className="deposit-label">Bank Name</span>
                <span className="deposit-value">{virtualAccount.bankName}</span>
              </div>

              <div className="deposit-detail-row">
                <span className="deposit-label">Account Name</span>
                <span className="deposit-value">
                  {virtualAccount.accountName}
                </span>
              </div>

              <div className="deposit-detail-row">
                <span className="deposit-label">Account Number</span>
                <span className="deposit-value">
                  {virtualAccount.accountNumber}
                  <button
                    type="button"
                    className="deposit-copy-btn"
                    onClick={handleCopy}
                    title="Copy Account Details"
                  >
                    {copied ? <FiCheck color="#10B981" /> : <FiCopy />}
                  </button>
                </span>
              </div>

              <div className="deposit-detail-row">
                <span className="deposit-label">Amount</span>
                <span className="deposit-value">
                  ₦{numericAmount.toLocaleString()}
                </span>
              </div>

              <div className="deposit-detail-row">
                <span className="deposit-label">Processing Fee</span>
                <span className="deposit-value">
                  ₦{virtualAccount.processingFee}
                </span>
              </div>

              <hr className="deposit-divider" />

              <div className="deposit-detail-row">
                <span className="deposit-label" style={{ fontWeight: "700" }}>
                  Total
                </span>
                <span className="deposit-value total-bold">
                  ₦{totalCharge.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="deposit-btn-group">
              <button
                type="button"
                className="deposit-btn deposit-btn-back"
                onClick={onClose}
              >
                Go Back
              </button>
              <button
                type="button"
                className="deposit-btn deposit-btn-primary"
                onClick={handleConfirmPayment}
              >
                I Have Paid
              </button>
            </div>
          </>
        )}

        {/* STEP 3: TRANSACTION PROCESSING WAIT STAGE */}
        {step === 3 && (
          <div className="deposit-spinner-wrapper">
            <h2 className="deposit-modal-title">Deposit From Bank</h2>
            <div className="deposit-ring-loader"></div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                margin: "0 0 4px 0",
                color: "#111827",
              }}
            >
              Processing Your Deposit...
            </h3>
            <p className="deposit-modal-subtitle" style={{ margin: 0 }}>
              Please wait, do not close this window.
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESS CONGRATULATIONS PANEL */}
        {step === 4 && (
          <>
            <div className="deposit-success-graphic">🎉</div>
            <h2 className="deposit-modal-title">Deposit Successful!</h2>
            <p className="deposit-modal-subtitle">
              <strong>₦{numericAmount.toLocaleString()}</strong> has been
              credited to your NGN Balance.
            </p>

            <div className="deposit-btn-group">
              <button
                type="button"
                className="deposit-btn deposit-btn-primary"
                onClick={handleResetAndClose}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DepositModalManager;
