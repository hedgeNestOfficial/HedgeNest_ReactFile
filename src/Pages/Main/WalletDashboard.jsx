import React, { useEffect, useState } from "react";
import { FiArrowDownLeft, FiArrowUpRight, FiPlus } from "react-icons/fi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Sidebar from "../../Components/Sidebar";
import "../../Style/Wallet.css";
import { historyData } from "../../JS/Transactions.js";
import { TransactionHistory } from "../../Features/TransactionHistory.jsx";
import { linkBankAccount } from "../../Services/Walletservice.js";
const WalletPage = () => {
  const { user, token } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("deposit");

  const [amount, setAmount] = useState("");

  const [balances] = useState({
    ngn: "0.00",
    usdt: "0.00",
  });

  const [transactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountData, setAccountData] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const handleAccountChange = (e) => {
    const { name, value } = e.target;

    setAccountData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // useEffect((){})
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

      setShowAccountModal(false);

      setAccountData({
        bankName: "",
        accountName: "",
        accountNumber: "",
      });
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Failed to link account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      return toast.error("Enter valid amount");
    }

    try {
      setIsLoading(true);

      if (activeTab === "deposit") {
        console.log("Deposit:", amount);
      }

      if (activeTab === "withdraw") {
        console.log("Withdraw:", amount);
      }

      toast.success(
        `${activeTab === "deposit" ? "Deposit" : "Withdrawal"} initiated`,
      );

      setAmount("");
    } catch (error) {
      console.log(error);

      toast.error("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(user);
  console.log(token);
  return (
    <div className="wallet-page-container">
      <Sidebar />

      <div className="wallet-main-content">
        {/* HEADER */}
        <header className="wallet-header">
          <div>
            <h1>Wallet</h1>

            <p>
              Welcome back, <span>{user?.firstName || "User"}</span>
            </p>
          </div>
        </header>

        {/* BALANCES */}
        <section className="balance-cards-grid">
          <div className="balance-card card-ngn">
            <div className="card-currency-header">
              <span className="currency-label">NGN BALANCE</span>
            </div>

            <div className="balance-amount">₦{balances.ngn}</div>
          </div>

          <div className="balance-card card-usdt">
            <div className="card-currency-header">
              <span className="currency-label">USDT BALANCE</span>
            </div>

            <div className="balance-amount">{balances.usdt} USDT</div>
          </div>
        </section>

        <section className="wallet-operations-card">
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

            <button
              className="tab-btn link-account-btn"
              onClick={() => setShowAccountModal(true)}
            >
              <FiPlus className="tab-icon" />
              Link Account
            </button>
          </div>

          {/* FORM */}
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

        {/* TRANSACTIONS */}
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
                  <TransactionHistory key={index} transactions={transactions} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* LINK ACCOUNT MODAL */}
      {showAccountModal && (
        <div className="wallet-modal-overlay">
          <div className="wallet-modal">
            <div className="wallet-modal-header">
              <h3>Link Withdrawal Account</h3>

              <button onClick={() => setShowAccountModal(false)}>✕</button>
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

// import React, { useState, useEffect } from "react";
// import { FiArrowDownLeft, FiArrowUpRight, FiPlus } from "react-icons/fi";
// import "../../Style/Wallet.css";
// import Sidebar from "../../Components/Sidebar";

// const WalletPage = () => {
//   // --- UI STATE ---
//   const [activeTab, setActiveTab] = useState("deposit");
//   const [amount, setAmount] = useState("");

//   const [balances, setBalances] = useState({
//     ngn: "0",
//     usdt: "0",
//   });
//   const [transactions, setTransactions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // --- API INTEGRATION POINTS ---
//   useEffect(() => {
//     // TODO: Fetch wallet balances on component mount
//     // fetchBalances().then(data => setBalances(data));
//     // fetchTransactions().then(data => setTransactions(data));
//   }, []);

//   const handleTransactionSubmit = async (e) => {
//     e.preventDefault();
//     if (!amount || isNaN(amount) || Number(amount) <= 0) return;

//     setIsLoading(true);
//     try {
//       if (activeTab === "deposit") {
//         // TODO: Call Deposit API
//         console.log("Depositing amount:", amount);
//       } else if (activeTab === "withdraw") {
//         // TODO: Call Withdraw API
//         console.log("Withdrawing amount:", amount);
//       }
//       // Reset form on success
//       setAmount("");
//     } catch (error) {
//       console.error("Transaction failed:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="wallet-page-container">
//       <Sidebar />
//       <header className="wallet-header">
//         <h1>Wallet</h1>
//       </header>

//       {/* BALANCE CARDS */}
//       <section className="balance-cards-grid">
//         <div className="balance-card card-ngn">
//           <div className="card-currency-header">
//             <div className="currency-icon ngn-flag"></div>
//             <span className="currency-label">NGN BALANCE</span>
//           </div>
//           <div className="balance-amount">
//             <span className="currency-symbol">₦</span>
//             {balances.ngn}
//           </div>
//         </div>

//         <div className="balance-card card-usdt">
//           <div className="card-currency-header">
//             <div className="currency-icon usdt-icon">₮</div>
//             <span className="currency-label">USDT BALANCE</span>
//           </div>
//           <div className="balance-amount">
//             {balances.usdt} <span className="currency-text">USDT</span>
//           </div>
//         </div>
//       </section>

//       {/* OPERATIONS CARD */}
//       <section className="wallet-operations-card">
//         {/* Tabs */}
//         <div className="operations-tabs-row">
//           <button
//             className={`tab-btn ${activeTab === "deposit" ? "active" : ""}`}
//             onClick={() => setActiveTab("deposit")}
//           >
//             <FiArrowDownLeft className="tab-icon" />
//             Deposit
//           </button>

//           <button
//             className={`tab-btn ${activeTab === "withdraw" ? "active" : ""}`}
//             onClick={() => setActiveTab("withdraw")}
//           >
//             <FiArrowUpRight className="tab-icon" />
//             Withdraw
//           </button>

//           <button className="tab-btn link-account-btn">
//             <FiPlus className="tab-icon" />
//             Link Withdrawal Account
//           </button>
//         </div>

//         {/* Form */}
//         <form className="operations-form" onSubmit={handleTransactionSubmit}>
//           <div className="input-group">
//             <label>CURRENCY</label>
//             <input
//               type="text"
//               value="Naira (NGN)"
//               readOnly
//               className="readonly-input"
//             />
//           </div>

//           <div className="input-group">
//             <label>AMOUNT</label>
//             <input
//               type="number"
//               placeholder=""
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               required
//               disabled={isLoading}
//             />
//           </div>

//           <button
//             type="submit"
//             className="form-submit-action-btn"
//             disabled={isLoading}
//           >
//             {isLoading
//               ? "Processing..."
//               : activeTab === "deposit"
//                 ? "Fund Wallet"
//                 : "Withdraw"}
//           </button>
//         </form>
//       </section>

//       {/* TRANSACTIONS HISTORY */}
//       <section className="transactions-history-card">
//         <div className="card-title-bar">
//           <h3>Transactions</h3>
//         </div>

//         <div className="transactions-view-port">
//           {transactions.length === 0 ? (
//             <div className="empty-state-container">
//               <p>No activities yet</p>
//             </div>
//           ) : (
//             <div className="transactions-list">
//               {/* Map through your transactions here */}
//             </div>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default WalletPage;
// import React, { useState } from "react";

// import {
// FiArrowDownLeft,
// FiArrowUpRight,
// FiPlus,
// } from "react-icons/fi";

// import { useSelector } from "react-redux";

// import Sidebar from "../../Components/Sidebar";

// import "../../Style/Wallet.css";

// const WalletPage = () => {
// // =========================
// // REDUX USER DATA
// // =========================

// const { user } = useSelector((state) => state.user);

// // =========================
// // UI STATES
// // =========================

// const [activeTab, setActiveTab] = useState("deposit");

// const [amount, setAmount] = useState("");

// const [isLoading, setIsLoading] = useState(false);

// // =========================
// // MOCK BALANCE
// // (replace with API later)
// // =========================

// const [balances] = useState({
// ngn: "0.00",

// usdt: "0.00",

// });

// // =========================
// // MOCK TRANSACTIONS
// // =========================

// const [transactions] = useState([]);

// // =========================
// // HANDLE SUBMIT
// // =========================

// const handleTransactionSubmit = async (e) => {
// e.preventDefault();

// if (!amount || Number(amount) <= 0) return;

// try {
//   setIsLoading(true);

//   if (activeTab === "deposit") {
//     console.log("Deposit:", amount);
//   }

//   if (activeTab === "withdraw") {
//     console.log("Withdraw:", amount);
//   }

//   setAmount("");
// } catch (error) {
//   console.log(error);
// } finally {
//   setIsLoading(false);
// }

// };

// return ( <div className="wallet-page-container">
// {/* SIDEBAR */} <Sidebar />

//   {/* MAIN CONTENT */}
//   <main className="wallet-main-content">
//     {/* HEADER */}
//     <header className="wallet-header">
//       <div>
//         <h1>Wallet</h1>

//         <p className="wallet-subtitle">
//           Manage your balances and transactions
//         </p>
//       </div>
//     </header>

//     {/* USER CARD */}
//     <section className="wallet-user-card">
//       <div className="wallet-user-info">
//         <img
//           src={
//             user?.profilePicture?.url ||
//             "https://via.placeholder.com/100"
//           }
//           alt="Profile"
//           className="wallet-profile-image"
//         />

//         <div>
//           <h2>
//             {user?.firstName} {user?.lastName}
//           </h2>

//           <p>{user?.email}</p>
//         </div>
//       </div>

//       <div className="wallet-user-status">
//         <span>
//           Email:
//           {user?.isVerified ? " Verified" : " Pending"}
//         </span>

//         <span>
//           PIN:
//           {user?.transactionPin
//             ? " Created"
//             : " Not Set"}
//         </span>
//       </div>
//     </section>

//     {/* BALANCE CARDS */}
//     <section className="balance-cards-grid">
//       {/* NGN */}
//       <div className="balance-card card-ngn">
//         <div className="card-currency-header">
//           <span className="currency-label">
//             NGN BALANCE
//           </span>
//         </div>

//         <div className="balance-amount">
//           ₦{balances.ngn}
//         </div>
//       </div>

//       {/* USDT */}
//       <div className="balance-card card-usdt">
//         <div className="card-currency-header">
//           <span className="currency-label">
//             USDT BALANCE
//           </span>
//         </div>

//         <div className="balance-amount">
//           {balances.usdt} USDT
//         </div>
//       </div>
//     </section>

//     {/* OPERATIONS */}
//     <section className="wallet-operations-card">
//       {/* TABS */}
//       <div className="operations-tabs-row">
//         <button
//           className={`tab-btn ${
//             activeTab === "deposit"
//               ? "active-tab-btn"
//               : ""
//           }`}
//           onClick={() => setActiveTab("deposit")}
//         >
//           <FiArrowDownLeft className="tab-icon" />

//           Deposit
//         </button>

//         <button
//           className={`tab-btn ${
//             activeTab === "withdraw"
//               ? "active-tab-btn"
//               : ""
//           }`}
//           onClick={() => setActiveTab("withdraw")}
//         >
//           <FiArrowUpRight className="tab-icon" />

//           Withdraw
//         </button>

//         <button className="tab-btn">
//           <FiPlus className="tab-icon" />

//           Link Account
//         </button>
//       </div>

//       {/* FORM */}
//       <form
//         className="operations-form"
//         onSubmit={handleTransactionSubmit}
//       >
//         {/* CURRENCY */}
//         <div className="input-group">
//           <label>Currency</label>

//           <input
//             type="text"
//             value="Naira (NGN)"
//             readOnly
//             className="readonly-input"
//           />
//         </div>

//         {/* AMOUNT */}
//         <div className="input-group">
//           <label>Amount</label>

//           <input
//             type="number"
//             placeholder="Enter amount"
//             value={amount}
//             onChange={(e) =>
//               setAmount(e.target.value)
//             }
//             disabled={isLoading}
//           />
//         </div>

//         {/* SUBMIT */}
//         <button
//           type="submit"
//           className="form-submit-action-btn"
//           disabled={isLoading}
//         >
//           {isLoading
//             ? "Processing..."
//             : activeTab === "deposit"
//               ? "Fund Wallet"
//               : "Withdraw Funds"}
//         </button>
//       </form>
//     </section>

//     {/* TRANSACTIONS */}
//     <section className="transactions-history-card">
//       <div className="card-title-bar">
//         <h3>Recent Transactions</h3>
//       </div>

//       <div className="transactions-view-port">
//         {transactions.length === 0 ? (
//           <div className="empty-state-container">
//             <p>No transaction history yet</p>
//           </div>
//         ) : (
//           <div className="transactions-list">
//             {transactions.map((item, index) => (
//               <div
//                 className="transaction-item"
//                 key={index}
//               >
//                 <p>{item.type}</p>

//                 <h4>{item.amount}</h4>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   </main>
// </div>

// );
// };

// export default WalletPage;
