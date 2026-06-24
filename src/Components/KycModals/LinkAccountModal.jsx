import React, { useEffect, useState, useRef } from "react";
import "../../Style/LinkAccountModal.css";
import { BiParty } from "react-icons/bi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import {
  linkBankAccount,
  confirmTransactionPin,
  getLinkedAccounts,
} from "../../Services/AccountService";

const LinkAccountModal = ({ isOpen, onClose, onSuccessRefresh }) => {
  const { token, user } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [pinBoxes, setPinBoxes] = useState(Array(6).fill(""));
  const pinRefs = useRef([]);

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
      pinRefs.current[index + 1].focus();
    }
  };

  const handlePinKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!pinBoxes[index] && index > 0) {
        const newPinBoxes = [...pinBoxes];
        newPinBoxes[index - 1] = "";
        setPinBoxes(newPinBoxes);
        pinRefs.current[index - 1].focus();
      }
    }
  };

  const handlePinPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData) {
      const newPinBoxes = Array(6).fill("");
      pastedData.split("").forEach((char, idx) => {
        if (idx < 6) newPinBoxes[idx] = char;
      });
      setPinBoxes(newPinBoxes);

      const focusTarget = pastedData.length === 6 ? 5 : pastedData.length;
      pinRefs.current[focusTarget]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bankName.trim()) {
      return toast.error("Please select a bank");
    }

    if (accountNumber.length !== 10) {
      return toast.error("Account number must be 10 digits");
    }

    const finalPin = pinBoxes.join("");
    if (finalPin.length !== 6) {
      return toast.error("Please enter your complete 6-digit transaction PIN");
    }

    const userId = user?._id || user?.id || user?.data?._id || user?.data?.id;
    const activeToken = token || localStorage.getItem("authToken");

    if (!userId) {
      return toast.error("User identity profile missing. Please log in again.");
    }

    try {
      setLoading(true);

      // Gracefully catch new accounts lacking dynamic sub-records
      try {
        const accountsResponse = await getLinkedAccounts(activeToken);
        const accountsArray = accountsResponse?.linkedAccounts || [];
        
        if (accountsArray.length >= 1) {
          setLoading(false);
          return toast.error("You already have a linked account.");
        }
      } catch (checkError) {
        const status = checkError?.response?.status;
        if (status && status !== 404) {
          throw checkError; 
        }
      }

      // 1. Verify Security PIN via explicit body payload mapping
      await confirmTransactionPin(userId, finalPin, activeToken);

      // 2. Link Bank Account (excluding structural metadata profiles)
      const response = await linkBankAccount(
        {
          bankName,
          accountNumber,
        },
        activeToken,
      );

      toast.success(response?.message || "Account linked successfully");
      setStep(2);
    } catch (error) {
      console.error("Workflow tracking error context:", error);
      
      const rawServerMessage = error?.response?.data?.message || error?.response?.data?.error || "";
      
      // 🟢 Catch explicit bcrypt configuration omissions from the database collections
      if (rawServerMessage.includes("data and hash arguments required")) {
        toast.error("This test user account has no transaction PIN configured. Create a PIN in settings first.");
      } else {
        toast.error(rawServerMessage || error?.message || "Internal Server Error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onSuccessRefresh) {
      onSuccessRefresh();
    }
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
              </select>
            </div>

            {/* Account Number Input */}
            <div className="link-account-input-group">
              <label className="link-account-input-label">Account Number</label>
              <input
                type="text"
                maxLength={10}
                className="link-account-custom-input"
                placeholder="Enter account number"
                value={accountNumber}
                onChange={(e) =>
                  setAccountNumber(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            {/* PIN Row */}
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
                    maxLength={2}
                    value={digit}
                    ref={(el) => (pinRefs.current[index] = el)}
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

            {/* Interface CTAs */}
            <div className="link-account-actions-row">
              <button
                type="button"
                className="link-account-btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="link-account-btn-solid"
                disabled={loading}
              >
                {loading ? "Checking..." : "Link Account"}
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