import React, { useState } from "react";
import "../../Style/ChangePinModal.css";
import { OrbitProgress } from "react-loading-indicators";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import { changeTransactionPin } from "../../Services/authService";

const ChangePinModal = ({ isOpen, onClose }) => {
  const { token } = useSelector((state) => state.user);

  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (oldPin.length !== 6) {
      return toast.error("Old PIN must be 6 digits");
    }

    if (newPin.length !== 6) {
      return toast.error("New PIN must be 6 digits");
    }

    if (confirmPin.length !== 6) {
      return toast.error("Confirm PIN must be 6 digits");
    }

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
      toast.error(
        error?.response?.data?.message || "Unable to change transaction PIN",
      );
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
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
                className="pin-text-input"
                placeholder="Enter old PIN"
              />
            </div>

            <div className="pin-input-group">
              <label className="pin-input-label">New PIN</label>

              <input
                type="password"
                maxLength={6}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                className="pin-text-input"
                placeholder="Enter new PIN"
              />
            </div>

            <div className="pin-input-group">
              <label className="pin-input-label">Confirm PIN</label>

              <input
                type="password"
                maxLength={6}
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, ""))
                }
                className="pin-text-input"
                placeholder="Confirm new PIN"
              />
            </div>

            <div className="pin-actions-container">
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <OrbitProgress color="#ffffff" size="small" />
                ) : (
                  "Change PIN"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="pin-modal-step-container text-center align-center">
            <div className="pin-confetti-badge-circle">
              <div className="pin-mini-confetti-particle cp1"></div>
              <div className="pin-mini-confetti-particle cp2"></div>
              <div className="pin-mini-confetti-particle cp3"></div>
              <div className="pin-mini-confetti-particle cp4"></div>
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
