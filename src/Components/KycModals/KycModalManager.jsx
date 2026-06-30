// // import React, { useState } from "react";
// // import "../../Style/KycModals.css";
// // import KycStartModal from "./KycStartModal";
// // import KycUploadModal from "./KycUploadModal";
// // import KycPinModal from "./KycPinModal";
// // import KycSuccessModal from "./KycSuccessModal";

// // const KycModalManager = ({ isOpen, onClose }) => {
// //   const [step, setStep] = useState(1);

// //   if (!isOpen) return null;

// //   const nextStep = () => setStep((prev) => prev + 1);
// //   const prevStep = () => setStep((prev) => prev - 1);
// //   const handleComplete = () => {
// //     setStep(1); // Reset for next time
// //     onClose();
// //   };

// //   return (
// //     <div className="kyc-modal-overlay">
// //       <div className="kyc-modal-content">
// //         {step === 1 && (
// //           <KycStartModal onCancel={onClose} onContinue={nextStep} />
// //         )}
// //         {step === 2 && (
// //           <KycUploadModal onCancel={onClose} onVerify={nextStep} />
// //         )}
// //         {step === 3 && <KycPinModal onBack={prevStep} onNext={nextStep} />}
// //         {step === 4 && <KycSuccessModal onClose={handleComplete} />}
// //       </div>
// //     </div>
// //   );
// // };

// // export default KycModalManager;

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import "../../Style/KycModals.css";
// import { updateUser } from "../../Store/UserSlice";

// import KycStartModal from "./KycStartModal";
// import KycUploadModal from "./KycUploadModal";
// import KycPinModal from "./KycPinModal";
// import KycSuccessModal from "./KycSuccessModal";

// const KycModalManager = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch();
//   const [step, setStep] = useState(1);
//   const [utilityBill, setUtilityBill] = useState(null);
//   const [kycResponseData, setKycResponseData] = useState(null);

//   if (!isOpen) return null;

//   const nextStep = () => setStep((prev) => prev + 1);

//   const prevStep = () => setStep((prev) => prev - 1);

//   const handleUploadComplete = (file) => {
//     setUtilityBill(file);
//     setStep(3);
//   };

//   // ✅ FIXED: Handle KYC success with proper user update
//   const handleKycSuccess = (responseData) => {
//     // Store the response data
//     setKycResponseData(responseData);

//     // ✅ CRITICAL: Update the user state with Tier 2 verification
//     if (responseData) {
//       dispatch(
//         updateUser({
//           tier: responseData.tier || 2,
//           isVerified2: responseData.isVerified2 || true,
//           utilityBill: responseData.utilityBill || null,
//         }),
//       );
//     }

//     // Move to success step
//     setStep(4);
//   };

//   const handleComplete = () => {
//     setStep(1);
//     setUtilityBill(null);
//     setKycResponseData(null);
//     onClose();
//   };

//   return (
//     <div className="kyc-modal-overlay">
//       <div className="kyc-modal-content">
//         {step === 1 && (
//           <KycStartModal onCancel={onClose} onContinue={nextStep} />
//         )}

//         {step === 2 && (
//           <KycUploadModal onCancel={onClose} onVerify={handleUploadComplete} />
//         )}

//         {step === 3 && (
//           <KycPinModal
//             utilityBill={utilityBill}
//             onBack={prevStep}
//             onNext={handleKycSuccess}
//           />
//         )}

//         {step === 4 && <KycSuccessModal onClose={handleComplete} />}
//       </div>
//     </div>
//   );
// };

// export default KycModalManager;
import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BsFileEarmarkText } from "react-icons/bs";
import { GiPartyPopper } from "react-icons/gi";
import { OrbitProgress } from "react-loading-indicators";
import toast from "react-hot-toast";
import { updateUser } from "../../Store/UserSlice";
import {
  uploadUtilityBill,
  confirmTransactionPin,
} from "../../Services/authService";
import "../../Style/KycModals.css";

