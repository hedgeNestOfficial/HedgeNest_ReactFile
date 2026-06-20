// import React, { useState, useEffect, useRef } from "react";
// import { IoClose } from "react-icons/io5";
// import { HiOutlineArrowLeft } from "react-icons/hi";
// import toast from "react-hot-toast";
// import { useWalletRefresh } from "../../hooks/useWalletRefresh";
// import breakIllustration from "../../assets/investAni.gif";
// import "../../Style/BreakModal.css";

// const STEPS = {
//   WARNING: 1,
//   CONFIRM_DETAILS: 2,
//   ENTER_PIN: 3,
//   LOADING: 4,
//   SUCCESS: 5,
// };

// const BreakInvestmentModalManager = ({
//   isOpen,
//   onClose,
//   position,
//   onConfirmBreak,
// }) => {
//   const [currentStep, setCurrentStep] = useState(STEPS.WARNING);
//   const [pin, setPin] = useState(["", "", "", "", "", ""]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const pinRefs = useRef([]);
//   const refreshWallet = useWalletRefresh();

//   /*
//   |--------------------------------------------------------------------------
//   | Reset Component State Lifecycles
//   |--------------------------------------------------------------------------
//   */
//   useEffect(() => {
//     if (isOpen) {
//       setCurrentStep(STEPS.WARNING);
//       setPin(["", "", "", "", "", ""]);
//       setIsSubmitting(false);
//     }
//   }, [isOpen]);

//   if (!isOpen || !position) return null;

//   const investmentName =
//     position?.investmentPlanId?.investmentName || "Investment";
//   const amount = Number(position?.amount || 0);

//   /*
//   |--------------------------------------------------------------------------
//   | Isolated Ref Input Array Tracking (Fixes Global ID Collisions)
//   |--------------------------------------------------------------------------
//   */
//   const handlePinChange = (value, index) => {
//     const digit = value.replace(/\D/g, "").slice(-1);
//     const newPin = [...pin];
//     newPin[index] = digit;
//     setPin(newPin);

//     if (digit && index < 5) {
//       pinRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !pin[index] && index > 0) {
//       pinRefs.current[index - 1]?.focus();
//     }
//   };

//   const nextStep = () => setCurrentStep((prev) => prev + 1);
//   const prevStep = () => setCurrentStep((prev) => prev - 1);

//   /*
//   |--------------------------------------------------------------------------
//   | Submit Handler (With Fallback ID Resolution Setup)
//   |--------------------------------------------------------------------------
//   */
//   const handleSubmitPin = async () => {
//     const transactionPin = pin.join("");

//     if (transactionPin.length !== 6) {
//       toast.error("Please fill out your 6-digit transaction PIN");
//       return;
//     }

//     // Defensive check to find the correct ID across raw vs populated Mongo queries
//     const investmentId =
//       position?._id || position?.id || position?.investmentPlanId?._id;

//     if (!investmentId) {
//       toast.error("System Error: Unable to resolve data reference keys.");
//       console.error(
//         "❌ DATA CONTRACT ERROR: 'position' object properties mismatch:",
//         position,
//       );
//       return;
//     }

//     try {
//       setIsSubmitting(true);
//       setCurrentStep(STEPS.LOADING);

//       // Fire Parent API pipeline pipeline
//       await onConfirmBreak(investmentId, transactionPin);

//       // Synchronize client balance changes across active views
//       await refreshWallet();

//       setCurrentStep(STEPS.SUCCESS);
//     } catch (error) {
//       console.error("❌ BREAK TRANSACTION PIPELINE FAILURE:", error);

//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Transaction verification failed. Please try again.",
//       );

//       setPin(["", "", "", "", "", ""]);
//       setCurrentStep(STEPS.ENTER_PIN);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const isPinComplete = pin.join("").length === 6;

//   return (
//     <div className="break-modal-overlay">
//       <div className="break-modal-container">
//         {/* MODAL NAVIGATION HEADER */}
//         <div className="break-modal-header">
//           {[STEPS.CONFIRM_DETAILS, STEPS.ENTER_PIN].includes(currentStep) ? (
//             <button
//               type="button"
//               className="break-modal-back-btn"
//               onClick={prevStep}
//             >
//               <HiOutlineArrowLeft size={20} />
//             </button>
//           ) : (
//             <div />
//           )}

//           {[STEPS.WARNING, STEPS.CONFIRM_DETAILS, STEPS.ENTER_PIN].includes(
//             currentStep,
//           ) && (
//             <button
//               type="button"
//               className="break-modal-close-btn"
//               onClick={onClose}
//             >
//               <IoClose size={24} />
//             </button>
//           )}
//         </div>

