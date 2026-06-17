import React, { useState, useEffect } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import Swal from "sweetalert2";
import PlanPinScreen from "./PlanPinScreen";
import "../Style/WithdrawalModal.css";

const WithdrawModal = ({
  isOpen,
  onClose,
  vault,
  onWithdraw,
  onWithdrawSuccess,
}) => {
  const [screen, setScreen] = useState("WARNING");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLocked = vault?.type?.toUpperCase() === "LOCKED";

  // RESET ON CLOSE
  useEffect(() => {
    if (!isOpen) {
      setScreen("WARNING");
      setPin(["", "", "", "", "", ""]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // LOADING → PIN ROUTE
  useEffect(() => {
    if (screen === "LOADING") {
      const timer = setTimeout(() => {
        setScreen("PIN");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [screen]);

  if (!isOpen || !vault) return null;

  const handleProceedToLoading = () => {
    setScreen("LOADING");
  };

  const handlePinChange = (val, idx) => {
    const cleanVal = val.slice(-1);
    const updated = [...pin];
    updated[idx] = cleanVal;
    setPin(updated);
  };

  const handlePinKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) {
      const updated = [...pin];
      updated[idx - 1] = "";
      setPin(updated);
    }
  };

  // 🔥 REAL WITHDRAW FLOW
  const handlePinSubmit = async () => {
    try {
      if (pin.includes("")) return;
      if (!vault) return;

      setIsSubmitting(true);

      const payload = {
        amount: vault.withdrawAmount || vault.balance,
        transactionPin: pin.join(""),
      };

      const res = await onWithdraw?.(vault, payload);

      const updatedBalance = res?.data?.newSavingsBalance ?? vault.balance;

      onClose();

      await Swal.fire({
        title: "Withdrawal Successful 🏧",
        text: `₦${Number(updatedBalance).toLocaleString()} has been moved successfully.`,
        icon: "success",
        confirmButtonText: "Close",
        confirmButtonColor: "#EDC344",
        customClass: {
          popup: "swal-vault-radius",
          title: "swal-vault-title",
          confirmButton: "swal-vault-button",
        },
      });

      onWithdrawSuccess?.(vault.id, updatedBalance);
    } catch (error) {
      await Swal.fire({
        title: "Withdrawal Failed",
        text: error?.message || "Please try again",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="withdraw-overlay">
      <div className="withdraw-box">
        {/* WARNING SCREEN */}
        {screen === "WARNING" && (
          <div className="withdraw-content animate-fade">
            <h2 className="withdraw-title">
              Are you sure you want to withdraw?
            </h2>

            {isLocked ? (
              <p className="withdraw-subtext">
                Early withdrawal will attract a{" "}
                <span className="text-red">1.5% breaking fee</span> and loss of
                interest.
              </p>
            ) : (
              <p className="withdraw-subtext">
                You can wait to earn more interest before withdrawing.
              </p>
            )}

            <div className="withdraw-actions">
              <button
                type="button"
                className="withdraw-btn-continue"
                onClick={handleProceedToLoading}
              >
                Continue
              </button>

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

        {/* LOADING SCREEN */}
        {screen === "LOADING" && (
          <div className="withdraw-loading-container animate-fade">
            <LuLoaderCircle className="withdraw-lucide-spinner" />
            <p className="withdraw-loading-text">
              Securing transaction channel...
            </p>
          </div>
        )}

        {/* PIN SCREEN */}
        {screen === "PIN" && (
          <PlanPinScreen
            pin={pin}
            handlePinChange={handlePinChange}
            handlePinKeyDown={handlePinKeyDown}
            onBack={() => setScreen("WARNING")}
            onSubmit={isSubmitting ? null : handlePinSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default WithdrawModal;
