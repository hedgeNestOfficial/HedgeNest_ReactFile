// import React, { useState } from "react";
// import "../../Style/SettingView.css";
// import LinkAccountModal from "../../Components/KycModals/LinkAccountModal";
// import ChangePasswordModal from "../../Components/KycModals/ChangePasswordModal";
// import ChangePinModal from "../../Components/KycModals/ChangePinModal";

// const SettingView = ({ accounts = [], onAddAccount }) => {
//   const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
//   const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
//   const [isPinModalOpen, setIsPinModalOpen] = useState(false);

//   const handleAddAccountClick = () => {
//     setIsAccountModalOpen(true);
//     if (onAddAccount) {
//       onAddAccount();
//     }
//   };

//   return (
//     <div className="settings-view-wrapper">
//       {/* CARD 1: CHANGE PASSWORD */}
//       <div className="settings-card">
//         <h3>Change Password</h3>
//         <p>Don’t like password, or have forgotten it?</p>
//         <button
//           className="settings-action-btn"
//           onClick={() => setIsPasswordModalOpen(true)}
//         >
//           Change Password
//         </button>
//       </div>

//       {/* CARD 2: CHANGE TRANSACTION PIN */}
//       <div className="settings-card">
//         <h3>Change Transaction PIN</h3>
//         <p>Forgotten your pin?</p>
//         <button
//           className="settings-action-btn"
//           onClick={() => setIsPinModalOpen(true)}
//         >
//           Change Transaction PIN
//         </button>
//       </div>

//       {/* CARD 3: LINKED WITHDRAWAL ACCOUNTS */}
//       <div className="settings-card">
//         <div className="card-header-row">
//           <h3>Linked Withdrawal Accounts</h3>
//           <button
//             className="add-account-link-btn"
//             onClick={handleAddAccountClick}
//           >
//             <span>+</span> Add account
//           </button>
//         </div>

//         <div className="accounts-list-zone">
//           {accounts.length === 0 ? (
//             <p className="empty-accounts-text">No Account linked yet</p>
//           ) : (
//             <div className="linked-accounts-grid">
//               {accounts.map((acc, index) => (
//                 <div key={index} className="account-item">
//                   <p>
//                     <strong>{acc.bankName}</strong> - {acc.accountNumber}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* CRITICAL GUARDRAIL: Rendered outside layout blocks
//         to guarantee perfect stack layout alignment
//       */}
//       <LinkAccountModal
//         isOpen={isAccountModalOpen}
//         onClose={() => setIsAccountModalOpen(false)}
//         // onSuccessRefresh={() => {
//         //   console.log(
//         //     "Bank linked successfully. Refresh global user data context.",
//         // );
//         // }}
//       />

//       <ChangePasswordModal
//         isOpen={isPasswordModalOpen}
//         onClose={() => setIsPasswordModalOpen(false)}
//       />

//       <ChangePinModal
//         isOpen={isPinModalOpen}
//         onClose={() => setIsPinModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default SettingView;
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; // 🟢 Added to connect to your Redux slice
import "../../Style/SettingView.css";
import LinkAccountModal from "../../Components/KycModals/LinkAccountModal";
import ChangePasswordModal from "../../Components/KycModals/ChangePasswordModal";
import ChangePinModal from "../../Components/KycModals/ChangePinModal";
import { getLinkedAccounts } from "../../Services/Walletservice";

const SettingView = ({ onAddAccount }) => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🟢 Extract token and rehydration status directly from your Redux user slice
  const { token, rehydrating } = useSelector((state) => state.user);

  // Isolated fetch function to trigger on mount and on changes
  const fetchUserAccounts = async () => {
    // Stop early if Redux is still restoring state, or if no token exists yet
    if (rehydrating || !token) return;

    // Defensive check: just in case the initial storage had literal embedded quotes
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

  // 🟢 Listens dynamically to token state changes (fires cleanly right after persistence resolves)
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
        <p>Forgotten your pin?</p>
        <button
          type="button"
          className="settings-action-btn"
          onClick={() => setIsPinModalOpen(true)}
        >
          Change Transaction PIN
        </button>
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
    </div>
  );
};

export default SettingView;
