import React from "react";
import "../../Style/Signup.css";
import Signupimg from "../../assets/Signupimg.jpg";
import { inputTex } from "../../JS/signupCard";
import Input from "../../Components/Input";

const SignupPage = () => {
  return (
    <section className="signup-section">
      {/* Left Column: Media Banner */}
      <div className="image-container">
        <img src={Signupimg} alt="HedgeNest Protection Illustration" />
      </div>

      {/* Right Column: Form Container */}
      <div className="form-container">
        <div className="signup-form-wrapper">
          <button
            type="button"
            className="back-arrow-btn"
            onClick={() => window.history.back()}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>

          <h2>Create Your Account</h2>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            {inputTex.map((item, index) => (
              <Input
                key={index}
                label={item.label}
                type={item.type}
                placeholder={item.placeholder}
                note={item.note}
                className="input-group-wrapper"
              />
            ))}

            <div className="checkbox-container">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I agree to the{" "}
                <span className="highlight-link">Terms & Conditions</span> and{" "}
                <span className="highlight-link">Privacy Policy.</span>
              </label>
            </div>

            <button type="submit" className="signup-submit-btn">
              Sign Up
            </button>

            <div className="form-divider">
              <span>Or</span>
            </div>

            <button type="button" className="google-oauth-btn">
              <img
                src="https://i.postimg.cc/906D76gG/google-icon.png"
                alt="Google Logo"
                className="google-icon"
              />
              Sign Up with Google
            </button>

            <p className="auth-switch-footer">
              Already have an account?{" "}
              <span className="highlight-link bold-link">Log In</span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
