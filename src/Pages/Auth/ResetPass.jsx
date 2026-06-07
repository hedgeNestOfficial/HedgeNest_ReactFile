import React, { useState } from "react";
import background from "../../assets/Signupimg.jpg";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "../../Components/Button";
import "../../Style/Otp.css";

import { resendOtp } from "../../Services/authService";
import { signup } from "../../Store/UserSlice";

const ResetPass = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const watchedEmail = watch("email");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const payload = {
        email: data.email.trim(),
      };

      const response = await resendOtp(payload);

      toast.success(response?.message || "OTP sent successfully");

      dispatch(
        signup({
          email: data.email,
          phoneNumber: "",
        }),
      );

      setTimeout(() => {
        navigate("/otp");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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

          <h2>Reset Password</h2>

          <p className="otp-subtitle">
            A One-Time Password will be sent to your email address
          </p>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="Auth-inputs-row">
              <label>Email Address</label>

              <div className="input-tag">
                <input
                  type="email"
                  className="otp-box-email"
                  placeholder="Enter email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
              </div>

              {errors.email && (
                <span className="terms-error">{errors.email.message}</span>
              )}
            </div>

            <Button
              text={isLoading ? "Sending..." : "Next"}
              type="submit"
              className="otp-submit-btn"
              disabled={!watchedEmail || isLoading}
              color={watchedEmail ? "#c9922a" : "#bdbdbd"}
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default ResetPass;
