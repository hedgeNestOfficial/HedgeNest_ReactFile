import React, { useState } from "react";
import "../../Style/SettingView.css";
import LinkAccountModal from "../../Components/KycModals/LinkAccountModal";

const SettingView = ({ accounts = [], onAddAccount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAccountClick = () => {
    // Open our newly minted multi-step modal flow
    setIsModalOpen(true);

    // Maintain backward compatibility with any optional parent-level handlers
    if (onAddAccount) {
      onAddAccount();
    }
  };

  return (
    <div className="settings-view-wrapper">
      {/* CARD 1: CHANGE PASSWORD */}
      <div className="settings-card">
        <h3>Change Password</h3>
        <p>Don’t like password, or have forgotten it?</p>
        <button
          className="settings-action-btn"
          onClick={() => console.log("Trigger change password flow")}
        >
          Change Password
        </button>
      </div>

      {/* CARD 2: CHANGE TRANSACTION PIN */}
      <div className="settings-card">
        <h3>Change Transaction PIN</h3>
        <p>Forgotten your pin?</p>
        <button
          className="settings-action-btn"
          onClick={() => console.log("Trigger change PIN flow")}
        >
          Change Transaction PIN
        </button>
      </div>

      {/* CARD 3: LINKED WITHDRAWAL ACCOUNTS */}
      <div className="settings-card">
        <div className="card-header-row">
          <h3>Linked Withdrawal Accounts</h3>
          <button
            className="add-account-link-btn"
            onClick={handleAddAccountClick}
          >
            <span>+</span> Add account
          </button>
        </div>

        <div className="accounts-list-zone">
          {accounts.length === 0 ? (
            <p className="empty-accounts-text">No Account linked yet</p>
          ) : (
            <div className="linked-accounts-grid">
              {accounts.map((acc, index) => (
                <div key={index} className="account-item">
                  <p>
                    <strong>{acc.bankName}</strong> - {acc.accountNumber}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 
        CRITICAL GUARDRAIL: Kept outside layout flex containers 
        to ensure overlay rendering works perfectly as seen in image_da3745.png 
      */}
      <LinkAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccessRefresh={() => {
          console.log(
            "Bank linked successfully. Refresh global user data context.",
          );
        }}
      />
    </div>
  );
};

export default SettingView;
