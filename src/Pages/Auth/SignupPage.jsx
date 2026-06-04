import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import "../../Style/Signup.css";

import Signupimg from "../../assets/Signupimg.jpg";

import { inputTex } from "../../JS/signupCard";

import Input from "../../Components/Input";
import Button from "../../Components/Button";

import { FcGoogle } from "react-icons/fc";
import { LuArrowLeft } from "react-icons/lu";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import axios from "axios";
import { ENDPOINTS } from "../../Config/apiConfig";
import { signup } from "../../Store/UserSlice";

/* =========================
   ZOD SCHEMA
========================= */

const signupSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters"),

  lastName: z.string().optional(),

  email: z.string().email("Please enter a valid email address"),

  phoneNumber: z.string().min(10, "Please enter a valid phone number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character",
    ),

  terms: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the Terms and Conditions",
    }),
  }),
});

const SignupPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [apiError, setApiError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  /* =========================
     REACT HOOK FORM
  ========================= */

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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

  /* =========================
     CLEAR MESSAGES
  ========================= */

  useEffect(() => {
    if (!apiError) return;

    const timer = setTimeout(() => {
      setApiError("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [apiError]);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  /* =========================
     SUBMIT FORM
  ========================= */

  const onSubmitForm = async (data) => {
    try {
      setApiError("");

      setSuccessMessage("");

      const registerPayload = {
        firstName: data.firstName.trim(),

        lastName: data.lastName?.trim() || "",

        email: data.email,

        phoneNumber: data.phoneNumber,

        password: data.password,
      };

      const response = await axios.post(
        ENDPOINTS.AUTH.REGISTER,
        registerPayload,
      );

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.data?.status
      ) {
        const message = response.data?.message || "OTP sent successfully";

        setSuccessMessage(message);

        const payload = response.data?.data || response.data;

        dispatch(signup(payload));

        setTimeout(() => {
          reset();

          navigate("/otp");
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      setApiError(errorMessage);

      console.log(error);
    }
  };

  /* =========================
     INVALID FORM
  ========================= */

  const onInvalidSubmit = (formErrors) => {
    console.log("Validation Errors:", formErrors);
  };

  return (
    <section className="signup-section">
      {/* LEFT IMAGE */}
      <div className="image-container">
        <img src={Signupimg} alt="HedgeNest Protection Illustration" />
      </div>

      {/* FORM SIDE */}
      <div className="form-container">
        <div className="signup-form-wrapper">
          {/* BACK BUTTON */}
          <button
            type="button"
            className="back-arrow-btn"
            onClick={() => window.history.back()}
          >
            <LuArrowLeft className="back-arrow-icon" />
          </button>

          <h2>Create Your Account</h2>

          {/* API ERROR */}
          {apiError && <div className="api-error-message">{apiError}</div>}

          {/* SUCCESS MESSAGE */}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {/* FORM */}
          <form
            className="auth-form"
            onSubmit={handleSubmit(onSubmitForm, onInvalidSubmit)}
          >
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

            {/* TERMS */}
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

            {/* SUBMIT BUTTON */}
            <Button
              text={isSubmitting ? "Signing up..." : "Sign Up"}
              type="submit"
              className="signup-submit-btn"
              disabled={isSubmitting}
            />

            {/* DIVIDER */}
            <div className="form-divider">
              <span>Or</span>
            </div>

            {/* GOOGLE BUTTON */}
            <button type="button" className="google-oauth-btn">
              <FcGoogle className="google-icon" />
              Sign Up with Google
            </button>

            {/* LOGIN LINK */}
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
