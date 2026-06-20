import React, { useState, useEffect } from "react";
import "../../Css/DashBoard.css";
import { IoNotificationsSharp } from "react-icons/io5";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TransactionHistory } from "../../Features/TransactionHistory.jsx";
import SplashScreen from "../../Components/SplashScreen.jsx";
import { getMyWallet } from "../../Services/Walletservice.js";
import { updateWallet } from "../../Store/UserSlice.js";
import { getTransactionHistory } from "../../Services/authService.js";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token, wallet } = useSelector((state) => state.user);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("dashboardSplashShown");
  });

  const [liveTransactions, setLiveTransactions] = useState([]);

  useEffect(() => {
    if (!showSplash) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem("dashboardSplashShown", "true");
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [showSplash]);

  useEffect(() => {
    const initializeDashboardData = async () => {
      if (!token) return;

      try {
        setIsLoadingWallet(true);
        // Transaction fetch removed as it is now natively handled by <TransactionHistory />
        const walletResponse = await getMyWallet(token);

        const walletData = walletResponse?.data?.[0];
        if (walletData) {
          dispatch(updateWallet(walletData));
        }
      } catch (error) {
        // console.error("Failed to sync wallet data:", error);
      } finally {
        setIsLoadingWallet(false);
      }
    };

    initializeDashboardData();
  }, [token, dispatch]);

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";
  const profileImage =
    user?.profilePicture?.url || "https://via.placeholder.com/150";

  const formatCurrency = (value = 0) =>
    Number(value).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const availableBalance = wallet?.availableBalance ?? 0;
  const nairaBalance = wallet?.balanceInNaira ?? 0;
  const usdtBalance = Number(wallet?.balanceInUSDT ?? 0).toFixed(2);

  const smartVaults = wallet?.smartVaults ?? 0;
  const investments = wallet?.investments ?? 0;

  if (showSplash) {
    return <SplashScreen />;
  }

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
                  <IoNotificationsSharp
                    onClick={() => navigate("/notification")}
                  />
                </button>

                <div
                  className="user-prof"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/profile")}
                >
                  <img
                    src={profileImage}
                    alt={fullName}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
              </div>
            </article>

            {/* BALANCES */}
            <article className="dr-balance">
              <div className="balance">
                <div className="total-available">
                  <p>Available Balance</p>
                  {isLoadingWallet ? (
                    <div className="dash-skel sk-dark sk-large"></div>
                  ) : (
                    <h2>₦ {formatCurrency(availableBalance)}</h2>
                  )}
                </div>

                <div className="other-balances">
                  <div className="Ngn-balance">
                    <p>NGN BALANCE</p>
                    {isLoadingWallet ? (
                      <div className="dash-skel sk-dark sk-medium"></div>
                    ) : (
                      <h2>₦ {formatCurrency(nairaBalance)}</h2>
                    )}
                  </div>

                  <div className="usdt-balance">
                    <p>USDT BALANCE</p>
                    {isLoadingWallet ? (
                      <div className="dash-skel sk-dark sk-medium"></div>
                    ) : (
                      <h2>{usdtBalance} USDT</h2>
                    )}
                  </div>
                </div>
              </div>

              <div className="insight">
                <h3>Financial Insight Of The Day</h3>
                <p>Insights On How To Grow Your Wealth Better</p>
              </div>
            </article>

            {/* QUICK ACTIONS */}
            <article className="dr-actions">
              <div className="convert" onClick={() => navigate("/convert")}>
                <p>Convert</p>
              </div>

              <div className="save" onClick={() => navigate("/SmartSafe")}>
                <p>Save</p>
              </div>

              <div className="invest" onClick={() => navigate("/invest")}>
                <p>Invest</p>
              </div>
            </article>

            {/* VAULTS & INVESTMENTS */}
            <article className="vault-section">
              <div className="vault">
                <div className="upper-section">
                  <h3>Smart Vaults</h3>
                  <div
                    className="view-all-action"
                    onClick={() => navigate("/SmartSafe")}
                  >
                    <p>View all</p>
                    <div className="icon-holder">
                      <IoIosArrowRoundForward
                        className="arrow-icon"
                        style={{ alignSelf: "right" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="lower-section">
                  {isLoadingWallet ? (
                    <div className="dash-skel sk-light sk-small"></div>
                  ) : (
                    <p>{smartVaults}</p>
                  )}
                  <p>Active Savings Plan</p>
                </div>
              </div>

              <div className="investment">
                <div className="upper-section">
                  <h3>Investments</h3>
                  <div
                    className="view-all-action"
                    onClick={() => navigate("/invest")}
                  >
                    <p>View all</p>
                    <div className="icon-holder">
                      <IoIosArrowRoundForward
                        className="arrow-icon"
                        style={{ alignSelf: "right" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="lower-section">
                  {isLoadingWallet ? (
                    <div className="dash-skel sk-light sk-small"></div>
                  ) : (
                    <p>{investments}</p>
                  )}
                  <p>Investment Plans</p>
                </div>
              </div>
            </article>

            {/* LIVE TRANSACTIONS MAPPER */}
            <section className="transaction-section">
              <div className="transaction-header">
                <h3>Recent Transactions</h3>
                <div className="tr-actions" onClick={() => navigate("/wallet")}>
                  <h5>View wallet</h5>
                  <div className="icon-holder">
                    <IoIosArrowRoundForward className="arrow-icon" />
                  </div>
                </div>
              </div>

              <div className="transactions-view-port">
                {/* The component now fully handles its own loading state
                  and data fetching. We just pass the limit!
                */}
                <TransactionHistory
                  limit={4}
                  hideHeader
                  customClass="dashboard-variant"
                />
              </div>
            </section>
          </section>
        </section>
      </div>
    </section>
  );
};

export default Dashboard;
