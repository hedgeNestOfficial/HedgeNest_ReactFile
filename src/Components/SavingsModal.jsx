import React from "react";
import PlanForm from "../Components/PlanForm";
import PlanSummary from "../Components/PlanSummary";
import PlanPinScreen from "../Components/PlanPinScreen";
import "../Style/SavingsModal.css";

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
  handleCloseSuccess
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
        <div className="modal-container layout-centered" role="dialog" aria-modal="true">
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

      {modalScreen === "SUCCESS" && (
        <div className="modal-container layout-centered success-card-padding" role="dialog" aria-modal="true">
          <div className="success-pulse-ring"><div className="success-inner-dot"></div></div>
          <h2 className="success-heading">Savings Plan Created!</h2>
          <button type="button" onClick={handleCloseSuccess} className="success-close-btn">Close</button>
        </div>
      )}
    </div>
  );
};

export default SavingsModal;