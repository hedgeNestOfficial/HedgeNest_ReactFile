// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { FaCheckCircle } from "react-icons/fa"; // Importing the clean verification check icon
// import "../Style/PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="payment-success-page">
//       <div className="payment-success-card">
//         <div className="payment-success-icon-wrapper">
//           <FaCheckCircle className="payment-success-icon" />
//         </div>

//         <h1 className="payment-success-title">Payment Received</h1>

//         <p className="payment-success-message">
//           Your payment is being verified. Your wallet will be updated shortly.
//         </p>

//         <button
//           className="payment-success-btn"
//           onClick={() => navigate("/dashboard")}
//         >
//           Go to Dashboard
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import { verifyPayment } from "../Services/paymentService";

import "../Style/PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const token = useSelector((state) => state.user.token);

  const [searchParams] = useSearchParams();

  const reference = searchParams.get("reference");

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (!reference) {
          throw new Error("Reference not found");
        }

        const response = await verifyPayment(reference, token);

        setVerified(true);

        setMessage(response.message);

        toast.success(response.message);
      } catch (error) {
        setVerified(false);

        setMessage(
          error?.response?.data?.message || "Payment verification failed",
        );

        toast.error(
          error?.response?.data?.message || "Payment verification failed",
        );
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [reference, token]);
  window.location.href = "/dashboard";

  return (
    <div className="payment-success-page">
      <div className="payment-success-card">
        {loading ? (
          <>
            <h1>Verifying Payment...</h1>
            <p>Please wait...</p>
          </>
        ) : verified ? (
          <>
            <div className="payment-success-icon-wrapper">
              <FaCheckCircle className="payment-success-icon" />
            </div>

            <h1 className="payment-success-title">Payment Received</h1>

            <p className="payment-success-message">{message}</p>

            <button
              className="payment-success-btn"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          </>
        ) : (
          <>
            <h1 className="payment-success-title">
              Payment Verification Failed
            </h1>

            <p className="payment-success-message">{message}</p>

            <button
              className="payment-success-btn"
              onClick={() => navigate("/dashboard")}
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
