import React, { useState, useEffect } from "react";

import { CiCircleQuestion } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { LuPiggyBank } from "react-icons/lu";
import SavingsModal from "../Components/SavingsModal";
import Vaults from "../Components/Vaults"; // 1. IMPORT THE SEPARATED COMPONENT
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

  // 2. DASHBOARD SWITCH FLAG (Starts false to show the empty placeholder card)
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
      // Logic managed inside layout subcomponents
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

    // 3. FLIP STATE TO TRUE WHEN PLAN GENERATION CONCLUDES
    setHasVaults(true);
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
        /* Render your standalone component parameters cleanly here */
        <Vaults
          onTopUp={(vault) =>
            console.log("Top up target metadata snapshot:", vault)
          }
          onWithdraw={(vault) =>
            console.log("Withdraw target metadata snapshot:", vault)
          }
        />
      )}

      {/* 3. MODAL OVERLAY */}
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
