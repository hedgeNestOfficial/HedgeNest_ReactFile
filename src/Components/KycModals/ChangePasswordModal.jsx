import React, { useState, useEffect, useRef } from "react";
import "../../Style/ChangePasswordModal.css";
import { FiArrowLeft } from "react-icons/fi";
import { FaCircleNotch } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi"; // Imported the congratulations cone icon
import toast from "react-hot-toast";
import {
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../../Services/authService";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      setNewPassword("");
      setConfirmPassword("");
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
      const response = await forgotPassword({
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

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      return toast.error("Please enter a valid 6-digit verification code");
    }

    try {
      setIsLoading(true);
      const response = await verifyResetOtp({
        email,
        otp: otpCode,
      });
      toast.success(response?.message || "OTP verified successfully");
      setStep(4);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setIsLoading(true);
      const response = await resetPassword({
        email,
        newPassword,
        confirmPassword,
        otp: otpCode,
      });
      toast.success(response?.message || "Password reset successful");
      setStep(6);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;

    try {
      const response = await forgotPassword({ email });
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
            <h2 className="pwd-modal-title">Verify Email Address</h2>
            <p className="pwd-modal-subtitle">
              Enter your email address so we know it's you
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
                {email
                  ? email.replace(/(..)(.*)(@.*)/, "$1******$3")
                  : "he*****22@gmail.com"}
              </span>
            </p>

            <div className="pwd-otp-grid-row">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  className="pwd-otp-square-box"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
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
              <button
                type="button"
                className="pwd-edit-email-btn"
                onClick={() => setStep(1)}
              >
                Edit email address
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: CREATE YOUR NEW PASSWORD */}
        {step === 4 && (
          <form
            onSubmit={handlePasswordSubmit}
            className="pwd-modal-step-container"
          >
            <div className="pwd-nav-header-row">
              <button
                type="button"
                className="pwd-back-arrow-btn"
                onClick={() => setStep(3)}
              >
                <FiArrowLeft />
              </button>
            </div>

            <h2 className="pwd-modal-title">Create Your New Password</h2>

            <div className="pwd-input-group margin-top-md">
              <label className="pwd-input-label">New Password</label>
              <input
                type="password"
                required
                className="pwd-text-input"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="pwd-input-group">
              <label className="pwd-input-label">Confirm Password</label>
              <input
                type="password"
                required
                className="pwd-text-input"
                placeholder="Enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="pwd-btn-block-solid margin-top-lg"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Next"}
            </button>
          </form>
        )}

        {/* STEP 6: PASSWORD RESET SUCCESSFUL */}
        {step === 6 && (
          <div className="pwd-modal-step-container text-center align-center">
            {/* Replaced old multi-colored particles with clean themed cone icon wrapper */}
            <div className="pwd-success-icon-wrapper">
              <GiPartyPopper className="pwd-success-icon" />
            </div>

            <h2 className="pwd-modal-title margin-top-lg font-size-xl">
              Password Reset Successful!
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

export default ChangePasswordModal;
