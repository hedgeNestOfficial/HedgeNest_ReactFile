import React, { useState, useEffect } from "react";
import "../../Css/Convert.css";
import { FiHelpCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  convertCurrency,
  GetHistory,
  GetLiveRate,
  confirmTransactionPin,
} from "../../Services/Conversionservice";
import { getMyWallet } from "../../Services/Walletservice";
import { updateWallet } from "../../Store/UserSlice";

/**
 * ============================================================================
 * CONVERT PAGE - CURRENCY CONVERSION (NGN ↔ USDT)
 * ============================================================================
 *
 * Features:
 * ✅ Live exchange rate display
 * ✅ Currency conversion with preview
 * ✅ PIN verification before conversion
 * ✅ Conversion history tracking
 * ✅ Wallet balance updates
 * ✅ Error handling and validation
 * ✅ Help/info dropdown
 *
 * Flows:
 * 1. User selects currency (NGN or USDT)
 * 2. User enters amount with live rate preview
 * 3. User submits → Modal opens
 * 4. User enters PIN for verification
 * 5. PIN verified → Conversion executed
 * 6. Success → Wallet updated, history refreshed
 */

const ConvertPage = () => {
  // ============================================================================
  // STATE & REDUX
  // ============================================================================

  const dispatch = useDispatch();

  // Conversion state
  const [activeCurrency, setActiveCurrency] = useState("NGN");
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  // Modal & PIN state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionPin, setTransactionPin] = useState("");
  const [loading, setLoading] = useState(false);

  // Data state
  const [liveRateData, setLiveRateData] = useState(null);
  const [coversionHistory, setConversionHistory] = useState([]);
  const [conversionData, setConversionData] = useState(null);

  // Loading states
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);
  const [isLoadingRate, setIsLoadingRate] = useState(true);

  // Help dropdown state
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Redux state
  const { token, wallet, user } = useSelector((state) => state.user);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Format number as currency with 2 decimal places
   */
  const formatCurrency = (value = 0) =>
    Number(value).toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  /**
   * Get current exchange rate based on active currency
   */
  const getCurrentDisplayRate = () => {
    if (!liveRateData) return 0;
    return activeCurrency === "NGN"
      ? liveRateData.rate
      : liveRateData.usdtRate || 1;
  };

  /**
   * Calculate conversion preview based on input amount and live rate
   */
  const getCalculatedPreview = () => {
    if (!inputValue || Number(inputValue) <= 0 || !liveRateData) return "0";

    const numericAmount = Number(inputValue);

    if (activeCurrency === "NGN") {
      // Converting NGN to USDT: divide by rate
      const rate = liveRateData.rate || 1;
      return (numericAmount / rate).toFixed(2);
    } else {
      // Converting USDT to NGN: multiply by rate
      const usdtRate = liveRateData.rate || 1;
      return (numericAmount * usdtRate).toFixed(2);
    }
  };

  /**
   * Format date for display
   */
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

  // ============================================================================
  // WALLET & DATA FETCHING
  // ============================================================================

  /**
   * Fetch live exchange rates
   */
  const fetchLiveRate = async () => {
    try {
      setIsLoadingRate(true);
      console.log("📊 Fetching live exchange rates...");
      const response = await GetLiveRate();
      console.log("✅ Live rates fetched");
      setLiveRateData(response);
    } catch (err) {
      console.error("❌ Live rate fetch error:", err);
      toast.error("Failed to fetch live exchange rates");
    } finally {
      setIsLoadingRate(false);
    }
  };

  /**
   * Fetch user's conversion history
   */
  const fetchConversionHistory = async () => {
    if (!token) {
      console.warn("⚠️ No token for history fetch");
      return;
    }

    try {
      console.log("📜 Fetching conversion history...");
      const res = await GetHistory(token);
      const dataPayload = res?.data || res;

      if (Array.isArray(dataPayload)) {
        setConversionHistory(dataPayload);
      } else if (dataPayload && typeof dataPayload === "object") {
        setConversionHistory([dataPayload]);
      } else {
        setConversionHistory([]);
      }
      console.log("✅ Conversion history loaded");
    } catch (err) {
      console.error("❌ History fetch error:", err);
      setConversionHistory([]);
    }
  };

  /**
   * Sync wallet data from backend
   */
  const syncWalletData = async () => {
    if (!token) {
      console.warn("⚠️ No token for wallet sync");
      return;
    }

    try {
      setIsLoadingWallet(true);
      console.log("💰 Syncing wallet data...");
      const walletResponse = await getMyWallet(token);

      let walletData = null;

      // Handle different response structures
      if (Array.isArray(walletResponse?.data)) {
        walletData = walletResponse.data[0];
      } else if (
        walletResponse?.data &&
        typeof walletResponse.data === "object"
      ) {
        walletData = walletResponse.data;
      } else if (walletResponse && typeof walletResponse === "object") {
        walletData = walletResponse;
      }

      if (walletData) {
        dispatch(updateWallet(walletData));
        console.log("✅ Wallet synced");
      }
    } catch (error) {
      console.error("❌ Wallet sync error:", error);
      toast.error("Failed to sync wallet balance");
    } finally {
      setIsLoadingWallet(false);
    }
  };

  /**
   * Initialize page - fetch all data
   */
  useEffect(() => {
    console.log("🚀 Initializing Convert page...");
    fetchLiveRate();

    if (token) {
      syncWalletData();
      fetchConversionHistory();
    }
  }, [token]);

  /**
   * Handle outside click to close help dropdown
   */
  useEffect(() => {
    if (!isHelpOpen) return;

    const handleOutsideClick = (event) => {
      if (!event.target.closest(".help-dropdown-wrapper")) {
        setIsHelpOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isHelpOpen]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  /**
   * Toggle help dropdown
   */
  const toggleHelpDropdown = (e) => {
    e.stopPropagation();
    setIsHelpOpen((prev) => !prev);
  };

  /**
   * Validate input amount based on currency and minimum
   */
  const validateInputAmount = (value, currency) => {
    if (!value) {
      setInputError("");
      return false;
    }

    const numericAmount = Number(value);

    if (numericAmount <= 0) {
      setInputError("Enter a valid positive amount");
      return false;
    }

    if (currency === "NGN" && numericAmount < 1500) {
      setInputError("Minimum conversion amount is ₦1,500.00");
      return false;
    }

    if (currency === "USDT" && numericAmount < 1.4) {
      setInputError("Minimum conversion amount is 1.40 USDT");
      return false;
    }

    setInputError("");
    return true;
  };

  /**
   * Handle amount input change
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    validateInputAmount(value, activeCurrency);
  };

  /**
   * Handle form submission - open confirmation modal
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const isValid = validateInputAmount(inputValue, activeCurrency);
    if (!isValid) {
      toast.error("Please correct the amount before proceeding");
      return;
    }

    // Reset modal state
    setConversionData(null);
    setTransactionPin("");
    setIsModalOpen(true);
  };

  /**
   * Handle final conversion confirmation with PIN
   */
  const handleFinalConfirm = async () => {
    if (!transactionPin || transactionPin.length !== 6) {
      toast.error("Please enter your complete 6-digit Transaction PIN");
      return;
    }

    try {
      setLoading(true);
      console.log("💱 Starting conversion with PIN verification...");

      // Get user ID
      const targetUserId = user?.id || user?._id;
      if (!targetUserId) {
        throw new Error("User ID not available");
      }

      // Step 1: Verify PIN
      console.log("Step 1: Verifying PIN...");
      try {
        await confirmTransactionPin(targetUserId, transactionPin, token);
        console.log("✅ PIN verified");
      } catch (pinError) {
        console.error("❌ PIN verification failed:", pinError);
        toast.error(
          pinError?.message || "Incorrect Transaction PIN. Please try again.",
        );
        setLoading(false);
        return;
      }

      // Step 2: Execute conversion
      console.log("Step 2: Executing conversion...");
      const payload = {
        from: activeCurrency,
        to: activeCurrency === "NGN" ? "USDT" : "NGN",
        amount: Number(inputValue),
      };

      const response = await convertCurrency(payload, token);
      setConversionData(response?.rate);
      console.log("✅ Conversion executed");

      // Success
      toast.success("Conversion successful!");
      setIsModalOpen(false);
      setInputValue("");
      setTransactionPin("");

      // Step 3: Refresh data
      console.log("Step 3: Refreshing data...");
      await Promise.all([
        syncWalletData(),
        fetchConversionHistory(),
        fetchLiveRate(),
      ]);
      console.log("✅ Conversion complete");
    } catch (error) {
      console.error("❌ Conversion error:", error);
      const errorMessage =
        error?.message ||
        error?.error ||
        "Conversion failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  const availableBalance = wallet?.availableBalance ?? 0;
  const usdtBalance = Number(wallet?.balanceInUSDT ?? 0).toFixed(2);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="convert-layout-container">
      <main className="convert-main-content">
        {/* HEADER */}
        <header className="convert-page-header">
          <div className="header-title-group">
            <h1>Hedge Your Naira</h1>
            <p>
              Convert NGN to USDT at live market rates.
              <span className="help-dropdown-wrapper">
                <button
                  type="button"
                  className={`help-btn ${isHelpOpen ? "active" : ""}`}
                  onClick={toggleHelpDropdown}
                  aria-label="Toggle currency information dropdown panel"
                >
                  <FiHelpCircle className="tooltip-icon" />
                </button>

                {isHelpOpen && (
                  <div className="dropdown-panel">
                    <div className="arrow-top"></div>
                    <div className="panel-content">
                      <p className="info-text">
                        <strong>USDT</strong> is a digital currency tied to the
                        US Dollar. It helps protect your money from Naira
                        depreciation and keeps its value more stable over time.
                      </p>
                      <p className="info-text">
                        Your money is converted to USDT at current live rates
                        and vice versa, giving you an edge over local currency
                        devaluation.
                      </p>
                      <p className="info-text">
                        With HedgeNest, your money is 100% safe and secure in
                        USDT. Kindly note that a 1.5% conversion fee is
                        calculated per transaction.
                      </p>
                    </div>
                  </div>
                )}
              </span>
            </p>
          </div>
        </header>

        {/* LIVE RATE BANNER */}
        <section className="rate-banner-container">
          <div className="rate-info">
            <span className="rate-label">
              CURRENT {activeCurrency === "NGN" ? "NAIRA" : "USDT"} MARKET
              TRACKER RATE
            </span>
            {isLoadingRate ? (
              <div className="convert-skel sk-dark sk-rate-headline"></div>
            ) : (
              <h2 className="summary-value">
                ₦{getCurrentDisplayRate().toLocaleString()} / 1 USDT
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

        {/* CONVERSION FORM */}
        <form className="conversion-card-panel" onSubmit={handleFormSubmit}>
          <div className="conversion-split-grid">
            {/* INPUT AMOUNT */}
            <div
              className="grid-left-input-pane"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <input
                type="number"
                placeholder={activeCurrency === "NGN" ? "1500" : "1.00"}
                value={inputValue}
                onChange={handleInputChange}
                className="currency-field-input"
                style={{ border: inputError ? "1px solid #ef4444" : "" }}
              />
              {inputError && (
                <span
                  style={{
                    color: "#ef4444",
                    fontSize: "0.82rem",
                    marginTop: "6px",
                    fontWeight: "500",
                    display: "block",
                  }}
                >
                  {inputError}
                </span>
              )}
            </div>

            {/* CURRENCY SELECTORS */}
            <div className="grid-right-selectors-pane">
              {/* NGN Button */}
              <div className="token-pill-group">
                {isLoadingWallet ? (
                  <div className="convert-skel sk-dark sk-pill-balance"></div>
                ) : (
                  <span className="balance-label">
                    Available: ₦{formatCurrency(availableBalance)}
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
                    setInputValue("");
                    setInputError("");
                  }}
                >
                  NGN
                </button>
              </div>

              {/* USDT Button */}
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
                    setInputValue("");
                    setInputError("");
                  }}
                >
                  USDT
                </button>
              </div>
            </div>
          </div>

          {/* PREVIEW OUTPUT */}
          <div className="full-width-output-banner">
            <span className="output-value">{getCalculatedPreview()}</span>
            <span className="output-currency-mid">
              {activeCurrency === "NGN" ? "USDT" : "NGN"}
            </span>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="submit-conversion-btn"
            disabled={!!inputError || !inputValue}
          >
            {activeCurrency === "NGN"
              ? "Convert NGN to USDT"
              : "Convert USDT to NGN"}
          </button>
        </form>

        {/* CONVERSION HISTORY */}
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
                    const receivedAmount = Number(item.amountNow || 0);

                    return (
                      <tr key={item._id || item.id || index}>
                        <td>
                          <span className="table-txt-timestamp">
                            {formatDate(item.createdAt || item.updatedAt)}
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
                            {receivedAmount.toLocaleString(undefined, {
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

      {/* CONFIRMATION MODAL */}
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
                <span className="summary-value">
                  {activeCurrency === "NGN"
                    ? "50.00 NGN (Gas Fee)"
                    : "0.00 (No Fee)"}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Execution Settlement Rate</span>
                <span className="summary-value">
                  ₦{getCurrentDisplayRate().toLocaleString()} / 1 USDT
                </span>
              </div>

              {/* PIN VERIFICATION */}
              <div
                className="summary-row pin-verification-wrapper"
                style={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  marginTop: "18px",
                  paddingTop: "14px",
                  borderTop: "1px dashed #060a11",
                  gap: "8px",
                }}
              >
                <span
                  className="summary-label"
                  style={{
                    fontWeight: "600",
                    color: "#1f2937",
                    textAlign: "left",
                  }}
                >
                  Enter 6-Digit Transaction PIN
                </span>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="••••••"
                  value={transactionPin}
                  disabled={loading}
                  onChange={(e) =>
                    setTransactionPin(e.target.value.replace(/\D/g, ""))
                  }
                  style={{
                    height: "46px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    textAlign: "center",
                    fontSize: "1.25rem",
                    letterSpacing: "8px",
                    boxSizing: "border-box",
                    background: "#f9fafb",
                  }}
                />
              </div>
            </div>

            {/* MODAL ACTIONS */}
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
                disabled={loading || transactionPin.length !== 6}
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
