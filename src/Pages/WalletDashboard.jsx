import React, { useState } from "react";
import "../Style/Wallet.css";
import WalletInput from "../Components/WalletInput";

const WalletDashboard = () => {
  const [activeTab, setActiveTab] = useState("deposit"); // "deposit" or "withdraw"
  const [amount, setAmount] = useState("");

  // Mock data representing states across Home Wallet 3.png and Frame 673 (2).png
  const mockBalances = {
    ngn: activeTab === "deposit" ? "0" : "5,000",
    usdt: activeTab === "deposit" ? "0" : "1.06",
  };

  const mockTransactions = [
    {
      id: 1,
      type: "in",
      title: "Conversion in",
      subtitle: "Converted from NGN",
      amount: "+1.06 USDT",
      class: "success",
    },
    {
      id: 2,
      type: "out",
      title: "Conversion out",
      subtitle: "Converted to USDT",
      amount: "- ₦1,500",
      class: "danger",
    },
  ];

  return (
    <div className="wallet-dashboard-container">
      {/* Left Sidebar Pane - Hidden automatically on mobile views */}
      <aside className="wallet-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-icon">🛡️</div>
          <h2>HedgeNest</h2>
        </div>
        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-item">
            <span>📊</span> Dashboard
          </a>
          <a href="#wallet" className="nav-item active">
            <span>💳</span> Wallet
          </a>
          <a href="#convert" className="nav-item">
            <span>🔀</span> Convert
          </a>
          <a href="#smartsafe" className="nav-item">
            <span>🔒</span> Smart Safe
          </a>
          <a href="#invest" className="nav-item">
            <span>📈</span> Invest
          </a>
          <a href="#profile" className="nav-item">
            <span>👤</span> Profile
          </a>
        </nav>
        <div className="sidebar-footer">
          <button className="signout-btn">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="wallet-main-content">
        <header className="content-header">
          <h1>Wallet</h1>
        </header>

        {/* Top Analytics Balance Cards Segment */}
        <section className="balance-cards-grid">
          <div className="balance-card card-ngn">
            <div className="card-currency-header">
              <span className="flag-icon ngn-flag">🇳🇬</span>
              <span className="currency-label">NGN BALANCE</span>
            </div>
            <div className="balance-amount">₦{mockBalances.ngn}</div>
          </div>

          <div className="balance-card card-usdt">
            <div className="card-currency-header">
              <span className="flag-icon usdt-flag">🟢</span>
              <span className="currency-label">USDT BALANCE</span>
            </div>
            <div className="balance-amount">{mockBalances.usdt} USDT</div>
          </div>
        </section>

        {/* Central Operations Console Card */}
        <section className="wallet-operations-card">
          {/* Reactive Functional Tabs Component Area */}
          <div className="operations-tabs-row">
            <button
              className={`tab-btn ${activeTab === "deposit" ? "active" : ""}`}
              onClick={() => setActiveTab("deposit")}
            >
              <span className="arrow-icon">↙</span> Deposit
            </button>
            <button
              className={`tab-btn ${activeTab === "withdraw" ? "active" : ""}`}
              onClick={() => setActiveTab("withdraw")}
            >
              <span className="arrow-icon">↗</span> Withdraw
            </button>
            <button className="tab-btn link-account-btn">
              <span className="plus-icon">+</span> Link Withdrawal Account
            </button>
          </div>

          {/* Interactive Flow Management Form */}
          <form
            className="operations-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <WalletInput label="CURRENCY" value="Naira (NGN)" readOnly />

            <WalletInput
              label="AMOUNT"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button type="submit" className="form-submit-action-btn">
              {activeTab === "deposit" ? "Fund Wallet" : "Withdraw"}
            </button>
          </form>
        </section>

        {/* Bottom Ledger History Component Panel */}
        <section className="transactions-history-card">
          <div className="card-title-bar">
            <h3>Transactions</h3>
          </div>

          <div className="transactions-view-port">
            {mockTransactions.length === 0 ? (
              <div className="empty-state-container">
                <p>No transaction yet, fund your wallet to begin</p>
              </div>
            ) : (
              <div className="transactions-list">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="transaction-row-item">
                    <div className="tx-info-block">
                      <div className={`tx-direction-indicator icon-${tx.type}`}>
                        {tx.type === "in" ? "↙" : "↗"}
                      </div>
                      <div className="tx-text-meta">
                        <h4>{tx.title}</h4>
                        <p>{tx.subtitle}</p>
                      </div>
                    </div>
                    <div className={`tx-amount-block text-${tx.class}`}>
                      {tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default WalletDashboard;
