import React, { useState } from "react";
import toast from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";
import { fundWallet } from "../../Services/paymentService";

const DepositModalManager = ({ isOpen, onClose, amount }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleProceed = async () => {
    try {
      const token = localStorage.getItem("authToken");

      setLoading(true);

      const response = await fundWallet(
        Number(amount),
        token
      );

      toast.success(
        response?.message || "Redirecting..."
      );

      window.location.href =
        response?.data?.checkout_url;
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to initialize payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="deposit-modal-overlay"
      onClick={onClose}
    >
      <div
        className="deposit-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="deposit-modal-title">
          Fund Wallet
        </h2>

        <p className="deposit-modal-subtitle">
          You are about to fund your wallet with
        </p>

        <h1
          style={{
            textAlign: "center",
            margin: "20px 0",
          }}
        >
          ₦{Number(amount).toLocaleString()}
        </h1>

        <div className="deposit-btn-group">
          <button
            className="deposit-btn deposit-btn-back"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="deposit-btn deposit-btn-primary"
            onClick={handleProceed}
            disabled={loading}
          >
            {loading ? (
              <OrbitProgress
                color="#fff"
                size="small"
              />
            ) : (
              "Proceed To Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModalManager;