import React from "react";
import "../../Style/Signup.css";
import Signupimg from "../../assets/Signupimg.jpg";
import Input from "../../Components/Input";
import Button from "../../Components/Button";
import { LoginData } from "../../JS/signupCard";
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginSchema } from "../../Validation/authSchema";
import { loginUser } from "../../Services/authService";
import { login } from "../../Store/UserSlice";
import { OrbitProgress } from "react-loading-indicators";
import whiteLogo from "../../assets/white logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  const watchedFields = watch();

  const isFormFilled =
    watchedFields.email?.trim() && watchedFields.password?.trim();

  const onSubmitForm = async (data) => {
    try {
      const payload = {
        email: data.email.trim(),
        password: data.password,
      };

      const response = await loginUser(payload);

      const { message, user, wallet, token } = response;

      dispatch(
        login({
          user,
          wallet,
          token,
        }),
      );

      localStorage.setItem("authToken", token);

      localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem("wallet", JSON.stringify(wallet));

      toast.success(message || "Login Successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      toast.error(
        error?.response?.data?.message || "Invalid email or password",
      );
    }
  };

  return (
    <section className="signup-section">
      <div className="image-container">
        <img src={Signupimg} alt="HedgeNest Protection Illustration" />

        <div
          className="brand-group"
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: "5%",
            left: "2%",
            gap: "10px",
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

      <div className="form-container">
        <div className="signup-form-wrapper">
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

          <h2>Log In To Your Account</h2>

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
              text={
                isSubmitting ? (
                  <div className="loader-wrapper">
                    <OrbitProgress color="#ffffff" size="small" />
                  </div>
                ) : (
                  "Login"
                )
              }
              type="submit"
              className={`signup-submit-btn ${
                isFormFilled ? "active-submit-btn" : "disabled-submit-btn"
              }`}
              disabled={!isFormFilled || isSubmitting}
            />

            <p
              onClick={() => navigate("/reset")}
              className="forgot-password-text"
              style={{
                textAlign: "left",
              }}
            >
              Forgotten password?
            </p>

            <p
              className="auth-switch-footer"
              style={{
                textAlign: "left",
              }}
            >
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
