import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "../Style/PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-success-page">
      <div className="payment-success-card">
        <div className="payment-success-icon-wrapper">
          <FaCheckCircle className="payment-success-icon" />
        </div>

        <h1 className="payment-success-title">Payment Initiated!</h1>

        <p className="payment-success-message">
          Your deposit is successful. Your wallet balance will be updated
          automatically once the network confirms the transaction.
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
