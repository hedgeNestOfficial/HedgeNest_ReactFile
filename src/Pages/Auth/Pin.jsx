import React from "react";
import Signupimg from "../../assets/Signupimg.jpg";
// import { LuArrowLeft } from "react-icons/lu";
import { LuArrowLeft } from "react-icons/lu";
import Button from "../../Components/Button";
import "../../Style/Otp.css";
const Pin = () => {
  const otpLength = Array(6).fill("");

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

          <h2>Enter PIN</h2>
          <p className="otp-subtitle">
            Create Your Transaction Pin
            {/* <br />
            <span className="user-email-highlight">
              he*****22@gmail.com
            </span>{" "}
            for verification */}
          </p>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="otp-inputs-row">
              <label htmlFor="">Enter Pin</label>
              <div className="otp-input">
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
            </div>
            <div className="otp-inputs-row">
              <label htmlFor="">Confirm Pin</label>
              <div className="otp-input">
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
            </div>
            <Button text="Next" type="submit" className="otp-submit-btn" />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Pin;
