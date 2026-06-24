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
import { SiTether } from "react-icons/si";
import "../../Style/Wallet.css";

const WalletPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, wallet } = useSelector((state) => state.user);

  // Live Redux State Console Logger
  // useEffect(() => {
  //   console.log("[WalletPage] Current Redux Wallet Slice Data:", wallet);
  // }, [wallet]);

  const [activeTab, setActiveTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [inputError, setInputError] = useState("");
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

  // ✅ Operational inline validation validation engine
  const validateAmountInput = (value, currentTab) => {
    if (!value) {
      setInputError("");
      return false;
    }

    const numericAmount = Number(value);
    if (numericAmount <= 0) {
      setInputError("Enter a valid positive amount");
      return false;
    }

    if (currentTab === "withdraw") {
      // 🟢 FIXED: Target availableBalance from Redux slice structure
      const availableBalance = Number(wallet?.availableBalance || 0);

      if (availableBalance < 1500) {
        setInputError(
          "Your available balance must be at least ₦1,500.00 to make a withdrawal.",
        );
        return false;
      }
      if (numericAmount < 1500) {
        setInputError("Minimum withdrawal amount is ₦1,500.00");
        return false;
      }
      if (numericAmount > availableBalance) {
        setInputError("Insufficient funds for this withdrawal amount");
        return false;
      }
    }

    setInputError("");
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    validateAmountInput(value, activeTab);
  };

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    validateAmountInput(amount, tabName);
  };

  const handleTransactionSubmit = (e) => {
    e.preventDefault();

    const isValid = validateAmountInput(amount, activeTab);
    if (!isValid) {
      if (!amount) setInputError("Amount field cannot be empty");
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
    setInputError("");
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
              style={{ display: "flex", alignItems: "center", width: "100%" }}
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
              style={{ display: "flex", alignItems: "center", width: "100%" }}
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
              onClick={() => handleTabSwitch("deposit")}
            >
              <FiArrowDownLeft className="tab-icon" />
              Deposit
            </button>

            <button
              type="button"
              className={`tab-btn ${activeTab === "withdraw" ? "active" : ""}`}
              onClick={() => handleTabSwitch("withdraw")}
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

            <div
              className="input-group"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label>Amount</label>
              <input
                type="number"
                placeholder={
                  activeTab === "withdraw" ? "Min 1,500" : "Enter amount"
                }
                value={amount}
                onChange={handleAmountChange}
                style={{ border: inputError ? "1px solid #ef4444" : "" }}
              />
              {inputError && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "0.82rem",
                    marginTop: "6px",
                    fontWeight: "500",
                    display: "block",
                    textAlign: "left",
                  }}
                >
                  {inputError}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="form-submit-action-btn"
              disabled={!!inputError}
            >
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
