// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { useSelector } from "react-redux";
// import { FiArrowLeft } from "react-icons/fi";
// import { HiOutlineShieldCheck } from "react-icons/hi";
// import toast from "react-hot-toast";
// import {
//   initiateInvestment,
//   confirmTransactionPin,
// } from "../../Services/investmentService";
// import "../../Style/InvestModal.css";
// import investAni from "../../assets/investAni.gif";

// const InvestModal = ({ isOpen, onClose, product, onSuccess }) => {
//   const [step, setStep] = useState(1);
//   const [amount, setAmount] = useState("");
//   const [pin, setPin] = useState(["", "", "", "", "", ""]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [riskTerm, setRiskTerm] = useState(null);

//   const pinRefs = useRef([]);
//   const modalRef = useRef(null);

//   const { user, token } = useSelector((state) => state.user);

//   useEffect(() => {
//     if (isOpen) {
//       setStep(1);
//       setAmount("");
//       setPin(["", "", "", "", "", ""]);
//       setIsLoading(false);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener("mousedown", handleOutsideClick);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, [isOpen, onClose]);

//   const normalizedPlan = useMemo(() => {
//     if (!product) return null;

//     const isNestedObject =
//       product.investmentPlanId && typeof product.investmentPlanId === "object";
//     const datasource = isNestedObject ? product.investmentPlanId : product;

//     const planId = isNestedObject
//       ? product.investmentPlanId._id || product.investmentPlanId.id
//       : product.investmentPlanId || product._id || product.id;

//     return {
//       id: planId,
//       name: datasource?.investmentName || "Investment Plan",
//       roi: Number(datasource?.roi || product?.roi || 0),
//       term: Number(datasource?.term || product?.term || 0),
//       minAmount: Number(datasource?.minAmount || product?.minAmount || 0),
//       investmentType: (
//         datasource?.investmentType ||
//         product?.investmentType ||
//         "Low"
//       ).toLowerCase(),
//     };
//   }, [product]);

//   const getInvestmentTypeMessage = useMemo(() => {
//     if (!normalizedPlan) return "";

//     const isMedium = normalizedPlan.investmentType === "medium";

//     if (isMedium) {
//       return "Your money is been invested in Balanced Mutual Funds, Dividend Stocks, Real Estate, Government Bonds with moderate market volatility and high potential returns";
//     }

//     return "Your money is invested in Treasury Bills, FGN Savings Bonds, Fixed Deposits, and Money Market Mutual Funds with a 100% guarantee on safe investment returns.";
//   }, [normalizedPlan]);

//   const getRiskDescription = useMemo(() => {
//     if (!normalizedPlan) return "";

//     const isMedium = normalizedPlan.investmentType === "medium";

//     if (isMedium) {
//       return `Capital-growth ${normalizedPlan.term}-day balanced portfolio note. Suitable for investors comfortable with moderate risk exposure.`;
//     }

//     return `Capital-protected ${normalizedPlan.term}-day fixed income note. Ideal for first-time investors.`;
//   }, [normalizedPlan]);

//   const investmentAmount = Number(amount) || 0;

//   const isAmountInvalid =
//     !amount || investmentAmount < (normalizedPlan?.minAmount || 0);

//   const expectedReturn = useMemo(() => {
//     if (!normalizedPlan || investmentAmount <= 0) return "0.00";
//     const { roi, term } = normalizedPlan;
//     const interest = investmentAmount * (roi / 100) * (term / 365);
//     return (investmentAmount + interest).toFixed(2);
//   }, [investmentAmount, normalizedPlan]);

//   if (!isOpen || !product || !normalizedPlan) return null;

//   const handleAmountSubmit = (e) => {
//     e.preventDefault();

//     if (investmentAmount <= 0) {
//       toast.error("Please enter a valid investment amount");
//       return;
//     }

