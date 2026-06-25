import React, { useRef, useState, useEffect } from "react";
import Signupimg from "../../assets/Signupimg.jpg";
import { LuArrowLeft } from "react-icons/lu";
import Button from "../../Components/Button";
import "../../Style/Otp.css";
import { useNavigate, useLocation } from "react-router-dom"; // 🟢 Added useLocation
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { clearTempUser } from "../../Store/UserSlice";
import { createPin } from "../../Services/authService";
import whiteLogo from "../../assets/white logo.png";
import { OrbitProgress } from "react-loading-indicators";

const Pin = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 🟢 Instantiated location state tracking
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  // Fetch slice keys
  const {
    user,
    tempUser,
    token: reduxOnboardingToken,
  } = useSelector((state) => state.user);

  // 🟢 FALLBACK STRATEGY: Read state from Redux store, or extract it from Router location history state
  const userEmail = tempUser?.email || location.state?.email;
  const onboardingToken = reduxOnboardingToken || location.state?.token;

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 🛡️ ON-MOUNT ROUTE GUARDS
   * 1. Dynamic check: If user is actively authenticated, bounce them to the main workspace.
   * 2. URL protection: If an unauthenticated guest tries to visit without valid context data, kick them to login.
   */
  useEffect(() => {
    if (user) {
      console.log(
        "🛡️ User already authenticated. Redirecting away from onboarding...",
      );
      navigate("/dashboard");
      return;
    }

    if (!onboardingToken || !userEmail) {
      console.log(
        "🛡️ No active onboarding session context detected. Redirecting to login...",
      );
      navigate("/login");
    }
  }, [user, onboardingToken, userEmail, navigate]);

  const handleChange = (value, index, type) => {
    if (!/^\d?$/.test(value)) return;

    if (type === "pin") {
      const updatedPin = [...pin];
      updatedPin[index] = value;
      setPin(updatedPin);
    } else {
      const updatedConfirmPin = [...confirmPin];
      updatedConfirmPin[index] = value;
      setConfirmPin(updatedConfirmPin);
    }

    if (value && index < 5) {
      const nextRef =
        type === "pin"
          ? inputRefs.current[`pin-${index + 1}`]
          : inputRefs.current[`confirm-${index + 1}`];

      nextRef?.focus();
    }
  };

  const handleKeyDown = (e, index, type) => {
    const currentArray = type === "pin" ? pin : confirmPin;

    if (e.key === "Backspace" && !currentArray[index] && index > 0) {
      const prevRef =
        type === "pin"
          ? inputRefs.current[`pin-${index - 1}`]
          : inputRefs.current[`confirm-${index - 1}`];

      prevRef?.focus();
    }
  };

  const handleSubmitPin = async (e) => {
    e.preventDefault();

    const pinCode = pin.join("");
    const confirmPinCode = confirmPin.join("");

    if (pinCode.length !== 6 || confirmPinCode.length !== 6) {
      toast.error("PIN must be 6 digits");
      return;
    }

    if (pinCode !== confirmPinCode) {
      toast.error("PINs do not match");
      return;
    }

    // Safety check fallback redundancy execution guard
    if (!onboardingToken || !userEmail) {
      toast.error(
        "Session context data missing. Please log in to request a fresh token.",
      );
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        email: userEmail,
        transactionPin: pinCode,
        confirmTransactionPin: confirmPinCode,
      };

      const response = await createPin(payload, onboardingToken);
      console.log("✅ Create PIN response:", response);

      const userDataFromResponse = response?.data;

      // 🛑 INTERCEPT: Check if user account has already been initialized on previous cycles
      if (
        userDataFromResponse?.createdAlready === true ||
        response?.message?.toLowerCase().includes("already")
      ) {
        toast.success("PIN verified successfully!");
        dispatch(clearTempUser());
        navigate("/login");
        return;
      }

      // 🧹 CLEAN ONBOARDING CACHE
      dispatch(clearTempUser());
      toast.success("PIN created successfully! Redirecting to login...");

      // 🚀 REDIRECT TO LOGIN PAGE
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("❌ PIN Creation Error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create PIN";
      toast.error(errorMessage);

      setPin(["", "", "", "", "", ""]);
      setConfirmPin(["", "", "", "", "", ""]);
      inputRefs.current[`pin-0`]?.focus();
    } finally {
      setIsLoading(false);
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

          <h2>Create Transaction PIN</h2>
          <p className="otp-subtitle">
            Create a secure 6-digit PIN for transactions
          </p>

          <form className="auth-form" onSubmit={handleSubmitPin}>
            {/* ENTER PIN */}
            <div className="otp-inputs-row">
              <label>Enter PIN</label>
              <div className="otp-input-container">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[`pin-${index}`] = el)}
                    type="password"
                    maxLength={1}
                    inputMode="numeric"
                    value={digit}
                    className="otp-box"
                    onChange={(e) => handleChange(e.target.value, index, "pin")}
                    onKeyDown={(e) => handleKeyDown(e, index, "pin")}
                  />
                ))}
              </div>
            </div>

            {/* CONFIRM PIN */}
            <div className="otp-inputs-row">
              <label>Confirm PIN</label>
              <div className="otp-input-container">
                {confirmPin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[`confirm-${index}`] = el)}
                    type="password"
                    maxLength={1}
                    inputMode="numeric"
                    value={digit}
                    className="otp-box"
                    onChange={(e) =>
                      handleChange(e.target.value, index, "confirm")
                    }
                    onKeyDown={(e) => handleKeyDown(e, index, "confirm")}
                  />
                ))}
              </div>
            </div>

            <Button
              text={
                isLoading ? (
                  <div className="loader-wrapper">
                    <OrbitProgress color="#fff" size="small" />
                  </div>
                ) : (
                  "Continue"
                )
              }
              type="submit"
              className="otp-submit-btn"
              disabled={isLoading}
              color="#c9922a"
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Pin;
