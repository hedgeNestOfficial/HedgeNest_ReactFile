import React, { useEffect, useState } from "react";
import "../../Style/LinkAccountModal.css";
import { BiParty } from "react-icons/bi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { linkBankAccount } from "../../Services/accountService";

const LinkAccountModal = ({ isOpen, onClose, onSuccessRefresh }) => {
  const { token } = useSelector((state) => state.user);

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [bankName, setBankName] = useState("");

  const [accountName, setAccountName] = useState("");

  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setBankName("");
      setAccountName("");
      setAccountNumber("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bankName.trim()) {
      return toast.error("Please select a bank");
    }

    if (!accountName.trim()) {
      return toast.error("Enter account name");
    }

    if (accountNumber.length !== 10) {
      return toast.error("Account number must be 10 digits");
    }

    try {
      setLoading(true);

      const response = await linkBankAccount(
        {
          bankName,
          accountName,
          accountNumber,
        },
        token || localStorage.getItem("authToken"),
      );

      toast.success(response?.message || "Account linked successfully");

      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to link account");
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

            <div className="link-account-input-group">
              <label className="link-account-input-label">Account Name</label>

              <input
                type="text"
                className="link-account-custom-input"
                placeholder="Enter account name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>

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
