import React from "react";

const KycStartModal = ({ onCancel, onContinue }) => {
  return (
    <>
      <h2 className="kyc-modal-title">KYC Verification Tier 2</h2>
      <p className="kyc-modal-subtitle">
        Upgrading to Tier 2 gives you access to our Investment offerings!
      </p>

      <div className="kyc-btn-group">
        <button className="kyc-btn kyc-btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="kyc-btn kyc-btn-continue" onClick={onContinue}>
          Continue
        </button>
      </div>
    </>
  );
};

export default KycStartModal;
