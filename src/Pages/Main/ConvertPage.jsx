import React, { useState, useEffect } from "react";
import "../../Css/Convert.css";
import { FiHelpCircle } from "react-icons/fi";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  convertCurrency,
  GetHistory,
  GetLiveRate,
} from "../../Services/Conversionservice";

const ConvertPage = () => {
  const [activeCurrency, setActiveCurrency] = useState("NGN");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Correctly named and safely initialized history state
  const [coversionHistory, setConversionHistory] = useState([]);
  const token = useSelector((state) => state.user.token);

  const [liveRate, setLiveRate] = useState(null);
  const [conversionData, setConversionData] = useState(null);

  const fetchLiveRate = async () => {
    try {
      const response = await GetLiveRate();
      console.log("Res", response);
      setLiveRate(response.rate);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCoversionHistory = async () => {
    if (!token) return;
    try {
      const res = await GetHistory(token);
      console.log("History API Response:", res);

      // Extract the raw payload data (checking standard locations like res.data or res directly)
      const dataPayload = res?.data || res;

      // ✅ Dynamically accommodate both a single object or an array of objects smoothly
      if (Array.isArray(dataPayload)) {
        setConversionHistory(dataPayload);
      } else if (dataPayload && typeof dataPayload === "object") {
        setConversionHistory([dataPayload]); // Convert single item into a manageable single-element array
      } else {
        setConversionHistory([]); // Fallback safety catch
      }
    } catch (err) {
      console.log("History fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLiveRate();
    fetchCoversionHistory();
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
      console.log("CONVERSION RESPONSE:", response);

      setConversionData(response?.rate);
      toast.success("Conversion successful!");
      setIsModalOpen(false);
      setInputValue("");

      // ✅ Refresh log listing automatically so your new transaction shows up right away
      fetchCoversionHistory();
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="convert-layout-container">
      <main className="convert-main-content">
        {/* HEADER */}
        <header className="convert-page-header">
          <div className="header-title-group">
            <h1>Hedge Your Naira</h1>
            <p>
              Convert NGN to USDT at live market rates.
              <FiHelpCircle className="tooltip-icon" />
            </p>
          </div>
        </header>

        {/* LIVE RATE */}
        <section className="rate-banner-container">
          <div className="rate-info">
            <span className="rate-label">CURRENT RATE</span>
            <h2 className="summary-value">
              {activeCurrency === "NGN" ? "₦" : "$"}
              {liveRate ? liveRate.toLocaleString() : "---"} / 1 USDT
            </h2>
          </div>
          <div className="rate-timestamp">
            <span>Updated Just Now</span>
          </div>
        </section>

        {/* FORM */}
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
                <span className="balance-label">Bal: ₦0</span>
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
                <span className="balance-label">Bal: 0 USDT</span>
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

          {/* OUTPUT */}
          <div className="full-width-output-banner">
            <span className="output-value">{getCalculatedPreview()}</span>
            <span className="output-currency-mid">
              {activeCurrency === "NGN" ? "USDT" : "NGN"}
            </span>
          </div>

          <button type="submit" className="submit-conversion-btn">
            {activeCurrency === "NGN"
              ? "Review NGN to USDT Conversion"
              : "Review USDT to NGN Conversion"}
          </button>
        </form>

        {/* HISTORY SECTION */}
        <section className="history-log-panel">
          <header className="history-panel-header">
            <h3>Conversion history</h3>
          </header>

          {coversionHistory.length === 0 ? (
            <div className="history-empty-state">
              <p>No conversions yet</p>
            </div>
          ) : (
            <div className="history-list-wrapper" style={{ padding: "1rem" }}>
              {coversionHistory.map((item, index) => (
                <div
                  key={item._id || item.id || index}
                  className="history-item-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div>
                    <strong style={{ textTransform: "uppercase" }}>
                      {item.from || "NGN"} ➔ {item.to || "USDT"}
                    </strong>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>
                      Rate: {item.rate || "---"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>
                      {item.amount} {item.from}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#2ecc71" }}>
                      +{item.value || item.receivedAmount || "---"} {item.to}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* MODAL */}
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
                  {liveRate ? liveRate.toLocaleString() : "---"} / 1 USDT
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
                {loading ? "Processing..." : "Confirm & Convert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConvertPage;
