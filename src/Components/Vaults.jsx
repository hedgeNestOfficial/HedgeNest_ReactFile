import React, { useState,useEffect } from "react";
import { RiLockLine, RiLockUnlockLine } from "react-icons/ri";
import "../Style/Vaults.css";

const Vaults = ({ onTopUp, onWithdraw }) => {
  // The array data is kept completely inside this file
  const [vaults, setVaults] = useState([
    {
      id: "v-01",
      type: "locked",
      title: "Vacation",
      balance: 500000,
      timelineSubtext: "339 Days left till maturity",
      progress: 15,
      rate: "16%",
      frequency: "Matures 25 Apr, 2027",
      autoSave: false,
    },
    {
      id: "v-02",
      type: "flexible",
      title: "Food",
      balance: 1000,
      timelineSubtext: "5 hours left to gain interest",
      progress: 13,
      rate: "10%",
      frequency: "Daily",
      autoSave: false,
    },
    {
      id: "v-03",
      type: "flexible",
      title: "Transportation",
      balance: 10000,
      timelineSubtext: "6 Days left to Withdrawal",
      progress: 10,
      rate: "12%",
      frequency: "Weekly",
      autoSave: false,
    },
    {
      id: "v-04",
      type: "flexible",
      title: "Birthday Gift",
      balance: 50000,
      timelineSubtext: "23 Days left to Withdrawal",
      progress: 40,
      rate: "14%",
      frequency: "Monthly",
      autoSave: false,
    },
  ]);

  // LISTEN FOR TOP UP STATE UPDATES FROM PARENT
  useEffect(() => {
    if (topUpEvent && topUpEvent.id) {
      setSetVaults((prevList) =>
        prevList.map((vault) => {
          if (vault.id === topUpEvent.id) {
            const newBalance = vault.balance + topUpEvent.amount;

            // Recalculate progress micro-indicator proportionally (Max caps out at 100%)
            const addedProgress = Math.floor(
              (topUpEvent.amount / vault.balance) * 10,
            );
            const newProgress = Math.min(
              vault.progress + (addedProgress || 5),
              100,
            );

            return {
              ...vault,
              balance: newBalance,
              progress: newProgress,
            };
          }
          return vault;
        }),
      );
    }
  }, [topUpEvent]);

  const handleToggleAutoSave = (vaultId) => {
    setVaults((prevList) =>
      prevList.map((vault) =>
        vault.id === vaultId ? { ...vault, autoSave: !vault.autoSave } : vault,
      ),
    );
  };

  return (
    <div className="vault-wrap">
      {vaults.map((vault) => {
        const isLocked = vault.type.toUpperCase() === "LOCKED";

        return (
          <article key={vault.id} className="vault-card">
            {/* Badge Info Header */}
            <div className="badge">
              {isLocked ? (
                <RiLockLine className="badge-icon icon-gold" />
              ) : (
                <RiLockUnlockLine className="badge-icon icon-gold" />
              )}
              <span className="badge-text">{vault.type.toUpperCase()}</span>
            </div>

            {/* Core Vault Content */}
            <h2 className="vault-name">{vault.title}</h2>

            <div className="amount-group">
              <span className="vault-currency">₦</span>
              <span className="vault-balance">
                {Number(vault.balance).toLocaleString()}
              </span>
            </div>

            <p className="timeline-text">{vault.timelineSubtext}</p>

            {/* Progress Meter bar */}
            <div className="progress-container">
              <div
                className="progress-fill"
                style={{ width: `${vault.progress || 0}%` }}
              ></div>
            </div>

            {/* Sub-metrics Row */}
            <div className="metrics-row">
              <span className="rate-lbl">{vault.rate} p.a.</span>
              <span className="freq-lbl">{vault.frequency}</span>
            </div>

            {/* Context-Aware Action Buttons Group */}
            <div className="action-row">
              {!isLocked && (
                <button
                  className="btn-gold-action"
                  onClick={() => onTopUp?.(vault)}
                >
                  Top Up
                </button>
              )}
              <button
                className={isLocked ? "btn-gold-full" : "btn-white-action"}
                onClick={() => onWithdraw?.(vault)}
              >
                Withdraw
              </button>
            </div>

            {/* Context-Aware Footer Row */}
            {!isLocked && (
              <footer className="card-footer">
                <span
                  className={`footer-lbl ${vault.autoSave ? "lbl-active" : ""}`}
                >
                  {vault.autoSave ? "Auto-Save Enabled" : "Enable Auto-Save"}
                </span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={!!vault.autoSave}
                    onChange={() => handleToggleAutoSave(vault.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </footer>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default Vaults;
