import React from "react";
import "../Css/DashBoard.css";
import { IoNotificationsSharp } from "react-icons/io5";
import { IoPersonCircle } from "react-icons/io5";

import { IoIosArrowRoundForward } from "react-icons/io";
import { LuPlus } from "react-icons/lu";
import Sidebar from "../Components/Sidebar";

const Dashboard = () => {
  return (
    <section>
      <div className="Dash-container">
        <section className="Dash-left">
          <Sidebar />
        </section>
        <section className="Dash-right">
          <section className="dr-holder">
            <article className="dr-header">
              <div>
                <p>Welcome Abayomi,</p>
                <h3>Your nest,today.</h3>
              </div>
              <div>
                <IoNotificationsSharp />
                <IoPersonCircle />
              </div>
            </article>
            <article className="dr-balance">
              <div className="balance">
                <div className="total-available">
                  <p>Available Balance</p>
                  <h2>₦ 0</h2>
                </div>
                <div className="other-balances">
                  <div className="Ngn-balance">
                    <p>NGN BALANCE</p>
                    <h2>
                      <span>{"\u20A6"} </span> <span>0</span>
                    </h2>
                  </div>
                  <div className="usdt-balance">
                    <p>USDT BALANCE</p>
                    <h2>0 USDT</h2>
                  </div>
                </div>
              </div>
              <div className="insight">
                <h3>Financial Insight Of The Day</h3>
                <p>Insights On How To Grow Your Wealth Better</p>
              </div>
            </article>
            <article className="dr-actions">
              <div className="convert">
                <LuPlus className="icon" />
                <p>Convert</p>
              </div>
              <div className="save">
                <LuPlus className="icon" />
                <p>Save</p>
              </div>
              <div className="invest">
                <LuPlus className="icon" />
                <p>Invest</p>
              </div>
            </article>
            <article className="vault-section">
              <div className="vault">
                <div className="upper-section">
                  <h3>Smart Vaults</h3>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <p>View all</p>
                    <div className="icon-holder">
                      <IoIosArrowRoundForward className="arrow-icon" />
                    </div>
                  </div>
                </div>
                <div className="lower-section">
                  <p>0</p>
                  <p>Acive Savings Plan</p>
                </div>
              </div>
              <div className="investment">
                <div className="upper-section">
                  <h3>Investments</h3>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <p>View all</p>
                    <div className="icon-holder">
                      <IoIosArrowRoundForward className="arrow-icon" />
                    </div>
                  </div>
                </div>
                <div className="lower-section">
                  <p>0</p>
                  <p>Earnings Yield</p>
                </div>
              </div>
            </article>
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
              <div className="transaction-body">
                <p>No transaction yet, fund your wallet</p>
              </div>
            </section>
          </section>
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
