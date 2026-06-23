import React from "react";
import { RiLockLine, RiLockUnlockLine, RiEyeOffLine } from "react-icons/ri";
import "../Style/Vaults.css";

const Vaults = ({ vaultsData = [], onTopUp, onWithdraw, onToggleAutoSave }) => {
  if (!Array.isArray(vaultsData) || vaultsData.length === 0) return null;

  const handleTopUpValidation = (vault) => {
    const vaultTypeUpper =
      vault.type?.toUpperCase() || vault.planType?.toUpperCase();
    const isFlexible = vaultTypeUpper === "FLEXIBLE";

    const baseTargetAmount = isFlexible ? vault.targetAmount : vault.amount;
    const currentBalance = vault.currentBalance;

    if (currentBalance >= baseTargetAmount && baseTargetAmount > 0) {
      alert(
        `Cannot top up. Your current balance (₦${currentBalance.toLocaleString()}) has reached or exceeded the target amount (₦${baseTargetAmount.toLocaleString()}).`,
      );
      return;
    }

    onTopUp?.(vault);
  };

  return (
    <div className="vault-wrap">
      {vaultsData.map((vault) => {
        const vaultId = vault.id || vault._id;
        const vaultTypeUpper =
          vault.type?.toUpperCase() || vault.planType?.toUpperCase();

        const isFlexible = vaultTypeUpper === "FLEXIBLE";
        const isStealth = vaultTypeUpper === "STEALTH";

        // Financial metrics from normalized parent context
        const displayBalanceValue = isFlexible
          ? vault.targetAmount
          : vault.amount;
        const topUpAdditions = vault.currentBalance;

        // Gauge progress cleanly using top-up accumulations divided by target limit
        const currentProgressAmount = Number(vault.currentBalance || 0);
        const targetGoalCeiling = isFlexible
          ? Number(vault.targetAmount || 0)
          : Number(vault.amount || 0);

        const progressPercentage =
          targetGoalCeiling > 0
            ? Math.min(100, (currentProgressAmount / targetGoalCeiling) * 100)
            : 0;

        return (
          <article key={vaultId} className="vault-card">
            <div className="badge">
              {isFlexible ? (
                <RiLockUnlockLine className="badge-icon icon-gold" />
              ) : isStealth ? (
                <RiEyeOffLine className="badge-icon icon-gold" />
              ) : (
                <RiLockLine className="badge-icon icon-gold" />
              )}
              <span className="badge-text">{vaultTypeUpper}</span>
            </div>

            <h2 className="vault-name">{vault.title || "Unnamed Plan"}</h2>

            {/* 🎯 Added "Target" text label beneath the title */}
            <p
              className="vault-target-label"
              style={{
                fontSize: "0.8rem",
                color: "#888",
                marginBottom: "2px",
                fontWeight: "500",
              }}
            >
              Target
            </p>

            <div className="amount-group">
              <div className="balance-main">
                <span className="vault-currency">₦</span>
                <span className="vault-balance">
                  {displayBalanceValue.toLocaleString()}
                </span>
              </div>

              {isFlexible && (
                <div className="top-up">
                  <h3>Current Amount</h3>
                  <div>
                    <span className="top-currency">₦</span>
                    <span className="top-balance">
                      {topUpAdditions.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="progress-container">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="metrics-row">
              <span className="rate-lbl">{vault.interestRate || 0}% p.a.</span>
              <span
                className="freq-lbl"
                style={{ textTransform: isFlexible ? "uppercase" : "none" }}
              >
                {vault.frequency || "DAILY"}
              </span>
            </div>

            <div className="action-row">
              {isFlexible && (
                <button
                  type="button"
                  className="btn-gold-action"
                  onClick={() => handleTopUpValidation(vault)}
                >
                  Top Up
                </button>
              )}

              <button
                type="button"
                className={isFlexible ? "btn-white-action" : "btn-gold-full"}
                disabled={isStealth}
                onClick={() => onWithdraw?.(vault)}
                style={
                  isStealth
                    ? {
                        background: "#fef9e7",
                        color: "#b89047",
                        borderColor: "#e8d7b0",
                        cursor: "not-allowed",
                        opacity: 0.9,
                        fontSize: "0.85rem",
                      }
                    : undefined
                }
              >
                {isStealth ? "Locked till maturity date" : "Withdraw"}
              </button>
            </div>

            {isFlexible && (
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
                    onChange={() => onToggleAutoSave?.(vaultId)}
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
