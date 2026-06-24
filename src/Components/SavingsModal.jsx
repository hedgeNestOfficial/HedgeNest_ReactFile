import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
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
  handleCloseSuccess,
  pin,
  handlePinChange,
  previewSummaryData,
  onPreviewReceived,
  formLivePreviewData,
  onFormPreviewRequested,
  handlePinSubmit,
}) => {
  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    if (modalScreen === "SUCCESS") {
      // Fire the beautiful hot toast instead of the bulky sweet alert
      toast.success(
        `Your plan "${formData?.title || "Nest"}" has been set up successfully.`,
        {
          duration: 4000,
        },
      );
      handleCloseSuccess?.();
    }
  }, [modalScreen, formData?.title, handleCloseSuccess]);

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
          onFormPreviewRequested={onFormPreviewRequested}
        />
      )}

      {modalScreen === "SUMMARY" && (
        <PlanSummary
          token={token}
          formData={formData}
          previewSummaryData={previewSummaryData}
          onRefreshSummary={() => onPreviewReceived?.(formLivePreviewData)}
          onBack={() => setModalScreen("CREATE")}
          onCancel={() => setModalScreen("NONE")}
          onConfirm={() => setModalScreen("PIN")}
        />
      )}

      {modalScreen === "PIN" && (
        <PlanPinScreen
          pin={pin}
          handlePinChange={handlePinChange}
          onBack={() => setModalScreen("SUMMARY")}
          onPinSubmitted={(pinString) => handlePinSubmit?.(pinString)}
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
    </div>
  );
};

export default SavingsModal;
