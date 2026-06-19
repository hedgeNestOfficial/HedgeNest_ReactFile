import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

import { useWalletRefresh } from "../Hooks/useWalletRefresh";

import "../Style/PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const refreshWallet = useWalletRefresh();

  useEffect(() => {
    const syncWallet = async () => {
      try {
        // First refresh immediately
        await refreshWallet();

        // Refresh again after a short delay
        // gives backend webhook enough time to update balance
        setTimeout(async () => {
          await refreshWallet();
        }, 5000);
      } catch (error) {
        console.log("Wallet refresh failed:", error);
      }
    };

    syncWallet();

    toast.success("Payment successful");
  }, [refreshWallet]);

  return (
    <div className="payment-success-page">
      <div className="payment-success-card">
        <div className="payment-success-icon-wrapper">
          <FaCheckCircle className="payment-success-icon" />
        </div>

        <h1 className="payment-success-title">Payment Successful</h1>

        <p className="payment-success-message">
          Your deposit was received successfully. Your wallet balance is being
          updated automatically.
        </p>

        <button
          className="payment-success-btn"
          onClick={() => navigate("/dashboard")}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
