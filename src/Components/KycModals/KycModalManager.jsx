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

  const [step, setStep] = useState(1);
  const [utilityBill, setUtilityBill] = useState(null);
  const [utilityName, setUtilityName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

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
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        e.target.value = "";
        return;
      }

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

    // Validate PIN
    if (enteredPin.length !== 6) {
      return toast.error("Please enter your 6-digit transaction pin");
    }

    // Validate utility bill
    if (!utilityBill) {
      return toast.error("Please upload a utility bill");
    }

    // Get auth token with multiple fallbacks
    const authToken =
      token ||
      user?.token ||
      user?.authToken ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("token");

    console.log("🔵 Auth Token:", authToken ? "Present" : "Missing");

    if (!authToken) {
      return toast.error("Session expired. Please login again.");
    }

    // Get user ID with multiple fallbacks
    const userId =
      user?._id ||
      user?.id ||
      user?.data?._id ||
      user?.data?.id ||
      user?.user?._id;

    console.log("🔵 User ID:", userId);
    console.log("🔵 PIN:", enteredPin);
    console.log("🔵 Utility Bill:", utilityBill);

    if (!userId) {
      return toast.error("User identity not found. Please login again.");
    }

    try {
      setIsVerifying(true);

      // ============================================================
      // STEP 1: Confirm PIN first
      // ============================================================
      console.log("🚀 Calling confirmTransactionPin API...");
      toast.loading("Verifying PIN...", { id: "pin-verification" });

      const pinResponse = await confirmTransactionPin(
        userId,
        enteredPin,
        authToken,
      );

      console.log("✅ PIN Response:", pinResponse);
      toast.success("PIN verified successfully!", { id: "pin-verification" });

      // ============================================================
      // STEP 2: Upload Utility Bill after PIN confirmation
      // ============================================================
      console.log("🚀 Calling uploadUtilityBill API...");
      toast.loading("Uploading utility bill...", { id: "upload-utility" });

      const uploadResponse = await uploadUtilityBill(utilityBill, authToken);

      console.log("✅ Upload Response:", uploadResponse);
      toast.success(
        uploadResponse?.message || "Utility bill uploaded successfully!",
        { id: "upload-utility" },
      );

      // ============================================================
      // STEP 3: Update Redux store
      // ============================================================
      dispatch(
        updateUser({
          tier: uploadResponse?.tier || 2,
          isVerified2: uploadResponse?.isVerified2 || true,
          utilityBill: uploadResponse?.utilityBill || null,
        }),
      );

      // Move to success step
      setStep(4);
    } catch (error) {
      console.error("❌ KYC Verification Error:", error);
      console.error("❌ Error Response:", error?.response?.data);
      console.error("❌ Error Status:", error?.response?.status);

      // Dismiss loading toasts
      toast.dismiss("pin-verification");
      toast.dismiss("upload-utility");

      // Extract meaningful error message
      let errorMessage = "Failed to verify. Please try again.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error?.message &&
        error.message !== "Request failed with status code 400"
      ) {
        errorMessage = error.message;
      } else if (error?.response?.status === 401) {
        errorMessage = "Invalid PIN. Please try again.";
      } else if (error?.response?.status === 404) {
        errorMessage =
          "Verification service unavailable. Please try again later.";
      }

      toast.error(errorMessage);

      // Reset PIN on error
      setPin(new Array(6).fill(""));
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
