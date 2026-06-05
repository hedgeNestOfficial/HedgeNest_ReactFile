import React, { useEffect, useState } from "react";
import "../../Style/Signup.css";
import Signupimg from "../../assets/Signupimg.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { LoginData } from "../../JS/signupCard";
import { FcGoogle } from "react-icons/fc";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../Validation/authSchema";
import { loginUser } from "../../Services/authService";
import { login } from "../../Store/UserSlice";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [inputField, setInputField] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    password >= 8 ? setInputField(true) : null;
  });

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
        email: data.email.trim(),
        password: data.password,
      };
      const response = await loginUser(payload);
      const { message, user, token } = response;
      setSuccessMessage(message || "Login Successful");
      dispatch(
        login({
          user,
          token,
        }),
      );

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      setApiError(error.response?.data?.message || "Invalid email or password");
      console.log("LOGIN ERROR:", error);
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

          <h2>Log In To Your Account</h2>

          {apiError && <div className="api-error-message">{apiError}</div>}

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit(onSubmitForm)}>
            {LoginData.map((item, index) => (
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

            <Button
              text={isSubmitting ? "Logging in..." : "Login"}
              type="submit"
              className="signup-submit-btn"
              disabled={isSubmitting}
              color={() => (inputField === true ? "#f6c15c" : "")}
            />

            <div className="form-divider">
              <span>Or</span>
            </div>

            <button type="button" className="google-oauth-btn">
              <FcGoogle className="google-icon" />
              Login with Google
            </button>

            <p className="auth-switch-footer">
              Don’t have an account?{" "}
              <span
                className="highlight-link bold-link"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
