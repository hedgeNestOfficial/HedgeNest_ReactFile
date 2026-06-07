import React, { useState } from "react";
import "../Css/Convert.css";
import { FiHelpCircle } from "react-icons/fi";

import Sidebar from "../Components/Sidebar";

const ConvertPage = () => {
  const [activeCurrency, setActiveCurrency] = useState("NGN");
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true); 
  };

  return (
    <div className="convert-layout-container">
      <Sidebar />

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

         {/* Live Market Rates Bar Banner   */}
        <section className="rate-banner-container">
          <div className="rate-info">
            <span className="rate-label">CURRENT RATE</span>
            <h2>₦1,397 / 1 USDT</h2>
          </div>
          <div className="rate-timestamp">
            <span>Updated Just Now</span>
          </div>
        </section>

        {/* Form Container Panel */}
        <form className="conversion-card-panel" onSubmit={handleFormSubmit}>
          <div className="conversion-split-grid">
             {/* Left side: Source Input Box  */}
            <div className="grid-left-input-pane">
              <input
                type="number"
                placeholder="1500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="currency-field-input"
              />
            </div>

            {/* Right side: Stacking Token Buttons */}
            <div className="grid-right-selectors-pane">
              <div className="token-pill-group">
                <span className="balance-label">Bal: ₦0</span>
                <button
                  type="button"
                  className={`currency-pill-btn ${activeCurrency === "NGN" ? "blue-active" : "transparent-inactive"}`}
                  onClick={() => setActiveCurrency("NGN")}
                >
                  NGN
                </button>
              </div>

              <div className="token-pill-group">
                <span className="balance-label">Bal: 0 USDT</span>
                <button
                  type="button"
                  className={`currency-pill-btn ${activeCurrency === "USDT" ? "blue-active" : "transparent-inactive"}`}
                  onClick={() => setActiveCurrency("USDT")}
                >
                  USDT
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Dynamic Output Banner */}
          <div className="full-width-output-banner">
            <span className="output-value">{inputValue || "0"}</span>
            <span className="output-currency-mid">{activeCurrency}</span>
            <span className="output-currency-end">{activeCurrency}</span>
          </div>

          {/* Core Action Button */}
          <button type="submit" className="submit-conversion-btn">
            Convert NGN to USDT
          </button>
        </form>

        {/* Historic Tracking Bottom Card Container */}
        <section className="history-log-panel">
          <header className="history-panel-header">
            <h3>Conversion history</h3>
          </header>
          <div className="history-empty-state">
            <p>No conversions yet</p>
          </div>
        </section>
      </main>

      
         {/* CONVERSION SUMMARY MODAL POPUP LAYER */}
        
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
                <span className="summary-label">Amount To Convert (USDT)</span>
                <span className="summary-value">1.06 USDT</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Amount To Receive (NGN)</span>
                <span className="summary-value">N1,458.6</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Conversion Fee</span>
                <span className="summary-value">0.02 USDT</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">USDT - Naira Rate</span>
                <span className="summary-value">N1,397 / 1 USDT</span>
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
                  alert("Conversion Confirmed!");
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
