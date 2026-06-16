import React, { useEffect, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../../Components/Sidebar";
import DepositModalManager from "../../Components/KycModals/DepositModalManager.jsx";
import WithdrawalModal from "../../Components/KycModals/WithdrawalModal.jsx";
import { TransactionHistory } from "../../Features/TransactionHistory.jsx";
import { historyData } from "../../JS/Transactions.js";
import "../../Style/Wallet.css";
import { useNavigate } from "react-router-dom";

// Consuming your custom modular standalone account linking modal component
import LinkAccountModal from "../../Components/KycModals/LinkAccountModal.jsx";

const WalletPage = () => {
  const { user, token, wallet } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handles structural modal visibilities
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [confirmedDepositAmount, setConfirmedDepositAmount] = useState("");
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [confirmedWithdrawAmount, setConfirmedWithdrawAmount] = useState("");

  // Placeholder state to update if components down the data line require structural cache
  const [linkedBank, setLinkedBank] = useState(null);

  // --- FORM SUBMISSION ROUTER ---
  const handleTransactionSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      return toast.error("Enter a valid amount");
    }

    // A. DEPOSIT PROCESSING ROUTE
    if (activeTab === "deposit") {
      setConfirmedDepositAmount(amount);
      setIsDepositOpen(true);
      setAmount("");
    }

    // B. WITHDRAWAL PROCESSING ROUTE
    if (activeTab === "withdraw") {
      setConfirmedWithdrawAmount(amount);
      setIsWithdrawOpen(true);
      setAmount("");
    }
  };

  // Callback executed after a successful account linkage inside the modal
  const handleLinkAccountSuccess = () => {
    console.log("Account linked successfully! Refreshing data streams...");
    // If you need to refetch profile parameters or wallet data from your backend API, trigger it here.
  };

  const handleWithdrawalRefresh = () => {
    console.log("Refresh ledger components or balance streams here!");
  };

  return (
    <div className="wallet-page-container">
      {/* SIDEBAR NAVIGATION */}
      {/* <Sidebar /> */}

      <div className="wallet-main-content">
        {/* HEADER SECTION */}
        <header className="wallet-header">
          <div>
            <h1>Wallet</h1>
            <p>
              Welcome back, <span>{user?.firstName || "User"}</span>
            </p>
          </div>
        </header>

        {/* ACCOUNT BALANCE METRICS CONTAINER */}
        <section className="balance-cards-grid">
          <div className="balance-card card-ngn">
            <div className="card-currency-header">
              <span className="currency-label">NGN BALANCE</span>
            </div>
            <div className="balance-amount">
              ₦{wallet?.balanceInNaira?.toLocaleString() || "0"}
            </div>
          </div>

          <div className="balance-card card-usdt">
            <div className="card-currency-header">
              <span className="currency-label">USDT BALANCE</span>
            </div>
            <div className="balance-amount">
              {wallet?.balanceInUSDT?.toLocaleString() || "0"} USDT
            </div>
          </div>
        </section>

        {/* CORE TRANSACTION OPERATION PANEL */}
        <section className="wallet-operations-card">
          <div className="operations-tabs-row">
            <button
              type="button"
              className={`tab-btn ${activeTab === "deposit" ? "active" : ""}`}
              onClick={() => setActiveTab("deposit")}
            >
              <FiArrowDownLeft className="tab-icon" />
              Deposit
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === "withdraw" ? "active" : ""}`}
              onClick={() => setActiveTab("withdraw")}
            >
              <FiArrowUpRight className="tab-icon" />
              Withdraw
            </button>

            <button
              type="button"
              className="tab-btn link-account-btn"
              onClick={() => setShowAccountModal(true)}
            >
              <FiPlus className="tab-icon" />
              Link Account
            </button>
          </div>

          {/* DYNAMIC TRANSACTION SELECTION FORM */}
          <form className="operations-form" onSubmit={handleTransactionSubmit}>
            <div className="input-group">
              <label>Currency</label>
              <input
                type="text"
                value="Naira (NGN)"
                readOnly
                className="readonly-input"
              />
            </div>

            <div className="input-group">
              <label>Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="form-submit-action-btn"
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : activeTab === "deposit"
                  ? "Fund Wallet"
                  : "Withdraw Funds"}
            </button>
          </form>
        </section>

        {/* AUDIT LOGS & TRANSACTION HISTORY CARD */}
        <section className="transactions-history-card">
          <div className="card-title-bar">
            <h3>Transactions</h3>
          </div>

          <div className="transactions-view-port">
            {historyData.length === 0 ? (
              <div className="empty-state-container">
                <p>No activities yet</p>
              </div>
            ) : (
              <div className="transactions-list">
                <TransactionHistory transactions={historyData} />
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ==========================================
          MODAL INTERFACES ORCHESTRATION LAYER
         ========================================== */}

      {/* DEPOSIT GATEWAY WIZARD POPUP */}
      <DepositModalManager
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        amount={confirmedDepositAmount}
      />

      {/* WITHDRAWAL TRANSACTION GATEWAY PORTAL */}
      <WithdrawalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        amount={confirmedWithdrawAmount}
        token={token}
        bankDetails={linkedBank}
        onWithdrawalSuccess={handleWithdrawalRefresh}
      />

      {/* NEW CLEANED-UP CUSTOM ACCOUNT LINKING MODAL */}
      <LinkAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSuccessRefresh={handleLinkAccountSuccess}
      />
    </div>
  );
};

export default WalletPage;
