import React, { useState, useEffect, useRef } from "react";
import "../../Style/ChangePasswordModal.css";
import { FiArrowLeft } from "react-icons/fi";
import { FaCircleNotch } from "react-icons/fa";
import toast from "react-hot-toast";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Flow step management mapping directly to your provided files:
  // 1: Verify Email (image_d97149.png)
  // 2: Email verification loader (image_d97128.png)
  // 3: Enter OTP view (image_d97108.png)
  // 4: Create Password view (image_d970ad.png)
  // 5: Password update loader (image_d97073.png)
  // 6: Success completion view (image_d9704e.png)
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [timer, setTimer] = useState(30);

  const otpRefs = useRef([]);

  // Handles countdown timer logic for the OTP view
  useEffect(() => {
    let interval = null;
    if (step === 3 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

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

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Transition to loading spinner (image_d97128.png)
    setStep(2);

    // Simulate validation request
    setTimeout(() => {
      setStep(3); // Transition to Enter OTP view (image_d97108.png)
    }, 1500);
  };

  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/\D/g, ""); // Accept digits only
    if (!value) return;

    let updatedOtp = [...otp];
    updatedOtp[index] = value.substring(value.length - 1);
    setOtp(updatedOtp);

    // Automatically shift focus to next input block
    if (index < 5 && element.value) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      let updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);

      // Automatically shift focus backwards on backspace
      if (index > 0) {
        otpRefs.current[index - 1].focus();
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const enteredCode = otp.join("");
    if (enteredCode.length !== 6) {
      toast.error("Please enter a valid 6-digit verification code");
      return;
    }
    // Transition to Create Password view (image_d970ad.png)
    setStep(4);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    // Transition to Processing Loader (image_d97073.png)
    setStep(5);

    // Simulate api database push
    setTimeout(() => {
      setStep(6); // Success (image_d9704e.png)
    }, 2000);
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(30);
      toast.success("A new verification code has been dispatched!");
    }
  };

  return (
    <div className="pwd-modal-overlay" onClick={onClose}>
      <div
        className={`pwd-modal-card ${step === 2 || step === 5 ? "pwd-loading-dims" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* STEP 1: VERIFY EMAIL ADDRESS (image_d97149.png) */}
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
              <button type="submit" className="pwd-btn-continue">
                Continue
              </button>
            </div>
          </form>
        )}

        {/* STEP 2 & 5: LOADING STATE SPINNERS (image_d97128.png / image_d97073.png) */}
        {(step === 2 || step === 5) && (
          <div className="pwd-spinner-wrapper">
            <FaCircleNotch className="pwd-loading-icon" />
          </div>
        )}

        {/* STEP 3: ENTER OTP CODE VIEW (image_d97108.png) */}
        {step === 3 && (
          <form onSubmit={handleOtpSubmit} className="pwd-modal-step-container">
            <button
              type="button"
              className="pwd-back-arrow-btn"
              onClick={() => setStep(1)}
            >
              <FiArrowLeft />
            </button>

            <h2 className="pwd-modal-title margin-top-md">Enter OTP</h2>
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

            <button type="submit" className="pwd-btn-block-solid margin-top-md">
              Next
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

        {/* STEP 4: CREATE YOUR NEW PASSWORD (image_d970ad.png) */}
        {step === 4 && (
          <form
            onSubmit={handlePasswordSubmit}
            className="pwd-modal-step-container"
          >
            <button
              type="button"
              className="pwd-back-arrow-btn"
              onClick={() => setStep(3)}
            >
              <FiArrowLeft />
            </button>

            <h2 className="pwd-modal-title margin-top-md">
              Create Your New Password
            </h2>

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

            <button type="submit" className="pwd-btn-block-solid margin-top-lg">
              Next
            </button>
          </form>
        )}

        {/* STEP 6: PASSWORD RESET SUCCESSFUL (image_d9704e.png) */}
        {step === 6 && (
          <div className="pwd-modal-step-container text-center align-center">
            <div className="pwd-confetti-badge-circle">
              {/* Clean decorative confetti canvas structure matching image mockup graphic */}
              <div className="pwd-mini-confetti-particle p1"></div>
              <div className="pwd-mini-confetti-particle p2"></div>
              <div className="pwd-mini-confetti-particle p3"></div>
              <div className="pwd-mini-confetti-particle p4"></div>
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
