import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../../Style/SettingView.css";
import LinkAccountModal from "../../Components/KycModals/LinkAccountModal";
import ChangePasswordModal from "../../Components/KycModals/ChangePasswordModal";
import ChangePinModal from "../../Components/KycModals/ChangePinModal";
import ResetPinModal from "../../Components/KycModals/resetPinModal"; // ✅ Imported with lowercase filename pattern
import { getLinkedAccounts } from "../../Services/Walletservice";

const SettingView = ({ onAddAccount }) => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isResetPinModalOpen, setIsResetPinModalOpen] = useState(false); // ✅ State for Reset PIN flow

  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { token, rehydrating } = useSelector((state) => state.user);

  const fetchUserAccounts = async () => {
    if (rehydrating || !token) return;

    const cleanToken = token.replace(/^"|"$/g, "");

    setIsLoading(true);
    try {
      const res = await getLinkedAccounts(cleanToken);
      if (res?.success && res?.linkedAccounts) {
        setAccounts(res.linkedAccounts);
      }
    } catch (err) {
      console.error("❌ Error retrieving user linked bank accounts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAccounts();
  }, [token, rehydrating]);

  const handleAddAccountClick = () => {
    setIsAccountModalOpen(true);
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
          type="button"
          className="settings-action-btn"
          onClick={() => setIsPasswordModalOpen(true)}
        >
          Change Password
        </button>
      </div>

      {/* CARD 2: CHANGE TRANSACTION PIN */}
      <div className="settings-card">
        <h3>Change Transaction PIN</h3>
        <p>Manage your account authorization code safely.</p>

        {/* ✅ Grouped layout to present choices contextually */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            className="settings-action-btn"
            onClick={() => setIsPinModalOpen(true)}
          >
            Change Transaction PIN
          </button>

          <button
            type="button"
            className="settings-action-btn"
            style={{
              background: "transparent",
              border: "1px solid #c9922a",
              color: "#c9922a",
            }}
            onClick={() => setIsResetPinModalOpen(true)}
          >
            Forgot PIN?
          </button>
        </div>
      </div>

      {/* CARD 3: LINKED WITHDRAWAL ACCOUNTS */}
      <div className="settings-card">
        <div className="card-header-row">
          <h3>Linked Withdrawal Accounts</h3>
          <button
            type="button"
            className="add-account-link-btn"
            onClick={handleAddAccountClick}
          >
            <span>+</span> Add account
          </button>
        </div>

        <div className="accounts-list-zone">
          {rehydrating || isLoading ? (
            <p className="empty-accounts-text">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="empty-accounts-text">No Account linked yet</p>
          ) : (
            <div className="linked-accounts-grid">
              {accounts.map((acc, index) => (
                <div key={acc._id || index} className="account-item">
                  <p>
                    <strong>{acc.bankName}</strong> - {acc.accountNumber}
                  </p>
                  <small
                    style={{
                      color: "#9ca3af",
                      display: "block",
                      marginTop: "2px",
                    }}
                  >
                    {acc.accountName}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODALS RENDER STACK CONTAINER */}
      <LinkAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSuccessRefresh={fetchUserAccounts}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />

      <ChangePinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
      />

      {/* ✅ Mounted ResetPinModal directly within the layout stack */}
      <ResetPinModal
        isOpen={isResetPinModalOpen}
        onClose={() => setIsResetPinModalOpen(false)}
      />
    </div>
  );
};

export default SettingView;
