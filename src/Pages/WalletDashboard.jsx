import React, { useState } from "react";
import "../Style/Wallet.css";
import WalletInput from "../Components/WalletInput";

import {
  FiGrid,
  FiCreditCard,
  FiRepeat,
  FiLock,
  FiTrendingUp,
  FiUser,
  FiLogOut,
  FiArrowDownLeft,
  FiArrowUpRight,
  FiPlus,
} from "react-icons/fi";

const WalletDashboard = () => {
  const [activeTab, setActiveTab] = useState("deposit");
  const [amount, setAmount] = useState("");

  const mockBalances = {
    ngn: activeTab === "deposit" ? "0" : "5,000",
    usdt: activeTab === "deposit" ? "0" : "1.06",
  };

  const mockTransactions = [];

  return (
    <div className="wallet-dashboard-container">
      <aside className="wallet-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-icon">HN</div>
          <h2>HedgeNest</h2>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item">
            <FiGrid className="nav-icon" />
            Dashboard
          </a>

          <a href="#" className="nav-item active">
            <FiCreditCard className="nav-icon" />
            Wallet
          </a>

          <a href="#" className="nav-item">
            <FiRepeat className="nav-icon" />
            Convert
          </a>

          <a href="#" className="nav-item">
            <FiLock className="nav-icon" />
            Smart Safe
          </a>

          <a href="#" className="nav-item">
            <FiTrendingUp className="nav-icon" />
            Invest
          </a>

          <a href="#" className="nav-item">
            <FiUser className="nav-icon" />
            Profile
          </a>
        </nav>

        <div className="sidebar-footer">
          <button className="signout-btn">
            <FiLogOut className="nav-icon" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="wallet-main-content">
        <header className="content-header">
          <h1>Wallet</h1>
        </header>

        {/* BALANCE CARDS */}
        <section className="balance-cards-grid">
          <div className="balance-card card-ngn">
            <div className="card-currency-header">
              <div className="currency-dot green"></div>
              <span className="currency-label">NGN BALANCE</span>
            </div>

            <div className="balance-amount">₦{mockBalances.ngn}</div>
          </div>

          <div className="balance-card card-usdt">
            <div className="card-currency-header">
              <div className="currency-dot teal"></div>
              <span className="currency-label">USDT BALANCE</span>
            </div>

            <div className="balance-amount">{mockBalances.usdt} USDT</div>
          </div>
        </section>

        <section className="wallet-operations-card">
          <div className="operations-tabs-row">
            <button
              className={`tab-btn ${activeTab === "deposit" ? "active" : ""}`}
              onClick={() => setActiveTab("deposit")}
            >
              <FiArrowDownLeft />
              Deposit
            </button>

            <button
              className={`tab-btn ${activeTab === "withdraw" ? "active" : ""}`}
              onClick={() => setActiveTab("withdraw")}
            >
              <FiArrowUpRight />
              Withdraw
            </button>

            <button className="tab-btn">
              <FiPlus />
              Link Withdrawal Account
            </button>
          </div>

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

        <section className="transactions-history-card">
          <div className="card-title-bar">
            <h3>Transactions</h3>
          </div>

          <div className="transactions-view-port">
            {mockTransactions.length === 0 ? (
              <div className="empty-state-container">
                <p>No activities yet</p>
              </div>
            ) : (
              <div className="transactions-list">
                {mockTransactions.map((tx) => (
                  <div key={tx.id} className="transaction-row-item">
                    <div className="tx-info-block">
                      <div className={`tx-direction-indicator icon-${tx.type}`}>
                        {tx.type === "in" ? (
                          <FiArrowDownLeft />
                        ) : (
                          <FiArrowUpRight />
                        )}
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
