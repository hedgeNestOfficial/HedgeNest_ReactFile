import React from "react";
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
import toast from "react-hot-toast";
import { loginSchema } from "../../Validation/authSchema";
import { loginUser } from "../../Services/authService";
import { login } from "../../Store/UserSlice";
import { OrbitProgress } from "react-loading-indicators";

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

      const { message, user, token } = response;

      dispatch(
        login({
          user,
          token,
        }),
      );

      localStorage.setItem("authToken", token);

      localStorage.setItem("user", JSON.stringify(user));

      toast.success(message || "Login Successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      toast.error(error.response?.data?.message || "Invalid email or password");
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
                    <OrbitProgress color="#c9922a" size="small" />
                  </div>
                ) : (
                  "Login"
                )
              }
              type="submit"
              className="signup-submit-btn"
              disabled={!isFormFilled || isSubmitting}
              color={
                isFormFilled ? "liner-grediant(#f6c15c, #a07017)" : "#bdbdbd"
              }
            />
            <p
              onClick={() => navigate("/reset")}
              style={{ color: "#fac156", cursor: "pointer" }}
            >
              {" "}
              Forgoten password?{" "}
            </p>
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