//     if (investmentAmount < normalizedPlan.minAmount) {
//       toast.error(
//         `Minimum investment is ₦${normalizedPlan.minAmount.toLocaleString()}`,
//       );
//       return;
//     }

//     setStep(2);
//   };

//   const handlePinChange = (value, index) => {
//     const digit = value.replace(/\D/g, "").slice(-1);
//     const updatedPin = [...pin];
//     updatedPin[index] = digit;
//     setPin(updatedPin);

//     if (digit && index < 5) {
//       pinRefs.current[index + 1]?.focus();
//     }
//   };

//   const handlePinBackspace = (e, index) => {
//     if (e.key === "Backspace" && !pin[index] && index > 0) {
//       pinRefs.current[index - 1]?.focus();
//     }
//   };

//   const handlePinSubmit = async () => {
//     const enteredPin = pin.join("");

//     if (enteredPin.length !== 6) {
//       toast.error("Please enter your 6-digit transaction PIN");
//       return;
//     }

//     if (!user?._id || !token) {
//       toast.error("Authentication session expired. Please login again.");
//       return;
//     }

//     if (!normalizedPlan.id) {
//       toast.error("System error: Missing investment plan identifier.");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       setStep(3);

//       await confirmTransactionPin(user._id, enteredPin, token);

//       const payload = {
//         investmentPlanId: normalizedPlan.id,
//         amount: investmentAmount,
//       };

//       const response = await initiateInvestment(payload, token);

//       toast.success(response?.message || "Investment created successfully");
//       await onSuccess?.();
//       setStep(4);
//     } catch (error) {
//       console.error("INVESTMENT PIPELINE FAILURE:", error);
//       toast.error(error?.response?.data?.message, "Invalid trasaction pin");
//       setPin(["", "", "", "", "", ""]);
//       setStep(2);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isPinComplete = pin.join("").length === 6;
//   const isMediumRisk = normalizedPlan.investmentType === "medium";

//   return (
//     <div className="invest-modal-overlay">
//       <div className="invest-modal-card" ref={modalRef}>
//         {step === 1 && (
//           <form
//             onSubmit={handleAmountSubmit}
//             className="invest-modal-step-wrapper"
//           >
//             <h2 className="invest-modal-title">{normalizedPlan.name}</h2>
//             <p className="invest-modal-description">{getRiskDescription}</p>
//             <p className="invest-modal-description">
//               {getInvestmentTypeMessage}
//             </p>

//             <div
//               className={`invest-lock-notification-banner ${isMediumRisk ? "medium-risk-banner" : ""}`}
//             >
//               <HiOutlineShieldCheck className="invest-shield-icon" />
//               <p className="invest-lock-banner-text">
//                 Funds locked for {normalizedPlan.term} days at{" "}
//                 {normalizedPlan.roi}% p.a.
//               </p>
//             </div>

//             <div className="invest-input-field-container">
//               <label className="invest-input-field-label">Amount (NGN)</label>
//               <div className="invest-input-box-wrapper">
//                 <input
//                   type="number"
//                   className="invest-numeric-text-input"
//                   value={amount}
//                   placeholder={normalizedPlan.minAmount.toString()}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     if (val.length <= 10) {
//                       setAmount(val);
//                     }
//                   }}
//                 />
//               </div>
//             </div>

//             <div className="invest-returns-summary-row">
//               <span className="invest-summary-label">Expected Return</span>
//               <span className="invest-summary-value-highlight">
//                 ₦
//                 {Number(expectedReturn).toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//               </span>
//             </div>

//             <div className="invest-modal-action-buttons-container">
//               <button
//                 type="button"
//                 className="invest-btn-secondary-cancel"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="invest-btn-primary-solid"
//                 disabled={isAmountInvalid}
//                 style={{
//                   opacity: isAmountInvalid ? 0.6 : 1,
//                   cursor: isAmountInvalid ? "not-allowed" : "pointer",
//                 }}
//               >
//                 Continue
//               </button>
//             </div>
//           </form>
//         )}

