import React, { useState, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { OrbitProgress } from "react-loading-indicators";

import { uploadUtilityBill } from "../../Services/authService";

const KycPinModal = ({ utilityBill, onBack, onNext }) => {
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  const { token } = useSelector((state) => state.user);

  const handleChange = (element, index) => {
    const value = element.value.replace(/\D/g, "");

    const updatedPin = [...pin];

    updatedPin[index] = value;

    setPin(updatedPin);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    const enteredPin = pin.join("");

    if (enteredPin.length !== 6) {
      return toast.error("Please enter your 6-digit transaction pin");
    }

    if (!utilityBill) {
      return toast.error("Please upload a utility bill");
    }

    try {
      setLoading(true);

      const authToken = token || localStorage.getItem("authToken");

      const response = await uploadUtilityBill(utilityBill, authToken);

      toast.success(response?.message || "Utility bill uploaded successfully");

      onNext();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to upload utility bill",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="kyc-back-btn" onClick={onBack}>
        <IoIosArrowRoundBack />
      </button>

      <h2 className="kyc-modal-title kyc-title-with-back">
        Enter Your Transaction Pin
      </h2>

      <div className="kyc-pin-container">
        {pin.map((digit, index) => (
          <input
            key={index}
            type="password"
            maxLength={1}
            className="kyc-pin-input"
            value={digit}
            ref={(ref) => (inputRefs.current[index] = ref)}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
          />
        ))}
      </div>

      <button
        className="kyc-btn kyc-btn-continue kyc-btn-full"
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? <OrbitProgress color="#ffffff" size="small" /> : "Verify"}
      </button>
    </>
  );
};

export default KycPinModal;
