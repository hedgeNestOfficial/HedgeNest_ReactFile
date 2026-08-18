import React, { useEffect, useRef, useState } from "react";
import "../../Style/LinkAccountModal.css";
import { BiParty } from "react-icons/bi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import {
  linkBankAccount,
  confirmTransactionPin,
} from "../../Services/AccountService";

const LinkAccountModal = ({ isOpen, onClose, onSuccessRefresh }) => {
  const { token, user } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [pinBoxes, setPinBoxes] = useState(Array(6).fill(""));
  const pinRefs = useRef([]);

  // Current transaction PIN
  const finalPin = pinBoxes.join("");

  // Form validation
  const isFormInvalid =
    !bankName.trim() || accountNumber.length !== 10 || finalPin.length !== 6;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBankName("");
      setAccountNumber("");
      setPinBoxes(Array(6).fill(""));
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ------------------------------------------------------------
  // Resolve authenticated user's account name from Redux
  // ------------------------------------------------------------
  const getAccountName = () => {
    const firstName = user?.firstName || user?.data?.firstName || "";

    const lastName = user?.lastName || user?.data?.lastName || "";

    const fullName =
      user?.name ||
      user?.fullName ||
      user?.data?.name ||
      user?.data?.fullName ||
      "";

    if (fullName.trim()) {
      return fullName.trim();
    }

    return `${firstName} ${lastName}`.trim();
  };

  // ------------------------------------------------------------
  // PIN input
  // ------------------------------------------------------------
  const handlePinChange = (value, index) => {
    const cleanValue = value.replace(/\D/g, "");

    if (!cleanValue) {
      const newPinBoxes = [...pinBoxes];
      newPinBoxes[index] = "";
      setPinBoxes(newPinBoxes);
      return;
    }

    const lastChar = cleanValue.slice(-1);

    const newPinBoxes = [...pinBoxes];
    newPinBoxes[index] = lastChar;
    setPinBoxes(newPinBoxes);

    if (index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  // ------------------------------------------------------------
  // PIN keyboard navigation
  // ------------------------------------------------------------
  const handlePinKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pinBoxes[index] && index > 0) {
      const newPinBoxes = [...pinBoxes];

      newPinBoxes[index - 1] = "";

      setPinBoxes(newPinBoxes);

      pinRefs.current[index - 1]?.focus();
    }
  };

  // ------------------------------------------------------------
  // PIN paste
  // ------------------------------------------------------------
  const handlePinPaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newPinBoxes = Array(6).fill("");

    pastedData.split("").forEach((char, index) => {
      if (index < 6) {
        newPinBoxes[index] = char;
      }
    });

    setPinBoxes(newPinBoxes);

    const focusTarget = pastedData.length >= 6 ? 5 : pastedData.length;

    pinRefs.current[focusTarget]?.focus();
  };

  // ------------------------------------------------------------
  // Main workflow
  // ------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!bankName.trim()) {
      return toast.error("Please select a bank");
    }

    if (accountNumber.length !== 10) {
      return toast.error("Account number must be 10 digits");
    }

    if (finalPin.length !== 6) {
      return toast.error("Please enter your complete 6-digit transaction PIN");
    }

    const userId = user?._id || user?.id || user?.data?._id || user?.data?.id;

    const activeToken = token || localStorage.getItem("authToken");

    if (!userId || !activeToken) {
      return toast.error(
        "Your session could not be verified. Please log in again.",
      );
    }

    const rawAccountName = getAccountName();

    const accountName = rawAccountName.trim().replace(/[^a-zA-Z]/g, "");

    if (!accountName) {
      return toast.error(
        "Your account name could not be determined from your profile.",
      );
    }

    try {
      setLoading(true);

      // --------------------------------------------------------
      // STEP 1: Verify authenticated user's transaction PIN
      // --------------------------------------------------------
      await confirmTransactionPin(userId, finalPin, activeToken);

      // --------------------------------------------------------
      // STEP 2: Link withdrawal account
      // --------------------------------------------------------
      const payload = {
        accountName,
        bankName,
        accountNumber,
      };

      const response = await linkBankAccount(payload, activeToken);

      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------
      toast.success(response?.message || "Account linked successfully");

      setStep(2);

      onSuccessRefresh?.();
    } catch (error) {
      // --------------------------------------------------------
      // BACKEND ERROR ONLY
      // --------------------------------------------------------
      const backendMessage =
        error?.response?.data?.message || error?.response?.data?.error;

      toast.error(
        backendMessage || "Unable to complete the account linking request.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Close modal
  // ------------------------------------------------------------
  const handleClose = () => {
    onSuccessRefresh?.();
    onClose();
  };

  return (
    <div className="link-account-modal-overlay" onClick={onClose}>
      <div
        className="link-account-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 && (
          <form onSubmit={handleSubmit} className="link-account-step-wrapper">
            <h2 className="link-account-modal-title">
              Link Withdrawal Account
            </h2>

            {/* Bank Selection */}
            <div className="link-account-input-group">
              <label className="link-account-input-label">Bank</label>

              <select
                className="link-account-custom-input"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              >
                <option value="">Select Bank</option>

                <option value="sterling">Sterling Bank</option>

                <option value="access">Access Bank</option>

                <option value="gtbank">GTBank</option>

                <option value="zenith">Zenith Bank</option>

                <option value="firstbank">First Bank</option>

                <option value="fcmb">FCMB</option>

                <option value="union">Union Bank</option>

                <option value="polaris">Polaris Bank</option>

                <option value="uba">UBA Bank</option>
              </select>
            </div>

            {/* Account Number */}
            <div className="link-account-input-group">
              <label className="link-account-input-label">Account Number</label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                className="link-account-custom-input"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            {/* Transaction PIN */}
            <div className="link-account-input-group">
              <label className="link-account-input-label">
                Transaction PIN
              </label>

              <div
                className="link-account-pin-row"
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "space-between",
                  marginTop: "4px",
                }}
              >
                {pinBoxes.map((digit, index) => (
                  <input
                    key={index}
                    type="password"
                    inputMode="numeric"
                    maxLength={2}
                    value={digit}
                    ref={(el) => {
                      pinRefs.current[index] = el;
                    }}
                    onChange={(e) => handlePinChange(e.target.value, index)}
                    onKeyDown={(e) => handlePinKeyDown(e, index)}
                    onPaste={handlePinPaste}
                    style={{
                      width: "44px",
                      height: "44px",
                      textAlign: "center",
                      fontSize: "18px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      background: "#f9fafb",
                    }}
                    className="link-account-pin-box"
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="link-account-actions-row">
              <button
                type="button"
                className="link-account-btn-outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="link-account-btn-solid"
                disabled={loading || isFormInvalid}
                style={{
                  opacity: loading || isFormInvalid ? 0.6 : 1,

                  cursor: loading || isFormInvalid ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Linking..." : "Link Account"}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="link-account-step-wrapper text-center">
            <div className="link-account-celebration-container">
              <BiParty className="link-account-party-icon" />
            </div>

            <h2 className="link-account-modal-title">Success!</h2>

            <p className="link-account-modal-subtitle">
              Your withdrawal account has been linked successfully.
            </p>

            <button
              className="link-account-btn-solid width-full"
              onClick={handleClose}
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
