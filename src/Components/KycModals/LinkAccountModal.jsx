import React, { useEffect, useRef, useState } from "react";
import "../../Style/LinkAccountModal.css";
import { BiParty } from "react-icons/bi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import {
  linkBankAccount,
  confirmTransactionPin,
} from "../../Services/AccountService";

const PIN_LENGTH = 6;
const ACCOUNT_NUMBER_LENGTH = 10;

const LinkAccountModal = ({ isOpen, onClose, onSuccessRefresh }) => {
  const { token, user } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [pinBoxes, setPinBoxes] = useState(Array(PIN_LENGTH).fill(""));

  const [backendSuccessMessage, setBackendSuccessMessage] = useState("");

  const pinRefs = useRef([]);

  const finalPin = pinBoxes.join("");

  /**
   * Resolve the authenticated user's name from Redux.
   *
   * We support the user shapes already used in this project
   * without adding another API request or another source of truth.
   *
   * Once resolved, the value is normalized before being sent
   * to the backend.
   */
  const getReduxAccountName = () => {
    const rawName =
      user?.fullName ||
      user?.name ||
      user?.data?.fullName ||
      user?.data?.name ||
      [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
      [user?.data?.firstName, user?.data?.lastName].filter(Boolean).join(" ");

    return rawName ? rawName.replace(/[^a-zA-Z]/g, "") : "";
  };

  const accountName = getReduxAccountName();

  /**
   * Frontend validation is limited to input shape/presence.
   * Backend remains the authority for business rules.
   */
  const isFormInvalid =
    !bankName.trim() ||
    !accountName ||
    accountNumber.length !== ACCOUNT_NUMBER_LENGTH ||
    finalPin.length !== PIN_LENGTH;

  useEffect(() => {
    if (!isOpen) return;

    setStep(1);
    setLoading(false);
    setBankName("");
    setAccountNumber("");
    setPinBoxes(Array(PIN_LENGTH).fill(""));
    setBackendSuccessMessage("");

    pinRefs.current = [];
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinChange = (value, index) => {
    const cleanValue = value.replace(/\D/g, "");

    if (!cleanValue) {
      setPinBoxes((current) => {
        const updated = [...current];
        updated[index] = "";
        return updated;
      });

      return;
    }

    const lastDigit = cleanValue.slice(-1);

    setPinBoxes((current) => {
      const updated = [...current];
      updated[index] = lastDigit;
      return updated;
    });

    if (index < PIN_LENGTH - 1) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (event, index) => {
    if (event.key !== "Backspace") return;

    if (pinBoxes[index]) {
      setPinBoxes((current) => {
        const updated = [...current];
        updated[index] = "";
        return updated;
      });

      return;
    }

    if (index > 0) {
      setPinBoxes((current) => {
        const updated = [...current];
        updated[index - 1] = "";
        return updated;
      });

      pinRefs.current[index - 1]?.focus();
    }
  };

  const handlePinPaste = (event) => {
    event.preventDefault();

    const pastedData = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, PIN_LENGTH);

    if (!pastedData) return;

    const newPinBoxes = Array(PIN_LENGTH).fill("");

    pastedData.split("").forEach((digit, index) => {
      newPinBoxes[index] = digit;
    });

    setPinBoxes(newPinBoxes);

    const focusTarget =
      pastedData.length === PIN_LENGTH ? PIN_LENGTH - 1 : pastedData.length;

    pinRefs.current[focusTarget]?.focus();
  };

  const handleAccountNumberChange = (event) => {
    /**
     * Account number:
     * - digits only
     * - maximum 10 digits
     * - minimum 10 digits before submission
     */
    const numericValue = event.target.value
      .replace(/\D/g, "")
      .slice(0, ACCOUNT_NUMBER_LENGTH);

    setAccountNumber(numericValue);
  };

  const validateForm = () => {
    if (!bankName.trim()) {
      toast.error("Please select a bank.");
      return false;
    }

    if (!accountName) {
      toast.error(
        "Your account name could not be loaded. Please log in again.",
      );
      return false;
    }

    if (accountNumber.length !== ACCOUNT_NUMBER_LENGTH) {
      toast.error("Account number must be exactly 10 digits.");
      return false;
    }

    if (finalPin.length !== PIN_LENGTH) {
      toast.error("Please enter your complete 6-digit transaction PIN.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!validateForm()) return;

    const userId = user?._id || user?.id || user?.data?._id || user?.data?.id;

    const activeToken = token || localStorage.getItem("authToken");

    if (!userId || !activeToken) {
      toast.error("Your session has expired. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      /**
       * STEP 1
       *
       * Transaction PIN confirmation is handled by the backend.
       */
      await confirmTransactionPin(userId, finalPin, activeToken);

      /**
       * STEP 2
       *
       * Send the exact backend payload.
       *
       * accountName comes from Redux and has already been
       * normalized to remove spaces and special characters.
       */
      const response = await linkBankAccount(
        {
          bankName: bankName.trim(),
          accountNumber,
          accountName,
        },
        activeToken,
      );

      /**
       * Do not invent or manually manufacture a backend result.
       * Use the response returned by the backend.
       */
      setBackendSuccessMessage(response?.message || "");
      setStep(2);
    } catch (error) {
      console.error("Link withdrawal account error:", error);

      /**
       * Backend response remains the authority for errors.
       */
      const backendMessage =
        error?.response?.data?.message || error?.response?.data?.error;

      if (backendMessage) {
        toast.error(backendMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (step === 2) {
      onSuccessRefresh?.();
    }

    onClose?.();
  };

  return (
    <div className="link-account-modal-overlay" onClick={handleClose}>
      <div
        className="link-account-modal-card"
        onClick={(event) => event.stopPropagation()}
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
                onChange={(event) => setBankName(event.target.value)}
                disabled={loading}
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
                maxLength={ACCOUNT_NUMBER_LENGTH}
                className="link-account-custom-input"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                disabled={loading}
                autoComplete="off"
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
                    maxLength={1}
                    value={digit}
                    ref={(element) => {
                      pinRefs.current[index] = element;
                    }}
                    onChange={(event) =>
                      handlePinChange(event.target.value, index)
                    }
                    onKeyDown={(event) => handlePinKeyDown(event, index)}
                    onPaste={handlePinPaste}
                    disabled={loading}
                    autoComplete="off"
                    aria-label={`Transaction PIN digit ${index + 1}`}
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

            {/* Interface CTAs */}
            <div className="link-account-actions-row">
              <button
                type="button"
                className="link-account-btn-outline"
                onClick={handleClose}
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
              {backendSuccessMessage}
            </p>

            <button
              type="button"
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
