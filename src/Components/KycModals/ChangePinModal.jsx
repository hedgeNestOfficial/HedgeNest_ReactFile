import React, { useState, useEffect, useRef } from "react";
import "../../Style/ChangePinModal.css";
import { FiArrowLeft } from "react-icons/fi";
import { OrbitProgress } from "react-loading-indicators";
import toast from "react-hot-toast";

const ChangePinModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Updated Flow step management:
  // 1: Verify Email
  // 2: Email verification full-card loader
  // 3: Enter OTP view (6 boxes)
  // 4: Combined Create & Confirm PIN view (As seen in image_d8f8cd.png)
  // 5: Success completion view
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [newPin, setNewPin] = useState(new Array(6).fill(""));
  const [confirmPin, setConfirmPin] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [isSubmittingPin, setIsSubmittingPin] = useState(false);

  const otpRefs = useRef([]);
  const pinRefs = useRef([]);
  const confirmPinRefs = useRef([]);

  // Live countdown timer logic for OTP screen
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

  // Reset all states upon modal mount/dismount
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEmail("");
      setOtp(new Array(6).fill(""));
      setNewPin(new Array(6).fill(""));
      setConfirmPin(new Array(6).fill(""));
      setTimer(30);
      setIsSubmittingPin(false);
    }
  }, [isOpen]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setStep(2);
    setTimeout(() => {
      setStep(3);
    }, 1500);
  };

  const handleBoxChange = (
    value,
    index,
    stateArr,
    setStateArr,
    refGroup,
    maxIdx,
  ) => {
    const sanitized = value.replace(/\D/g, "");
    if (!sanitized) return;

    let updated = [...stateArr];
    updated[index] = sanitized.substring(sanitized.length - 1);
    setStateArr(updated);

    if (index < maxIdx) {
      refGroup.current[index + 1].focus();
    }
  };

  const handleBoxKeyDown = (e, index, stateArr, setStateArr, refGroup) => {
    if (e.key === "Backspace") {
      let updated = [...stateArr];
      updated[index] = "";
      setStateArr(updated);

      if (index > 0) {
        refGroup.current[index - 1].focus();
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.join("").length !== 6) {
      toast.error("Please enter your complete 6-digit verification code");
      return;
    }
    setStep(4);
  };

  // Handles submission for the combined screen layout
  const handlePinFormSubmit = (e) => {
    e.preventDefault();
    const pinStr = newPin.join("");
    const confirmStr = confirmPin.join("");

    if (pinStr.length !== 6) {
      toast.error("Please fill in your 6-digit Enter Pin row");
      return;
    }
    if (confirmStr.length !== 6) {
      toast.error("Please fill in your 6-digit Confirm Pin row");
      return;
    }
    if (pinStr !== confirmStr) {
      toast.error("PIN codes do not match!");
      return;
    }

    // Show consistent loading spinner directly inside button as shown in image_d8f8cd.png
    setIsSubmittingPin(true);

    setTimeout(() => {
      setIsSubmittingPin(false);
      setStep(5); // Go directly to success screen
    }, 2000);
  };

  const handleResendCode = () => {
    if (timer === 0) {
      setTimer(30);
      toast.success("Verification code resent successfully!");
    }
  };

  return (
    <div className="pin-modal-overlay" onClick={onClose}>
      <div
        className={`pin-modal-card ${step === 2 ? "pin-loading-dims" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* STEP 1: VERIFY EMAIL ADDRESS */}
        {step === 1 && (
          <form
            onSubmit={handleEmailSubmit}
            className="pin-modal-step-container"
          >
            <h2 className="pin-modal-title">Verify Email Address</h2>
            <p className="pin-modal-subtitle">
              Enter your email address so we know it's you
            </p>

            <div className="pin-input-group">
              <label className="pin-input-label">Email address</label>
              <input
                type="email"
                required
                className="pin-text-input"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="pin-actions-container">
              <button
                type="button"
                className="pin-btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="pin-btn-continue">
                Continue
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: EMAIL VERIFICATION LOADER */}
        {step === 2 && (
          <div className="pin-spinner-wrapper">
            <OrbitProgress color="#f2bf5e" size="medium" />
          </div>
        )}

        {/* STEP 3: ENTER OTP CODE VIEW */}
        {step === 3 && (
          <form onSubmit={handleOtpSubmit} className="pin-modal-step-container">
            <button
              type="button"
              className="pin-back-arrow-btn"
              onClick={() => setStep(1)}
            >
              <FiArrowLeft />
            </button>

            <h2 className="pin-modal-title margin-top-md">Enter OTP</h2>
            <p className="pin-modal-subtitle">
              A 6-digit code has been sent to this email <br />
              <span className="pin-masked-email">
                {email
                  ? email.replace(/(..)(.*)(@.*)/, "$1******$3")
                  : "he*****22@gmail.com"}
              </span>
            </p>

            <div className="pin-otp-grid-row">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  ref={(el) => (otpRefs.current[idx] = el)}
                  className="pin-box-input squares-6"
                  value={digit}
                  onChange={(e) =>
                    handleBoxChange(
                      e.target.value,
                      idx,
                      otp,
                      setOtp,
                      otpRefs,
                      5,
                    )
                  }
                  onKeyDown={(e) =>
                    handleBoxKeyDown(e, idx, otp, setOtp, otpRefs)
                  }
                />
              ))}
            </div>

            <button type="submit" className="pin-btn-block-solid margin-top-md">
              Next
            </button>

            <div className="pin-otp-footer-links">
              <span className="pin-resend-timer-text">
                Resend code{" "}
                {timer > 0 ? (
                  <strong className="color-dark">{timer}s</strong>
                ) : (
                  <span
                    className="pin-resend-active-link"
                    onClick={handleResendCode}
                  >
                    Now
                  </span>
                )}
              </span>
              <button
                type="button"
                className="pin-edit-email-btn"
                onClick={() => setStep(1)}
              >
                Edit email address
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: COMBINED CREATE & CONFIRM TRANSACTION PIN SCREEN (image_d8f8cd.png) */}
        {step === 4 && (
          <form
            onSubmit={handlePinFormSubmit}
            className="pin-modal-step-container"
          >
            <button
              type="button"
              className="pin-back-arrow-btn"
              onClick={() => setStep(3)}
            >
              <FiArrowLeft />
            </button>

            <h2 className="pin-modal-title margin-top-md">
              Create Your Transaction Pin
            </h2>

            {/* Row 1: Enter Pin */}
            <div className="pin-stack-section">
              <label className="pin-stack-label">Enter Pin</label>
              <div className="pin-otp-grid-row">
                {newPin.map((digit, idx) => (
                  <input
                    key={idx}
                    type="password"
                    maxLength={1}
                    ref={(el) => (pinRefs.current[idx] = el)}
                    className="pin-box-input squares-6"
                    value={digit}
                    onChange={(e) =>
                      handleBoxChange(
                        e.target.value,
                        idx,
                        newPin,
                        setNewPin,
                        pinRefs,
                        5,
                      )
                    }
                    onKeyDown={(e) =>
                      handleBoxKeyDown(e, idx, newPin, setNewPin, pinRefs)
                    }
                  />
                ))}
              </div>
            </div>

            {/* Row 2: Confirm Pin */}
            <div className="pin-stack-section margin-top-sm">
              <label className="pin-stack-label">Confirm Pin</label>
              <div className="pin-otp-grid-row">
                {confirmPin.map((digit, idx) => (
                  <input
                    key={idx}
                    type="password"
                    maxLength={1}
                    ref={(el) => (confirmPinRefs.current[idx] = el)}
                    className="pin-box-input squares-6"
                    value={digit}
                    onChange={(e) =>
                      handleBoxChange(
                        e.target.value,
                        idx,
                        confirmPin,
                        setConfirmPin,
                        confirmPinRefs,
                        5,
                      )
                    }
                    onKeyDown={(e) =>
                      handleBoxKeyDown(
                        e,
                        idx,
                        confirmPin,
                        setConfirmPin,
                        confirmPinRefs,
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Consistent Application Spinner inside the Submission Button */}
            <button
              type="submit"
              className="pin-btn-block-solid margin-top-xl display-flex-center"
              disabled={isSubmittingPin}
            >
              {isSubmittingPin ? (
                <OrbitProgress color="#ffffff" size="small" />
              ) : (
                "Next"
              )}
            </button>
          </form>
        )}

        {/* STEP 5: PIN RESET SUCCESSFUL */}
        {step === 5 && (
          <div className="pin-modal-step-container text-center align-center">
            <div className="pin-confetti-badge-circle">
              <div className="pin-mini-confetti-particle cp1"></div>
              <div className="pin-mini-confetti-particle cp2"></div>
              <div className="pin-mini-confetti-particle cp3"></div>
              <div className="pin-mini-confetti-particle cp4"></div>
            </div>

            <h2 className="pin-modal-title margin-top-lg font-size-xl">
              PIN Reset Successful!
            </h2>

            <button
              type="button"
              className="pin-btn-block-solid margin-top-lg"
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

export default ChangePinModal;
