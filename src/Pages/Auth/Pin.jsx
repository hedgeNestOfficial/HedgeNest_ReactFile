import React, { useRef, useState } from "react";
import Signupimg from "../../assets/Signupimg.jpg";
import { LuArrowLeft } from "react-icons/lu";
import Button from "../../Components/Button";
import "../../Style/Otp.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  useSelector,
  useDispatch,
} from "react-redux";
import {
  login,
  clearTempUser,
} from "../../Store/UserSlice";
import { createPin } from "../../Services/authService";
import whiteLogo from "../../assets/white logo.png";
import { OrbitProgress } from "react-loading-indicators";

const Pin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);

  const { tempUser } = useSelector((state) => state.user);
  const onboardingToken = tempUser?.authToken;
  const userEmail = tempUser?.email;

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

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

    if (!onboardingToken || !userEmail) {
      toast.error("Session expired. Please restart registration.");
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

      toast.success(
        response?.message || "Transaction PIN created successfully",
      );

      // Extract user data and token from response
      // Adjust these keys if your backend returns a different structure
      const userData = response?.user || response?.data || tempUser;
      const sessionToken = response?.token || onboardingToken;
      const walletData = response?.wallet || null;

      // FIX: was dispatching setUser() which doesn't exist.
      // Changed to login() which is the correct action in UserSlice
      dispatch(
        login({
          user: userData,
          wallet: walletData,
          token: sessionToken,
        }),
      );

      // IMPORTANT: Save to localStorage to enable redux-persist rehydration
      // This mirrors what LoginPage.jsx does
      localStorage.setItem("authToken", sessionToken);
      localStorage.setItem("user", JSON.stringify(userData));
      if (walletData) {
        localStorage.setItem("wallet", JSON.stringify(walletData));
      }

      // Clean up onboarding temporary states
      dispatch(clearTempUser());

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.log("PIN ERROR:", error);
      toast.error(error?.response?.data?.message || "Failed to create PIN");
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
