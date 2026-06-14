import React from "react";
import { GiPartyPopper } from "react-icons/gi";

const KycSuccessModal = ({ onClose }) => {
  return (
    <>
      <div className="kyc-success-icon-wrapper">
        <GiPartyPopper />
      </div>

      <h2 className="kyc-modal-title">KYC Verified!</h2>
      <p className="kyc-modal-subtitle">Welcome to Tier 2!!!</p>

      <button
        className="kyc-btn kyc-btn-continue kyc-btn-full kyc-success-action"
        onClick={onClose}
      >
        Close
      </button>
    </>
  );
};

export default KycSuccessModal;
