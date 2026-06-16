import React, { useRef, useState } from "react";
import Signupimg from "../../assets/Signupimg.jpg";
import { LuArrowLeft } from "react-icons/lu";
import Button from "../../Components/Button";
import "../../Style/Otp.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { createPin } from "../../Services/authService";
import whiteLogo from "../../assets/white logo.png";
import { OrbitProgress } from "react-loading-indicators";

const Pin = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // FIX: Extract tempUser to gain access to the onboarding token and temporary email state
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

    if (pinCode.length !== 6) {
      toast.error("PIN must be 6 digits");
      return;
    }

    if (confirmPinCode.length !== 6) {
      toast.error("Confirm PIN must be 6 digits");
      return;
    }

    if (pinCode !== confirmPinCode) {
      toast.error("PINs do not match");
      return;
    }

    // Safety Guard: Handle scenario if session context was lost
    if (!onboardingToken || !userEmail) {
      toast.error("Session expired. Please restart registration.");
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        email: userEmail, // FIX: Use userEmail pulled from tempUser
        transactionPin: pinCode,
        confirmTransactionPin: confirmPinCode,
      };

      console.log("PIN PAYLOAD:", payload);

      // FIX: Pass onboardingToken instead of the logged-in token instance
      const response = await createPin(payload, onboardingToken);

      console.log("PIN SUCCESS:", response);

      toast.success(
        response?.message || "Transaction pin created successfully",
      );

      setTimeout(() => {
        // Registration is complete! Send them to login to get their permanent user token
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.log("FULL PIN ERROR:", error);
      console.log("PIN ERROR RESPONSE:", error?.response);
      console.log("PIN ERROR DATA:", error?.response?.data);

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
