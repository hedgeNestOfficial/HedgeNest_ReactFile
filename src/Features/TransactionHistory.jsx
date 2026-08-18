import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import "../Style/TransactionHistory.css";

export const TransactionHistory = ({
  limit = null, // e.g., pass 4 from the Dashboard
  hideHeader = false,
  customClass = "",
}) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const BASE_URL = import.meta.env.VITE_HedgeNest_Url;

        const response = await axios.get(`${BASE_URL}/api/v1/transaction`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data?.data) {
          let data = response.data.data;
          if (limit) {
            data = data.slice(0, limit);
          }
          setTransactions(data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [token, limit]);

  /*
  |--------------------------------------------------------------------------
  | Data Normalization & Formatting
  |--------------------------------------------------------------------------
  */
  const formatTransaction = (tx) => {
    // Determine Credit (in) vs Debit (out)
    const isCredit = ["deposit", "return"].includes(
      tx.transactionType?.toLowerCase(),
    );
    const type = isCredit ? "in" : "out";

    // Dynamic Title based on Transaction Type
    let title = "Transaction";
    switch (tx.transactionType?.toLowerCase()) {
      case "deposit":
        title = "Wallet Deposit";
        break;
      case "return":
        title = "Return Payout";
        break;
      case "investment":
        title = "Investment Locked";
        break;
      case "savings":
        title = "Smart Vault Funding";
        break;
      case "withdraw": // 🟢 FIXED: Matches backend payload structure ("withdraw")
      case "withdrawal":
        title = "Wallet Withdrawal";
        break;
      case "conversion": // 🟢 FIXED: Added case assignment for conversions
        title = "Currency Conversion";
        break;
      default:
        title = tx.transactionType
          ? tx.transactionType.charAt(0).toUpperCase() +
            tx.transactionType.slice(1)
          : "Transaction";
        break;
    }

    // Format Date and Time
    const dateObj = new Date(tx.createdAt || tx.date);
    const formattedDate = dateObj.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = dateObj.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 🟢 FIXED: Safe normalization fallback for missing/null currencies
    const currencyCode = tx.currency ? tx.currency.toUpperCase() : "NGN";

    // Assign proper symbols based on currency context
    const currencySymbol = currencyCode === "USDT" ? "$" : "₦";

    return {
      id: tx._id,
      type,
      title,
      description: `${formattedDate} • ${formattedTime}`,
      amount: tx.amount,
      currencySymbol,
      currencyCode,
    };
  };

  /*
  |--------------------------------------------------------------------------
  | Skeleton Loader Component
  |--------------------------------------------------------------------------
  */
  const SkeletonRows = () => (
    <>
      {Array.from({ length: limit || 5 }).map((_, i) => (
        <div key={i} className="trans-item skeleton-wrapper">
          <div className="icon-box skeleton-pulse"></div>
          <div className="details skeleton-details">
            <div className="skeleton-pulse skeleton-title"></div>
            <div className="skeleton-pulse skeleton-subtitle"></div>
          </div>
          <div className="amount skeleton-pulse skeleton-amount"></div>
        </div>
      ))}
    </>
  );

  return (
    <div
      className={`transaction-card ${customClass} ${
        hideHeader ? "hide-container-styles" : ""
      }`}
    >
      {!hideHeader && (
        <div className="trans-header">
          <h3>Transaction History</h3>
        </div>
      )}

      <div className="trans-list">
        {isLoading ? (
          <SkeletonRows />
        ) : transactions.length > 0 ? (
          transactions.map((rawTx) => {
            const t = formatTransaction(rawTx);
            return (
              <div key={t.id} className="trans-item">
                <div className={`icon-box ${t.type}`}>
                  {t.type === "in" ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                </div>

                <div className="details">
                  <p className="title">{t.title}</p>
                  <p className="subtitle">{t.description}</p>
                </div>

                {/* 🟢 FIXED: Dynamically renders the normalized currency configuration */}
                <div className={`amount ${t.type}`}>
                  {t.type === "in" ? "+" : "-"} {t.currencySymbol}
                  {Number(t.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  {t.currencyCode === "USDT" && (
                    <span
                      className="currency-label"
                      style={{ fontWeight: "bold" }}
                    >
                      {" "}
                      USDT
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state-container">
            <p className="no-transaction">
              No transactions yet. Fund your wallet to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
