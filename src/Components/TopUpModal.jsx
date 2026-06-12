import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Swal from "sweetalert2";
import "../Style/TopUp.css";

const TopUpModal = ({ isOpen, onClose, vault, onTopUpSuccess }) => {
  //   Modal screens: "AMOUNT" | "LOADING" | "PIN"
  const [screen, setScreen] = useState("AMOUNT");
  const [amount, setAmount] = useState("");
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  const pinRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      setScreen("AMOUNT");
      setAmount("");
      setIsBtnLoading(false);
      setPin(["", "", "", "", "", ""]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (screen === "LOADING") {
      const timer = setTimeout(() => {
        setScreen("PIN");
        setIsBtnLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  if (!isOpen || !vault) return null;

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (isNaN(rawValue)) return;
    if (rawValue === "") {
      setAmount("");
      return;
    }
    setAmount(Number(rawValue).toLocaleString());
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (!amount || isBtnLoading) return;

    setIsBtnLoading(true);
    setTimeout(() => {
      setScreen("LOADING");
    }, 1000);
  };

  const handlePinChange = (val, idx) => {
    if (isNaN(val)) return;
    const cleanVal = val.substring(val.length - 1);
    const updatedPin = [...pin];
    updatedPin[idx] = cleanVal;
    setPin(updatedPin);

    if (cleanVal && idx < 5) {
      pinRefs.current[idx + 1]?.focus();
    }
  };

  const handlePinKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) {
      const updatedPin = [...pin];
      updatedPin[idx - 1] = "";
      setPin(updatedPin);
      pinRefs.current[idx - 1]?.focus();
    }
  };

  // 2. TRIGGER SWEETALERT2 ON VALIDATION SUCCESS
  const handlePinSubmit = () => {
    if (pin.includes("") || isBtnLoading) return;
    setIsBtnLoading(true);

    // Simulate database transaction processing
    setTimeout(() => {
      setIsBtnLoading(false);
      onClose(); // Close the top-up inner modal canvas background

      // Trigger the specialized HedgeNest themed SweetAlert popup frame
      Swal.fire({
        title: "Top Up Successful!",
        text: `₦${amount} has been safely added to your "${vault.title}" nest.`,
        icon: "success",
        confirmButtonText: "Close",
        confirmButtonColor: "#EDC344", // Matches your exact brand gold token hex
        buttonsStyling: true,
        customClass: {
          popup: "swal-vault-radius",
          title: "swal-vault-title",
          confirmButton: "swal-vault-button",
        },
      }).then(() => {
        // Execute the top-level parent dashboard update callback logic thread
        onTopUpSuccess?.(vault.id, Number(amount.replace(/,/g, "")));
      });
    }, 2000);
  };

  return (
    <div className="topup-overlay">
      <div className="topup-box">
        {screen === "PIN" && (
          <button
            className="topup-back-btn"
            onClick={() => setScreen("AMOUNT")}
          >
            <FaArrowLeft />
          </button>
        )}

        {/* SCREEN 1: AMOUNT INPUT SCREEN */}
        {screen === "AMOUNT" && (
          <form
            onSubmit={handleAmountSubmit}
            className="topup-content animate-fade"
          >
            <h2 className="topup-title">Top Up Savings</h2>
            <label className="topup-label">
              How much do you want to add to "{vault.title}" (NGN)
            </label>
            <div className="topup-input-wrapper">
              <input
                type="text"
                className="topup-input"
                placeholder="5,000"
                value={amount}
                onChange={handleAmountChange}
                required
                autoFocus
              />
            </div>
            <div className="topup-actions">
              <button
                type="button"
                className="topup-btn-cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="topup-btn-submit"
                disabled={isBtnLoading}
              >
                {isBtnLoading ? (
                  <span className="spinner-inline"></span>
                ) : (
                  "Top Up"
                )}
              </button>
            </div>
          </form>
        )}

        {/* SCREEN 2: INTERMEDIATE LOADING OVERLAY */}
        {screen === "LOADING" && (
          <div className="topup-loading-container animate-fade">
            <div className="fullscreen-spinner"></div>
            <p className="loading-text">Securing transaction window...</p>
          </div>
        )}

        {/* SCREEN 3: TRANSACTION PIN INPUT SCREEN */}
        {screen === "PIN" && (
          <div className="topup-content animate-fade">
            <h2 className="topup-title pin-header-gap">
              Enter Your Transaction Pin
            </h2>
            <p className="topup-subtext">
              Confirming NGN {amount} for "{vault.title}"
            </p>

            <div className="pin-grid">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (pinRefs.current[idx] = el)}
                  type="password"
                  className="pin-box-input"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, idx)}
                  onKeyDown={(e) => handlePinKeyDown(e, idx)}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <button
              className="topup-btn-full"
              onClick={handlePinSubmit}
              disabled={pin.includes("") || isBtnLoading}
            >
              {isBtnLoading ? <span className="spinner-inline"></span> : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUpModal;
