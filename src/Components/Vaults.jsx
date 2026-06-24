import React from "react";
import { RiLockLine, RiLockUnlockLine, RiEyeOffLine } from "react-icons/ri";
import "../Style/Vaults.css";

const Vaults = ({ vaultsData = [], onTopUp, onWithdraw, onToggleAutoSave }) => {
  if (!Array.isArray(vaultsData) || vaultsData.length === 0) return null;

  const handleTopUpValidation = (vault) => {
    const vaultTypeUpper =
      vault.type?.toUpperCase() || vault.planType?.toUpperCase();
    const isFlexible = vaultTypeUpper === "FLEXIBLE";

    // Fallback safely to .amount if targetAmount is 0 (like in LOCKED accounts)
    const baseTargetAmount = isFlexible
      ? vault.targetAmount || vault.amount
      : vault.amount;
    const currentBalance = isFlexible ? vault.currentBalance : vault.amount;

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

        // 🎯 FIX: Backend returns targetAmount: 0 and currentBalance: 0 for LOCKED types.
        // We render vault.amount as the main figure for locked savings.
        const displayBalanceValue = isFlexible
          ? vault.targetAmount || vault.amount
          : vault.amount;

        const topUpAdditions = isFlexible ? vault.currentBalance : vault.amount;

        // Gauge progress cleanly
        let progressPercentage = 0;

        if (isFlexible) {
          const current = Number(vault.currentBalance || 0);
          const target = Number(vault.targetAmount || vault.amount || 0);
          progressPercentage =
            target > 0 ? Math.min(100, (current / target) * 100) : 0;
        } else {
          // Time-based duration track fallback for LOCKED/STEALTH setups
          const start = new Date(vault.startDate || vault.createdAt).getTime();
          const end = new Date(vault.maturityDate).getTime();
          const now = Date.now();

          const totalDuration = end - start;
          const elapsed = now - start;

          progressPercentage =
            totalDuration > 0
              ? Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
              : 0;
        }

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

            <p
              className="vault-target-label"
              style={{
                fontSize: "0.8rem",
                color: "#888",
                marginBottom: "2px",
                fontWeight: "500",
              }}
            >
              {isFlexible ? "Target" : "Amount Locked"}
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
                style={{
                  textTransform: isFlexible ? "uppercase" : "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                {!isFlexible && (
                  <small
                    style={{
                      fontSize: "0.7rem",
                      color: "#888",
                      marginBottom: "2px",
                      fontWeight: "500",
                    }}
                  >
                    Maturity
                  </small>
                )}

                {isFlexible
                  ? vault.savingFrequency || vault.frequency || "N/A"
                  : vault.maturityDate
                    ? new Date(vault.maturityDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
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
          </article>
        );
      })}
    </div>
  );
};

export default Vaults;
