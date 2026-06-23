import React, { useState, useEffect } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DepositModalManager from "../../Components/KycModals/DepositModalManager";
import WithdrawalModal from "../../Components/KycModals/WithdrawalModal";
import LinkAccountModal from "../../Components/KycModals/LinkAccountModal";
import { TransactionHistory } from "../../Features/TransactionHistory";
import { updateWallet } from "../../Store/UserSlice";
import { getMyWallet } from "../../Services/Walletservice.js";
import { IoIosArrowRoundForward } from "react-icons/io";
import { SiTether } from "react-icons/si"; // ✅ Keeps the USDT Asset Icon
import "../../Style/Wallet.css";

const WalletPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, wallet } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);

  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const [confirmedDepositAmount, setConfirmedDepositAmount] = useState("");
  const [confirmedWithdrawAmount, setConfirmedWithdrawAmount] = useState("");

  const [linkedBank, setLinkedBank] = useState(null);

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const refreshWallet = async () => {
    try {
      if (!token) return;
      setIsLoadingWallet(true);

      const response = await getMyWallet(token);
      const walletData = response?.data?.[0];

      if (walletData) {
        dispatch(updateWallet(walletData));
      }
    } catch (error) {
      console.error("Wallet refresh failed:", error);
    } finally {
      setIsLoadingWallet(false);
    }
  };

  useEffect(() => {
    refreshWallet();
  }, [token]);

  const handleTransactionSubmit = (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (activeTab === "deposit") {
      setConfirmedDepositAmount(amount);
      setIsDepositOpen(true);
    }

    if (activeTab === "withdraw") {
      setConfirmedWithdrawAmount(amount);
      setIsWithdrawOpen(true);
    }

    setAmount("");
  };

  const handleLinkAccountSuccess = (bankData) => {
    setLinkedBank(bankData);
    toast.success("Account linked successfully");
  };

  const handleWithdrawalSuccess = async () => {
    await refreshWallet();
  };

  return (
    <div className="wallet-page-container">
      <div className="wallet-main-content">
        {/* HEADER */}
        <header className="wallet-header">
          <div>
            <h1>Wallet</h1>
            <p>
              Welcome back,{" "}
              <span>{user?.firstName || user?.name || "User"}</span>
            </p>
          </div>
        </header>

        {/* BALANCES */}
        <section className="balance-cards-grid">
          {/* NGN CARD */}
          <div className="balance-card card-ngn">
            <div
              className="card-currency-header"
              style={{
                display: "flex",
                // justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="currency-badge-icon ngn-badge"
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  display: "inline-block",
                }}
              >
                <rect x="0" y="0" width="33.33" height="100" fill="#008751" />
                <rect
                  x="33.33"
                  y="0"
                  width="33.34"
                  height="100"
                  fill="#ffffff"
                />
                <rect
                  x="66.67"
                  y="0"
                  width="33.33"
                  height="100"
                  fill="#008751"
                />
              </svg>
              <span className="currency-label">NGN BALANCE</span>

              {/* ✅ Inline Round Nigerian Flag SVG */}
            </div>

            <div className="balance-amount">
              {isLoadingWallet ? (
                <div className="wallet-skel skel-dark skel-large"></div>
              ) : (
                <>₦{formatAmount(wallet?.balanceInNaira)}</>
              )}
            </div>
          </div>

          {/* USDT CARD */}
          <div className="balance-card card-usdt">
            <div
              className="card-currency-header"
              style={{
                display: "flex",
                // justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <SiTether
                className="currency-badge-icon usdt-badge"
                style={{ fontSize: "1.3rem", color: "#26a17b" }}
              />
              <span className="currency-label">USDT BALANCE</span>
            </div>

            <div className="balance-amount">
              {isLoadingWallet ? (
                <div className="wallet-skel skel-gold skel-large"></div>
              ) : (
                <>{formatAmount(wallet?.balanceInUSDT)} USDT</>
              )}
            </div>
          </div>
        </section>

        {/* ACTIONS */}
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

            <button type="submit" className="form-submit-action-btn">
              {activeTab === "deposit" ? "Fund Wallet" : "Withdraw Funds"}
            </button>
          </form>
        </section>

        {/* TRANSACTIONS */}
        <section className="transaction-section">
          <div className="transaction-header">
            <h3>Recent Transactions</h3>
            <div
              className="tr-actions"
              onClick={() => navigate("/notification")}
            >
              <h5>View Transactions</h5>
              <div className="icon-holder">
                <IoIosArrowRoundForward className="arrow-icon" />
              </div>
            </div>
          </div>

          <div className="transactions-view-port">
            <TransactionHistory
              limit={4}
              hideHeader
              customClass="dashboard-variant"
            />
          </div>
        </section>
      </div>

      {/* DEPOSIT */}
      <DepositModalManager
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        amount={confirmedDepositAmount}
        token={token}
        onSuccess={refreshWallet}
      />

      {/* WITHDRAWAL */}
      <WithdrawalModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        amount={confirmedWithdrawAmount}
        userId={user?._id || user?.id}
        token={token}
        onWithdrawalSuccess={handleWithdrawalSuccess}
      />

      {/* LINK ACCOUNT */}
      <LinkAccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSuccessRefresh={handleLinkAccountSuccess}
      />
    </div>
  );
};

export default WalletPage;