//         {step === 2 && (
//           <div className="invest-modal-step-wrapper">
//             <button
//               type="button"
//               className="invest-modal-back-navigation-arrow"
//               onClick={() => setStep(1)}
//             >
//               <FiArrowLeft />
//             </button>

//             <h2 className="invest-modal-title margin-top-xs">
//               Enter Your Transaction Pin
//             </h2>

//             <div
//               className="invest-pin-box-flex-row"
//               style={{ display: "flex", gap: "10px", justifyContent: "center" }}
//             >
//               {pin.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="password"
//                   maxLength={1}
//                   inputMode="numeric"
//                   className="invest-square-box-input"
//                   value={digit}
//                   ref={(el) => (pinRefs.current[index] = el)}
//                   onChange={(e) => handlePinChange(e.target.value, index)}
//                   onKeyDown={(e) => handlePinBackspace(e, index)}
//                 />
//               ))}
//             </div>

//             <button
//               type="button"
//               disabled={!isPinComplete || isLoading}
//               onClick={handlePinSubmit}
//               className={`invest-btn-block-action margin-top-xl ${!isPinComplete || isLoading ? "disabled-btn" : ""}`}
//               style={{
//                 opacity: !isPinComplete || isLoading ? 0.6 : 1,
//                 cursor: !isPinComplete || isLoading ? "not-allowed" : "pointer",
//               }}
//             >
//               {isLoading ? "Processing..." : "Next"}
//             </button>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="invest-modal-step-wrapper text-center align-center padding-vertical-lg">
//             <div className="invest-processing-image-wrapper">
//               <img
//                 src={investAni}
//                 alt="Processing investment"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                 }}
//                 style={{ width: "120px", marginBottom: "20px" }}
//               />
//             </div>
//             <h2 className="invest-modal-title text-center-forced">
//               Investing In Your Future
//             </h2>
//             <p className="invest-modal-processing-subtext margin-top-xs">
//               Please wait...
//             </p>
//             <div className="invest-processing-button-loader-banner">
//               <div className="invest-full-card-spinner-centered">
//                 <p className="invest-lock-banner-text">
//                   Securing your transaction...
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {step === 4 && (
//           <div className="invest-modal-step-wrapper text-center align-center padding-vertical-lg">
//             <div className="invest-success-checkmark-animated-badge">
//               <div className="invest-checkmark-inner-circle">
//                 <span
//                   style={{
//                     color: "#ffffff",
//                     fontSize: "24px",
//                     fontWeight: "700",
//                   }}
//                 >
//                   ✓
//                 </span>
//               </div>
//             </div>

//             <h2 className="invest-modal-title text-center-forced margin-top-md">
//               Investment Activated!
//             </h2>
//             <p className="invest-modal-description text-center-forced max-width-text margin-top-xs">
//               We'll confirm and process your investment within 1–2 days
//             </p>

//             <button
//               className="invest-btn-block-action margin-top-xl"
//               onClick={onClose}
//             >
//               Close
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InvestModal;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import { HiOutlineShieldCheck } from "react-icons/hi";
import toast from "react-hot-toast";
import {
  initiateInvestment,
  confirmTransactionPin,
} from "../../Services/investmentService";
import "../../Style/InvestModal.css";
import investAni from "../../assets/investAni.gif";

const InvestModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const pinRefs = useRef([]);
  const modalRef = useRef(null);

  const { user, token } = useSelector((state) => state.user);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAmount("");
      setPin(["", "", "", "", "", ""]);
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  const normalizedPlan = useMemo(() => {
    if (!product) return null;

    const isNestedObject =
      product.investmentPlanId && typeof product.investmentPlanId === "object";
    const datasource = isNestedObject ? product.investmentPlanId : product;

    const planId = isNestedObject
      ? product.investmentPlanId._id || product.investmentPlanId.id
      : product.investmentPlanId || product._id || product.id;

    return {
      id: planId,
      name: datasource?.investmentName || "Investment Plan",
      roi: Number(datasource?.roi || product?.roi || 0),
      term: Number(datasource?.term || product?.term || 0),
      minAmount: Number(datasource?.minAmount || product?.minAmount || 0),
      investmentType: (
        datasource?.investmentType ||
        product?.investmentType ||
        "Low"
      ).toLowerCase(),
    };
  }, [product]);

  const getInvestmentTypeMessage = useMemo(() => {
    if (!normalizedPlan) return "";

    const isMedium = normalizedPlan.investmentType === "medium";

    if (isMedium) {
      return "Your money is been invested in Balanced Mutual Funds, Dividend Stocks, Real Estate, Government Bonds with moderate market volatility and high potential returns";
    }

    return "Your money is invested in Treasury Bills, FGN Savings Bonds, Fixed Deposits, and Money Market Mutual Funds with a 100% guarantee on safe investment returns.";
  }, [normalizedPlan]);

  const getRiskDescription = useMemo(() => {
    if (!normalizedPlan) return "";

    const isMedium = normalizedPlan.investmentType === "medium";

    if (isMedium) {
      return `Capital-growth ${normalizedPlan.term}-day balanced portfolio note. Suitable for investors comfortable with moderate risk exposure.`;
    }

    return `Capital-protected ${normalizedPlan.term}-day fixed income note. Ideal for first-time investors.`;
  }, [normalizedPlan]);

  const investmentAmount = Number(amount) || 0;

  const isAmountInvalid =
    !amount || investmentAmount < (normalizedPlan?.minAmount || 0);

  const expectedReturn = useMemo(() => {
    if (!normalizedPlan || investmentAmount <= 0) return "0.00";
    const { roi, term } = normalizedPlan;
    const interest = investmentAmount * (roi / 100) * (term / 365);
    return (investmentAmount + interest).toFixed(2);
  }, [investmentAmount, normalizedPlan]);

  if (!isOpen || !product || !normalizedPlan) return null;

  const handleAmountSubmit = (e) => {
    e.preventDefault();

    if (investmentAmount <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    if (investmentAmount < normalizedPlan.minAmount) {
      toast.error(
        `Minimum investment is ₦${normalizedPlan.minAmount.toLocaleString()}`,
      );
      return;
    }

    setStep(2);
  };

  const handlePinChange = (value, index) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updatedPin = [...pin];
    updatedPin[index] = digit;
    setPin(updatedPin);

    if (digit && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinBackspace = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handlePinSubmit = async () => {
    const enteredPin = pin.join("");

    if (enteredPin.length !== 6) {
      toast.error("Please enter your 6-digit transaction PIN");
      return;
    }

    if (!user?._id || !token) {
      toast.error("Authentication session expired. Please login again.");
      return;
    }

    if (!normalizedPlan.id) {
      toast.error("System error: Missing investment plan identifier.");
      return;
    }

    try {
      setIsLoading(true);
      setStep(3);

      await confirmTransactionPin(user._id, enteredPin, token);

      const payload = {
        investmentPlanId: normalizedPlan.id,
        amount: investmentAmount,
      };

      const response = await initiateInvestment(payload, token);

      toast.success(response?.message || "Investment created successfully");
      await onSuccess?.();
      setStep(4);
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      const backendError = error?.response?.data?.error;

      if (backendMessage) {
        toast.error(backendMessage);
      } else if (backendError) {
        toast.error(backendError);
      } else if (
        error?.message &&
        error?.message !== "Request failed with status code 400"
      ) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      setPin(["", "", "", "", "", ""]);
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const isPinComplete = pin.join("").length === 6;
  const isMediumRisk = normalizedPlan.investmentType === "medium";

  return (
    <div className="invest-modal-overlay">
      <div className="invest-modal-card" ref={modalRef}>
        {step === 1 && (
          <form
            onSubmit={handleAmountSubmit}
            className="invest-modal-step-wrapper"
          >
            <h2 className="invest-modal-title">{normalizedPlan.name}</h2>
            <p className="invest-modal-description">{getRiskDescription}</p>
            <p className="invest-modal-description">
              {getInvestmentTypeMessage}
            </p>

            <div
              className={`invest-lock-notification-banner ${isMediumRisk ? "medium-risk-banner" : ""}`}
            >
              <HiOutlineShieldCheck className="invest-shield-icon" />
              <p className="invest-lock-banner-text">
                Funds locked for {normalizedPlan.term} days at{" "}
                {normalizedPlan.roi}% p.a.
              </p>
            </div>

            <div className="invest-input-field-container">
              <label className="invest-input-field-label">Amount (NGN)</label>
              <div className="invest-input-box-wrapper">
                <input
                  type="number"
                  className="invest-numeric-text-input"
                  value={amount}
                  placeholder={normalizedPlan.minAmount.toString()}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.length <= 10) {
                      setAmount(val);
                    }
                  }}
                />
              </div>
            </div>

            <div className="invest-returns-summary-row">
              <span className="invest-summary-label">Expected Return</span>
              <span className="invest-summary-value-highlight">
                ₦
                {Number(expectedReturn).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <div className="invest-modal-action-buttons-container">
              <button
                type="button"
                className="invest-btn-secondary-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="invest-btn-primary-solid"
                disabled={isAmountInvalid}
                style={{
                  opacity: isAmountInvalid ? 0.6 : 1,
                  cursor: isAmountInvalid ? "not-allowed" : "pointer",
                }}
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="invest-modal-step-wrapper">
            <button
              type="button"
              className="invest-modal-back-navigation-arrow"
              onClick={() => setStep(1)}
            >
              <FiArrowLeft />
            </button>

            <h2 className="invest-modal-title margin-top-xs">
              Enter Your Transaction Pin
            </h2>

            <div
              className="invest-pin-box-flex-row"
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              {pin.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  inputMode="numeric"
                  className="invest-square-box-input"
                  value={digit}
                  ref={(el) => (pinRefs.current[index] = el)}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handlePinBackspace(e, index)}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={!isPinComplete || isLoading}
              onClick={handlePinSubmit}
              className={`invest-btn-block-action margin-top-xl ${!isPinComplete || isLoading ? "disabled-btn" : ""}`}
              style={{
                opacity: !isPinComplete || isLoading ? 0.6 : 1,
                cursor: !isPinComplete || isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? "Processing..." : "Next"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="invest-modal-step-wrapper text-center align-center padding-vertical-lg">
            <div className="invest-processing-image-wrapper">
              <img
                src={investAni}
                alt="Processing investment"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                style={{ width: "120px", marginBottom: "20px" }}
              />
            </div>
            <h2 className="invest-modal-title text-center-forced">
              Investing In Your Future
            </h2>
            <p className="invest-modal-processing-subtext margin-top-xs">
              Please wait...
            </p>
            <div className="invest-processing-button-loader-banner">
              <div className="invest-full-card-spinner-centered">
                <p className="invest-lock-banner-text">
                  Securing your transaction...
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="invest-modal-step-wrapper text-center align-center padding-vertical-lg">
            <div className="invest-success-checkmark-animated-badge">
              <div className="invest-checkmark-inner-circle">
                <span
                  style={{
                    color: "#ffffff",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  ✓
                </span>
              </div>
            </div>

            <h2 className="invest-modal-title text-center-forced margin-top-md">
              Investment Activated!
            </h2>
            <p className="invest-modal-description text-center-forced max-width-text margin-top-xs">
              We'll confirm and process your investment within 1–2 days
            </p>

            <button
              className="invest-btn-block-action margin-top-xl"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestModal;