//         {/* STEP 1: WARNING */}
//         {currentStep === STEPS.WARNING && (
//           <div className="break-modal-step-content text-center">
//             <h2 className="break-modal-title">
//               Are you sure you want to withdraw?
//             </h2>
//             <p className="break-modal-subtitle text-muted">
//               Early withdrawal will not earn full interest
//             </p>
//             <div className="break-modal-actions-stacked">
//               <button
//                 type="button"
//                 className="break-btn-gold"
//                 onClick={nextStep}
//               >
//                 Continue
//               </button>
//               <button
//                 type="button"
//                 className="break-btn-outline"
//                 onClick={onClose}
//               >
//                 Go Back
//               </button>
//             </div>
//           </div>
//         )}

//         {/* STEP 2: CONFIRM DETAILS */}
//         {currentStep === STEPS.CONFIRM_DETAILS && (
//           <div className="break-modal-step-content">
//             <h2 className="break-modal-title text-center">
//               Withdraw From {investmentName}
//             </h2>
//             <p className="break-input-label text-center">
//               How much do you want to withdraw
//             </p>

//             <div className="break-input-wrapper">
//               <span className="break-currency-prefix">₦</span>
//               <input
//                 type="text"
//                 className="break-disabled-input"
//                 value={amount.toLocaleString()}
//                 disabled
//               />
//             </div>

//             <div className="break-modal-actions-row">
//               <button
//                 type="button"
//                 className="break-btn-outline half-width"
//                 onClick={onClose}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="break-btn-gold half-width"
//                 onClick={nextStep}
//               >
//                 Withdraw
//               </button>
//             </div>
//           </div>
//         )}

//         {/* STEP 3: TRANSACTION PIN INPUT */}
//         {currentStep === STEPS.ENTER_PIN && (
//           <div className="break-modal-step-content text-center">
//             <h2 className="break-modal-title">Enter Your Transaction Pin</h2>
//             <div className="break-pin-container">
//               {pin.map((digit, index) => (
//                 <input
//                   key={index}
//                   type="password"
//                   maxLength={1}
//                   inputMode="numeric"
//                   className="break-pin-input-box"
//                   value={digit}
//                   ref={(el) => (pinRefs.current[index] = el)}
//                   onChange={(e) => handlePinChange(e.target.value, index)}
//                   onKeyDown={(e) => handleKeyDown(e, index)}
//                 />
//               ))}
//             </div>
//             <button
//               type="button"
//               className={`break-btn-gold mt-4 ${!isPinComplete || isSubmitting ? "disabled-btn" : ""}`}
//               onClick={handleSubmitPin}
//               disabled={!isPinComplete || isSubmitting}
//             >
//               {isSubmitting ? "Processing..." : "Next"}
//             </button>
//           </div>
//         )}

//         {/* STEP 4: LOADING PROFILE */}
//         {currentStep === STEPS.LOADING && (
//           <div className="break-modal-step-content text-center py-4">
//             <img
//               src={breakIllustration}
//               alt="Processing request"
//               className="break-loading-illustration"
//               onError={(e) => {
//                 e.target.style.display = "none";
//               }}
//               style={{ width: "120px", margin: "0 auto" }}
//             />
//             <h2 className="break-modal-title mt-3">
//               Terminating Investment Position
//             </h2>
//             <p className="break-modal-subtitle">
//               Securing your liquidation profile, please wait...
//             </p>
//             <div className="break-spinner-circle"></div>
//           </div>
//         )}

//         {/* STEP 5: LIQUIDATION SUCCESS */}
//         {currentStep === STEPS.SUCCESS && (
//           <div className="break-modal-step-content text-center py-4">
//             <div className="break-success-icon-wrapper">
//               <div className="break-success-circle-checkmark">✓</div>
//             </div>
//             <h2 className="break-modal-title mt-4">Investment Terminated!</h2>
//             <p className="break-modal-subtitle px-2">
//               We'll confirm and process your investment settlement within 1–2
//               days
//             </p>
//             <button
//               type="button"
//               className="break-btn-gold mt-4"
//               onClick={onClose}
//               style={{ alignSelf: "center" }}
//             >
//               Close
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BreakInvestmentModalManager;

import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { HiOutlineArrowLeft } from "react-icons/hi";
import toast from "react-hot-toast";
import { useWalletRefresh } from "../../Hooks/useWalletRefresh";
import breakIllustration from "../../assets/investAni.gif";
import "../../Style/BreakModal.css";

const STEPS = {
  WARNING: 1,
  CONFIRM_DETAILS: 2,
  ENTER_PIN: 3,
  LOADING: 4,
  SUCCESS: 5,
};

