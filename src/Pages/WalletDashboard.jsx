import React, { useState, useEffect } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiPlus } from "react-icons/fi";
import "../Style/Wallet.css";

const WalletPage = () => {
  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState("deposit");
  const [amount, setAmount] = useState("");

  const [balances, setBalances] = useState({
    ngn: "0",
    usdt: "0",
  });
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- API INTEGRATION POINTS ---
  useEffect(() => {
    // TODO: Fetch wallet balances on component mount
    // fetchBalances().then(data => setBalances(data));
    // fetchTransactions().then(data => setTransactions(data));
  }, []);

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;

    setIsLoading(true);
    try {
      if (activeTab === "deposit") {
        // TODO: Call Deposit API
        console.log("Depositing amount:", amount);
      } else if (activeTab === "withdraw") {
        // TODO: Call Withdraw API
        console.log("Withdrawing amount:", amount);
      }
      // Reset form on success
      setAmount("");
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wallet-page-container">
      {/* HEADER */}
      <header className="wallet-header">
        <h1>Wallet</h1>
      </header>

      {/* BALANCE CARDS */}
      <section className="balance-cards-grid">
        <div className="balance-card card-ngn">
          <div className="card-currency-header">
            <div className="currency-icon ngn-flag"></div>
            <span className="currency-label">NGN BALANCE</span>
          </div>
          <div className="balance-amount">
            <span className="currency-symbol">₦</span>
            {balances.ngn}
          </div>
        </div>

        <div className="balance-card card-usdt">
          <div className="card-currency-header">
            <div className="currency-icon usdt-icon">₮</div>
            <span className="currency-label">USDT BALANCE</span>
          </div>
          <div className="balance-amount">
            {balances.usdt} <span className="currency-text">USDT</span>
          </div>
        </div>
      </section>

      {/* OPERATIONS CARD */}
      <section className="wallet-operations-card">
        {/* Tabs */}
        <div className="operations-tabs-row">
          <button
            className={`tab-btn ${activeTab === "deposit" ? "active" : ""}`}
            onClick={() => setActiveTab("deposit")}
          >
            <FiArrowDownLeft className="tab-icon" />
            Deposit
          </button>

          <button
            className={`tab-btn ${activeTab === "withdraw" ? "active" : ""}`}
            onClick={() => setActiveTab("withdraw")}
          >
            <FiArrowUpRight className="tab-icon" />
            Withdraw
          </button>

          <button className="tab-btn link-account-btn">
            <FiPlus className="tab-icon" />
            Link Withdrawal Account
          </button>
        </div>

        {/* Form */}
        <form className="operations-form" onSubmit={handleTransactionSubmit}>
          <div className="input-group">
            <label>CURRENCY</label>
            <input
              type="text"
              value="Naira (NGN)"
              readOnly
              className="readonly-input"
            />
          </div>

          <div className="input-group">
            <label>AMOUNT</label>
            <input
              type="number"
              placeholder=""
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              disabled={isLoading}
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
                : "Withdraw"}
          </button>
        </form>
      </section>

      {/* TRANSACTIONS HISTORY */}
      <section className="transactions-history-card">
        <div className="card-title-bar">
          <h3>Transactions</h3>
        </div>

        <div className="transactions-view-port">
          {transactions.length === 0 ? (
            <div className="empty-state-container">
              <p>No activities yet</p>
            </div>
          ) : (
            <div className="transactions-list">
              {/* Map through your transactions here */}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WalletPage;
