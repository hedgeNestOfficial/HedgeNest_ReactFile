import React, { useEffect, useState } from "react";

import "../../Style/Signup.css";

import Signupimg from "../../assets/Signupimg.jpg";

import Input from "../../Components/Input";
import Button from "../../Components/Button";

import { inputTex } from "../../JS/signupCard";

import { FcGoogle } from "react-icons/fc";
import { LuArrowLeft } from "react-icons/lu";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { signupSchema } from "../../Validation/authSchema";

import { registerUser } from "../../Services/authService";

import { signup } from "../../Store/UserSlice";

const SignupPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [apiError, setApiError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,

    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      terms: false,
    },
  });

  const isChecked = watch("terms");

  useEffect(() => {
    if (!apiError) return;

    const timer = setTimeout(() => {
      setApiError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [apiError]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const onSubmitForm = async (data) => {
    try {
      setApiError("");

      setSuccessMessage("");

      const payload = {
        firstName: data.firstName.trim(),

        lastName: data.lastName?.trim() || "",

        email: data.email,

        phoneNumber: data.phoneNumber,

        password: data.password,
      };

      const response = await registerUser(payload);

      setSuccessMessage(response.message || "OTP sent successfully");

      dispatch(
        signup({
          email: data.email,
          phoneNumber: data.phoneNumber,
        }),
      );

      reset();

      setTimeout(() => {
        navigate("/otp");
      }, 1500);
    } catch (error) {
      setApiError(error.response?.data?.message || "Something went wrong");

      console.log(error);
    }
  };

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

          <h2>Create Your Account</h2>

          {apiError && <div className="api-error-message">{apiError}</div>}

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
            {inputTex.map((item, index) => (
              <Input
                key={index}
                label={item.label}
                type={item.type}
                placeholder={item.placeholder}
                note={item.note}
                className="input-group-wrapper"
                registerProps={register(item.name)}
                error={errors[item.name]}
              />
            ))}

            <div className="checkbox-container">
              <input type="checkbox" id="terms" {...register("terms")} />

              <label htmlFor="terms">
                I agree to the{" "}
                <span className="highlight-link">Terms & Conditions</span> and{" "}
                <span className="highlight-link">Privacy Policy</span>
              </label>
            </div>

            {errors.terms && (
              <span className="terms-error">{errors.terms.message}</span>
            )}

            <Button
              text={isSubmitting ? "Signing up..." : "Sign Up"}
              type="submit"
              className="signup-submit-btn"
              disabled={!isChecked || isSubmitting}
              color={isChecked ? "#c9922a" : "#bdbdbd"}
            />

            <div className="form-divider">
              <span>Or</span>
            </div>

            <button type="button" className="google-oauth-btn">
              <FcGoogle className="google-icon" />
              Sign Up with Google
            </button>

            <p className="auth-switch-footer">
              Already have an account?{" "}
              <span
                className="highlight-link bold-link"
                onClick={() => navigate("/login")}
              >
                Log In
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
