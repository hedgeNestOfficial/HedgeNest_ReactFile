import React from "react";
import "../../Style/Signup.css";
import Signupimg from "../../assets/Signupimg.jpg";
import { inputTex } from "../../JS/signupCard";
import Input from "../../Components/Input";

const SignupPage = () => {
  return (
    <section className="signup-section">
      <div className="image-container">
        <img src={Signupimg} alt="" />
      </div>
      <div className="form-container">
        <div className="signup-form-wrapper">
          <h2>Sign Up</h2>
          <form action="">
            {inputTex.map((item, index) => (
              <Input
                key={index}
                label={item.label}
                type={item.type}
                placeholder={item.placeholder}
                className="input-Card"
              />
            ))}

            <div className="checkbox-container">
              <input type="checkbox" />
              <label htmlFor="">I agree to the terms and conditions</label>
            </div>
            <p>
              Already have an account? <span className="login-link">Login</span>
            </p>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
