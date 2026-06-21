import React, { useState, useEffect } from "react";
import "../../Css/Convert.css";
import { FiHelpCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  convertCurrency,
  GetHistory,
  GetLiveRate,
} from "../../Services/Conversionservice";
import { getMyWallet } from "../../Services/Walletservice";
import { updateWallet } from "../../Store/UserSlice";

const ConvertPage = () => {
  const dispatch = useDispatch();
  const [activeCurrency, setActiveCurrency] = useState("NGN");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [coversionHistory, setConversionHistory] = useState([]);
  const [liveRate, setLiveRate] = useState(null);
  const [conversionData, setConversionData] = useState(null);

  const { token, wallet } = useSelector((state) => state.user);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isLoadingRate, setIsLoadingRate] = useState(true);

  const formatCurrency = (value = 0) =>
    Number(value).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const nairaBalance = wallet?.balanceInNaira ?? 0;
  const usdtBalance = Number(wallet?.balanceInUSDT ?? 0).toFixed(2);

  const fetchLiveRate = async () => {
    try {
      setIsLoadingRate(true);
      const response = await GetLiveRate();
      setLiveRate(response?.rate || response);
    } catch (err) {
    } finally {
      setIsLoadingRate(false);
    }
  };

  const fetchCoversionHistory = async () => {
    if (!token) return;
    try {
      const res = await GetHistory(token);
      const dataPayload = res?.data || res;

      if (Array.isArray(dataPayload)) {
        setConversionHistory(dataPayload);
      } else if (dataPayload && typeof dataPayload === "object") {
        setConversionHistory([dataPayload]);
      } else {
        setConversionHistory([]);
      }
    } catch (err) {}
  };

  const syncWalletData = async () => {
    if (!token) return;
    try {
      setIsLoadingWallet(true);
      const walletResponse = await getMyWallet(token);
      const walletData = walletResponse?.data?.[0];
      if (walletData) {
        dispatch(updateWallet(walletData));
      }
    } catch (error) {
    } finally {
      setIsLoadingWallet(false);
    }
  };

  useEffect(() => {
    fetchLiveRate();
    if (token) {
      syncWalletData();
      fetchCoversionHistory();
    }
  }, [token]);

  const getCalculatedPreview = () => {
    if (!inputValue || Number(inputValue) <= 0 || !liveRate) return "0";

    const numericAmount = Number(inputValue);
    if (activeCurrency === "NGN") {
      return (numericAmount / liveRate).toFixed(2);
    } else {
      return (numericAmount * liveRate).toFixed(2);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!inputValue || Number(inputValue) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const currentLimit = activeCurrency === "NGN" ? nairaBalance : usdtBalance;
    if (Number(inputValue) > Number(currentLimit)) {
      toast.error(
        `Insufficient ${activeCurrency} balance to complete this operation.`,
      );
      return;
    }

    setConversionData(null);
    setIsModalOpen(true);
  };

  const handleFinalConfirm = async () => {
    try {
      setLoading(true);

      const payload = {
        from: activeCurrency,
        to: activeCurrency === "NGN" ? "USDT" : "NGN",
        amount: Number(inputValue),
      };

      const response = await convertCurrency(payload, token);
      setConversionData(response?.rate);

      toast.success("Conversion successful!");
      setIsModalOpen(false);
      setInputValue("");

      await Promise.all([syncWalletData(), fetchCoversionHistory()]);
    } catch (error) {
      toast.error(error?.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="convert-layout-container">
      <main className="convert-main-content">
        <header className="convert-page-header">
          <div className="header-title-group">
            <h1>Hedge Your Naira</h1>
            <p>
              Convert NGN to USDT at live market rates.
              <FiHelpCircle className="tooltip-icon" />
            </p>
          </div>
        </header>

        <section className="rate-banner-container">
          <div className="rate-info">
            <span className="rate-label">CURRENT RATE</span>
            {isLoadingRate ? (
              <div className="convert-skel sk-dark sk-rate-headline"></div>
            ) : (
              <h2 className="summary-value">
                {"₦"}
                {liveRate ? liveRate.toLocaleString() : "0"} / 1 USDT
              </h2>
            )}
          </div>
          <div className="rate-timestamp">
            <span>
              {isLoadingRate
                ? "Syncing exchange tracking..."
                : "updated just now"}
            </span>
          </div>
        </section>

        <form className="conversion-card-panel" onSubmit={handleFormSubmit}>
          <div className="conversion-split-grid">
            <div className="grid-left-input-pane">
              <input
                type="number"
                placeholder={activeCurrency === "NGN" ? "1500" : "1.00"}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="currency-field-input"
              />
            </div>

            <div className="grid-right-selectors-pane">
              <div className="token-pill-group">
                {isLoadingWallet ? (
                  <div className="convert-skel sk-dark sk-pill-balance"></div>
                ) : (
                  <span className="balance-label">
                    Bal: ₦{formatCurrency(nairaBalance)}
                  </span>
                )}
                <button
                  type="button"
                  className={`currency-pill-btn ${
                    activeCurrency === "NGN"
                      ? "blue-active"
                      : "transparent-inactive"
                  }`}
                  onClick={() => {
                    setActiveCurrency("NGN");
                    setConversionData(null);
                  }}
                >
                  NGN
                </button>
              </div>

              <div className="token-pill-group">
                {isLoadingWallet ? (
                  <div className="convert-skel sk-dark sk-pill-balance"></div>
                ) : (
                  <span className="balance-label">Bal: {usdtBalance} USDT</span>
                )}
                <button
                  type="button"
                  className={`currency-pill-btn ${
                    activeCurrency === "USDT"
                      ? "blue-active"
                      : "transparent-inactive"
                  }`}
                  onClick={() => {
                    setActiveCurrency("USDT");
                    setConversionData(null);
                  }}
                >
                  USDT
                </button>
              </div>
            </div>
          </div>

          <div className="full-width-output-banner">
            <span className="output-value">{getCalculatedPreview()}</span>
            <span className="output-currency-mid">
              {activeCurrency === "NGN" ? "USDT" : "NGN"}
            </span>
          </div>

          <button type="submit" className="submit-conversion-btn">
            {activeCurrency === "NGN"
              ? "Convert NGN to USDT "
              : "Convert USDT to NGN "}
          </button>
        </form>

        <section className="history-log-panel">
          <header className="history-panel-header">
            <h3>Conversion History</h3>
          </header>

          {coversionHistory.length === 0 ? (
            <div className="history-empty-state">
              <p>No conversions yet</p>
            </div>
          ) : (
            <div className="history-table-responsive">
              <table className="history-data-table">
                <thead>
                  <tr>
                    <th>Date &amp; Time</th>
                    <th>Type</th>
                    <th>Rate</th>
                    <th>Sent</th>
                    <th>Received</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {coversionHistory.map((item, index) => {
                    const fromCur = item.from || "NGN";
                    const toCur = item.to || "USDT";
                    const itemStatus = item.status || "Success";

                    const exchangeRate = Number(item.rate || 0);
                    const baseAmount = Number(item.amount || 0);
                    const feeCost = Number(item.fee || 0);

                    let calculatedReceived = 0;
                    if (fromCur === "NGN" && exchangeRate > 0) {
                      calculatedReceived =
                        (baseAmount - feeCost) / exchangeRate;
                    } else if (fromCur === "USDT") {
                      calculatedReceived = baseAmount * exchangeRate - feeCost;
                    }

                    return (
                      <tr key={item._id || item.id || index}>
                        <td>
                          <span className="table-txt-timestamp">
                            {formatDate(
                              item.createdAt || item.updatedAt || item.date,
                            )}
                          </span>
                        </td>
                        <td>
                          <span className="table-txt-route">
                            {fromCur} &rarr; {toCur}
                          </span>
                        </td>
                        <td>
                          <span className="table-txt-rate">
                            {exchangeRate.toLocaleString("en-NG", {
                              style: "currency",
                              currency: "NGN",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </td>
                        <td>
                          <span className="table-txt-sent">
                            {baseAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {fromCur}
                          </span>
                        </td>
                        <td>
                          <span className="table-txt-received">
                            +
                            {calculatedReceived.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {toCur}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-pill ${itemStatus.toLowerCase()}`}
                          >
                            {itemStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {isModalOpen && (
        <div
          className="modal-backdrop-overlay"
          onClick={() => !loading && setIsModalOpen(false)}
        >
          <div
            className="modal-summary-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Conversion Summary</h2>

            <div className="summary-details-list">
              <div className="summary-row">
                <span className="summary-label">Amount To Convert</span>
                <span className="summary-value">
                  {inputValue} {activeCurrency}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Amount To Receive</span>
                <span className="summary-value">
                  {getCalculatedPreview()}{" "}
                  {activeCurrency === "NGN" ? "USDT" : "NGN"}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Conversion Fee</span>
                <span className="summary-value">50.00</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">USDT - Naira Rate</span>
                <span className="summary-value">
                  {activeCurrency === "NGN" ? "₦" : "$"}
                  {liveRate ? liveRate.toLocaleString() : "0"} / 1 USDT
                </span>
              </div>
            </div>

            <div className="modal-actions-wrapper">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-modal-confirm"
                onClick={handleFinalConfirm}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConvertPage;
