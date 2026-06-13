import React, { useEffect, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../../Components/Sidebar";
import DepositModalManager from "../../Components/KycModals/DepositModalManager.jsx";
import WithdrawalModal from "../../Components/KycModals/WithdrawalModal.jsx"; // <-- ADDED IMPORT
import { TransactionHistory } from "../../Features/TransactionHistory.jsx";
import { historyData } from "../../JS/Transactions.js";
import { linkBankAccount } from "../../Services/Walletservice.js";
import "../../Style/Wallet.css";

const WalletPage = () => {
  const { user, token, wallet } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [confirmedDepositAmount, setConfirmedDepositAmount] = useState("");

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false); // <-- ADDED STATE
  const [confirmedWithdrawAmount, setConfirmedWithdrawAmount] = useState(""); // <-- ADDED STATE

  // const [balances] = useState({
  //   ngn: "0.00",
  //   usdt: "0.00",
  // });

  // Track currently filling form data
  const [accountData, setAccountData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  // Persisted state holding successfully linked bank profile for display inside Breakdown Step
  const [linkedBank, setLinkedBank] = useState(null);

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- LINK WITHDRAWAL ACCOUNT ACTION ---
  const handleLinkAccount = async (e) => {
    e.preventDefault();

    if (
      !accountData.bankName ||
      !accountData.accountName ||
      !accountData.accountNumber
    ) {
      return toast.error("Please fill all fields");
    }

    if (accountData.accountNumber.length !== 10) {
      return toast.error("Account number must be 10 digits");
    }

    try {
      setIsLoading(true);
      const payload = {
        bankName: accountData.bankName,
        accountName: accountData.accountName,
        accountNumber: accountData.accountNumber,
      };

      const response = await linkBankAccount(payload, token);
      toast.success(response?.message || "Account linked successfully");

      // Save data locally so the breakdown sheet displays actual dynamic bank content
      setLinkedBank({
        name: accountData.bankName,
        accountNumber: accountData.accountNumber,
      });

      setShowAccountModal(false);
      setAccountData({ bankName: "", accountName: "", accountNumber: "" });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to link account");
    } finally {
      setIsLoading(false);
    }
  };

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
      // Snapshot balance validation threshold can go here if required
      setConfirmedWithdrawAmount(amount);
      setIsWithdrawOpen(true); // <-- OPENS WITHDRAWAL FLOW MODAL
      setAmount(""); // Wipe input panel clean
    }
  };

  // Optional Callback execution after completion
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
                {historyData.map((item, index) => (
                  <TransactionHistory key={index} item={item} />
                ))}
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

      {/* BANK WITHDRAWAL LINKING PORTAL */}
      {showAccountModal && (
        <div className="wallet-modal-overlay">
          <div className="wallet-modal">
            <div className="wallet-modal-header">
              <h3>Link Withdrawal Account</h3>
              <button type="button" onClick={() => setShowAccountModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleLinkAccount}>
              <div className="input-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  placeholder="Enter bank name"
                  value={accountData.bankName}
                  onChange={handleAccountChange}
                />
              </div>

              <div className="input-group">
                <label>Account Name</label>
                <input
                  type="text"
                  name="accountName"
                  placeholder="Enter account name"
                  value={accountData.accountName}
                  onChange={handleAccountChange}
                />
              </div>

              <div className="input-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Enter account number"
                  maxLength={10}
                  value={accountData.accountNumber}
                  onChange={handleAccountChange}
                />
              </div>

              <button
                type="submit"
                className="form-submit-action-btn"
                disabled={isLoading}
              >
                {isLoading ? "Linking..." : "Link Account"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
