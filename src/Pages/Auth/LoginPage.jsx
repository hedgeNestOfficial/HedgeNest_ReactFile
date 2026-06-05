import React from "react";
import "../../Style/Signup.css";
import Signupimg from "../../assets/Signupimg.jpg";
import { inputTex, LoginData } from "../../JS/signupCard";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { FcGoogle } from "react-icons/fc";
import { LuArrowLeft } from "react-icons/lu";

const LoginPage = () => {
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
            <LuArrowLeft className="back-arrow-icon" />
          </button>

          <h2>Log In Your Account</h2>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            {LoginData.map((item, index) => (
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

            <Button
              text="Login"
              type="submit"
              className="signup-submit-btn"
            ></Button>

            <div className="form-divider">
              <span>Or</span>
            </div>

            <button type="button" className="google-oauth-btn">
              <FcGoogle className="google-icon" />
              Login with Google
            </button>

            <p className="auth-switch-footer">
              Don’t have an account?{" "}
              <span className="highlight-link bold-link">Login</span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
