import React, { useState, useEffect } from "react";
import "../../Css/Convert.css";
import { FiHelpCircle } from "react-icons/fi";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { convertCurrency } from "../../Services/Conversionservice";

const ConvertPage = () => {
  const [activeCurrency, setActiveCurrency] = useState("NGN");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Default live rate fallback if API hasn't loaded yet
  const [liveRate, setLiveRate] = useState(1397);

  // ✅ STORE ONLY CLEAN DATA
  const [conversionData, setConversionData] = useState(null);

  // ✅ Array to store completed conversion logs
  const [history, setHistory] = useState([]);

  // 🔐 GET TOKEN FROM REDUX
  const token = useSelector((state) => state.user.token);

  // 🔄 FETCH LIVE RATE DIRECTLY FROM THE API ON COMPONENT MOUNT
  useEffect(() => {
    const fetchLiveRateOnMount = async () => {
      if (!token) return;
      try {
        const initialPayload = {
          from: "NGN",
          to: "USDT",
          amount: 1500, // Meets backend validation minimum threshold requirement
        };
        const response = await convertCurrency(initialPayload, token);
        if (response?.rate?.rate) {
          setLiveRate(Number(response.rate.rate));
        }
      } catch (error) {
        console.error("Could not fetch live rate on load:", error);
      }
    };

    fetchLiveRateOnMount();
  }, [token]);

  // Dynamic live rate updating if available from a previous response object
  useEffect(() => {
    if (conversionData?.rate) {
      setLiveRate(Number(conversionData.rate));
    }
  }, [conversionData]);

  // Real-time calculated preview value structure
  const getCalculatedPreview = () => {
    if (!inputValue || Number(inputValue) <= 0) return "0";

    const numericAmount = Number(inputValue);
    if (activeCurrency === "NGN") {
      return (numericAmount / liveRate).toFixed(2);
    } else {
      return numericAmount * liveRate;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue || Number(inputValue) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

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
      setIsModalOpen(true);
      toast.success("Conversion calculated");
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format modal values based on currency type
  const formatModalReceiveAmount = () => {
    if (conversionData?.value) {
      return activeCurrency === "NGN"
        ? Number(conversionData.value).toFixed(2)
        : conversionData.value;
    }
    return getCalculatedPreview();
  };

  // ✅ CONFIRMATION HANDLER: Saves entry into history array logs
  const handleConfirmConversion = () => {
    const finalSent = conversionData?.amount || inputValue;
    const finalReceived = formatModalReceiveAmount();
    const targetCurrency = activeCurrency === "NGN" ? "USDT" : "NGN";

    const newLog = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      fromAmount: finalSent,
      fromCurrency: activeCurrency,
      toAmount: finalReceived,
      toCurrency: targetCurrency,
      rate: conversionData?.rate || liveRate,
    };

    setHistory((prevLogs) => [newLog, ...prevLogs]);
    toast.success("Conversion Confirmed!");
    setIsModalOpen(false);
    setInputValue("");
    setConversionData(null);
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
              {liveRate.toLocaleString()} / 1 USDT
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
                  className={`currency-pill-btn ${activeCurrency === "NGN" ? "blue-active" : "transparent-inactive"}`}
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
                  className={`currency-pill-btn ${activeCurrency === "USDT" ? "blue-active" : "transparent-inactive"}`}
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

          <button
            type="submit"
            className="submit-conversion-btn"
            disabled={loading}
          >
            {loading
              ? "Converting..."
              : activeCurrency === "NGN"
                ? "Convert NGN to USDT"
                : "Convert USDT to NGN"}
          </button>
        </form>

        {/* HISTORY */}
        <section className="history-log-panel">
          <header className="history-panel-header">
            <h3>Conversion history</h3>
          </header>

          {history.length === 0 ? (
            <div className="history-empty-state">
              <p>No conversions yet</p>
            </div>
          ) : (
            <div className="history-list-wrapper">
              {history.map((item) => (
                <div key={item.id} className="history-item-row">
                  <div className="history-item-left">
                    <span className="history-amount-sent">
                      Converted {item.fromAmount} {item.fromCurrency}
                    </span>
                    <span className="history-timestamp-label">{item.date}</span>
                  </div>
                  <div className="history-item-right">
                    <span className="history-amount-received">
                      + {item.toAmount} {item.toCurrency}
                    </span>
                    <span className="history-rate-factor">
                      Rate: ₦{item.rate.toLocaleString()}
                    </span>
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
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="modal-summary-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Conversion Summary</h2>

            <div className="summary-details-list">
              <div className="summary-row">
                <span className="summary-label">Amount To Convert</span>
                <span className="modal-value-text">
                  {conversionData?.amount || inputValue} {activeCurrency}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Amount To Receive</span>
                <span className="modal-value-text">
                  {formatModalReceiveAmount()}{" "}
                  {activeCurrency === "NGN" ? "USDT" : "NGN"}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Conversion Fee</span>
                <span className="modal-value-text">
                  {conversionData?.fee || "0.00"}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">USDT - Naira Rate</span>
                <span className="modal-value-text">
                  {activeCurrency === "NGN" ? "₦" : "$"}
                  {conversionData?.rate || liveRate.toLocaleString()} / 1 USDT
                </span>
              </div>
            </div>

            <div className="modal-actions-wrapper">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-modal-confirm"
                onClick={handleConfirmConversion}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConvertPage;
