import React, { useState } from "react";
import "../../Style/ChangePinModal.css";
import { OrbitProgress } from "react-loading-indicators";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
// 🟢 IMPORTED: High-quality success verification shield icon
import { HiOutlineShieldCheck } from "react-icons/hi";

import { changeTransactionPin } from "../../Services/authService";

const ChangePinModal = ({ isOpen, onClose }) => {
  const { token } = useSelector((state) => state.user);

  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Evaluation Flag: Button remains disabled until all 3 fields hit exactly 6 digits
  const isFormInvalid =
    oldPin.length !== 6 || newPin.length !== 6 || confirmPin.length !== 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPin !== confirmPin) {
      return toast.error("PINs do not match");
    }

    try {
      setIsLoading(true);

      const response = await changeTransactionPin(
        {
          oldTransactionPin: oldPin,
          newTransactionPin: newPin,
          confirmTransactionPin: confirmPin,
        },
        token,
      );

      toast.success(
        response?.message || "Transaction PIN changed successfully",
      );

      setIsSuccess(true);
    } catch (error) {
      toast.error(error?.message || "Unable to change transaction PIN");
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setOldPin("");
    setNewPin("");
    setConfirmPin("");
    setIsSuccess(false);
    onClose();
  };

  // Shared inline styling for centered password pin alignment
  const centerPinStyle = {
    textAlign: "center",
    letterSpacing: "0.25em",
  };

  return (
    <div className="pin-modal-overlay" onClick={resetModal}>
      <div className="pin-modal-card" onClick={(e) => e.stopPropagation()}>
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="pin-modal-step-container">
            <h2 className="pin-modal-title">Change Transaction PIN</h2>

            <div className="pin-input-group">
              <label className="pin-input-label">Old PIN</label>
              <input
                type="password"
                maxLength={6}
                inputMode="numeric"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
                className="pin-text-input"
                placeholder="••••••"
                style={centerPinStyle}
              />
            </div>

            <div className="pin-input-group">
              <label className="pin-input-label">New PIN</label>
              <input
                type="password"
                maxLength={6}
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                className="pin-text-input"
                placeholder="••••••"
                style={centerPinStyle}
              />
            </div>

            <div className="pin-input-group">
              <label className="pin-input-label">Confirm PIN</label>
              <input
                type="password"
                maxLength={6}
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, ""))
                }
                className="pin-text-input"
                placeholder="••••••"
                style={centerPinStyle}
              />
            </div>

            <div
              className="pin-actions-container"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                width: "100%",
              }}
            >
              <button
                type="button"
                className="pin-btn-cancel"
                onClick={resetModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="pin-btn-continue"
                disabled={isFormInvalid || isLoading}
                style={{
                  opacity: isFormInvalid || isLoading ? 0.6 : 1,
                  cursor:
                    isFormInvalid || isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? (
                  <div className="loader-wrapper">
                    <OrbitProgress color="#fff" size="small" />
                  </div>
                ) : (
                  "Change PIN"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="pin-modal-step-container text-center align-center">
            {/* 🟢 FIXED: Swapped out old confetti divs for a unified green shield checkmark layout */}
            <div
              className="pin-success-icon-wrapper"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "80px",
                height: "80px",
                backgroundColor: "#e8f5e9",
                borderRadius: "50%",
                margin: "0 auto 20px auto",
              }}
            >
              <HiOutlineShieldCheck
                style={{ fontSize: "44px", color: "#2e7d32" }}
              />
            </div>

            <h2 className="pin-modal-title margin-top-lg font-size-xl">
              PIN Changed Successfully!
            </h2>

            <button
              type="button"
              className="pin-btn-block-solid margin-top-lg"
              onClick={resetModal}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePinModal;
