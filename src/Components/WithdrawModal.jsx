import React, { useState, useEffect } from "react";
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

      setIsSubmitting(true); // The live balance pool is the actual money real asset

      const realAmountToWithdraw = Number(vault.balance || 0);

      const payload = {
        amount: realAmountToWithdraw,
        transactionPin: pin.join(""),
      };

      const res = await onWithdraw?.(vault, payload);
      const apiData = res?.data?.data || res?.data;
      const creditedAmount = apiData?.amountCredited ?? realAmountToWithdraw; // SUCCESS PATH: Teardown React modal layout completely

      setScreen(null);
      onClose();

      await new Promise((r) => setTimeout(r, 250));

      await Swal.fire({
        title: "Withdrawal Successful",
        text: `₦${Number(creditedAmount).toLocaleString()} has been moved successfully.`,
        icon: "success",
        confirmButtonText: "Close",
        confirmButtonColor: "#EDC344",
      });

      onWithdrawSuccess?.();
    } catch (error) {
      // FAILURE PATH: Close local component layers instantly to clear the backdrop layout
      setScreen(null);
      onClose(); // Pause briefly for DOM unmounting before mounting SweetAlert frame

      await new Promise((r) => setTimeout(r, 250));

      await Swal.fire({
        title: "Withdrawal Failed",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Please try again",
        icon: "error",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hn-modal-overlay">
           {" "}
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
                   {" "}
          {screen === "WARNING" && (
            <div className="hn-step-container animate-fade">
                           {" "}
              <h2 className="hn-modal-title hn-text-center">
                                Are you sure you want to withdraw?            
                 {" "}
              </h2>
                           {" "}
              {isLocked ? (
                <p className="hn-modal-desc hn-text-center">
                                    Early withdrawal will attract a            
                       {" "}
                  <span style={{ color: "#EF4444", fontWeight: "600" }}>
                                        {vault.breakingFeePercentage || 1.5}%
                    breaking fee                  {" "}
                  </span>{" "}
                                    and loss of interest.                {" "}
                </p>
              ) : (
                <p className="hn-modal-desc hn-text-center">
                                    You can wait to earn more interest before
                  withdrawing.                {" "}
                </p>
              )}
                           {" "}
              <div className="hn-button-grid">
                               {" "}
                <button
                  type="button"
                  className="hn-btn-secondary"
                  onClick={onClose}
                >
                                    {isLocked ? "Go Back" : "Wait"}             
                   {" "}
                </button>
                               {" "}
                <button
                  type="button"
                  className="hn-btn-primary"
                  onClick={handleProceedToLoading}
                >
                                    Continue                {" "}
                </button>
                             {" "}
              </div>
                         {" "}
            </div>
          )}
                   {" "}
          {screen === "LOADING" && (
            <div className="hn-step-container hn-align-center hn-justify-center hn-py-xl animate-fade">
                            <div className="hn-loading-spinner"></div>         
                 {" "}
              <p className="hn-modal-desc hn-margin-top-md hn-text-center">
                                Securing transaction channel...            
                 {" "}
              </p>
                         {" "}
            </div>
          )}
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
};

export default WithdrawModal;
