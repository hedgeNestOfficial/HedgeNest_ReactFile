import React from "react";
import background from "../assets/Signupimg.jpg";
import { LuArrowLeft } from "react-icons/lu";
import Button from "../../Components/Button"; // Ensure your relative path to Button matches
import "../Style/Otp.css";
const BvnAuth = () => {
  const otpLength = Array(6).fill("");

  return (
    <section className="signup-section">
      <div className="image-container">
        <img src={background} alt="HedgeNest Protection Illustration" />
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

          <h2>Enter OTP</h2>
          <p className="otp-subtitle">
            A 6-digit code has been sent to your email
            <br />
            <span className="user-email-highlight">
              he*****22@gmail.com
            </span>{" "}
            for verification
          </p>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="otp-inputs-row">
              {otpLength.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="otp-box"
                />
              ))}
            </div>

            <Button text="Next" type="submit" className="otp-submit-btn" />

            <div className="down-action-container">
              <p className="resend-countdown">
                Resend code <span className="countdown-timer">30s</span>
              </p>
              <p className="edit-email-action">Edit email address</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BvnAuth;