const BreakInvestmentModalManager = ({
  isOpen,
  onClose,
  position,
  onConfirmBreak,
}) => {
  const [currentStep, setCurrentStep] = useState(STEPS.WARNING);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pinRefs = useRef([]);
  const refreshWallet = useWalletRefresh();

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(STEPS.WARNING);
      setPin(["", "", "", "", "", ""]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !position) return null;

  const investmentName =
    position?.investmentPlanId?.investmentName || "Investment";
  const amount = Number(position?.amount || 0);

  const handlePinChange = (value, index) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);

    if (digit && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmitPin = async () => {
    const transactionPin = pin.join("");

    if (transactionPin.length !== 6) {
      toast.error("Please fill out your 6-digit transaction PIN");
      return;
    }

    const investmentId = position?._id || position?.id;
    if (!investmentId) {
      toast.error("Data mapping issue: Unable to resolve investment ID.");
      return;
    }

    try {
      setIsSubmitting(true);
      setCurrentStep(STEPS.LOADING);

      // Triggers sequential verification & liquidation flow in parent component
      await onConfirmBreak(investmentId, transactionPin);

      await refreshWallet();
      setCurrentStep(STEPS.SUCCESS);
    } catch (error) {
      console.error("❌ SEQUENTIAL PIPELINE REJECTION:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Transaction failed. Please check details and try again.",
      );
      setPin(["", "", "", "", "", ""]);
      setCurrentStep(STEPS.ENTER_PIN);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPinComplete = pin.join("").length === 6;

  return (
    <div className="break-modal-overlay">
      <div className="break-modal-container">
        <div className="break-modal-header">
          {[STEPS.CONFIRM_DETAILS, STEPS.ENTER_PIN].includes(currentStep) ? (
            <button
              type="button"
              className="break-modal-back-btn"
              onClick={prevStep}
            >
              <HiOutlineArrowLeft size={20} />
            </button>
          ) : (
            <div />
          )}

          {[STEPS.WARNING, STEPS.CONFIRM_DETAILS, STEPS.ENTER_PIN].includes(
            currentStep,
          ) && (
            <button
              type="button"
              className="break-modal-close-btn"
              onClick={onClose}
            >
              <IoClose size={24} />
            </button>
          )}
        </div>

        {currentStep === STEPS.WARNING && (
          <div className="break-modal-step-content text-center">
            <h2 className="break-modal-title">
              Are you sure you want to withdraw?
            </h2>
            <p className="break-modal-subtitle text-muted">
              Early withdrawal will not earn full interest
            </p>
            <div className="break-modal-actions-stacked">
              <button
                type="button"
                className="break-btn-gold"
                onClick={nextStep}
              >
                Continue
              </button>
              <button
                type="button"
                className="break-btn-outline"
                onClick={onClose}
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {currentStep === STEPS.CONFIRM_DETAILS && (
          <div className="break-modal-step-content">
            <h2 className="break-modal-title text-center">
              Withdraw From {investmentName}
            </h2>
            <p className="break-input-label text-center">
              How much do you want to withdraw
            </p>
            <div className="break-input-wrapper">
              <span className="break-currency-prefix">₦</span>
              <input
                type="text"
                className="break-disabled-input"
                value={amount.toLocaleString()}
                disabled
              />
            </div>
            <div className="break-modal-actions-row">
              <button
                type="button"
                className="break-btn-outline half-width"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="break-btn-gold half-width"
                onClick={nextStep}
              >
                Withdraw
              </button>
            </div>
          </div>
        )}

        {currentStep === STEPS.ENTER_PIN && (
          <div className="break-modal-step-content text-center">
            <h2 className="break-modal-title">Enter Your Transaction Pin</h2>
            <div className="break-pin-container">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  type="password"
                  maxLength={1}
                  inputMode="numeric"
                  className="break-pin-input-box"
                  value={digit}
                  ref={(el) => (pinRefs.current[index] = el)}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button
              type="button"
              className={`break-btn-gold mt-4 ${!isPinComplete || isSubmitting ? "disabled-btn" : ""}`}
              onClick={handleSubmitPin}
              disabled={!isPinComplete || isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Next"}
            </button>
          </div>
        )}

        {currentStep === STEPS.LOADING && (
          <div className="break-modal-step-content text-center py-4">
            <img
              src={breakIllustration}
              alt="Processing"
              className="break-loading-illustration"
              onError={(e) => {
                e.target.style.display = "none";
              }}
              style={{ width: "120px", margin: "0 auto" }}
            />
            <h2 className="break-modal-title mt-3">
              Terminating Investment Position
            </h2>
            <p className="break-modal-subtitle">
              Securing your liquidation profile, please wait...
            </p>
            <div className="break-spinner-circle"></div>
          </div>
        )}

        {currentStep === STEPS.SUCCESS && (
          <div className="break-modal-step-content text-center py-4">
            <div className="break-success-icon-wrapper">
              <div className="break-success-circle-checkmark">✓</div>
            </div>
            <h2 className="break-modal-title mt-4">Investment Terminated!</h2>
            <p className="break-modal-subtitle px-2">
              We'll confirm and process your investment settlement within 1–2
              days
            </p>
            <button
              type="button"
              className="break-btn-gold mt-4"
              onClick={onClose}
              style={{ alignSelf: "center" }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakInvestmentModalManager;
