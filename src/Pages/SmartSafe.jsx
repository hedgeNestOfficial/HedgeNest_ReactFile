import React, { useState, useEffect } from "react";

import { CiCircleQuestion } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { LuPiggyBank } from "react-icons/lu";
import SavingsModal from "../Components/SavingsModal";
import Vaults from "../Components/Vaults";
import TopUpModal from "../Components/TopUpModal";
import "../Css/SmartSafe.css";

const SmartSafe = () => {
  const [modalScreen, setModalScreen] = useState("NONE");
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFlexibleMode, setIsFlexibleMode] = useState(false);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    duration: "",
    savingFrequency: "Daily",
  });

  // STATE FOR MANAGING THE TOP-UP ACTIVE OBJECT AND MODAL VISIBILITY
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [activeTopUpVault, setActiveTopUpVault] = useState(null);

  // SIMPLE NEW STATES FOR MANAGING WITHDRAWAL WARNING WORKFLOW OUTSIDE
  const [isWithdrawWarningOpen, setIsWithdrawWarningOpen] = useState(false);
  const [activeWithdrawVault, setActiveWithdrawVault] = useState(null);

  // COMMUNICATOR BRIDGE STATE FOR THE SEPARATED CHILD ARRAY DATA LOOP
  const [lastTopUpTransaction, setLastTopUpTransaction] = useState(null);

  // DASHBOARD SWITCH FLAG (Starts false to show the empty placeholder card)
  const [hasVaults, setHasVaults] = useState(false);

  useEffect(() => {
    if (modalScreen === "LOADING") {
      const timer = setTimeout(() => setModalScreen("PIN"), 1500);
      return () => clearTimeout(timer);
    }
  }, [modalScreen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePinChange = (value, index) => {
    if (isNaN(value)) return;
    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);
  };

  const handlePinKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
    }
  };

  const handleCloseSuccess = () => {
    setPin(["", "", "", "", "", ""]);
    setFormData({
      title: "",
      targetAmount: "",
      duration: "",
      savingFrequency: "Daily",
    });
    setModalScreen("NONE");

    // FLIP STATE TO TRUE WHEN PLAN GENERATION CONCLUDES
    setHasVaults(true);
  };

  // ACTION DISPATCH CALLBACK HOOK AFTER SWEETALERT2 DISMISSAL
  const handleTopUpSuccess = (vaultId, addedAmount) => {
    console.log(
      `Dispatched ₦${addedAmount} tracking deposit inside Vault ID: ${vaultId}`,
    );

    // UPDATED: Dispatches the updated data down to the Vaults wrapper prop
    setLastTopUpTransaction({
      id: vaultId,
      amount: addedAmount,
      timestamp: Date.now(), // Timestamps ensure a clean re-render flow trigger
    });
  };

  // NEW INTERCEPT LOGIC FOR SECURING LOCKED WITHDRAWALS BEFORE PASSING FORWARD
  const handleWithdrawClick = (vault) => {
    if (vault.type.toUpperCase() === "LOCKED") {
      setActiveWithdrawVault(vault);
      setIsWithdrawWarningOpen(true);
    } else {
      console.log("Flexible Withdraw target metadata snapshot:", vault);
    }
  };

  const handleConfirmWithdrawal = () => {
    setIsWithdrawWarningOpen(false);
    console.log(
      "Confirmed Withdraw action from Locked target:",
      activeWithdrawVault,
    );
    // Proceed to next action step / reset tracking references here
    setActiveWithdrawVault(null);
  };

  const handleCloseWithdrawWarning = () => {
    setIsWithdrawWarningOpen(false);
    setActiveWithdrawVault(null);
  };

  return (
    <main className="smart-container">
      {/* 1. DASHBOARD HEADER */}
      <header className="dash-header">
        <div className="header-titles">
          <h1 className="main-title">Smart Safe</h1>
          <p className="sub-title">Save with intent. Earn up to 17% p.a.</p>
        </div>

        <div className="header-actions">
          <div className="dropdown-wrapper">
            <button
              className={`help-btn ${isHelpOpen ? "active" : ""}`}
              onClick={() => setIsHelpOpen(!isHelpOpen)}
              aria-label="Help and Info"
            >
              <CiCircleQuestion className="icon-help" />
            </button>

            {isHelpOpen && (
              <div className="dropdown-panel">
                <div className="arrow-top"></div>
                <div className="panel-content">
                  <p className="info-text">
                    Interest on Smart Safe is calculated per annum and paid on
                    the matured date of the savings plan.
                  </p>
                  <p className="info-text">
                    In compliance with Nigerian tax regulations, a Withholding
                    Tax of 10% applies to the interest earned on your savings.
                  </p>
                  <p className="info-text">
                    Breaking Fees of 1.5% will be attracted for early Withdrawal
                    for locked Saving Plans while with Flexible plans, users can
                    break savings without additional charges.
                  </p>

                  <div className="rate-banner">Interest Rate Details</div>

                  {/* FLEXBOX ALTERNATIVE TO TABLE */}
                  <div className="rate-list">
                    <div className="rate-row rate-header">
                      <span className="cell text-left">Duration</span>
                      <span className="cell text-right">Rate</span>
                    </div>
                    <div className="rate-row bg-highlight">
                      <span className="cell text-left">7 - 90 days</span>
                      <span className="cell text-right">14% p.a.</span>
                    </div>
                    <div className="rate-row">
                      <span className="cell text-left">91 - 180 days</span>
                      <span className="cell text-right">15% p.a.</span>
                    </div>
                    <div className="rate-row bg-highlight">
                      <span className="cell text-left">181 - 364 days</span>
                      <span className="cell text-right">16% p.a.</span>
                    </div>
                    <div className="rate-row">
                      <span className="cell text-left">365 - 1000 days</span>
                      <span className="cell text-right">17% p.a.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            className="create-btn"
            onClick={() => setModalScreen("CREATE")}
          >
            <FaPlus className="icon-plus" /> New Vault
          </button>
        </div>
      </header>

      {/* 4. CONDITIONAL RENDER WORKSPACE TOGGLE */}
      {!hasVaults ? (
        <section className="empty-card">
          <div className="empty-content">
            <div className="icon-box">
              <LuPiggyBank className="icon-piggy" />
            </div>
            <h2 className="card-title">Build Your First Nest</h2>
            <p className="card-desc">
              Pick a goal, set how often you'll save, and let HedgeNest do the
              rest.
            </p>
          </div>
        </section>
      ) : (
        /* WIRED UP TRIGGER HANDLERS STRAIGHT BACK TO OUR SMART SAFE CONTAINER */
        <Vaults
          topUpEvent={lastTopUpTransaction}
          onTopUp={(vault) => {
            setActiveTopUpVault(vault);
            setIsTopUpOpen(true);
          }}
          onWithdraw={handleWithdrawClick}
        />
      )}

      {/* 5. NEW VAULT TOP UP TRANSACTION CONTEXT OVERLAY LAYER */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => {
          setIsTopUpOpen(false);
          setActiveTopUpVault(null);
        }}
        vault={activeTopUpVault}
        onTopUpSuccess={handleTopUpSuccess}
      />

      {/* NEW WITHDRAWAL EARLY BREAK WARNING MODAL OVERLAY (Matches image_dc18bf.png) */}
      {isWithdrawWarningOpen && (
        <div className="topup-overlay">
          <div className="topup-box">
            <div className="topup-content align-center">
              <h2 className="swal-vault-title">
                Are you sure you want to withdraw?
              </h2>
              <p className="topup-subtext">
                Early Withdrawal will attract a 1.5% breaking fee and all
                accrued interest will be lost.
              </p>

              <div className="topup-actions">
                <button
                  type="button"
                  className="topup-btn-cancel"
                  onClick={handleConfirmWithdrawal}
                >
                  Continue
                </button>
                <button
                  type="button"
                  className="topup-btn-submit"
                  onClick={handleCloseWithdrawWarning}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORIGINAL SAVINGS CREATION MODAL OVERLAY */}
      <SavingsModal
        modalScreen={modalScreen}
        setModalScreen={setModalScreen}
        isFlexibleMode={isFlexibleMode}
        setIsFlexibleMode={setIsFlexibleMode}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormSubmit={(e) => {
          e.preventDefault();
          setModalScreen("SUMMARY");
        }}
        handleConfirmClick={() => setModalScreen("LOADING")}
        pin={pin}
        handlePinChange={handlePinChange}
        handlePinKeyDown={handlePinKeyDown}
        handlePinSubmit={() => setModalScreen("SUCCESS")}
        handleCloseSuccess={handleCloseSuccess}
      />
    </main>
  );
};

export default SmartSafe;
