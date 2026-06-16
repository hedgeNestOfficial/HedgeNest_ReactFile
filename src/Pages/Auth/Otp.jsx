import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";
import "../../Style/Otp.css";
import Signupimg from "../../assets/Signupimg.jpg";
import Button from "../../Components/Button";
import { LuArrowLeft } from "react-icons/lu";
import { verifyOtp, resendOtp } from "../../Services/authService";
import whiteLogo from "../../assets/white logo.png";
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

  // Countdown timer states
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Timer Effect Logic
  useEffect(() => {
    let timerId;
    if (countdown > 0) {
      setCanResend(false);
      timerId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    // Clean up interval on component unmount to prevent memory leaks
    return () => clearInterval(timerId);
  }, [countdown]);

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

  const handleResendOtp = async () => {
    // Structural Guard: prevent API requests if timer isn't up
    if (!canResend) return;

    try {
      const response = await resendOtp({
        email: userEmail,
      });

      toast.success(response?.message || "OTP resent successfully");

      // Reset layout defaults
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      // Restart countdown track back to 30 seconds
      setCountdown(30);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      console.log(error);
    }
  };

  return (
    <section className="signup-section">
      <div className="image-container">
        <div
          className="brand-group"
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: "5%",
            left: "2%",
            gap: "10px",
          }}
        >
          <div className="brand-logo">
            <img
              onClick={() => navigate("/")}
              src={whiteLogo}
              alt="HedgeNest Logo"
            />
          </div>
          <span className="brand-name">HedgeNest</span>
        </div>
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
                Didn’t receive code?{" "}
                {canResend ? (
                  <span
                    onClick={handleResendOtp}
                    className="resend-link active-link"
                  >
                    Resend
                  </span>
                ) : (
                  <span className="resend-link disabled-countdown">
                    Resend in {countdown}s
                  </span>
                )}
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
