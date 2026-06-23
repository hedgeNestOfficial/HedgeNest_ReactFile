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

  // PIN states forwarded from parent state context
  pin,
  handlePinChange,

  previewSummaryData,
  onPreviewReceived,
  formLivePreviewData,
  onFormPreviewRequested,
  handlePinSubmit,
}) => {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.profile || state.user.data);
  const userId = user?.id || user?._id || user?.userId;

  useEffect(() => {
    if (modalScreen === "SUCCESS") {
      Swal.fire({
        title: "Savings Plan Created!",
        text: `Your plan "${formData?.title || "Nest"}" has been set up successfully.`,
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#EDC344",
        buttonsStyling: true,
        allowOutsideClick: false,
        customClass: {
          popup: "swal-vault-radius",
          title: "swal-vault-title",
          confirmButton: "swal-vault-button",
        },
      }).then(() => {
        // Parent cleanly triggers cache invalidation and resets variables
        handleCloseSuccess?.();
      });
    }
  }, [modalScreen, formData?.title, handleCloseSuccess]);

  // Prevent background elements leaking into layout when unmounted
  if (modalScreen === "NONE") return null;

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
          onFormPreviewRequested={onFormPreviewRequested}
        />
      )}

      {/* 2. SUMMARY & MATURITY METRICS STAGE */}
      {modalScreen === "SUMMARY" && (
        <PlanSummary
          token={token}
          formData={formData}
          previewSummaryData={previewSummaryData}
          // Pass formLivePreviewData so handleSummaryPreviewFetch can extract the plan setup ID cleanly
          onRefreshSummary={() => onPreviewReceived?.(formLivePreviewData)}
          onBack={() => setModalScreen("CREATE")}
          onCancel={() => setModalScreen("NONE")}
          onConfirm={() => setModalScreen("PIN")}
        />
      )}

      {/* 3. TRANSACTION PIN AUTHORIZATION STAGE */}
      {modalScreen === "PIN" && (
        <PlanPinScreen
          pin={pin}
          handlePinChange={handlePinChange}
          onBack={() => setModalScreen("SUMMARY")}
          onPinSubmitted={(pinString) => handlePinSubmit?.(pinString)}
        />
      )}

      {/* 4. LOADING STATE */}
      {modalScreen === "LOADING" && (
        <div
          className="modal-container layout-centered"
          role="dialog"
          aria-modal="true"
        >
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* 5. SUCCESS STATE (INTERNALS CONTROLLED BY SWAL WINDOW EFFECT) */}
      {modalScreen === "SUCCESS" && null}
    </div>
  );
};

export default SavingsModal;
