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

  const isLocked = vault?.planType?.toUpperCase() === "LOCKED";

  useEffect(() => {
    if (!isOpen) {
      setScreen("WARNING");
      setPin(["", "", "", "", "", ""]);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (screen !== "LOADING") return;

    const timer = setTimeout(() => {
      setScreen("PIN");
    }, 1500);

    return () => clearTimeout(timer);
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

  const handlePinSubmit = async () => {
    try {
      if (pin.some((p) => p === "")) return;
      if (!vault) return;

      setIsSubmitting(true);

      const payload = {
        amount: vault.withdrawAmount || vault.balance,
        transactionPin: pin.join(""),
      };

      const res = await onWithdraw?.(vault, payload);
      const creditedAmount = res?.data?.amountCredited ?? 0;

      setScreen(null);
      onClose();

      await new Promise((r) => setTimeout(r, 200));

      await Swal.fire({
        title: "Withdrawal Successful",
        text: `₦${Number(creditedAmount).toLocaleString()} has been moved successfully.`,
        icon: "success",
        confirmButtonText: "Close",
        confirmButtonColor: "#EDC344",
      });

      onWithdrawSuccess?.(vault.id, creditedAmount);
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
    <div className="hn-modal-overlay">
      {screen === "PIN" ? (
        <PlanPinScreen
          pin={pin}
          handlePinChange={handlePinChange}
          handlePinKeyDown={handlePinKeyDown}
          onBack={() => setScreen("WARNING")}
          onSubmit={isSubmitting ? null : handlePinSubmit}
        />
      ) : (
        <div className="hn-modal-card">
          {/* WARNING SCREEN  */}
          {screen === "WARNING" && (
            <div className="hn-step-container animate-fade">
              <h2 className="hn-modal-title hn-text-center">
                Are you sure you want to withdraw?
              </h2>

              {isLocked ? (
                <p className="hn-modal-desc hn-text-center">
                  Early withdrawal will attract a{" "}
                  <span style={{ color: "#EF4444", fontWeight: "600" }}>
                    {data?.breakingFee} breaking fee
                  </span>{" "}
                  and loss of interest.
                </p>
              ) : (
                <p className="hn-modal-desc hn-text-center">
                  You can wait to earn more interest before withdrawing.
                </p>
              )}

              <div className="hn-button-grid">
                <button
                  type="button"
                  className="hn-btn-secondary"
                  onClick={onClose}
                >
                  {isLocked ? "Go Back" : "Wait"}
                </button>

                <button
                  type="button"
                  className="hn-btn-primary"
                  onClick={handleProceedToLoading}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* LOADING SCREEN */}
          {screen === "LOADING" && (
            <div className="hn-step-container hn-align-center hn-justify-center hn-py-xl animate-fade">
              <div className="hn-loading-spinner"></div>
              <p className="hn-modal-desc hn-margin-top-md hn-text-center">
                Securing transaction channel...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WithdrawModal;
