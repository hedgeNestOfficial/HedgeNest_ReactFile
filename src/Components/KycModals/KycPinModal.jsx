import React, { useState, useRef } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

const KycPinModal = ({ onBack, onNext }) => {
  const [pin, setPin] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setPin([...pin.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <>
      <button className="kyc-back-btn" onClick={onBack}>
        <IoIosArrowRoundBack />
      </button>

      <h2 className="kyc-modal-title" style={{ marginTop: "20px" }}>
        Enter Your Transaction Pin
      </h2>

      {/* Spacer */}
      <div style={{ height: "30px" }}></div>

      <div className="kyc-pin-container">
        {pin.map((data, index) => {
          return (
            <input
              className="kyc-pin-input"
              type="password"
              name="pin"
              maxLength="1"
              key={index}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              ref={(ref) => (inputRefs.current[index] = ref)}
            />
          );
        })}
      </div>

      <button
        className="kyc-btn kyc-btn-continue"
        style={{ width: "100%", marginTop: "10px" }}
        onClick={onNext}
      >
        Next
      </button>
    </>
  );
};

export default KycPinModal;
