import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import PlanPinScreen from "./PlanPinScreen";
import "../Style/WithdrawModal.css";

const WithdrawModal = ({ isOpen, onClose, vault, onWithdrawSuccess }) => {
  // Navigation states: "WARNING" | "LOADING" | "PIN"
  const [screen, setScreen] = useState("WARNING");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);

  const isLocked = vault?.type?.toUpperCase() === "LOCKED";

  // Reset form layout parameters whenever the modal open status shifts
  useEffect(() => {
    if (!isOpen) {
      setScreen("WARNING");
      setPin(["", "", "", "", "", ""]);
    }
  }, [isOpen]);

  // Manages the automated progression timing for the loader engine panel
  useEffect(() => {
    if (screen === "LOADING") {
      const timer = setTimeout(() => {
        setScreen("PIN");
      }, 1500); // Displays spinner view window for 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [screen]);

  if (!isOpen || !vault) return null;

  // ROUTING LOGIC: Triggers the native loading spinner page for both cards
  const handleProceedToLoading = () => {
    setScreen("LOADING");
  };

  const handlePinChange = (val, idx) => {
    const cleanVal = val.substring(val.length - 1);
    const updatedPin = [...pin];
    updatedPin[idx] = cleanVal;
    setPin(updatedPin);
  };

  const handlePinKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) {
      const updatedPin = [...pin];
      updatedPin[idx - 1] = "";
      setPin(updatedPin);
    }
  };

  const handlePinSubmit = () => {
    if (pin.includes("")) return;

    // Instantly terminate backdrop view canvas
    onClose();

    // Fire custom styled SweetAlert framework card block
    Swal.fire({
      title: "Withdrawal Successful!",
      text: `₦${Number(vault.balance).toLocaleString()} has been safely moved from your "${vault.title}" nest to your main wallet.`,
      icon: "success",
      confirmButtonText: "Close",
      confirmButtonColor: "#EDC344",
      buttonsStyling: true,
      customClass: {
        popup: "swal-vault-radius",
        title: "swal-vault-title",
        confirmButton: "swal-vault-button",
      },
    }).then(() => {
      onWithdrawSuccess?.(vault.id);
    });
  };

  return (
    <div className="withdraw-overlay">
      <div className="withdraw-box">
        {/* SCREEN 1: CONDITIONAL DESIGNS DIRECTION ROUTING */}
        {screen === "WARNING" && (
          <div className="withdraw-content animate-fade">
            <h2 className="withdraw-title">
              Are you sure you want to withdraw?
            </h2>

            {isLocked ? (
              <p className="withdraw-subtext">
                Early Withdrawal will attract a{" "}
                <span className="text-red">1.5% breaking fee</span> and all
                accrued interest will be lost.
              </p>
            ) : (
              <p className="withdraw-subtext">
                You could wait till the next day to get your accrued interest.
              </p>
            )}

            <div className="withdraw-actions">
              {/* Clicking Continue now pushes the state string directly forward */}
              <button
                type="button"
                className="withdraw-btn-continue"
                onClick={handleProceedToLoading}
              >
                Continue
              </button>

              {/* Go Back/Wait button safely targets cancellation handles */}
              <button
                type="button"
                className="withdraw-btn-yellow"
                onClick={onClose}
              >
                {isLocked ? "Go Back" : "Wait"}
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 2: CLEAN TRANSLUCENT REACT SPINNER LOADING LOOKUP */}
        {screen === "LOADING" && (
          <div className="withdraw-loading-container animate-fade">
            {/* Native spin animation styling handled directly without custom CSS keyframes */}
            <Loader2 className="withdraw-lucide-spinner" />
            <p className="withdraw-loading-text">
              Securing secure channel window...
            </p>
          </div>
        )}

        {/* SCREEN 3: HIGH-LEVEL TRANSACTION PIN INPUT COMPONENT INTEGRATION */}
        {screen === "PIN" && (
          <div className="animate-fade">
            <PlanPinScreen
              pin={pin}
              handlePinChange={handlePinChange}
              handlePinKeyDown={handlePinKeyDown}
              onBack={() => setScreen("WARNING")}
              onSubmit={handlePinSubmit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawModal;
