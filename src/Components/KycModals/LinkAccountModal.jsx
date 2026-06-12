import React, { useState, useEffect } from "react";
import "../../Style/LinkAccountModal.css";
import { FiCopy, FiCheckCircle, FiChevronDown } from "react-icons/fi";
import { BiParty } from "react-icons/bi";
import toast from "react-hot-toast";

const LinkAccountModal = ({ isOpen, onClose, onSuccessRefresh }) => {
  if (!isOpen) return null;

  // Step state tracker mapping directly to Figma views:
  // 1: Input Form, 2: Verification Loader, 3: Verified Status, 4: Confirmation Fee, 5: Payment Processing Loader, 6: Success
  const [step, setStep] = useState(1);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [verifiedName, setVerifiedName] = useState("Abayomi Jeremiah Elijah");

  // Reset modal state on close/open toggle
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBankName("");
      setAccountNumber("");
    }
  }, [isOpen]);

  const handleInitialVerify = (e) => {
    e.preventDefault();
    if (!bankName || accountNumber.length !== 10) {
      toast.error("Please enter a valid Bank and 10-digit Account Number");
      return;
    }

    // Transition to Loading Screen (image_d9e0f1.png)
    setStep(2);

    // Simulate API Verification Call
    setTimeout(() => {
      setStep(3); // Go to Verified State (image_d9e12e.png)
    }, 2000);
  };

  const handleConfirmContinue = () => {
    setStep(4); // Go to Confirmation Fee Info (image_d9de26.png)
  };

  const handlePaymentSubmitted = () => {
    // Transition to Processing Payment Loader (image_d9dde8.png)
    setStep(5);

    // Simulate Backend Webhook Validation Wait
    setTimeout(() => {
      setStep(6); // Go to Final Success View (image_d9ddc7.png)
    }, 2500);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Account number copied to clipboard!");
  };

  const handleCloseFinalFlow = () => {
    if (onSuccessRefresh) onSuccessRefresh();
    onClose();
  };

  return (
    <div className="link-account-modal-overlay" onClick={onClose}>
      <div
        className={`link-account-modal-card ${step === 2 || step === 5 ? "loading-card-dims" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* STEP 1: INITIAL INPUT FORM (image_da3745.png) */}
        {step === 1 && (
          <form
            onSubmit={handleInitialVerify}
            className="link-account-step-wrapper"
          >
            <h2 className="link-account-modal-title">
              Link Withdrawal Account
            </h2>

            <div className="link-account-input-group">
              <label className="link-account-input-label">Bank</label>
              <div className="link-account-select-wrapper">
                <select
                  className="link-account-custom-select"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>
                    Enter Bank name
                  </option>
                  <option value="Sterling Bank">Sterling Bank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="GTBank">Guaranty Trust Bank</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                </select>
                <FiChevronDown className="link-account-select-chevron" />
              </div>
            </div>

            <div className="link-account-input-group">
              <label className="link-account-input-label">Account Number</label>
              <input
                type="text"
                maxLength={10}
                className="link-account-custom-input"
                placeholder="Enter 10 digits account number"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value.replace(/\D/g, ""))
                }
                required
              />
            </div>

            <div className="link-account-actions-row">
              <button
                type="button"
                className="link-account-btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="link-account-btn-solid">
                Verify
              </button>
            </div>
          </form>
        )}

        {/* STEP 2 & STEP 5: SPINNING LOADING STATES (image_d9e0f1.png / image_d9dde8.png) */}
        {(step === 2 || step === 5) && (
          <div className="link-account-loader-container">
            <div className="link-account-spinner"></div>
          </div>
        )}

        {/* STEP 3: ACCOUNT VERIFIED STATUS (image_d9e12e.png) */}
        {step === 3 && (
          <div className="link-account-step-wrapper">
            <h2 className="link-account-modal-title">
              Link Withdrawal Account
            </h2>

            <div className="link-account-input-group">
              <label className="link-account-input-label">Bank</label>
              <input
                type="text"
                className="link-account-custom-input"
                value={bankName}
                disabled
              />
            </div>

            <div className="link-account-input-group">
              <label className="link-account-input-label">Account Number</label>
              <input
                type="text"
                className="link-account-custom-input"
                value={accountNumber}
                disabled
              />
            </div>

            <div className="link-account-verified-banner">
              <FiCheckCircle className="link-account-verified-icon" />
              <div className="link-account-verified-details">
                <span className="link-account-verified-status-text">
                  Account Verified
                </span>
                <span className="link-account-verified-user-name">
                  {verifiedName}
                </span>
              </div>
            </div>

            <div className="link-account-actions-row">
              <button
                type="button"
                className="link-account-btn-outline"
                onClick={() => setStep(1)}
              >
                Not Me
              </button>
              <button
                type="button"
                className="link-account-btn-solid"
                onClick={handleConfirmContinue}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: MICRO-TRANSACTION CONFIRMATION FEE SCREEN (image_d9de26.png) */}
        {step === 4 && (
          <div className="link-account-step-wrapper">
            <h2 className="link-account-modal-title">Confirmation Fee</h2>
            <p className="link-account-modal-subtitle">
              Transfer N50 to the account below to confirm that this account
              belongs to you
            </p>

            <div className="link-account-data-table">
              <div className="link-account-table-row">
                <span className="link-account-label-text">Fee</span>
                <span className="link-account-value-text text-bold">N50</span>
              </div>
              <div className="link-account-table-row">
                <span className="link-account-label-text">Bank</span>
                <span className="link-account-value-text">Sterling Bank</span>
              </div>
              <div className="link-account-table-row">
                <span className="link-account-label-text">Account Number</span>
                <div className="link-account-copyable-value">
                  <span className="link-account-value-text">0921884884</span>
                  <button
                    type="button"
                    className="link-account-copy-icon-btn"
                    onClick={() => handleCopyToClipboard("0921884884")}
                    title="Copy Account Number"
                  >
                    <FiCopy />
                  </button>
                </div>
              </div>
              <div className="link-account-table-row">
                <span className="link-account-label-text">
                  Destination Bank
                </span>
                <span className="link-account-value-text">Korapay</span>
              </div>
            </div>

            <div className="link-account-actions-row">
              <button
                type="button"
                className="link-account-btn-outline"
                onClick={() => setStep(3)}
              >
                Go Back
              </button>
              <button
                type="button"
                className="link-account-btn-solid"
                onClick={handlePaymentSubmitted}
              >
                I Have Paid
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: COMPLETION SUCCESS VIEW (image_d9ddc7.png) */}
        {step === 6 && (
          <div className="link-account-step-wrapper text-center">
            <div className="link-account-celebration-container">
              <BiParty className="link-account-party-icon" />
            </div>

            <h2 className="link-account-modal-title margin-top-sm">
              Almost There!
            </h2>
            <p className="link-account-modal-subtitle width-narrow">
              We'll confirm your payment and bank linking status within 4 hours
            </p>

            <button
              type="button"
              className="link-account-btn-solid width-full margin-top-md"
              onClick={handleCloseFinalFlow}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkAccountModal;
