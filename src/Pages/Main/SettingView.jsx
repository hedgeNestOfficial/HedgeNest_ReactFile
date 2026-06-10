import React from "react";
import "../../Style/SettingView.css";

const SettingView = ({ accounts = [], onAddAccount }) => {
  return (
    <div className="settings-view-wrapper">
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
          <button className="add-account-link-btn" onClick={onAddAccount}>
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
    </div>
  );
};

export default SettingView;
