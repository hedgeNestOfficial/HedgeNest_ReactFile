import React from "react";
import PlanForm from "../Components/PlanForm";
import PlanSummary from "../Components/PlanSummary";
import PlanPinScreen from "../Components/PlanPinScreen";
import "../Style/SavingsModal.css";

import Swal from "sweetalert2";

const SavingsModal = ({
  modalScreen,
  setModalScreen,
  isFlexibleMode,
  setIsFlexibleMode,
  formData,
  handleInputChange,
  handleFormSubmit,
  handleConfirmClick,
  pin,
  handlePinChange,
  handlePinKeyDown,
  handlePinSubmit,
  handleCloseSuccess,
}) => {
  if (modalScreen === "NONE") return null;

  return (
    <div className="modal-overlay">
      {modalScreen === "CREATE" && (
        <PlanForm
          formData={formData}
          handleInputChange={handleInputChange}
          isFlexibleMode={isFlexibleMode}
          setIsFlexibleMode={setIsFlexibleMode}
          onCancel={() => setModalScreen("NONE")}
          onSubmit={handleFormSubmit}
        />
      )}

      {modalScreen === "SUMMARY" && (
        <PlanSummary
          formData={formData}
          isFlexibleMode={isFlexibleMode}
          onBack={() => setModalScreen("CREATE")}
          onCancel={() => setModalScreen("NONE")}
          onConfirm={handleConfirmClick}
        />
      )}

      {modalScreen === "LOADING" && (
        <div
          className="modal-container layout-centered"
          role="dialog"
          aria-modal="true"
        >
          <div className="loading-spinner"></div>
        </div>
      )}

      {modalScreen === "PIN" && (
        <PlanPinScreen
          pin={pin}
          handlePinChange={handlePinChange}
          handlePinKeyDown={handlePinKeyDown}
          onBack={() => setModalScreen("SUMMARY")}
          onSubmit={handlePinSubmit}
        />
      )}

      {modalScreen === "SUCCESS" &&
        (() => {
          Swal.fire({
            title: "Savings Plan Created!",
            text: `Your plan "${formData?.title || "Nest"}" has been set up successfully.`,
            icon: "success",
            confirmButtonText: "Close",
            confirmButtonColor: "#EDC344",
            buttonsStyling: true,
            allowOutsideClick: false,
            customClass: {
              popup: "swal-vault-radius",
              title: "swal-vault-title",
              confirmButton: "swal-vault-button",
            },
          }).then(() => {
            handleCloseSuccess?.();
          });
          return null;
        })()}
    </div>
  );
};

export default SavingsModal;
