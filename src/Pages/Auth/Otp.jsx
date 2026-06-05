import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "../../Style/Otp.css";
import Signupimg from "../../assets/Signupimg.jpg";
import Button from "../../Components/Button";
import { LuArrowLeft } from "react-icons/lu";
import { verifyOtp, resendOtp } from "../../Services/authService";

const Otp = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const tempUser = useSelector((state) => state.user.tempUser);
  const userEmail = tempUser?.email || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!apiError) return;

    const timer = setTimeout(() => {
      setApiError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [apiError]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setApiError("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");

      const payload = {
        email: userEmail,
        otp: otpCode,
      };

      const response = await verifyOtp(payload);

      setSuccessMessage(response?.message || "OTP verified successfully");

      setTimeout(() => {
        navigate("/bvn");
      }, 1500);
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Invalid OTP. Please try again.",
      );

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setApiError("");

      setSuccessMessage("");

      const response = await resendOtp({
        email: userEmail,
      });

      setSuccessMessage(response?.message || "OTP resent successfully");

      setOtp(["", "", "", "", "", ""]);

      inputRefs.current[0]?.focus();
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed to resend OTP");

      console.log(error);
    }
  };

  return (
    <section className="signup-section">
      <div className="image-container">
        <img src={Signupimg} alt="HedgeNest Protection Illustration" />
      </div>

      <div className="form-container">
        <div className="signup-form-wrapper">
          <button
            type="button"
            className="back-arrow-btn"
            onClick={() => window.history.back()}
          >
            <LuArrowLeft className="back-arrow-icon" />
          </button>

          <h2>OTP Verification</h2>

          <p className="otp-subtitle">
            Enter the 6-digit code sent to
            <span className="user-email-highlight"> {userEmail}</span>
          </p>

          {apiError && <div className="api-error-message">{apiError}</div>}

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <div className="otp-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  className="otp-box"
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            {/* BUTTON */}
            <Button
              text={isLoading ? "Verifying..." : "Verify OTP"}
              type="submit"
              className="signup-submit-btn"
              disabled={isLoading}
              color="#c9922a"
            />

            <div className="otp-footer-actions">
              <p>
                Didn’t receive code?
                <span onClick={handleResendOtp}>Resend</span>
              </p>

              <p className="edit-email" onClick={() => navigate("/signup")}>
                Edit email
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Otp;
