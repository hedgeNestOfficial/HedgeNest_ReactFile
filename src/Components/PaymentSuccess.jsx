import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useWalletRefresh } from "../Hooks/useWalletRefresh";

// import { useWalletRefresh } from "../Hooks/useWalletRefresh";
import "../Style/PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const refreshWallet = useWalletRefresh();

  useEffect(() => {
    const syncWallet = async () => {
      try {
        // Fires immediately when the component mounts onto the screen
        await refreshWallet();
      } catch (error) {
        console.error("Wallet refresh failed on mount:", error);
      }
    };

    syncWallet();
    toast.success("Payment successful");

    /*
    |--------------------------------------------------------------------------
    | ⚡ THE MOUNT LOCK
    |--------------------------------------------------------------------------
    | The empty array below guarantees that this entire block executes 
    | EXACTLY ONCE. No matter how many times your global wallet balance updates 
    | or how many re-renders happen, it will NEVER re-trigger.
    */
  }, []);

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
          type="button"
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
