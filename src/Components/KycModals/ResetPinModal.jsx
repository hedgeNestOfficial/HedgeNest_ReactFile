import React, { useState, useEffect, useRef } from "react";
import "../../Style/ChangePasswordModal.css"; // Reusing your existing CSS architecture
import { FiArrowLeft } from "react-icons/fi";
import { FaCircleNotch } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import toast from "react-hot-toast";
import { forgotPin, verifyOtp, createPin } from "../../Services/authService";

const ResetPinModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [transactionPin, setTransactionPin] = useState("");
  const [confirmTransactionPin, setConfirmTransactionPin] = useState("");
  const [resetToken, setResetToken] = useState(""); // Stores Bearer token from step 2
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const otpRefs = useRef([]);

  // Handles countdown timer logic for the OTP view
  useEffect(() => {
    if (step !== 3) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // Reset all local component state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEmail("");
      setOtp(new Array(6).fill(""));
      setTransactionPin("");
      setConfirmTransactionPin("");
      setResetToken("");
      setTimer(30);
    }
  }, [isOpen]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return toast.error("Enter your email address");
    }

    try {
      setIsLoading(true);
      const response = await forgotPin({
        email: email.trim(),
      });
      toast.success(response?.message || "OTP sent successfully");
      setStep(3);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/\D/g, "");
    if (!value) return;

    let updatedOtp = [...otp];
    updatedOtp[index] = value.substring(value.length - 1);
    setOtp(updatedOtp);

    if (index < 5 && element.value) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      let updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);

      if (index > 0) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  // Clipboard Paste listener for the multi-box OTP layout
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedText) return;

    const pastedDigits = pastedText.slice(0, 6).split("");
    const updatedOtp = [...otp];

    pastedDigits.forEach((digit, idx) => {
      updatedOtp[idx] = digit;
    });
    setOtp(updatedOtp);

    const targetFocusIndex = Math.min(pastedDigits.length, 5);
    otpRefs.current[targetFocusIndex]?.focus();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return toast.error("Please enter a valid 6-digit verification code");
    }

    try {
      setIsLoading(true);
      const response = await verifyOtp({
        email: email.trim(),
        otp: otpCode,
      });

      toast.success(response?.message || "OTP verified successfully");

      // Cache the verification bearer token return payload securely in local state
      if (response?.token) {
        setResetToken(response.token);
      }

      setStep(4);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Sanitizes Pin fields to prevent alpha characters from being typed
  const handlePinInputFilter = (value, setter) => {
    const numericValue = value.replace(/\D/g, "");
    setter(numericValue);
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();

    if (transactionPin.length !== 6 || confirmTransactionPin.length !== 6) {
      return toast.error("Transaction PIN must be exactly 6 digits");
    }

    if (transactionPin !== confirmTransactionPin) {
      return toast.error("Transaction PINs do not match");
    }

    if (!resetToken) {
      return toast.error("Session expired. Please request a new OTP.");
    }

    try {
      setIsLoading(true);
      const payload = {
        email: email.trim(),
        transactionPin,
        confirmTransactionPin,
      };

      const response = await createPin(payload, resetToken);
      toast.success(
        response?.message || "Transaction PIN updated successfully",
      );
      setStep(6);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to reset Transaction PIN",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;

    try {
      const response = await forgotPin({ email: email.trim() });
      toast.success(response?.message || "OTP resent");
      setTimer(30);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to resend OTP");
    }
  };

  return (
    <div className="pwd-modal-overlay" onClick={onClose}>
      <div
        className={`pwd-modal-card ${step === 2 || step === 5 ? "pwd-loading-dims" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* STEP 1: VERIFY EMAIL ADDRESS */}
        {step === 1 && (
          <form
            onSubmit={handleEmailSubmit}
            className="pwd-modal-step-container"
          >
            <h2 className="pwd-modal-title">Reset Transaction PIN</h2>
            <p className="pwd-modal-subtitle">
              Enter your email address to receive a recovery code
            </p>

            <div className="pwd-input-group">
              <label className="pwd-input-label">Email address</label>
              <input
                type="email"
                required
                className="pwd-text-input"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="pwd-actions-container">
              <button
                type="button"
                className="pwd-btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="pwd-btn-continue"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Continue"}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2 & 5: LOADING STATE SPINNERS */}
        {(step === 2 || step === 5) && (
          <div className="pwd-spinner-wrapper">
            <FaCircleNotch className="pwd-loading-icon" />
          </div>
        )}

        {/* STEP 3: ENTER OTP CODE VIEW */}
        {step === 3 && (
          <form onSubmit={handleOtpSubmit} className="pwd-modal-step-container">
            <div className="pwd-nav-header-row">
              <button
                type="button"
                className="pwd-back-arrow-btn"
                onClick={() => setStep(1)}
              >
                <FiArrowLeft />
              </button>
            </div>

            <h2 className="pwd-modal-title">Enter OTP</h2>
            <p className="pwd-modal-subtitle">
              A 6-digit code has been sent to this email <br />
              <span className="pwd-masked-email">
                {email ? email.replace(/(..)(.*)(@.*)/, "$1******$3") : ""}
              </span>
            </p>

            <div className="pwd-otp-grid-row">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  className="pwd-otp-square-box"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  onPaste={handleOtpPaste}
                />
              ))}
            </div>

            <button
              type="submit"
              className="pwd-btn-block-solid margin-top-md"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Next"}
            </button>

            <div className="pwd-otp-footer-links">
              <span className="pwd-resend-timer-text">
                Resend code{" "}
                {timer > 0 ? (
                  <strong className="color-dark">{timer}s</strong>
                ) : (
                  <span
                    className="pwd-resend-active-link"
                    onClick={handleResendCode}
                  >
                    Now
                  </span>
                )}
              </span>
              {/* <button
                type="button"
                className="pwd-edit-email-btn"
                onClick={() => setStep(1)}
              >
                Edit email address
              </button> */}
            </div>
          </form>
        )}

        {/* STEP 4: CREATE YOUR NEW TRANSACTION PIN */}
        {step === 4 && (
          <form onSubmit={handlePinSubmit} className="pwd-modal-step-container">
            <div className="pwd-nav-header-row">
              <button
                type="button"
                className="pwd-back-arrow-btn"
                onClick={() => setStep(3)}
              >
                <FiArrowLeft />
              </button>
            </div>

            <h2 className="pwd-modal-title">Create New PIN</h2>
            <p className="pwd-modal-subtitle">
              Setup a secure 6-digit numeric transaction code
            </p>

            <div className="pwd-input-group margin-top-md">
              <label className="pwd-input-label">New Transaction PIN</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                className="pwd-text-input"
                placeholder="Enter 6-digit PIN"
                value={transactionPin}
                onChange={(e) =>
                  handlePinInputFilter(e.target.value, setTransactionPin)
                }
              />
            </div>

            <div className="pwd-input-group">
              <label className="pwd-input-label">Confirm Transaction PIN</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                required
                className="pwd-text-input"
                placeholder="Re-enter 6-digit PIN"
                value={confirmTransactionPin}
                onChange={(e) =>
                  handlePinInputFilter(e.target.value, setConfirmTransactionPin)
                }
              />
            </div>

            <button
              type="submit"
              className="pwd-btn-block-solid margin-top-lg"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Confirm PIN"}
            </button>
          </form>
        )}

        {/* STEP 6: PIN RESET SUCCESSFUL */}
        {step === 6 && (
          <div className="pwd-modal-step-container text-center align-center">
            <div className="pwd-success-icon-wrapper">
              <GiPartyPopper className="pwd-success-icon" />
            </div>

            <h2 className="pwd-modal-title margin-top-lg font-size-xl">
              PIN Created Successfully!
            </h2>

            <button
              type="button"
              className="pwd-btn-block-solid margin-top-lg"
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

export default ResetPinModal;
