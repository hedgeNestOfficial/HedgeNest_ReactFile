import React, { useEffect } from "react";
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

import toast from "react-hot-toast";

import { signupSchema } from "../../Validation/authSchema";
import { registerUser } from "../../Services/authService";
import { signup } from "../../Store/UserSlice";
import { OrbitProgress } from "react-loading-indicators";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      confirmPassword: "",
      terms: false,
    },
  });

  /*
  =========================================
  WATCHED VALUES
  =========================================
  */

  const watchedFields = watch();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  /*
  =========================================
  PASSWORD MATCH MONITOR
  =========================================
  */

  useEffect(() => {
    if (
      password?.length >= 8 &&
      confirmPassword?.length >= 8 &&
      password !== confirmPassword
    ) {
      toast.error("Passwords do not match");
    }
  }, [password, confirmPassword]);

  /*
  =========================================
  FORM FILLED STATE
  =========================================
  */

  const isFormFilled =
    watchedFields.firstName?.trim() &&
    watchedFields.email?.trim() &&
    watchedFields.phoneNumber?.trim() &&
    watchedFields.password?.trim() &&
    watchedFields.confirmPassword?.trim() &&
    watchedFields.terms;

  /*
  =========================================
  SUBMIT FUNCTION
  =========================================
  */

  const onSubmitForm = async (data) => {
    try {
      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName?.trim() || "",
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
      };

      const response = await registerUser(payload);

      toast.success(response.message || "OTP sent successfully");

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
      toast.error(error.response?.data?.message || "Something went wrong");

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
              text={
                isSubmitting ? (
                  <div className="loader-wrapper">
                    <OrbitProgress color="#c9922a" size="small" />
                  </div>
                ) : (
                  "Sign Up"
                )
              }
              type="submit"
              className="signup-submit-btn"
              disabled={!isFormFilled || isSubmitting}
              color={isFormFilled ? "#c9922a" : "#bdbdbd"}
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
