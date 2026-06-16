// import React from "react";
// import "../../Css/DashBoard.css";
// import { IoNotificationsSharp } from "react-icons/io5";
// import Abayomi from "../../assets/Abayomi.png";

// import { IoIosArrowRoundForward } from "react-icons/io";
// import { LuPlus } from "react-icons/lu";
// // import Sidebar from "../../Components/Sidebar";

// const Dashboard = () => {
//   return (
//     <section>
//       <div className="Dash-container">
//         <section className="Dash-left">{/* <Sidebar /> */}</section>
//         <section className="Dash-right">
//           <section className="dr-holder">
//             <article className="dr-header">
//               <div>
//                 <p>Welcome Abayomi,</p>
//                 <h3>Your nest,today.</h3>
//               </div>
//               <div className="notify-user">
//                 <button className="notify-button">
//                   <IoNotificationsSharp />
//                 </button>
//                 <div className="user-prof">
//                   <img src={Abayomi} alt="user profile" />
//                 </div>
//               </div>
//             </article>
//             <article className="dr-balance">
//               <div className="balance">
//                 <div className="total-available">
//                   <p>Available Balance</p>
//                   <h2>₦ 0</h2>
//                 </div>
//                 <div className="other-balances">
//                   <div className="Ngn-balance">
//                     <p>NGN BALANCE</p>
//                     <h2>
//                       <span>{"\u20A6"} </span> <span>0</span>
//                     </h2>
//                   </div>
//                   <div className="usdt-balance">
//                     <p>USDT BALANCE</p>
//                     <h2>0 USDT</h2>
//                   </div>
//                 </div>
//               </div>
//               <div className="insight">
//                 <h3>Financial Insight Of The Day</h3>
//                 <p>Insights On How To Grow Your Wealth Better</p>
//               </div>
//             </article>
//             <article className="dr-actions">
//               <div className="convert">
//                 <p>Convert</p>
//               </div>
//               <div className="save">
//                 <p>Save</p>
//               </div>
//               <div className="invest">
//                 <p>Invest</p>
//               </div>
//             </article>
//             <article className="vault-section">
//               <div className="vault">
//                 <div className="upper-section">
//                   <h3>Smart Vaults</h3>
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <p>View all</p>
//                     <div className="icon-holder">
//                       <IoIosArrowRoundForward className="arrow-icon" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="lower-section">
//                   <p>0</p>
//                   <p>Acive Savings Plan</p>
//                 </div>
//               </div>
//               <div className="investment">
//                 <div className="upper-section">
//                   <h3>Investments</h3>
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <p>View all</p>
//                     <div className="icon-holder">
//                       <IoIosArrowRoundForward className="arrow-icon" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="lower-section">
//                   <p>0</p>
//                   <p>Earnings Yield</p>
//                 </div>
//               </div>
//             </article>
//             <section className="transaction-section">
//               <div className="transaction-header">
//                 <h3>Recent Transactions</h3>
//                 <div className="tr-actions">
//                   <h5>View wallet</h5>

//                   <div className="icon-holder">
//                     <IoIosArrowRoundForward className="arrow-icon" />
//                   </div>
//                 </div>
//               </div>
//               <div className="transaction-body">
//                 <p>No transaction yet, fund your wallet</p>
//               </div>
//             </section>
//           </section>
//         </section>
//       </div>
//     </section>
//   );
// };

// export default Dashboard;
import React from "react";

import "../../Css/DashBoard.css";

import { IoNotificationsSharp } from "react-icons/io5";
import { IoIosArrowRoundForward } from "react-icons/io";

import { TransactionHistory } from "../../Features/TransactionHistory.jsx";
import { historyData } from "../../JS/Transactions.js";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user, wallet } = useSelector((state) => state.user);

  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`;

  const profileImage =
    user?.profilePicture?.url || "https://via.placeholder.com/150";

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const availableBalance = wallet?.availableBalance ?? 0;

  const nairaBalance = wallet?.balanceInNaira ?? 0;

  const rawUsdt = wallet?.balanceInUSDT ?? allet?.balanceInUsdt ?? 0;
  const usdtBalance = Number(rawUsdt).toFixed(2);

  const smartVaults = wallet?.smartVaults ?? 0;

  const investments = wallet?.investments ?? 0;

  return (
    <section>
      <div className="Dash-container">
        <section className="Dash-right">
          <section className="dr-holder">
            {/* HEADER */}
            <article className="dr-header">
              <div>
                <p>Welcome {user?.firstName || "User"},</p>

                <h3>Your nest, today.</h3>
              </div>

              <div className="notify-user">
                <button className="notify-button">
                  <IoNotificationsSharp />
                </button>

                <div className="user-prof">
                  <img src={profileImage} alt={fullName} />
                </div>
              </div>
            </article>

            {/* BALANCE SECTION */}
            <article className="dr-balance">
              <div className="balance">
                <div className="total-available">
                  <p>Available Balance</p>

                  <h2>₦ {formatCurrency(availableBalance)}</h2>
                </div>

                <div className="other-balances">
                  <div className="Ngn-balance">
                    <p>NGN BALANCE</p>

                    <h2>
                      <span>₦ </span>

                      <span>{formatCurrency(nairaBalance)}</span>
                    </h2>
                  </div>

                  <div className="usdt-balance">
                    <p>USDT BALANCE</p>

                    <h2>{usdtBalance} USDT</h2>
                  </div>
                </div>
              </div>

              <div className="insight">
                <h3>Financial Insight Of The Day</h3>

                <p>Insights On How To Grow Your Wealth Better</p>
              </div>
            </article>

            {/* ACTIONS */}
            <article className="dr-actions">
              <div className="convert">
                <p>Convert</p>
              </div>

              <div className="save">
                <p>Save</p>
              </div>

              <div className="invest">
                <p>Invest</p>
              </div>
            </article>

            {/* VAULT & INVESTMENTS */}
            <article className="vault-section">
              <div className="vault">
                <div className="upper-section">
                  <h3>Smart Vaults</h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <p>View all</p>

                    <div className="icon-holder">
                      <IoIosArrowRoundForward className="arrow-icon" />
                    </div>
                  </div>
                </div>

                <div className="lower-section">
                  <p>{smartVaults}</p>

                  <p>Active Savings Plan</p>
                </div>
              </div>

              <div className="investment">
                <div className="upper-section">
                  <h3>Investments</h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <p>View all</p>

                    <div className="icon-holder">
                      <IoIosArrowRoundForward className="arrow-icon" />
                    </div>
                  </div>
                </div>

                <div className="lower-section">
                  <p>{investments}</p>

                  <p>Earnings Yield</p>
                </div>
              </div>
            </article>

            {/* TRANSACTIONS */}
            <section className="transaction-section">
              <div className="transaction-header">
                <h3>Recent Transactions</h3>

                <div className="tr-actions">
                  <h5>View wallet</h5>

                  <div className="icon-holder">
                    <IoIosArrowRoundForward className="arrow-icon" />
                  </div>
                </div>
              </div>

              <div className="transactions-view-port">
                {historyData.length === 0 ? (
                  <div className="transaction-body">
                    <p>No transactions yet, fund your wallet</p>
                  </div>
                ) : (
                  <TransactionHistory
                    transactions={historyData.slice(0, 4)}
                    hideHeader={true}
                    customClass="dashboard-variant"
                  />
                )}
              </div>
            </section>
          </section>
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
