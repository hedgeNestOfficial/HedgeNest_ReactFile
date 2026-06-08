import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";

import "../../Style/Otp.css";
import Signupimg from "../../assets/Signupimg.jpg";
import Button from "../../Components/Button";
import { LuArrowLeft } from "react-icons/lu";

import { verifyOtp, resendOtp } from "../../Services/authService";

import toast from "react-hot-toast";

const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const inputRefs = useRef([]);

  const tempUser = useSelector((state) => state.user.tempUser);

  const userEmail = tempUser?.email || "";

  const purpose = location.state?.purpose || "signup";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];

    updatedOtp[index] = value;

    setOtp(updatedOtp);

    // AUTO MOVE
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // HANDLE BACKSPACE
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");

      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        email: userEmail,
        otp: otpCode,
      };

      const response = await verifyOtp(payload);

      toast.success(response?.message || "OTP verified successfully");

      // HANDLE DIFFERENT FLOWS
      setTimeout(() => {
        switch (purpose) {
          case "signup":
            navigate("/kycauth");
            break;

          case "reset-password":
            navigate("/newpass");
            break;

          case "pin":
            navigate("/dashboard");
            break;

          default:
            navigate("/");
        }
      }, 1500);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid OTP. Please try again.",
      );

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({
        email: userEmail,
      });

      toast.success(response?.message || "OTP resent successfully");

      setOtp(["", "", "", "", "", ""]);

      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");

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

          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <div className="otp-input-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  className="otp-box"
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <Button
              text={
                isLoading ? (
                  <div className="loader-wrapper">
                    <OrbitProgress color="#fff" size="small" />
                  </div>
                ) : (
                  "Verify OTP"
                )
              }
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
