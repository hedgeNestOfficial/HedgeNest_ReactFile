import React from "react";
import background from "../../assets/Signupimg.jpg";
import { LuArrowLeft } from "react-icons/lu";
import Button from "../../Components/Button";
import "../../Style/Otp.css";

const ReadyComp = () => {
  const otpLength = Array(6).fill("");

  return (
    <section className="signup-section">
      <div className="image-container">
        <img src={background} alt="HedgeNest Protection Illustration" />
      </div>

      <div className="form-container">
        <div className="signup-form-wrapper">
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="otp-inputs-text">
              <h2>You are Raedy!</h2>
            </div>
            <Button text="Next" type="submit" className="otp-submit-btn" />
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReadyComp;
