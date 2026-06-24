import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import Swal from "sweetalert2";
import "../Style/TopUpModal.css";

const TopUpModal = ({ isOpen, onClose, vault, onTopUpSuccess }) => {
  const [screen, setScreen] = useState("AMOUNT");
  const [amount, setAmount] = useState("");
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const pinRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) {
      setScreen("AMOUNT");
      setAmount("");
      setPin(["", "", "", "", "", ""]);
      setIsBtnLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (screen === "LOADING") {
      const timer = setTimeout(() => {
        setScreen("PIN");
        setIsBtnLoading(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [screen]);

  if (!isOpen || !vault) return null;

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (rawValue === "") {
      setAmount("");
      return;
    }
    if (isNaN(rawValue)) return;
    setAmount(Number(rawValue).toLocaleString());
  };

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    if (!amount || isBtnLoading) return;

    setIsBtnLoading(true);
    setTimeout(() => {
      setScreen("LOADING");
    }, 800);
  };

  const handlePinChange = (val, idx) => {
    if (isNaN(val)) return;

    const cleanVal = val.slice(-1);
    const updated = [...pin];

    updated[idx] = cleanVal;
    setPin(updated);

    if (cleanVal && idx < 5) {
      pinRefs.current[idx + 1]?.focus();
    }
  };

  const handlePinKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      const updated = [...pin];
      if (pin[idx]) {
        updated[idx] = "";
        setPin(updated);
      } else if (idx > 0) {
        updated[idx - 1] = "";
        setPin(updated);
        pinRefs.current[idx - 1]?.focus();
      }
    }
  };

  const handlePinSubmit = async () => {
    if (pin.includes("") || isBtnLoading) return;

    try {
      setIsBtnLoading(true);
      const cleanAmount = parseInt(amount.replace(/,/g, ""), 10);

      await onTopUpSuccess?.(vault, cleanAmount, pin.join(""));

      setScreen("AMOUNT");
      onClose();

      await new Promise((r) => setTimeout(r, 200));

      Swal.fire({
        title: "Top Up Successful!",
        text: `₦${amount} has been added to "${vault.title}".`,
        icon: "success",
        confirmButtonText: "Close",
        confirmButtonColor: "#EDC344",
        customClass: {
          popup: "swal-vault-radius",
          title: "swal-vault-title",
          confirmButton: "swal-vault-button",
        },
      });
    } catch (error) {
      setScreen("AMOUNT");
      onClose();

      await new Promise((r) => setTimeout(r, 200));

      Swal.fire({
        title: "Top Up Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsBtnLoading(false);
    }
  };

  return (
    <div className="topup-overlay">
      <div className="topup-box">
        <div className="top-up-container">
          {screen === "AMOUNT" && (
            <form onSubmit={handleAmountSubmit} className="topup-content">
              <h2 className="topup-title">Top Up Savings</h2>

              <label className="topup-label">
                How much do you want to add to "{vault.title}" (NGN)
              </label>

              <input
                type="text"
                className="topup-input"
                placeholder="5,000"
                value={amount}
                onChange={handleAmountChange}
                autoFocus
              />

              <div className="topup-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="topup-btn-cancel"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="topup-btn-submit"
                  disabled={isBtnLoading}
                >
                  {isBtnLoading ? "Loading..." : "Top Up"}
                </button>
              </div>
            </form>
          )}
        </div>

        {screen === "LOADING" && (
          <div className="topup-loading-container">
            <div className="fullscreen-spinner" />
            <p>Securing transaction window...</p>
          </div>
        )}

        {screen === "PIN" && (
          <div className="topup-content">
            <div className="topup-nav-header">
              <button
                type="button"
                className="topup-back-btn"
                onClick={() => setScreen("AMOUNT")}
              >
                <FaArrowLeft />
              </button>
            </div>

            <h2 className="topup-pin-title">Enter Your Transaction PIN</h2>

            <p>
              Confirming NGN {amount} for "{vault.title}"
            </p>

            <div className="pin-grid">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (pinRefs.current[idx] = el)}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, idx)}
                  onKeyDown={(e) => handlePinKeyDown(e, idx)}
                  className="pin-box-input"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <button
              className="topup-btn-full"
              onClick={handlePinSubmit}
              disabled={pin.includes("") || isBtnLoading}
            >
              {isBtnLoading ? "Processing..." : "Confirm"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUpModal;
