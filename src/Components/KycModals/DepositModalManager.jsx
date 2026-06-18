import React, { useState } from "react";
import toast from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";

import { fundWallet } from "../../Services/paymentService";
import { useWalletRefresh } from "../../Hooks/useWalletRefresh";

import "../../Style/DepositModals.css";

const DepositModalManager = ({ isOpen, onClose, amount }) => {
  const [loading, setLoading] = useState(false);

  const refreshWallet = useWalletRefresh();

  if (!isOpen) return null;

 const handleProceed = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("authToken");

    const response = await fundWallet(Number(amount), token);

    console.log("Payment Init:", response);

    if (!response) {
      throw new Error("No response returned from payment API");
    }

    toast.success(response.message || "Redirecting...");

    if (response?.data?.checkout_url) {
      window.location.href = response.data.checkout_url;
    }
  } catch (error) {
    console.error(error);

    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Unable to initialize payment"
    );
  } finally {
    setLoading(false);
  }
};


return (

    <div className="deposit-modal-overlay" onClick={onClose}>
      <div
        className="deposit-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="deposit-modal-title">Fund Wallet</h2>

        <p className="deposit-modal-subtitle">
          You are about to fund your wallet with
        </p>

        <h1
          style={{
            textAlign: "center",
            margin: "20px 0",
            color:"black"
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "20px",
                  transform: "scale(0.5)",
                }}
              >
                <OrbitProgress color="#ffffff" size="small" />
              </div>
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
