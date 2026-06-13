import React, { useState } from "react";
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
  const [conversionData, setConversionData] = useState(null);

  // 🔐 GET TOKEN FROM REDUX
  const token = useSelector((state) => state.user.token);

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
        from: "NGN",
        to: "USDT",
        amount: Number(inputValue),
      };

      // 🔐 PASS TOKEN HERE (IMPORTANT FIX)
      const response = await convertCurrency(payload, token);

      console.log("CONVERSION RESPONSE:", response);

      setConversionData(response);

      setIsModalOpen(true);

      toast.success("Conversion calculated");
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
        <header className="convert-page-header">
          <div className="header-title-group">
            <h1>Hedge Your Naira</h1>
            <p>
              Convert NGN to USDT at live market rates.
              <FiHelpCircle className="tooltip-icon" />
            </p>
          </div>
        </header>

        {/* Live Market Rates */}
        <section className="rate-banner-container">
          <div className="rate-info">
            <span className="rate-label">CURRENT RATE</span>
            <h2 className="summary-value">
              ₦{conversionData?.rate || "1,397"} / 1 USDT
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
                placeholder="1500"
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
                  onClick={() => setActiveCurrency("NGN")}
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
                  onClick={() => setActiveCurrency("USDT")}
                >
                  USDT
                </button>
              </div>
            </div>
          </div>

          <div className="full-width-output-banner">
            <span className="output-value">{inputValue || "0"}</span>
            <span className="output-currency-mid">{activeCurrency}</span>
            <span className="output-currency-end">{activeCurrency}</span>
          </div>

          <button
            type="submit"
            className="submit-conversion-btn"
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert NGN to USDT"}
          </button>
        </form>

        {/* HISTORY */}
        <section className="history-log-panel">
          <header className="history-panel-header">
            <h3>Conversion history</h3>
          </header>

          <div className="history-empty-state">
            <p>No conversions yet</p>
          </div>
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
                <span className="summary-value">{inputValue} NGN</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Amount To Receive</span>
                <span className="summary-value">
                  {conversionData?.convertedAmount || 0} USDT
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Conversion Fee</span>
                <span className="summary-value">
                  {conversionData?.fee || 0}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">USDT - Naira Rate</span>
                <span className="summary-value">
                  ₦{conversionData?.rate || "1,397"} / 1 USDT
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
                onClick={() => {
                  toast.success("Conversion Confirmed!");
                  setIsModalOpen(false);
                }}
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
