import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
import { ENDPOINTS } from "../../config/apiConfig";
import { signup } from "../../Store/UserSlice";

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
      "Password must contain at least one special character (e.g., @, $, #, _)",
    ),
  terms: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the Terms and Conditions to proceed",
    }),
  }),
});

const SignupPage = () => {
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // TIMEOUT MECHANISM: Automatically clear error messages after 5 seconds
  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError("");
      }, 5000);
      return () => clearTimeout(timer); // Clean up timer on unmount
    }
  }, [apiError]);

  // TIMEOUT MECHANISM: Automatically clear success messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer); // Clean up timer on unmount
    }
  }, [successMessage]);

  const onSubmitForm = async (data) => {
    setApiError("");
    setSuccessMessage("");

    try {
      const nameParts = data.firstName.trim().split(/\s+/); // Assuming firstName might contain multiple words
      const firstName = nameParts[0];
      const lastName = data.lastName || nameParts.slice(1).join(" ") || "";

      const registerPayload = {
        firstName,
        lastName,
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
        response.data.status
      ) {
        const serverMsg = response.data?.message || "OTP sent successfully!";
        setSuccessMessage(serverMsg);

        const targetPayload = response.data?.data || response.data;
        dispatch(signup(targetPayload));

        setTimeout(() => {
          navigate("/otp");
          reset();
        }, 1500);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setApiError(errorMsg);
    }
  };

  const onInvalidSubmit = (formErrors) => {
    console.log("❌ Zod Validation Blocked Submission:", formErrors);
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

          {apiError && (
            <div
              style={{
                color: "#ef4444",
                marginBottom: "10px",
                fontSize: "0.9rem",
                backgroundColor: "#fef2f2",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              ⚠️ {apiError}
            </div>
          )}
          {successMessage && (
            <div
              style={{
                color: "#22c55e",
                marginBottom: "10px",
                fontSize: "0.9rem",
                backgroundColor: "#f0fdf4",
                padding: "8px",
                borderRadius: "4px",
              }}
            >
              ✅ {successMessage}
            </div>
          )}

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

            <div className="checkbox-container">
              <input type="checkbox" id="terms" {...register("terms")} />
              <label htmlFor="terms">
                I agree to the{" "}
                <span className="highlight-link">Terms & Conditions</span> and{" "}
                <span className="highlight-link">Privacy Policy.</span>
              </label>
            </div>
            {errors.terms && (
              <span
                className="input-note"
                style={{
                  color: "#ef4444",
                  display: "block",
                  marginTop: "-12px",
                  fontWeight: "500",
                }}
              >
                {errors.terms.message}
              </span>
            )}

            <Button
              text={isSubmitting ? "Creating Account..." : "Sign Up"}
              type="submit"
              className="signup-submit-btn"
              disabled={isSubmitting}
              style={{
                background: isSubmitting ? "#b3b3b3" : undefined,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
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
              <span className="highlight-link bold-link">Log In</span>
            </p>
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
