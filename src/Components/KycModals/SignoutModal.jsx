import React from "react";
import "../../Style/SignoutModal.css";

const SignoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (typeof onConfirm === "function") {
      onConfirm();
    } else {
      console.warn(
        "⚠️ SignoutModal: The 'onConfirm' prop was not passed down as a function from the parent component.",
      );
    }

    if (typeof onClose === "function") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay-wrapper" onClick={onClose}>
      <div className="signout-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="signout-modal-content">
          <h3 className="signout-modal-title">
            Are you sure you want to sign out?
          </h3>
          <p className="signout-modal-warning">
            You may miss updates or real-time tracking of your funds.
          </p>
        </div>

        <div className="signout-modal-action-row">
          <button
            type="button"
            className="signout-btn signout-btn-confirm"
            onClick={handleConfirmClick}
          >
            Yes
          </button>
          <button
            type="button"
            className="signout-btn signout-btn-cancel"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignoutModal;
