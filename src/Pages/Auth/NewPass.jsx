import React, { useEffect, useState } from "react";
import "../../Style/NewPass.css";
import background from "../../assets/Signupimg.jpg";
import { LuArrowLeft, LuEye, LuEyeOff } from "react-icons/lu";
import Button from "../../Components/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";
import whiteLogo from "../../assets/white logo.png";
import { resetPassword } from "../../Services/authService";

const NewPass = () => {
  const navigate = useNavigate();
  const tempUser = useSelector((state) => state.user.tempUser);
  const userEmail = tempUser?.email || "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("newPassword");

  const watchedConfirmPassword = watch("confirmPassword");

  /* =========================================
     LIVE PASSWORD MATCH VALIDATION
  ========================================= */

  useEffect(() => {
    if (watchedConfirmPassword && watchedPassword !== watchedConfirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
    } else {
      clearErrors("confirmPassword");
    }
  }, [watchedPassword, watchedConfirmPassword, setError, clearErrors]);

  /* =========================================
     SUBMIT RESET PASSWORD
  ========================================= */

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const payload = {
        email: userEmail,
        otp: data.otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      const response = await resetPassword(payload);

      toast.success(response?.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="signup-section">
      {/* LEFT IMAGE */}
      <div className="image-container">
        <img src={background} alt="HedgeNest Protection Illustration" />
        <div
          className="brand-group"
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: "2%",
            left: "2%",
          }}
        >
          <div className="brand-logo">
            <img
              onClick={() => navigate("/")}
              src={whiteLogo}
              alt="HedgeNest Logo"
            />
          </div>

          <span className="brand-name">HedgeNest</span>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="form-container">
        <div className="signup-form-wrapper">
          {/* BACK BUTTON */}
          <div className="form-header-mobile">
            <div className="brand-group-mobile">
              <img src={whiteLogo} alt="Logo" />
            </div>
            <button
              type="button"
              className="back-arrow-btn"
              onClick={() => window.history.back()}
            >
              <LuArrowLeft className="back-arrow-icon" />
            </button>
          </div>

          {/* TITLE */}
          <h2>Create Your New Password</h2>

          <p className="newpass-subtitle">
            Enter the OTP sent to your email and create a new password.
          </p>

          {/* FORM */}
          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            {/* OTP */}
            <div className="auth-inputs-row">
              <label>OTP Code</label>

              <div className="input-tag">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  {...register("otp", {
                    required: "OTP is required",
                    minLength: {
                      value: 6,
                      message: "OTP must be 6 digits",
                    },
                  })}
                />
              </div>

              {errors.otp && (
                <span className="input-error">{errors.otp.message}</span>
              )}
            </div>

            {/* NEW PASSWORD */}
            <div className="auth-inputs-row">
              <label>New Password</label>

              <div className="input-tag">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <LuEyeOff /> : <LuEye />}
                </button>
              </div>

              {errors.newPassword && (
                <span className="input-error">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="auth-inputs-row">
              <label>Confirm Password</label>

              <div className="input-tag">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                  })}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <LuEyeOff /> : <LuEye />}
                </button>
              </div>

              {errors.confirmPassword && (
                <span className="input-error">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* BUTTON */}
            <Button
              text={
                isLoading ? (
                  <div className="button-loader">
                    <div className="loader-wrapper">
                      <OrbitProgress color="#fff" size="small" />
                    </div>
                  </div>
                ) : (
                  "Reset Password"
                )
              }
              type="submit"
              className="otp-submit-btn"
              disabled={isLoading}
              color="#c9922a"
            ></Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewPass;
