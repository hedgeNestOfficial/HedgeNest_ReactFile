import React from "react";
import background from "../assets/Signupimg.jpg";
import { LuArrowLeft } from "react-icons/lu";
import Button from "../Components/Button"; // Ensure your relative path to Button matches
import "../Style/Otp.css";
import { BvnAuthData } from "../JS/signupCard";
import Input from "../Components/Input";

const Loading = () => {
  return (
    <section className="signup-section">
      <div className="image-container">
        <img src={background} alt="HedgeNest Protection Illustration" />
      </div>

      <div className="form-container">
        <div className="signup-form-wrapper">
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="otp-inputs-text">
              <span class="loader"></span>
            </div>
            <Button text="Next" type="submit" className="otp-submit-btn" />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Loading;
