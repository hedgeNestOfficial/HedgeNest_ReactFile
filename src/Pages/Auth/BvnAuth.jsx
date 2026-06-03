import React from "react";
import Signupimg from "../../assets/Signupimg.jpg";
import { LuArrowLeft } from "react-icons/lu";
import Button from "../../Components/Button"; // Ensure your relative path to Button matches
import "../../Style/Otp.css";
import { BvnAuthData } from "../../JS/signupCard";
import Input from "../../Components/Input";
import { FaChevronDown } from "react-icons/fa6";
import { CiFileOn } from "react-icons/ci";

const BvnAuth = () => {
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

          <h2>Enter BVN or Upload NIN ID</h2>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="Auth-inputs-row">
              <label htmlFor="">BVN</label>

              <div className="input-tag">
                <input type="text" placeholder="Enter BVN number" />
              </div>
            </div>
            or
            <div className="Auth-inputs-row">
              <label htmlFor="">Upload Photo Of NIN ID</label>
              <div className="input-tag">
                <input type="text" placeholder="Attch File" />
                <CiFileOn className="icon1" />
              </div>
            </div>
            <div className="Auth-inputs-row">
              <label htmlFor="">What best describes you</label>
              <div className="input-tag">
                <input type="text" placeholder="Enter" />
                <FaChevronDown className="icon" />
              </div>
            </div>
            <Button text="Next" type="submit" className="otp-submit-btn" />
          </form>
        </div>
      </div>
    </section>
  );
};

export default BvnAuth;
