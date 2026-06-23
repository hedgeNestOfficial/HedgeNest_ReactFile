import React, { useEffect } from "react";
import { useSelector } from "react-redux";
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
  handleCloseSuccess,

  // Destructured missing preview and pipeline properties from SmartSafe
  previewSummaryData,
  onPreviewReceived,
  formLivePreviewData,
  onFormPreviewRequested,
  handlePinSubmit,
}) => {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.profile || state.user.data);
  const userId = user?.id || user?._id || user?.userId;

  // Handle SweetAlert via side-effect instead of inside JSX
  useEffect(() => {
    if (modalScreen === "SUCCESS") {
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
    }
  }, [modalScreen, formData?.title, handleCloseSuccess]);

  // Force the component to return absolutely nothing on NONE or SUCCESS states
  if (modalScreen === "NONE" || modalScreen === "SUCCESS") return null;

  return (
    <div className="modal-overlay">
      {/* 1. PLAN CONFIGURATION STAGE */}
      {modalScreen === "CREATE" && (
        <PlanForm
          formData={formData}
          handleInputChange={handleInputChange}
          isFlexibleMode={isFlexibleMode}
          setIsFlexibleMode={setIsFlexibleMode}
          onCancel={() => setModalScreen("NONE")}
          // Bind the functional preview calculations prop here safely
          onFormPreviewRequested={onFormPreviewRequested}
        />
      )}

      {/* 2. SUMMARY & MATURITY METRICS STAGE */}
      {modalScreen === "SUMMARY" && (
        <PlanSummary
          token={token}
          formData={formData}
          previewSummaryData={previewSummaryData}
          onRefreshSummary={() => onPreviewReceived?.(formData)}
          onBack={() => setModalScreen("CREATE")}
          onCancel={() => setModalScreen("NONE")}
          onConfirm={() => setModalScreen("PIN")}
        />
      )}

      {/* 3. TRANSACTION PIN AUTHORIZATION STAGE */}
      {modalScreen === "PIN" && (
        <PlanPinScreen
          token={token}
          userId={userId}
          formData={formData}
          onBack={() => setModalScreen("SUMMARY")}
          // Delegate submission up to SmartSafe's verified unified pipeline
          onSuccess={(pinString) => handlePinSubmit?.(pinString)}
          onFailure={() => setModalScreen("SUMMARY")}
        />
      )}

      {/* 4. API PROCESSING INDICATOR */}
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
