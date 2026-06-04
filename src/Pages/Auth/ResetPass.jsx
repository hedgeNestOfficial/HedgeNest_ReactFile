import React from "react";
import background from "../../assets/Signupimg.jpg";
import { LuArrowLeft } from "react-icons/lu";
import Button from "../../Components/Button"; // Ensure your relative path to Button matches
import "../../Style/Otp.css";
import { BvnAuthData } from "../../JS/signupCard";
import Input from "../../Components/Input";
import { FaChevronDown } from "react-icons/fa6";
import { CiFileOn } from "react-icons/ci";

const ResetPass = () => {
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

          <h2>Enter Your Email Address</h2>
          <p>A One-Time Password will be sent to your email address</p>
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="Auth-inputs-row">
              <label htmlFor="">Email adrress</label>

              <div className="input-tag">
                <input type="text" placeholder="Enter email" />
              </div>
            </div>

            <Button text="Next" type="submit" className="otp-submit-btn" />
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPass;