const KycModalManager = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);

  // Step management
  const [step, setStep] = useState(1);
  const [utilityBill, setUtilityBill] = useState(null);
  const [utilityName, setUtilityName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // PIN state
  const [pin, setPin] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  if (!isOpen) return null;

  // ============================================================
  // STEP 1: KYC Start Modal
  // ============================================================
  const renderKycStart = () => (
    <>
      <h2 className="kyc-modal-title">KYC Verification Tier 2</h2>
      <p className="kyc-modal-subtitle">
        Upgrading to Tier 2 gives you access to our Investment offerings!
      </p>

      <div className="kyc-btn-group">
        <button className="kyc-btn kyc-btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button className="kyc-btn kyc-btn-continue" onClick={() => setStep(2)}>
          Continue
        </button>
      </div>
    </>
  );

  // ============================================================
  // STEP 2: KYC Upload Modal
  // ============================================================
  const handleUtilityChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = "";
        return;
      }

      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid image or PDF file");
        e.target.value = "";
        return;
      }

      setUtilityName(file.name);
      setUtilityBill(file);
    }
  };

  const renderKycUpload = () => (
    <div style={{ textAlign: "left" }}>
      <h2 className="kyc-modal-title" style={{ textAlign: "left" }}>
        Complete KYC Verification
      </h2>
      <p className="kyc-modal-subtitle" style={{ textAlign: "left" }}>
        Upload a photo of your latest Utility (NEPA) Bill
      </p>

      {/* Utility Bill Upload */}
      <div className="kyc-upload-group">
        <label className="kyc-upload-label">Upload Photo Of Utility Bill</label>
        <div
          className="kyc-upload-box"
          onClick={() => document.getElementById("utilityFileInput").click()}
          style={{ cursor: "pointer" }}
        >
          <span className="kyc-upload-text">
            {utilityName || "Attach File"}
          </span>
          <BsFileEarmarkText size={20} color="#1a1a1a" />
        </div>
        <input
          id="utilityFileInput"
          type="file"
          style={{ display: "none" }}
          onChange={handleUtilityChange}
          accept="image/*,.pdf"
        />
      </div>

      <div className="kyc-btn-group">
        <button
          className="kyc-btn kyc-btn-cancel"
          onClick={onClose}
          disabled={isVerifying}
        >
          Cancel
        </button>
        <button
          className="kyc-btn kyc-btn-continue"
          onClick={() => {
            if (!utilityBill) {
              toast.error("Please upload a utility bill first");
              return;
            }
            setStep(3);
          }}
          disabled={!utilityBill || isVerifying}
        >
          Continue
        </button>
      </div>
    </div>
  );

  // ============================================================
  // STEP 3: KYC PIN Modal
  // ============================================================
  const handlePinChange = (element, index) => {
    const value = element.value.replace(/\D/g, "");
    const updatedPin = [...pin];
    updatedPin[index] = value;
    setPin(updatedPin);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePinBackspace = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePinSubmit = async () => {
    const enteredPin = pin.join("");

    if (enteredPin.length !== 6) {
      return toast.error("Please enter your 6-digit transaction pin");
    }

    if (!utilityBill) {
      return toast.error("Please upload a utility bill");
    }

    const authToken = token || localStorage.getItem("authToken");

    if (!authToken) {
      return toast.error("Session expired. Please login again.");
    }

    const userId = user?._id || user?.id || user?.data?._id || user?.data?.id;

    if (!userId) {
      return toast.error("User identity not found. Please login again.");
    }

    try {
      setIsVerifying(true);

      // ============================================================
      // ✅ STEP 1: Confirm PIN first
      // ============================================================
      toast.loading("Verifying PIN...", { id: "pin-verification" });

      await confirmTransactionPin(userId, enteredPin, authToken);

      toast.success("PIN verified successfully!", { id: "pin-verification" });

      // ============================================================
      // ✅ STEP 2: Upload Utility Bill after PIN confirmation
      // ============================================================
      toast.loading("Uploading utility bill...", { id: "upload-utility" });

      const response = await uploadUtilityBill(utilityBill, authToken);

      console.log("✅ KYC Response:", response);

      toast.success(
        response?.message || "Utility bill uploaded successfully!",
        {
          id: "upload-utility",
        },
      );

      // ============================================================
      // ✅ STEP 3: Update user state with Tier 2 verification
      // ============================================================
      dispatch(
        updateUser({
          tier: response?.tier || 2,
          isVerified2: response?.isVerified2 || true,
          utilityBill: response?.utilityBill || null,
        }),
      );

      // Move to success step
      setStep(4);
    } catch (error) {
      console.error("KYC Verification error:", error);

      // Dismiss any loading toasts
      toast.dismiss("pin-verification");
      toast.dismiss("upload-utility");

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to verify. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const renderKycPin = () => (
    <>
      <button className="kyc-back-btn" onClick={() => setStep(2)}>
        <IoIosArrowRoundBack />
      </button>

      <h2 className="kyc-modal-title kyc-title-with-back">
        Enter Your Transaction Pin
      </h2>

      <div className="kyc-pin-container">
        {pin.map((digit, index) => (
          <input
            key={index}
            type="password"
            maxLength={1}
            className="kyc-pin-input"
            value={digit}
            ref={(ref) => (inputRefs.current[index] = ref)}
            onChange={(e) => handlePinChange(e.target, index)}
            onKeyDown={(e) => handlePinBackspace(e, index)}
          />
        ))}
      </div>

      <button
        className="kyc-btn kyc-btn-continue kyc-btn-full"
        disabled={isVerifying}
        onClick={handlePinSubmit}
      >
        {isVerifying ? (
          <div className="loader-wrapper">
            <OrbitProgress color="#fff" size="small" />
          </div>
        ) : (
          "Verify"
        )}
      </button>
    </>
  );

  // ============================================================
  // STEP 4: KYC Success Modal
  // ============================================================
  const handleSuccessClose = () => {
    setStep(1);
    setUtilityBill(null);
    setUtilityName("");
    setPin(new Array(6).fill(""));
    setIsVerifying(false);
    onClose();
  };

  const renderKycSuccess = () => (
    <>
      <div className="kyc-success-icon-wrapper">
        <GiPartyPopper />
      </div>

      <h2 className="kyc-modal-title">KYC Verified!</h2>
      <p className="kyc-modal-subtitle">Welcome to Tier 2!!!</p>

      <button
        className="kyc-btn kyc-btn-continue kyc-btn-full kyc-success-action"
        onClick={handleSuccessClose}
      >
        Close
      </button>
    </>
  );

  // ============================================================
  // RENDER SWITCH
  // ============================================================
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderKycStart();
      case 2:
        return renderKycUpload();
      case 3:
        return renderKycPin();
      case 4:
        return renderKycSuccess();
      default:
        return renderKycStart();
    }
  };

  return (
    <div className="kyc-modal-overlay">
      <div className="kyc-modal-content">{renderStep()}</div>
    </div>
  );
};

export default KycModalManager;
